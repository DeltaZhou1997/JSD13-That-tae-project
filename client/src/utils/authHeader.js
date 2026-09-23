/**
 * Helper ดึง Auth Token และสร้าง Headers สำหรับส่งไปกับคำขอ API
 */
export function getAuthToken() {
  try {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  } catch {
    return "";
  }
}

export function getAuthHeaders(customHeaders = {}) {
  const token = getAuthToken();
  const headers = { ...customHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * ดึง API URL พร้อมตัดเครื่องหมาย / ท้ายสุดออก ป้องกันปัญหา Double Slash (//api/...)
 */
export function getApiUrl() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3001";
  return url.replace(/\/+$/, "");
}

