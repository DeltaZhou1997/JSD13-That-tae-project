import mongoose from "mongoose";
import ingredients from "../mockDB/ingredients.js";

const DEFAULT_STOCK_GRAMS = 10000;
const DEFAULT_LOW_STOCK_GRAMS = 1000;

export const INGREDIENT_CATEGORIES = {
  meat: "เนื้อสัตว์ & โปรตีน",
  poultry: "สัตว์ปีก",
  seafood: "อาหารทะเล",
  protein: "โปรตีนจากพืช",
  vegetable: "ผัก & พืชสมุนไพร",
  herb_spice: "สมุนไพร & เครื่องเทศ",
  carb: "แป้ง & คาร์โบไฮเดรต",
  seasoning: "เครื่องปรุงรส",
  dairy_egg: "นม & ไข่",
  other: "อื่น ๆ",
};

function normalizeIngredient(item) {
  return {
    ...item,
    categoryTh: item.categoryTh || INGREDIENT_CATEGORIES[item.category] || "อื่น ๆ",
    basisWeightG: Number(item.basisWeightG) || 100,
    currentStockGrams:
      item.currentStockGrams === undefined
        ? DEFAULT_STOCK_GRAMS
        : Number(item.currentStockGrams),
    lowStockThresholdGrams:
      item.lowStockThresholdGrams === undefined
        ? DEFAULT_LOW_STOCK_GRAMS
        : Number(item.lowStockThresholdGrams),
    isActive: item.isActive !== false,
  };
}

let items = Object.values(ingredients).map(normalizeIngredient);

export function getAllIngredients() {
  return items;
}

export function getIngredientById(id) {
  return items.find((item) => item._id === id);
}

function createNextId() {
  return new mongoose.Types.ObjectId().toString();
}

export function createIngredient(data) {
  const created = normalizeIngredient({ ...data, _id: createNextId() });
  items = [...items, created];
  return created;
}

export function updateIngredient(id, data) {
  const exists = getIngredientById(id);
  if (!exists) return null;
  const updated = normalizeIngredient({ ...exists, ...data, _id: id });
  items = items.map((item) => (item._id === id ? updated : item));
  return updated;
}

export function deleteIngredient(id) {
  const exists = getIngredientById(id);
  if (!exists) return null;
  items = items.filter((item) => item._id !== id);
  return exists;
}

export function resetIngredients() {
  items = Object.values(ingredients).map(normalizeIngredient);
  return items;
}

export function getLowStockIngredients() {
  return items.filter(
    (item) => Number(item.currentStockGrams) <= Number(item.lowStockThresholdGrams),
  );
}
