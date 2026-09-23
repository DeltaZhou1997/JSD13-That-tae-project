import { createContext, useContext } from "react";
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
    basisWeightG: Number(item?.basisWeightG) || 100,
    regionalStocks,
    currentStockGrams,
    stockQuantity: currentStockGrams,
    lowStockThresholdGrams:
      item?.lowStockThresholdGrams === undefined
        ? DEFAULT_LOW_STOCK_GRAMS
        : Number(item.lowStockThresholdGrams),
    isActive: item?.isActive !== false,
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
