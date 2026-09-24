import { getApiUrl } from "./authHeader.js";

/**
 * ดึงเมนูพร้อมจำนวนชุดที่ทำได้ "ล่าสุด" จาก DB (สต็อกวัตถุดิบเปลี่ยนตลอด — ห้ามเชื่อค่าที่โหลดไว้นาน)
 * คืน null ถ้าเชื่อมต่อไม่ได้ (ให้ผู้เรียกใช้ข้อมูลเดิมแทน)
 */
export async function fetchLiveProduct(id) {
  try {
    const res = await fetch(`${getApiUrl()}/api/v2/products/${id}`, { cache: "no-store" });
    if (res.status === 404) return { removed: true };
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
