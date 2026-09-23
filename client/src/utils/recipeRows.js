import { NUTRIENT_BASIS_G, toGrams } from "./units.js";

const NUTRIENT_FIELDS = ["calories", "protein", "carbs", "fat", "sugar", "fiber", "sodium"];

const round1 = (v) => Math.round(v * 10) / 10;

function findIngredient(item, ingredients) {
  const id = String(item.ingredient || item.ingredientId || "");
  return (
    (id && ingredients.find((ing) => String(ing._id || ing.id) === id)) ||
    (item.nameTh && ingredients.find((ing) => ing.nameTh === item.nameTh)) ||
    null
  );
}

/**
 * รวมข้อมูลสูตรเมนูกับข้อมูลวัตถุดิบล่าสุดในคลัง แล้วคิดสารอาหารตาม "ปริมาณจริง"
 * - ค่าจากคลัง (รสยา หมวดหมู่ ธาตุ สารอาหารต่อ 100 g) มาก่อน snapshot ในสูตร
 * - สารอาหารจริง = ค่าต่อ 100 × (ปริมาณจริงแปลงเป็นกรัม ÷ 100)  เช่น กะทิ 230 kcal/100 ml ใส่ 50 ml = 115 kcal
 */
export function buildRecipeRows(recipe = [], ingredients = []) {
  const totals = NUTRIENT_FIELDS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});

  const rows = recipe.map((item) => {
    const ing = findIngredient(item, ingredients);
    const per100 = { ...(item.nutrientsPer100g || {}), ...(ing?.nutrientsPer100g || {}) };
    const unit = item.unit || "g";
    const grams = toGrams(item.quantity, unit, ing?.gramsPerPiece ?? item.gramsPerPiece);
    const ratio = grams / NUTRIENT_BASIS_G;

    const actual = {};
    NUTRIENT_FIELDS.forEach((k) => {
      const value = (Number(per100[k]) || 0) * ratio;
      actual[k] = round1(value);
      totals[k] += value;
    });

    return {
      ...item,
      unit,
      category: ing?.category || item.category,
      categoryTh: ing?.categoryTh || item.categoryTh,
      medicinalTaste: ing?.medicinalTaste || item.medicinalTaste || "",
      elements: ing?.elements?.length ? ing.elements : item.elements || [],
      nutrientsPer100g: per100,
      grams,
      actual,
    };
  });

  const roundedTotals = NUTRIENT_FIELDS.reduce(
    (acc, k) => ({ ...acc, [k]: k === "calories" || k === "sodium" ? Math.round(totals[k]) : round1(totals[k]) }),
    {},
  );

  return { rows, totals: roundedTotals };
}

/** แสดงรสยา: "หวาน/เค็ม" หรือ "รสหวาน/รสเค็ม" → "รสหวาน · รสเค็ม" */
export function formatTastes(medicinalTaste) {
  if (!medicinalTaste) return "";
  return String(medicinalTaste)
    .split(/[/,·|]+/)
    .map((t) => t.trim().replace(/^รส/, ""))
    .filter(Boolean)
    .map((t) => `รส${t}`)
    .join(" · ");
}
