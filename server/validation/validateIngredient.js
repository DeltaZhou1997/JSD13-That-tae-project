import { INGREDIENT_CATEGORIES } from "../src/data/ingredients.js";

const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ"];

const NUTRIENT_LABELS = {
  calories: "แคลอรี",
  carbs: "คาร์โบไฮเดรต",
  sugar: "น้ำตาล",
  fiber: "ใยอาหาร",
  protein: "โปรตีน",
  fat: "ไขมัน",
  sodium: "โซเดียม",
};

const TASTE_KEYWORDS = [
  "ฝาด",
  "หวาน",
  "มัน",
  "เค็ม",
  "เปรี้ยว",
  "ขม",
  "เผ็ด",
  "หอมเย็น",
  "จืด",
];

function isNonNegativeNumber(value) {
  const num = Number(value);
  return value !== "" && value !== null && value !== undefined && !Number.isNaN(num) && num >= 0;
}

export function validateIngredient(data = {}, { partial = false } = {}) {
  const errors = {};

  const has = (field) => Object.prototype.hasOwnProperty.call(data, field);
  const shouldCheck = (field) => !partial || has(field);

  if (shouldCheck("nameTh")) {
    if (!data.nameTh || String(data.nameTh).trim().length < 2) {
      errors.nameTh = "ชื่อวัตถุดิบต้องไม่เป็นค่าว่าง และมีความยาวอย่างน้อย 2 ตัวอักษร";
    }
  }

  if (shouldCheck("category")) {
    if (!data.category || !Object.keys(INGREDIENT_CATEGORIES).includes(data.category)) {
      errors.category = "กรุณาเลือกหมวดหมู่วัตถุดิบจากรายการที่กำหนด";
    }
  }

  if (shouldCheck("medicinalTaste")) {
    const taste = String(data.medicinalTaste || "").trim();
    if (!taste) {
      errors.medicinalTaste = "กรุณาระบุรสยาอย่างน้อย 1 รส";
    } else if (!TASTE_KEYWORDS.some((keyword) => taste.includes(keyword))) {
      errors.medicinalTaste = `รสยาต้องมีคำใดคำหนึ่งใน: ${TASTE_KEYWORDS.join(", ")}`;
    }
  }

  if (shouldCheck("elements")) {
    const list = Array.isArray(data.elements) ? data.elements : [];
    if (list.length === 0) {
      errors.elements = "กรุณาเลือกธาตุเจ้าเรือนอย่างน้อย 1 ธาตุ";
    } else if (list.some((element) => !ELEMENTS.includes(element))) {
      errors.elements = `ธาตุต้องเป็นหนึ่งใน: ${ELEMENTS.join(", ")}`;
    }
  }

  if (shouldCheck("nutrientsPer100g")) {
    const nutrients = data.nutrientsPer100g;
    if (!nutrients || typeof nutrients !== "object") {
      errors.nutrientsPer100g = "กรุณาระบุค่าสารอาหารต่อ 100 กรัม";
    } else {
      const bad = Object.entries(NUTRIENT_LABELS)
        .filter(([key]) => !isNonNegativeNumber(nutrients[key]))
        .map(([, label]) => label);
      if (bad.length > 0) {
        errors.nutrientsPer100g = `ค่าสารอาหารต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป (ตรวจ: ${bad.join(", ")})`;
      }
    }
  }

  if (shouldCheck("basisWeightG")) {
    const basis = Number(data.basisWeightG);
    if (data.basisWeightG !== undefined && (Number.isNaN(basis) || basis <= 0)) {
      errors.basisWeightG = "น้ำหนักอ้างอิงต้องเป็นตัวเลขมากกว่า 0";
    }
  }

  if (shouldCheck("currentStockGrams")) {
    const stock = Number(data.currentStockGrams);
    if (!isNonNegativeNumber(data.currentStockGrams) || !Number.isInteger(stock)) {
      errors.currentStockGrams = "จำนวนสต็อก (กรัม) ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    }
  }

  if (shouldCheck("lowStockThresholdGrams")) {
    const threshold = Number(data.lowStockThresholdGrams);
    if (!isNonNegativeNumber(data.lowStockThresholdGrams) || !Number.isInteger(threshold)) {
      errors.lowStockThresholdGrams = "จุดเตือนสต็อก (กรัม) ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    }
  }

  if (data.expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(data.expiryDate);
    selected.setHours(0, 0, 0, 0);
    if (Number.isNaN(selected.getTime()) || selected < today) {
      errors.expiryDate = "วันหมดอายุของล็อตวัตถุดิบต้องไม่เป็นวันที่ในอดีต";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export default validateIngredient;
