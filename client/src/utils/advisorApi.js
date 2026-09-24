import { getApiUrl, getAuthHeaders } from "./authHeader.js";

export class AdvisorApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * ถาม That-Tae Advisor (RAG ฝั่ง server)
 * role/สิทธิ์ถูกตัดสินจาก token ที่ server — client ส่งแค่คำถามและบริบทที่ไม่ลับ
 */
export async function askAdvisor({ message, history = [], guestElement, guestCartProductIds = [] }) {
  let res;
  try {
    res = await fetch(`${getApiUrl()}/api/v2/advisor/chat`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify({ message, history, guestElement, guestCartProductIds }),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new AdvisorApiError("เชื่อมต่อ AI Advisor ไม่สำเร็จ", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdvisorApiError(data.message || "AI Advisor ไม่พร้อมใช้งาน", res.status);
  return data;
}
