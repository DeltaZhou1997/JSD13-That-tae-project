// หน่วยของวัตถุดิบ (ต้องตรงกับ INGREDIENT_UNIT ใน server/src/models/Ingredient.model.js และ server/src/utils/units.js)
// สต็อก จุดเตือน และปริมาณในสูตรเมนู ใช้หน่วยนี้ — ส่วนค่าสารอาหารล็อกเป็น "ต่อ 100 กรัม" เสมอ (มาตรฐานกลาง)
export const INGREDIENT_UNITS = [
  { value: "g", label: "กรัม", short: "g", dimension: "mass", toBase: 1, gramsPerUnit: 1 },
  { value: "kg", label: "กิโลกรัม", short: "kg", dimension: "mass", toBase: 1000, gramsPerUnit: 1000 },
  // ปริมาตรคิดน้ำหนักโดยประมาณ 1 ml ≈ 1 g
  { value: "ml", label: "มิลลิลิตร", short: "ml", dimension: "volume", toBase: 1, gramsPerUnit: 1 },
  { value: "l", label: "ลิตร", short: "L", dimension: "volume", toBase: 1000, gramsPerUnit: 1000 },
  // ชิ้น: ต้องระบุน้ำหนักต่อชิ้นเอง (gramsPerPiece)
  { value: "piece", label: "ชิ้น", short: "ชิ้น", dimension: "count", toBase: 1, gramsPerUnit: null },
];

// ค่าสารอาหารของวัตถุดิบทุกชนิดคิดต่อ 100 กรัม
export const NUTRIENT_BASIS_G = 100;

export function getUnitInfo(unit) {
  return INGREDIENT_UNITS.find((u) => u.value === unit) || INGREDIENT_UNITS[0];
}

/** ตัวคูณแปลงหน่วย from → to (null ถ้าคนละกลุ่ม เช่น g → ชิ้น) */
export function getUnitFactor(from, to) {
  const a = getUnitInfo(from);
  const b = getUnitInfo(to);
  if (a.dimension !== b.dimension) return null;
  return a.toBase / b.toBase;
}

export const roundQty = (value) => Math.round(Number(value) * 1000) / 1000;

/**
 * แปลงปริมาณในหน่วยของวัตถุดิบ → กรัม (ใช้คำนวณสารอาหารต่อ 100 g)
 * หน่วย "ชิ้น" ใช้ gramsPerPiece ถ้าไม่ได้ระบุจะคืน 0 (ไม่นับสารอาหาร)
 */
export function toGrams(qty, unit, gramsPerPiece) {
  const info = getUnitInfo(unit);
  const perUnit = info.gramsPerUnit ?? (Number(gramsPerPiece) || 0);
  return (Number(qty) || 0) * perUnit;
}
