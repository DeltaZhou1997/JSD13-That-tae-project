/**
 * รายการเงื่อนไขทางโภชนาการ, โรคประจำตัว, และการแพ้อาหารยอดนิยม
 * (Food Restrictions, Allergens & Health Conditions)
 */
export const POPULAR_FOOD_RESTRICTIONS = [
  // 1. เหมาะกับผู้มีปัญหาสุขภาพ
  { id: "gerd_friendly", label: "เหมาะกับผู้มีกรดไหลย้อน", category: "health", shortLabel: "กรดไหลย้อน" },
  { id: "low_sodium", label: "โซเดียมต่ำ (ไม่เค็ม)", category: "health", shortLabel: "โซเดียมต่ำ" },
  { id: "low_sugar", label: "น้ำตาลต่ำ", category: "health", shortLabel: "น้ำตาลต่ำ" },
  { id: "heart_healthy", label: "ไขมันต่ำ", category: "health", shortLabel: "ไขมันต่ำ" },
  { id: "gout_friendly", label: "พิวรีนต่ำ (เหมาะกับผู้เป็นเกาต์)", category: "health", shortLabel: "พิวรีนต่ำ" },
  { id: "ckd_friendly", label: "เหมาะกับผู้ป่วยโรคไต", category: "health", shortLabel: "โรคไต" },

  // 2. ไม่มีส่วนผสมที่มักแพ้
  { id: "no_seafood", label: "ไม่มีอาหารทะเล", category: "allergy", shortLabel: "ไม่มีอาหารทะเล" },
  { id: "no_shrimp", label: "ไม่มีกุ้งและปู", category: "allergy", shortLabel: "ไม่มีกุ้ง/ปู" },
  { id: "gluten_free", label: "ไม่มีกลูเตน (แป้งสาลี)", category: "allergy", shortLabel: "ไม่มีกลูเตน" },
  { id: "no_peanuts", label: "ไม่มีถั่วลิสง", category: "allergy", shortLabel: "ไม่มีถั่วลิสง" },
  { id: "dairy_free", label: "ไม่มีนมวัว", category: "allergy", shortLabel: "ไม่มีนมวัว" },
  { id: "egg_free", label: "ไม่มีไข่", category: "allergy", shortLabel: "ไม่มีไข่" },

  // 3. รูปแบบการกิน
  { id: "vegetarian", label: "มังสวิรัติ (ไม่มีเนื้อสัตว์)", category: "diet", shortLabel: "มังสวิรัติ" },
  { id: "vegan", label: "เจ / วีแกน (ไม่มีผลิตภัณฑ์จากสัตว์)", category: "diet", shortLabel: "เจ / วีแกน" },
  { id: "halal", label: "ฮาลาล", category: "diet", shortLabel: "ฮาลาล" },
  { id: "keto", label: "คีโต / คาร์บต่ำ", category: "diet", shortLabel: "คีโต" },
];

export const RESTRICTION_CATEGORIES = {
  health: { label: "เหมาะกับผู้มีปัญหาสุขภาพ", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  allergy: { label: "ไม่มีส่วนผสมที่มักแพ้", color: "text-amber-700 bg-amber-50 border-amber-200" },
  diet: { label: "รูปแบบการกิน", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

/** ป้ายสั้นของข้อจำกัด (ใช้บนการ์ด/แท็ก) — ไม่รู้จักรหัสให้คืนรหัสเดิม */
export const restrictionShortLabel = (id) =>
  POPULAR_FOOD_RESTRICTIONS.find((r) => r.id === id)?.shortLabel || String(id || "").replace(/_/g, " ");
