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

/**
 * ตัวคูณแปลงหน่วย from → to (null ถ้าแปลงไม่ได้ เช่น g → ชิ้น)
 * น้ำหนักกับปริมาตรแปลงกันได้โดยคิด 1 ml ≈ 1 g (สูตรเดียวกับการคำนวณสารอาหารและตัดสต็อก)
 */
export function getUnitFactor(from, to) {
  const a = getUnitInfo(from);
  const b = getUnitInfo(to);
  if (!a.gramsPerUnit || !b.gramsPerUnit) return a.value === b.value ? 1 : null;
  return a.gramsPerUnit / b.gramsPerUnit;
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

/** น้ำหนักต่อ 1 หน่วย (กรัม) — ชิ้นใช้ gramsPerPiece (0 = ไม่ทราบ) */
function gramsPerUnitOf(unit, gramsPerPiece) {
  const info = getUnitInfo(unit);
  return info.gramsPerUnit ?? (Number(gramsPerPiece) || 0);
}

/**
 * แปลงปริมาณระหว่างหน่วย (ผ่านกรัม, ปริมาตรคิด 1 ml ≈ 1 g)
 * คืน null ถ้าแปลงไม่ได้ (เช่น ชิ้น ที่ไม่ได้ระบุน้ำหนักต่อชิ้น)
 */
export function convertQty(qty, from, to, gramsPerPiece) {
  if ((from || "g") === (to || "g")) return Number(qty) || 0;
  const fromG = gramsPerUnitOf(from, gramsPerPiece);
  const toG = gramsPerUnitOf(to, gramsPerPiece);
  if (!fromG || !toG) return null;
  return roundQty(((Number(qty) || 0) * fromG) / toG);
}

/** หน่วยที่ใช้ใส่ในสูตรเมนูได้ สำหรับวัตถุดิบหน่วยนี้ (ต้องแปลงกลับเป็นหน่วยสต็อกได้) */
export function getRecipeUnitOptions(stockUnit, gramsPerPiece) {
  const hasPieceWeight = Number(gramsPerPiece) > 0;
  if (getUnitInfo(stockUnit).value === "piece" && !hasPieceWeight) {
    return INGREDIENT_UNITS.filter((u) => u.value === "piece");
  }
  return INGREDIENT_UNITS.filter((u) => u.value !== "piece" || hasPieceWeight);
}
