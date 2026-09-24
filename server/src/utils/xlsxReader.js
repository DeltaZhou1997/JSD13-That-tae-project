// อ่านไฟล์ .xlsx แบบเบา ๆ ด้วย Node ล้วน (ไม่ต้องติดตั้ง package)
// .xlsx = zip ที่ข้างในเป็น XML → อ่าน central directory ของ zip แล้วแตกด้วย zlib
// รองรับเฉพาะค่าที่ใช้ในโปรเจกต์: ข้อความ (shared/inline string) และตัวเลข
import fs from "fs";
import { readZip } from "./zip.js";

const decodeXml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, "&");

// ข้อความใน <t>...</t> ทั้งหมด (รองรับ rich text ที่แบ่งหลาย run)
const textOf = (xml) => [...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decodeXml(m[1])).join("");

function colIndex(ref) {
  const letters = ref.match(/^[A-Z]+/)[0];
  let n = 0;
  for (const ch of letters) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
}

/**
 * @returns {Record<string, Array<Array<string|number|null>>>} ชื่อชีต → แถว (อาร์เรย์ของค่าแต่ละคอลัมน์)
 */
export function readXlsx(filePath) {
  const files = readZip(fs.readFileSync(filePath));
  const str = (name) => (files[name] ? files[name].toString("utf8") : "");

  const shared = [...str("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));

  // ชื่อชีต → ไฟล์ XML ของชีต
  const rels = Object.fromEntries(
    [...str("xl/_rels/workbook.xml.rels").matchAll(/<Relationship\b[^>]*>/g)].map((m) => [
      m[0].match(/Id="([^"]+)"/)[1],
      m[0].match(/Target="([^"]+)"/)[1],
    ]),
  );
  const sheets = {};
  for (const m of str("xl/workbook.xml").matchAll(/<sheet\b[^>]*>/g)) {
    const name = decodeXml(m[0].match(/name="([^"]+)"/)[1]);
    const rid = m[0].match(/r:id="([^"]+)"/)[1];
    let target = rels[rid].replace(/^\//, "");
    if (!target.startsWith("xl/")) target = `xl/${target}`;

    const rows = [];
    for (const rowMatch of str(target).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = [];
      for (const c of rowMatch[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1];
        const inner = c[2] || "";
        const ref = attrs.match(/r="([A-Z]+\d+)"/)?.[1];
        if (!ref) continue;
        const type = attrs.match(/t="([^"]+)"/)?.[1];
        const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
        let value = null;
        if (type === "s" && v !== undefined) value = shared[Number(v)];
        else if (type === "inlineStr") value = textOf(inner);
        else if (type === "str" && v !== undefined) value = decodeXml(v);
        else if (v !== undefined) value = Number.isNaN(Number(v)) ? decodeXml(v) : Number(v);
        row[colIndex(ref)] = value;
      }
      if (row.length) rows.push(Array.from(row, (x) => (x === undefined ? null : x)));
    }
    sheets[name] = rows;
  }
  return sheets;
}
