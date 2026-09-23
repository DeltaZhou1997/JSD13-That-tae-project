// ตะกร้าของผู้ที่ยังไม่ล็อกอิน เก็บในคุกกี้ (เฉพาะ id + จำนวน ให้ไม่เกินขนาดคุกกี้ 4KB)
// รูปแบบ: [["<productId>", <quantity>], ...]
const COOKIE_NAME = "tt_guest_cart";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 วัน

export function readGuestCart() {
  try {
    const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!match) return [];
    const parsed = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
    return Array.isArray(parsed)
      ? parsed
          .filter((row) => Array.isArray(row) && row[0] && Number(row[1]) > 0)
          .map(([productId, quantity]) => ({ productId: String(productId), quantity: Number(quantity) }))
      : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items = []) {
  try {
    const compact = items
      .filter((i) => (i.productId || i._id || i.id) && Number(i.quantity) > 0)
      .map((i) => [String(i.productId || i._id || i.id), Number(i.quantity)]);
    if (compact.length === 0) {
      clearGuestCart();
      return;
    }
    const value = encodeURIComponent(JSON.stringify(compact));
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // คุกกี้ถูกบล็อก — ตะกร้ายังใช้งานได้ในหน้านี้ แต่จะไม่ถูกจำ
  }
}

export function clearGuestCart() {
  try {
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}
