import { createContext, useContext } from "react";
import { resolveImageField } from "../utils/imageUrl.js";
// ⚠️ key ต้องตรงกับ INGREDIENT_CATEGORIES ใน server/src/models/Ingredient.model.js
// (เดิมใช้ protein / dairy_egg ซึ่ง Server ไม่รับ → บันทึกวัตถุดิบหมวดนี้ไม่ได้)
export const CATEGORY_MAP = {
  meat: "เนื้อสัตว์ & โปรตีน",
  poultry: "สัตว์ปีก",
  seafood: "อาหารทะเล",
  plantprotein: "โปรตีนจากพืช",
  vegetable: "ผัก & พืชสมุนไพร",
  herb_spice: "สมุนไพร & เครื่องเทศ",
  seasoning_spice: "เครื่องปรุง & เครื่องเทศ",
  carb: "แป้ง & คาร์โบไฮเดรต",
  seasoning: "เครื่องปรุงรส",
  dairy: "นม",
  egg: "ไข่",
  other: "อื่น ๆ",
};

// หน่วยวัตถุดิบย้ายไปอยู่ที่ utils/units.js (re-export ไว้ให้ไฟล์เดิมใช้ต่อได้)
export {
  INGREDIENT_UNITS,
  NUTRIENT_BASIS_G,
  getUnitFactor,
  getUnitInfo,
  roundQty,
  toGrams,
} from "../utils/units.js";
import { NUTRIENT_BASIS_G, getUnitInfo } from "../utils/units.js";

export const DEFAULT_STOCK_GRAMS = 10000;
export const DEFAULT_LOW_STOCK_GRAMS = 1000;

export function normalizeIngredient(item) {
  const fallbackStock = Number(item?.currentStockGrams ?? item?.stockQuantity ?? DEFAULT_STOCK_GRAMS);
  const rawRegions = item?.regionalStocks || {};
  const regionalStocks = {
    north: Number(rawRegions.north || 0),
    northeast: Number(rawRegions.northeast || 0),
    central: rawRegions.central !== undefined ? Number(rawRegions.central) : fallbackStock,
    south: Number(rawRegions.south || 0),
  };

  const sumRegions =
    regionalStocks.north + regionalStocks.northeast + regionalStocks.central + regionalStocks.south;

  const currentStockGrams =
    item?.currentStockGrams !== undefined
      ? Number(item.currentStockGrams)
      : sumRegions;

  return {
    ...item,
    categoryTh: item?.categoryTh || CATEGORY_MAP[item?.category] || "อื่น ๆ",
    unit: getUnitInfo(item?.unit).value,
    // ค่าสารอาหารล็อกเป็นต่อ 100 กรัมเสมอ
    basisWeightG: NUTRIENT_BASIS_G,
    gramsPerPiece: Number(item?.gramsPerPiece) || 0,
    regionalStocks,
    currentStockGrams,
    stockQuantity: currentStockGrams,
    lowStockThresholdGrams:
      item?.lowStockThresholdGrams === undefined
        ? DEFAULT_LOW_STOCK_GRAMS
        : Number(item.lowStockThresholdGrams),
    isActive: item?.isActive !== false,
    imageUrl: resolveImageField(item?.imageUrl),
  };
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
