import { createContext, useContext } from "react";
import { ingredients } from "../mock-data/index.js";

const DEFAULT_STOCK_GRAMS = 10000;
const DEFAULT_LOW_STOCK_GRAMS = 1000;

export const CATEGORY_MAP = {
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

export function normalizeIngredient(item) {
  return {
    ...item,
    categoryTh: item.categoryTh || CATEGORY_MAP[item.category] || "อื่น ๆ",
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

export function createInitialIngredients() {
  return Object.values(ingredients).map(normalizeIngredient);
}

export function isLowStock(item) {
  return Number(item?.currentStockGrams) <= Number(item?.lowStockThresholdGrams);
}

export const IngredientsContext = createContext(null);

export function useIngredients() {
  const context = useContext(IngredientsContext);
  if (!context) {
    throw new Error("useIngredients ต้องถูกเรียกภายใน <IngredientsProvider> เท่านั้น");
  }
  return context;
}
