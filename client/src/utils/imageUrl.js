import { getApiUrl } from "./authHeader.js";

const GRIDFS_PATH_RE = /\/api\/v\d\/images\/([a-f0-9]{24})(?:[/?#]|$)/i;

/**
 * แปลง URL รูปจาก GridFS ให้ชี้ไปที่ API server ปัจจุบันเสมอ
 * รองรับทั้ง "/api/v2/images/<id>" และ URL เต็มที่เคยบันทึกไว้ เช่น
 * "http://localhost:3001/api/v2/images/<id>" (อัปโหลดตอนรันในเครื่อง แล้วไปเปิดบนเว็บจริง รูปจะหาย)
 * URL อื่น (unsplash, assets ในโปรเจกต์) คืนค่าเดิม
 */
export function resolveImageUrl(url) {
  if (typeof url !== "string" || !url) return url;
  const match = url.match(GRIDFS_PATH_RE);
  if (!match) return url;
  return `${getApiUrl()}/api/v2/images/${match[1]}`;
}

/** ใช้กับฟิลด์ imageUrl ที่อาจเป็น string หรือ array */
export function resolveImageField(value) {
  if (Array.isArray(value)) return value.map(resolveImageUrl);
  return resolveImageUrl(value);
}
