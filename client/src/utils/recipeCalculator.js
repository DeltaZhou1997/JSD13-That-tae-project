
export const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ"];

export const NUTRIENT_KEYS = [
  "calories",
  "carbs",
  "sugar",
  "fiber",
  "protein",
  "fat",
  "sodium",
];

export const MEDICINAL_TASTES = [
  "รสฝาด",
  "รสหวาน",
  "รสมัน",
  "รสเค็ม",
  "รสเปรี้ยว",
  "รสขม",
  "รสเผ็ดร้อน",
  "รสหอมเย็น",
  "รสจืด",
  "รสเมาเบื่อ",
];

// รสยา → ธาตุที่รสนั้นบำรุง (หลักเภสัชกรรมไทย)
// เรียงคำยาวก่อน เพื่อให้ "หอมเย็น" ไม่ถูกจับเป็น "เย็น" (ธาตุไฟ)
const TASTE_KEYWORDS = [
  ["เผ็ดร้อน", "ลม"],
  ["หอมเย็น", "ลม"],
  ["เมาเบื่อ", "น้ำ"],
  ["เปรี้ยว", "น้ำ"],
  ["สุขุม", "ลม"],
  ["หวาน", "ดิน"],
  ["ฝาด", "ดิน"],
  ["เค็ม", "ดิน"],
  ["เผ็ด", "ลม"],
  ["มัน", "ดิน"],
  ["ขม", "น้ำ"],
  ["จืด", "ไฟ"],
  ["เย็น", "ไฟ"],
];

export function getTasteElement(taste) {
  const text = String(taste || "").replace(/^รส/, "").trim();
  return TASTE_KEYWORDS.find(([keyword]) => text.includes(keyword))?.[1] || null;
}

function splitTastes(tastes) {
  return (Array.isArray(tastes) ? tastes : [tastes])
    .flatMap((t) => String(t || "").split(/[/,·|\s]+/))
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * วิเคราะห์รสยาที่เลือก → ธาตุเด่น
 * สูตร: นับจำนวนรสของแต่ละธาตุ ธาตุที่มีรสมากที่สุด "เพียงธาตุเดียว" คือธาตุของวัตถุดิบ
 * status:
 *  - "empty"    ยังไม่เลือกรส
 *  - "ok"       ได้ธาตุเด่นชัดเจน
 *  - "conflict" มีหลายธาตุคะแนนเท่ากัน (ไม่เข้าเงื่อนไข ห้ามบันทึก)
 *  - "unknown"  รสที่ระบุไม่ตรงกับรสยาใดเลย
 */
export function analyzeMedicinalTastes(tastes = []) {
  const counts = ELEMENTS.reduce((acc, el) => ({ ...acc, [el]: 0 }), {});
  const tokens = splitTastes(tastes);
  if (tokens.length === 0) return { status: "empty", element: null, counts, tiedElements: [] };

  tokens.forEach((token) => {
    const element = getTasteElement(token);
    if (element) counts[element] += 1;
  });

  const max = Math.max(...Object.values(counts));
  if (max === 0) return { status: "unknown", element: null, counts, tiedElements: [] };

  const top = ELEMENTS.filter((el) => counts[el] === max);
  if (top.length > 1) return { status: "conflict", element: null, counts, tiedElements: top };
  return { status: "ok", element: top[0], counts, tiedElements: [] };
}

export const TASTE_ELEMENT_WEIGHTS = {
  ฝาด: { ดิน: 1.5 },
  มัน: { ดิน: 1.5 },
  เค็ม: { ดิน: 1.5 },
  หวาน: { ดิน: 1.0, น้ำ: 0.8 },
  เปรี้ยว: { น้ำ: 1.5 },
  เผ็ด: { ลม: 1.8 },
  หอมเย็น: { ลม: 1.2, ไฟ: 0.6 },
  ขม: { ไฟ: 1.5, น้ำ: 0.5 },
  จืด: { ไฟ: 1.5, น้ำ: 0.5 },
  เมาเบื่อ: { น้ำ: 1.5 },
};

// ธาตุหลักของวัตถุดิบกำหนดจากรสยาตามหลักเภสัชกรรมไทย (ใช้สูตรเดียวกับ analyzeMedicinalTastes)
// ข้อมูลเก่าที่คะแนนเท่ากัน ใช้ลำดับ ดิน → น้ำ → ลม → ไฟ ตามเดิม เพื่อไม่ให้การคำนวณสูตรอาหารพัง
export function getElementFromMedicinalTastes(tastes = []) {
  const result = analyzeMedicinalTastes(tastes);
  if (result.status === "ok") return result.element;
  if (result.status === "conflict") return result.tiedElements[0];
  return "ดิน";
}

const DIRECT_ELEMENT_WEIGHT = 3;

export const POTENCY_BY_CATEGORY = {
  herb_spice: 3,
  seasoning: 2,
};
const DEFAULT_POTENCY = 1;

const INTENSITY_EXPONENT = 0.5;


function emptyNutrients() {
  return NUTRIENT_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
}

function emptyElementScores() {
  return ELEMENTS.reduce((acc, element) => ({ ...acc, [element]: 0 }), {});
}

function roundNutrients(nutrients, divisor = 1) {
  return NUTRIENT_KEYS.reduce((acc, key) => {
    const value = (nutrients[key] || 0) / divisor;
    acc[key] =
      key === "calories" || key === "sodium"
        ? Math.round(value)
        : Number(value.toFixed(1));
    return acc;
  }, {});
}


export function scoreIngredientElements(ingredient, grams) {
  const scores = emptyElementScores();
  const qty = Number(grams) || 0;
  if (qty <= 0) return scores;

  const potency = POTENCY_BY_CATEGORY[ingredient?.category] ?? DEFAULT_POTENCY;
  const impact = Math.pow(qty, INTENSITY_EXPONENT) * potency;

  const taste = String(ingredient?.medicinalTaste || "");
  // ใช้ธาตุที่คำนวณจากรสยาเพียงธาตุเดียว ไม่กระจายคะแนนจากการเลือกเอง
  const derivedElement = getElementFromMedicinalTastes([taste]);
  scores[derivedElement] += impact * DIRECT_ELEMENT_WEIGHT;

  return scores;
}


export function calculateRecipeMetrics(recipeItems, servings = 2) {
  const items = Array.isArray(recipeItems) ? recipeItems : [];
  const safeServings = Math.max(1, Number(servings) || 1);

  let totalWeight = 0;
  const totals = emptyNutrients();
  const elementScores = emptyElementScores();

  items.forEach((item) => {
    const ingredient = item?.ingredient || item || {};
    const qty = Number(item?.quantity) || 0;
    if (qty <= 0) return;

    totalWeight += qty;

    const basis = Number(ingredient.basisWeightG) || 100;
    const ratio = qty / basis;
    const nutrients = ingredient.nutrientsPer100g || {};
    NUTRIENT_KEYS.forEach((key) => {
      totals[key] += (Number(nutrients[key]) || 0) * ratio;
    });

    const scores = scoreIngredientElements(ingredient, qty);
    ELEMENTS.forEach((element) => {
      elementScores[element] += scores[element];
    });
  });

  const sorted = Object.entries(elementScores).sort((a, b) => b[1] - a[1]);
  const hasScore = sorted.length > 0 && sorted[0][1] > 0;
  const dominantElement = hasScore ? sorted[0][0] : "ดิน";
  const suitability = sorted
    .filter(([, score]) => score > 0)
    .slice(0, 2)
    .map(([element]) => element);

  const roundedScores = ELEMENTS.reduce((acc, element) => {
    acc[element] = Number(elementScores[element].toFixed(1));
    return acc;
  }, {});

  return {
    totalWeight: Number(totalWeight.toFixed(1)),
    servings: safeServings,
    totals: roundNutrients(totals),
    perServing: roundNutrients(totals, safeServings),
    dominantElement,
    elementSuitability: suitability.length > 0 ? suitability : [dominantElement],
    elementScores: roundedScores,
  };
}


export function toElementPercentages(elementScores) {
  const total = ELEMENTS.reduce(
    (sum, element) => sum + (Number(elementScores?.[element]) || 0),
    0,
  );
  return ELEMENTS.reduce((acc, element) => {
    const score = Number(elementScores?.[element]) || 0;
    acc[element] = total > 0 ? Math.round((score / total) * 100) : 0;
    return acc;
  }, {});
}

export default calculateRecipeMetrics;
