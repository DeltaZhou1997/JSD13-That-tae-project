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
