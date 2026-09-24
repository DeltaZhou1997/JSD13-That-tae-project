import { getApiUrl } from "./authHeader.js";

/**
 * ให้ทุกคำขอ GET ไปที่ API ข้าม cache ของเบราว์เซอร์ (cache: "no-store")
 * กันหน้าเว็บแสดงข้อมูลเก่าหลังข้อมูลใน MongoDB เปลี่ยน
 * - ไม่แตะคำขอที่กำหนด cache เองแล้ว, คำขอที่ไม่ใช่ GET, และรูปจาก GridFS (/api/v2/images — ให้ cache ได้)
 */
export function installNoStoreFetch() {
  if (typeof window === "undefined" || window.__noStoreFetchInstalled) return;
  const originalFetch = window.fetch.bind(window);
  const apiBase = `${getApiUrl()}/api/`;

  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const method = String(init.method || (typeof input === "object" && input?.method) || "GET").toUpperCase();
    const isApi = url.startsWith(apiBase) || url.startsWith("/api/");
    const isImage = url.includes("/api/v2/images/") || url.includes("/api/v1/images/");

    if (isApi && !isImage && method === "GET" && init.cache === undefined) {
      return originalFetch(input, { ...init, cache: "no-store" });
    }
    return originalFetch(input, init);
  };
  window.__noStoreFetchInstalled = true;
}

export default installNoStoreFetch;
