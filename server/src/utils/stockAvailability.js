import mongoose from "mongoose";
import { Ingredient } from "../models/Ingredient.model.js";
import { PRODUCT_TO_INGREDIENT_REGION } from "../models/Product.model.js";
import { recipeQtyInStockUnit } from "./units.js";

/** โหลดวัตถุดิบทั้งหมดครั้งเดียว แล้วทำ lookup ด้วย id และชื่อไทย */
export async function loadIngredientLookup() {
  const all = await Ingredient.find().select("nameTh unit gramsPerPiece regionalStocks stockQuantity currentStockGrams").lean();
  const byId = new Map(all.map((i) => [String(i._id), i]));
  const byName = new Map(all.map((i) => [i.nameTh, i]));
  return { byId, byName };
}

/**
 * จำนวนชุดที่ทำได้จากสต็อกวัตถุดิบในภาคของเมนู (สูตรเดียวกับ Product.calculateAvailableKits)
 * @returns {{ availableKits, inStock, missing: string[], limitedBy: string|null }}
 *   missing  = วัตถุดิบที่ไม่พอแม้แต่ 1 ชุด (หรือไม่พบในคลัง)
 *   limitedBy = วัตถุดิบที่จำกัดจำนวนชุดมากที่สุด
 */
export function computeAvailability(product, lookup) {
  const recipe = Array.isArray(product?.recipe) ? product.recipe : [];
  // เมนูที่ยังไม่มีสูตร ไม่ผูกกับสต็อกวัตถุดิบ → ถือว่าพร้อมขาย
  if (recipe.length === 0) return { availableKits: null, inStock: true, missing: [], limitedBy: null };

  const region = PRODUCT_TO_INGREDIENT_REGION[product.region] || "central";
  let minKits = Infinity;
  let limitedBy = null;
  const missing = [];

  for (const item of recipe) {
    // รองรับทั้ง id ปกติ และกรณี populate("recipe.ingredient") แล้วเป็น object
    const id = String(item.ingredient?._id || item.ingredient || item.ingredientId || "");
    const ing =
      (mongoose.Types.ObjectId.isValid(id) && lookup.byId.get(id)) ||
      (item.nameTh && lookup.byName.get(item.nameTh)) ||
      null;
    const name = ing?.nameTh || item.nameTh || "วัตถุดิบ";

    if (!ing) {
      missing.push(name);
      minKits = 0;
      continue;
    }

    const perKit = recipeQtyInStockUnit(item, ing);
    if (!(perKit > 0)) continue;
    const stock =
      ing.regionalStocks?.[region] !== undefined
        ? Number(ing.regionalStocks[region]) || 0
        : Number(ing.stockQuantity ?? ing.currentStockGrams ?? 0);
    const kits = Math.max(0, Math.floor(stock / perKit));

    if (kits === 0) missing.push(name);
    if (kits < minKits) {
      minKits = kits;
      limitedBy = name;
    }
  }

  const availableKits = minKits === Infinity ? null : minKits;
  return {
    availableKits,
    inStock: availableKits === null || availableKits > 0,
    missing,
    limitedBy,
  };
}

/** เติม availability ให้รายการสินค้า (lean objects) */
export async function withAvailability(products) {
  const list = Array.isArray(products) ? products : [products];
  const lookup = await loadIngredientLookup();
  return list.map((p) => ({ ...p, availability: computeAvailability(p, lookup) }));
}
