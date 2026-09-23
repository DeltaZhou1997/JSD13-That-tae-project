// หน่วยของวัตถุดิบ (ต้องตรงกับ INGREDIENT_UNIT ใน Ingredient.model.js และ client/src/context/IngredientsContext.js)
// แปลงได้เฉพาะหน่วยในกลุ่มเดียวกัน: น้ำหนัก (g ↔ kg), ปริมาตร (ml ↔ l) — "piece" แปลงกับหน่วยอื่นไม่ได้
const UNIT_INFO = {
  g: { dimension: "mass", toBase: 1 },
  kg: { dimension: "mass", toBase: 1000 },
  ml: { dimension: "volume", toBase: 1 },
  l: { dimension: "volume", toBase: 1000 },
  piece: { dimension: "count", toBase: 1 },
};

export const roundQty = (value) => Math.round(Number(value) * 1000) / 1000;

/** ตัวคูณสำหรับแปลงจากหน่วย from → to หรือ null ถ้าแปลงไม่ได้ */
export function getUnitFactor(from, to) {
  const a = UNIT_INFO[from || "g"];
  const b = UNIT_INFO[to || "g"];
  if (!a || !b || a.dimension !== b.dimension) return null;
  return a.toBase / b.toBase;
}

// น้ำหนักต่อ 1 หน่วย (กรัม) — ปริมาตรคิด 1 ml ≈ 1 g, ชิ้นใช้ gramsPerPiece
const GRAMS_PER_UNIT = { g: 1, kg: 1000, ml: 1, l: 1000 };

/**
 * แปลงปริมาณในสูตรเมนู (หน่วยที่แอดมินเลือก) → หน่วยสต็อกของวัตถุดิบ
 * ต้องตรงกับ convertQty ใน client/src/utils/units.js
 * คืน null ถ้าแปลงไม่ได้ (เช่น ชิ้น ที่ไม่ทราบน้ำหนักต่อชิ้น)
 */
export function convertQty(qty, from, to, gramsPerPiece) {
  const f = from || "g";
  const t = to || "g";
  if (f === t) return Number(qty) || 0;
  const gpp = Number(gramsPerPiece) || 0;
  const fromG = f === "piece" ? gpp : GRAMS_PER_UNIT[f];
  const toG = t === "piece" ? gpp : GRAMS_PER_UNIT[t];
  if (!fromG || !toG) return null;
  return roundQty(((Number(qty) || 0) * fromG) / toG);
}

/** ปริมาณที่ต้องใช้ต่อ 1 ชุด ในหน่วยสต็อกของวัตถุดิบ (แปลงไม่ได้ → ใช้ตัวเลขเดิม) */
export function recipeQtyInStockUnit(recipeItem, ingredient) {
  const qty = Number(recipeItem?.quantity) || 0;
  const converted = convertQty(qty, recipeItem?.unit, ingredient?.unit, ingredient?.gramsPerPiece ?? recipeItem?.gramsPerPiece);
  return converted ?? qty;
}
