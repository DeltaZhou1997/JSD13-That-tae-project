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
