// ตัวกรองขาเข้า/ขาออกของ Advisor

export const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_TEXT = 600;

export const OUT_OF_SCOPE_REPLY =
  "ขออภัยครับ ผมตอบได้เฉพาะเรื่องในร้านธาตุแท้ เช่น เมนูอาหาร วัตถุดิบ ธาตุเจ้าเรือนและการแพทย์แผนไทยเรื่องอาหาร การสั่งซื้อ และการใช้งานเว็บ ลองถามใหม่ได้เลยครับ 🌿";

// ตัดอักขระควบคุม + จำกัดความยาว
function cleanText(value, max) {
  return String(value || "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function sanitizeMessage(value) {
  return cleanText(value, MAX_MESSAGE_LENGTH);
}

/**
 * ประวัติแชทจาก client (ไม่เชื่อถือ — ผู้ใช้ปลอมข้อความฝั่ง AI ได้)
 * จึงไม่ส่งเป็น turn ของ model แต่แปลงเป็น "ข้อความอ้างอิง" ในข้อความของผู้ใช้แทน
 */
export function formatHistoryAsData(history) {
  if (!Array.isArray(history)) return "";
  return history
    .slice(-MAX_HISTORY_TURNS)
    .map((h) => {
      const who = h?.role === "assistant" || h?.role === "model" ? "ผู้ช่วย" : "ผู้ใช้";
      const text = cleanText(h?.text, MAX_HISTORY_TEXT);
      return text ? `${who}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

// ---------------------------------------------------------------------------
// ตรวจคำขอที่ตั้งใจใช้ AI ผิดวัตถุประสงค์ (ปฏิเสธทันที ไม่เสียค่าเรียก API)
// ตั้งใจให้แคบ: จับเฉพาะรูปแบบที่ชัดเจน เรื่องที่กำกวมให้ Gemini ตัดสินด้วยกฎใน system prompt
// ---------------------------------------------------------------------------
const ABUSE_PATTERNS = [
  // เจาะคำสั่งระบบ / jailbreak
  { reason: "prompt_injection", re: /\b(ignore|disregard|forget|override)\b.{0,30}\b(instructions?|rules?|prompts?|guidelines?)\b/i },
  { reason: "prompt_injection", re: /\b(system|developer|hidden)\s*(prompt|message|instructions?)\b/i },
  { reason: "prompt_injection", re: /\b(jailbreak|developer mode|do anything now|DAN mode)\b/i },
  { reason: "prompt_injection", re: /\bpretend\s+(you\s+are|to\s+be)\b/i },
  { reason: "prompt_injection", re: /(ลืม|เพิกเฉย|ไม่ต้องสนใจ|ข้าม|ยกเลิก)\s*(คำสั่ง|กฎ|ข้อจำกัด)/ },
  { reason: "prompt_injection", re: /(คำสั่งระบบ|พรอมต์ระบบ|prompt\s*ของระบบ|system\s*prompt)/i },
  { reason: "prompt_injection", re: /(แสดง|บอก|เปิดเผย|พิมพ์)\s*.{0,12}(prompt|พรอมต์|พรอมท์|คำสั่งที่ได้รับ|กฎของคุณ)/i },
  { reason: "prompt_injection", re: /(สวมบทบาท|แกล้งทำเป็น|ต่อจากนี้คุณคือ|คุณไม่ใช่ผู้ช่วย)/ },
  // ขอความลับของระบบ
  { reason: "secrets", re: /\b(api[\s_-]?key|secret[\s_-]?key|jwt|access[\s_-]?token|connection\s*string)\b|mongodb(\+srv)?:\/\//i },
  // ขอข้อมูลของผู้ใช้คนอื่น
  { reason: "other_users_data", re: /(ข้อมูล|อีเมล|เบอร์|ที่อยู่|ออเดอร์|คำสั่งซื้อ|รหัสผ่าน).{0,15}(ของ)?(ลูกค้า|ผู้ใช้|สมาชิก|user)\s*(คนอื่น|ทั้งหมด|ทุกคน|อื่น ?ๆ)/i },
];

/** คืนเหตุผลถ้าเป็นคำขอที่ใช้ผิดวัตถุประสงค์ชัดเจน ไม่งั้นคืน null */
export function detectAbuse(text) {
  const t = String(text || "");
  return ABUSE_PATTERNS.find((p) => p.re.test(t))?.reason || null;
}

// ข้อความเฉพาะใน system prompt/บริบท — ถ้าโผล่ในคำตอบแปลว่าโมเดลถูกหลอกให้เปิดเผยคำสั่ง
const LEAK_MARKERS = ["CONTEXT (ข้อมูลอ้างอิง", "ขอบเขตที่ตอบได้ (inScope", "inScope", "productIds", "adminInsights", "visibilities"];

/** ทำความสะอาดคำตอบ: ตัดลิงก์ภายนอก และตรวจการหลุดของคำสั่งระบบ */
export function sanitizeReply(reply) {
  const text = String(reply || "");
  if (LEAK_MARKERS.some((m) => text.includes(m))) return null;
  // นำทางได้เฉพาะหน้าในเว็บผ่าน action — ไม่ปล่อยลิงก์ออกนอกเว็บในข้อความ
  return text.replace(/\b(https?:\/\/|www\.)\S+/gi, "").trim();
}

const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ"];
export const pickElement = (value) => (ELEMENTS.includes(value) ? value : null);

/**
 * ตรวจคำตอบของ AI ก่อนส่งกลับ
 * - productIds ต้องมาจากบริบทที่ retrieve มาเท่านั้น
 * - action ต้องเป็นชนิดที่ role นี้ใช้ได้
 */
export function validateModelOutput(output, { allowedProductIds, allowedActions }) {
  const inScope = output?.inScope !== false;
  const reply = sanitizeReply(cleanText(output?.reply, 2500));
  if (!inScope || !reply) {
    return { inScope: false, reply: OUT_OF_SCOPE_REPLY, productIds: [], highlightElement: null, action: { type: "none" } };
  }

  const productIds = [...new Set(Array.isArray(output.productIds) ? output.productIds.map(String) : [])]
    .filter((id) => allowedProductIds.has(id))
    .slice(0, 6);

  const rawAction = output.action || {};
  const type = allowedActions.includes(rawAction.type) ? rawAction.type : "none";

  return {
    inScope: true,
    reply,
    productIds,
    highlightElement: pickElement(output.highlightElement),
    action: {
      type,
      path: typeof rawAction.path === "string" ? rawAction.path.slice(0, 120) : "",
      planId: ["S", "M", "L", "XL"].includes(rawAction.planId) ? rawAction.planId : null,
      element: pickElement(rawAction.element),
      count: Number(rawAction.count) || 1,
    },
  };
}
