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

// หน่วยของวัตถุดิบ (ต้องตรงกับ INGREDIENT_UNIT ใน Ingredient.model.js และ server/src/utils/units.js)
// สต็อก จุดเตือน ปริมาณอ้างอิงสารอาหาร และปริมาณในสูตรเมนู ใช้หน่วยนี้ทั้งหมด
export const INGREDIENT_UNITS = [
  { value: "g", label: "กรัม", short: "g", dimension: "mass", toBase: 1, defaultBasis: 100 },
  { value: "kg", label: "กิโลกรัม", short: "kg", dimension: "mass", toBase: 1000, defaultBasis: 1 },
  { value: "ml", label: "มิลลิลิตร", short: "ml", dimension: "volume", toBase: 1, defaultBasis: 100 },
  { value: "l", label: "ลิตร", short: "L", dimension: "volume", toBase: 1000, defaultBasis: 1 },
  { value: "piece", label: "ชิ้น", short: "ชิ้น", dimension: "count", toBase: 1, defaultBasis: 1 },
];

export function getUnitInfo(unit) {
  return INGREDIENT_UNITS.find((u) => u.value === unit) || INGREDIENT_UNITS[0];
}

/** ตัวคูณแปลงหน่วย from → to (null ถ้าคนละกลุ่ม เช่น g → ชิ้น) */
export function getUnitFactor(from, to) {
  const a = getUnitInfo(from);
  const b = getUnitInfo(to);
  if (a.dimension !== b.dimension) return null;
  return a.toBase / b.toBase;
}

export const roundQty = (value) => Math.round(Number(value) * 1000) / 1000;

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
    basisWeightG: Number(item?.basisWeightG) || getUnitInfo(item?.unit).defaultBasis,
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
