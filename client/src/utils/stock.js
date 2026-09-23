/**
 * สถานะสต็อกของเมนู จาก product.availability ที่ Server คำนวณจากวัตถุดิบในภาคของเมนู
 * @param {object} product
 * @param {number} wantQty จำนวนชุดที่ต้องการ (เช่น จำนวนรวมในตะกร้า)
 */
export function getStockStatus(product, wantQty = 1) {
  const a = product?.availability;
  if (!a || a.availableKits === null || a.availableKits === undefined) {
    return { soldOut: false, short: false, availableKits: null, missing: [], limitedBy: null };
  }
  const availableKits = Number(a.availableKits) || 0;
  const soldOut = a.inStock === false || availableKits <= 0;
  return {
    soldOut,
    // มีของแต่ไม่พอกับจำนวนที่ต้องการ
    short: !soldOut && wantQty > availableKits,
    availableKits,
    missing: Array.isArray(a.missing) ? a.missing : [],
    limitedBy: a.limitedBy || null,
  };
}

/** ข้อความสั้น ๆ ว่าขาดอะไร เช่น "ขาด ไข่แดง, กะทิ +1" */
export function formatMissing(names = [], max = 2) {
  if (!names.length) return "";
  const shown = names.slice(0, max).join(", ");
  return `ขาด ${shown}${names.length > max ? ` +${names.length - max}` : ""}`;
}
