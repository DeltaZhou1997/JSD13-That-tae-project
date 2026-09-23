/**
 * รายการเงื่อนไขทางโภชนาการ, โรคประจำตัว, และการแพ้อาหารยอดนิยม
 * (Food Restrictions, Allergens & Health Conditions)
 */
export const POPULAR_FOOD_RESTRICTIONS = [
  // 1. โรค & สุขภาพ
  { id: "gerd_friendly", label: "กรดไหลย้อน", category: "health", shortLabel: "กรดไหลย้อน" },
  { id: "low_sodium", label: "ลดเค็ม", category: "health", shortLabel: "ลดเค็ม" },
  { id: "low_sugar", label: "น้ำตาลต่ำ", category: "health", shortLabel: "น้ำตาลต่ำ" },
  { id: "heart_healthy", label: "ไขมันต่ำ", category: "health", shortLabel: "ไขมันต่ำ" },
  { id: "gout_friendly", label: "พิวรีนต่ำ", category: "health", shortLabel: "พิวรีนต่ำ" },
  { id: "ckd_friendly", label: "เหมาะกับผู้ป่วยไต", category: "health", shortLabel: "ผู้ป่วยไต" },

  // 2. การแพ้อาหาร (Allergies)
  { id: "no_seafood", label: "ไม่ใส่อาหารทะเล", category: "allergy", shortLabel: "ไม่ใส่ทะเล" },
  { id: "no_shrimp", label: "ไม่ใส่กุ้ง/ปู", category: "allergy", shortLabel: "ไม่ใส่กุ้ง/ปู" },
  { id: "gluten_free", label: "ไม่มีกลูเตน", category: "allergy", shortLabel: "ไม่มีกลูเตน" },
  { id: "no_peanuts", label: "ไม่ใส่ถั่วลิสง", category: "allergy", shortLabel: "ไม่ใส่ถั่วลิสง" },
  { id: "dairy_free", label: "ไม่ใส่นมวัว", category: "allergy", shortLabel: "ไม่ใส่นม" },
  { id: "egg_free", label: "ไม่ใส่ไข่", category: "allergy", shortLabel: "ไม่ใส่ไข่" },

  // 3. รูปแบบการกิน (Dietary Lifestyle)
  { id: "vegetarian", label: "มังสวิรัติ", category: "diet", shortLabel: "มังสวิรัติ" },
  { id: "vegan", label: "เจ / วีแกน", category: "diet", shortLabel: "เจ / วีแกน" },
  { id: "halal", label: "ฮาลาล", category: "diet", shortLabel: "ฮาลาล" },
  { id: "keto", label: "คีโต / โลว์คาร์บ", category: "diet", shortLabel: "คีโต" },
];

export const RESTRICTION_CATEGORIES = {
  health: { label: "สุขภาพ / โรคประจำตัว", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  allergy: { label: "สิ่งที่แพ้ / ไม่รับประทาน", color: "text-amber-700 bg-amber-50 border-amber-200" },
  diet: { label: "รูปแบบการกิน", color: "text-purple-700 bg-purple-50 border-purple-200" },
};
