// อ่าน/เขียน CSV (รองรับไฟล์จาก Excel/Google Sheets ภาษาไทย)
// - UTF-8 มี/ไม่มี BOM, บรรทัดแบบ CRLF/LF
// - ช่องที่ครอบด้วย "..." มี , " (เขียนเป็น "") และขึ้นบรรทัดใหม่ในช่องได้
// - เดาตัวคั่นอัตโนมัติ: , ; หรือ tab (Excel บางภาษาบันทึกเป็น ;)

export function parseCsv(input) {
  const text = String(input || "").replace(/^﻿/, "");
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const delimiter = [",", ";", "\t"].sort(
    (a, b) => firstLine.split(b).length - firstLine.split(a).length,
  )[0];

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  // ตัดแถวว่างทั้งแถว
  return rows.filter((r) => r.some((cell) => String(cell).trim() !== ""));
}

/**
 * แปลง CSV เป็น array ของ object ตามหัวคอลัมน์ (ไม่สนตัวพิมพ์เล็ก-ใหญ่/ช่องว่างของชื่อคอลัมน์)
 * @returns {{ headers: string[], records: Array<{ line: number, data: Record<string,string> }> }}
 */
export function csvToRecords(input) {
  const rows = parseCsv(input);
  if (rows.length === 0) return { headers: [], records: [] };
  const headers = rows[0].map((h) => String(h).trim().replace(/\s+/g, "").toLowerCase());
  const records = rows.slice(1).map((cells, idx) => ({
    line: idx + 2, // เลขบรรทัดใน Excel (หัวตาราง = บรรทัด 1)
    data: Object.fromEntries(headers.map((h, i) => [h, String(cells[i] ?? "").trim()])),
  }));
  return { headers, records };
}

const escapeCell = (value) => {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** เขียน CSV พร้อม BOM ให้ Excel เปิดภาษาไทยได้ถูกต้อง */
export function toCsv(rows) {
  return `﻿${rows.map((r) => r.map(escapeCell).join(",")).join("\r\n")}\r\n`;
}
