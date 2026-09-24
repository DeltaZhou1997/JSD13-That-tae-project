// อ่าน/เขียนไฟล์ zip ด้วย Node ล้วน (ไม่ต้องติดตั้ง package)
// - readZip: รองรับ stored (0) และ deflate (8) ซึ่งเป็นแบบที่ Windows/macOS/Excel สร้าง
// - createZip: เขียนแบบ stored (ไม่บีบอัด) ใช้สร้างไฟล์ตัวอย่าง (template)
import zlib from "zlib";

const MAX_ENTRY_BYTES = 60 * 1024 * 1024; // กัน zip bomb: ไฟล์เดียวแตกออกมาไม่เกิน 60MB

/**
 * @param {Buffer} buffer
 * @returns {Record<string, Buffer>} path ภายใน zip → เนื้อไฟล์ (ข้ามโฟลเดอร์)
 */
export function readZip(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("ไม่ใช่ไฟล์ zip ที่ถูกต้อง");

  const count = buffer.readUInt16LE(eocd + 10);
  let ptr = buffer.readUInt32LE(eocd + 16);
  const files = {};

  for (let n = 0; n < count; n++) {
    if (buffer.readUInt32LE(ptr) !== 0x02014b50) throw new Error("โครงสร้าง zip เสียหาย");
    const flags = buffer.readUInt16LE(ptr + 8);
    const method = buffer.readUInt16LE(ptr + 10);
    const compSize = buffer.readUInt32LE(ptr + 20);
    const size = buffer.readUInt32LE(ptr + 24);
    const nameLen = buffer.readUInt16LE(ptr + 28);
    const extraLen = buffer.readUInt16LE(ptr + 30);
    const commentLen = buffer.readUInt16LE(ptr + 32);
    const localOffset = buffer.readUInt32LE(ptr + 42);
    const rawName = buffer.subarray(ptr + 46, ptr + 46 + nameLen);
    // bit 11 = ชื่อไฟล์เป็น UTF-8 (ถ้าไม่ตั้งก็ลองอ่านเป็น UTF-8 อยู่ดี ชื่อไทยจาก macOS/7zip ส่วนใหญ่อ่านได้)
    const name = rawName.toString(flags & 0x800 ? "utf8" : "utf8");
    ptr += 46 + nameLen + extraLen + commentLen;

    if (name.endsWith("/")) continue;
    if (size > MAX_ENTRY_BYTES) throw new Error(`ไฟล์ "${name}" ใน zip ใหญ่เกินไป`);

    const localNameLen = buffer.readUInt16LE(localOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLen + localExtraLen;
    const data = buffer.subarray(start, start + compSize);

    let content;
    if (method === 0) content = Buffer.from(data);
    else if (method === 8) content = zlib.inflateRawSync(data, { maxOutputLength: MAX_ENTRY_BYTES });
    else throw new Error(`ไม่รองรับการบีบอัดแบบนี้ในไฟล์ "${name}" (method ${method})`);

    files[name] = content;
  }
  return files;
}

// ---------------------------------------------------------------------------
// createZip (stored)
// ---------------------------------------------------------------------------
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * @param {Array<{ name: string, data: Buffer|string }>} entries
 * @returns {Buffer}
 */
export function createZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(String(entry.data), "utf8");
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x800, 6); // UTF-8 names
    local.writeUInt16LE(0, 8); // stored
    local.writeUInt32LE(0, 10); // time/date
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(0, 12);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += 30 + name.length + data.length;
  }

  const centralSize = centrals.reduce((sum, b) => sum + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, ...centrals, end]);
}
