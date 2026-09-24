// รสยา → ธาตุ (ต้องตรงกับ analyzeMedicinalTastes ใน client/src/utils/recipeCalculator.js)
// ใช้ร่วมกันใน seed script และระบบนำเข้า ZIP

export const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ"];

const TASTE_KEYWORDS = [
  ["เผ็ดร้อน", "ลม"],
  ["หอมเย็น", "ลม"],
  ["เมาเบื่อ", "น้ำ"],
  ["เปรี้ยว", "น้ำ"],
  ["สุขุม", "ลม"],
  ["หวาน", "ดิน"],
  ["ฝาด", "ดิน"],
  ["เค็ม", "ดิน"],
  ["เผ็ด", "ลม"],
  ["มัน", "ดิน"],
  ["ขม", "น้ำ"],
  ["จืด", "ไฟ"],
  ["เย็น", "ไฟ"],
];

// รสมาตรฐาน 10 รส (ตัวเลือกในฟอร์มแอดมิน) — เรียงคำยาวก่อน
const CANONICAL_TASTES = ["เผ็ดร้อน", "หอมเย็น", "เมาเบื่อ", "เปรี้ยว", "หวาน", "ฝาด", "เค็ม", "มัน", "ขม", "จืด"];

/** "รสมัน/ รสเค็ม / หวาน" → ["รสมัน","รสเค็ม","รสหวาน"] */
export function normalizeTastes(raw) {
  const text = String(raw || "").replace(/\(.*?\)/g, "");
  const out = [];
  for (let token of text.split(/[/,|\s]+/)) {
    token = token.replace(/^รส/, "").trim();
    if (!token) continue;
    let found = false;
    for (const t of CANONICAL_TASTES) {
      if (token.includes(t)) {
        out.push(`รส${t}`);
        token = token.replace(t, "");
        found = true;
      }
    }
    if (!found && token.includes("เผ็ด")) out.push("รสเผ็ดร้อน");
  }
  return [...new Set(out)];
}

/** นับรสของแต่ละธาตุ ธาตุที่มากที่สุด "เพียงธาตุเดียว" คือธาตุของวัตถุดิบ */
export function analyzeTastes(tastes) {
  const counts = Object.fromEntries(ELEMENTS.map((e) => [e, 0]));
  for (const t of tastes) {
    const el = TASTE_KEYWORDS.find(([k]) => t.replace(/^รส/, "").includes(k))?.[1];
    if (el) counts[el] += 1;
  }
  const max = Math.max(...Object.values(counts));
  if (max === 0) return { status: "unknown", element: null, tied: [] };
  const top = ELEMENTS.filter((e) => counts[e] === max);
  return top.length > 1 ? { status: "conflict", element: null, tied: top } : { status: "ok", element: top[0], tied: [] };
}

/** ธาตุจากข้อความ เช่น "ธาตุลม, ธาตุไฟ (ต้องสุก)" หรือ "ลม ไฟ" → ["ลม","ไฟ"] */
export function parseElements(raw) {
  const text = String(raw || "");
  if (text.includes("ทุกธาตุ")) return [...ELEMENTS];
  const found = [...text.matchAll(/(ดิน|น้ำ|ลม|ไฟ)/g)].map((m) => m[1]);
  return [...new Set(found)];
}
