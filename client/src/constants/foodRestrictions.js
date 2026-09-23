/**
 * รายการเงื่อนไขทางโภชนาการ, โรคประจำตัว, และการแพ้อาหารยอดนิยม
 * (Food Restrictions, Allergens & Health Conditions)
 */
export const POPULAR_FOOD_RESTRICTIONS = [
  // 1. โรค & สุขภาพ
  { id: "gerd_friendly", label: "กรดไหลย้อนทานได้ (GERD Friendly)", category: "health", shortLabel: "GERD" },
  { id: "low_sodium", label: "โซเดียมต่ำ / ลดเค็ม (Low Sodium)", category: "health", shortLabel: "Low Na" },
  { id: "low_sugar", label: "น้ำตาลต่ำ / เบาหวานทานได้ (Low Sugar)", category: "health", shortLabel: "Low Sugar" },
  { id: "heart_healthy", label: "บำรุงหัวใจ / ไขมันต่ำ (Heart Healthy)", category: "health", shortLabel: "Low Fat" },
  { id: "gout_friendly", label: "พิวรีนต่ำ / ผู้ป่วยเกาต์ (Low Purine)", category: "health", shortLabel: "Low Purine" },
  { id: "ckd_friendly", label: "ไตทานได้ (Renal Friendly)", category: "health", shortLabel: "Renal" },

  // 2. การแพ้อาหาร (Allergies)
  { id: "no_seafood", label: "ไม่มีอาหารทะเล (No Seafood)", category: "allergy", shortLabel: "No Seafood" },
  { id: "no_shrimp", label: "ไม่มีกุ้ง/ปู (Crustacean Free)", category: "allergy", shortLabel: "No Shrimp" },
  { id: "gluten_free", label: "ไม่มีกลูเตน (Gluten-Free)", category: "allergy", shortLabel: "Gluten-Free" },
  { id: "no_peanuts", label: "ไม่มีถั่วลิสง (Peanut-Free)", category: "allergy", shortLabel: "Nut-Free" },
  { id: "dairy_free", label: "ไม่มีนมวัว (Dairy-Free)", category: "allergy", shortLabel: "Dairy-Free" },
  { id: "egg_free", label: "ไม่มีไข่ (Egg-Free)", category: "allergy", shortLabel: "Egg-Free" },

  // 3. รูปแบบการกิน (Dietary Lifestyle)
  { id: "vegetarian", label: "มังสวิรัติ (Vegetarian)", category: "diet", shortLabel: "Vegetarian" },
  { id: "vegan", label: "เจ / วีแกน (Vegan)", category: "diet", shortLabel: "Vegan" },
  { id: "halal", label: "ฮาลาล (Halal)", category: "diet", shortLabel: "Halal" },
  { id: "keto", label: "คีโต / โลว์คาร์บ (Keto / Low-Carb)", category: "diet", shortLabel: "Keto" },
];

export const RESTRICTION_CATEGORIES = {
  health: { label: "โรคประจำตัว & สุขภาพ", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  allergy: { label: "การแพ้อาหาร (Allergies)", color: "text-amber-700 bg-amber-50 border-amber-200" },
  diet: { label: "รูปแบบการกิน (Diets)", color: "text-purple-700 bg-purple-50 border-purple-200" },
};
