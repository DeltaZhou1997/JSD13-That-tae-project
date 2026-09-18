import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../data-source");

// 1. Index and parse nutrients_elements.xlsx
const wbNutrients = xlsx.readFile(path.join(dataDir, "nutrients_elements.xlsx"));

function parseElements(elemStr) {
  if (!elemStr) return [];
  const matches = [];
  if (elemStr.includes("ดิน")) matches.push("ดิน");
  if (elemStr.includes("น้ำ")) matches.push("น้ำ");
  if (elemStr.includes("ลม")) matches.push("ลม");
  if (elemStr.includes("ไฟ")) matches.push("ไฟ");
  return matches;
}

function mapCategory(catTh) {
  if (!catTh) return "other";
  if (catTh.includes("เนื้อ") || catTh.includes("โปรตีน")) {
    if (catTh.includes("ทะเล") || catTh.includes("กุ้ง") || catTh.includes("ปลา")) return "seafood";
    return "meat";
  }
  if (catTh.includes("ผัก") || catTh.includes("สมุนไพร")) return "vegetable";
  if (catTh.includes("พริก") || catTh.includes("เครื่องแกง")) return "herb_spice";
  if (catTh.includes("แป้ง") || catTh.includes("คาร์โบ")) return "carb";
  if (catTh.includes("เครื่องปรุง") || catTh.includes("ไขมัน") || catTh.includes("ซอส")) return "seasoning";
  if (catTh.includes("กะทิ")) return "coconut";
  if (catTh.includes("ขนม") || catTh.includes("ของหวาน")) return "dessert";
  return "other";
}

const masterIngredients = {};
const ingredientLookupList = [];

let ingCounter = 1;
for (const sheetName of wbNutrients.SheetNames) {
  const rows = xlsx.utils.sheet_to_json(wbNutrients.Sheets[sheetName], { header: 1 });
  let currentCat = "";
  for (let i = 3; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[1]) continue;
    if (r[0]) currentCat = String(r[0]).trim();
    const name = String(r[1]).trim();

    const calories = Number(r[2]) || 0;
    const carbs = Number(r[3]) || 0;
    const sugar = Number(r[4]) || 0;
    const fiber = Number(r[5]) || 0;
    const protein = Number(r[6]) || 0;
    const fat = Number(r[7]) || 0;
    const sodium = Number(r[8]) || 0;
    const taste = r[9] ? String(r[9]).trim() : "";
    const elementStr = r[10] ? String(r[10]).trim() : "";
    const elements = parseElements(elementStr);

    const ingId = `ing_${String(ingCounter++).padStart(3, "0")}`;
    const ingObj = {
      _id: ingId,
      nameTh: name,
      category: mapCategory(currentCat),
      categoryTh: currentCat || "วัตถุดิบ",
      medicinalTaste: taste,
      elements: elements,
      basisWeightG: 100,
      nutrientsPer100g: {
        calories,
        carbs,
        sugar,
        fiber,
        protein,
        fat,
        sodium,
      },
      isActive: true,
    };

    masterIngredients[ingId] = ingObj;
    ingredientLookupList.push(ingObj);
  }
}

// Fallback specials that appear in recipes
const extraSpecials = [
  {
    _id: `ing_${String(ingCounter++).padStart(3, "0")}`,
    nameTh: "ถั่วลิสงป่น",
    category: "carb",
    categoryTh: "ถั่วและธัญพืช",
    medicinalTaste: "รสมัน",
    elements: ["ดิน"],
    basisWeightG: 100,
    nutrientsPer100g: { calories: 567, carbs: 16.1, sugar: 4.7, fiber: 8.5, protein: 25.8, fat: 49.2, sodium: 18 },
    isActive: true,
  },
  {
    _id: `ing_${String(ingCounter++).padStart(3, "0")}`,
    nameTh: "แป้งเท้ายายม่อม",
    category: "carb",
    categoryTh: "แป้ง & คาร์โบไฮเดรต",
    medicinalTaste: "รสจืด/มัน",
    elements: ["ดิน"],
    basisWeightG: 100,
    nutrientsPer100g: { calories: 350, carbs: 87.0, sugar: 0, fiber: 0.5, protein: 0.2, fat: 0.1, sodium: 5 },
    isActive: true,
  }
];

extraSpecials.forEach((ing) => {
  masterIngredients[ing._id] = ing;
  ingredientLookupList.push(ing);
});

function cleanStr(s) {
  return String(s || "").replace(/[\s\(\)\/\.,\-]/g, "").toLowerCase();
}

const aliases = {
  หมูสดบด: "หมู",
  มะเขือเทศเชอร์รี่: "มะเขือเทศ",
  มะเขือเทศลูกเล็ก: "มะเขือเทศ",
  น้ำมะมะขามเปียก: "น้ำมะขามเปียก",
  น้ำมะนาวแท้: "น้ำมะนาว",
  หมูสันนอก: "หมู",
  เนื้อหมูสันใน: "หมู",
  เครื่องในหมู: "หมู",
  ซี่โครงหมูสับ: "หมู",
  "เนื้อไก่ (สับ/น่อง)": "เนื้อไก่",
  "ไข่จะละเม็ด (ไข่เต่าตะนุ / ไข่ปลา)": "ไข่แดง",
  ผงขมิ้น: "ขมิ้นชัน",
  ลูกผักชี: "ผักชี",
  น้ำปลาแท้: "น้ำปลา",
  น้ำตาลมะพร้าวแท้: "น้ำตาลมะพร้าว",
  กะทิคั้นสด: "หัวกะทิ",
  ผงกะหรี่: "เครื่องแกง",
  ชะอม: "ผัก",
  ขิงอ่อน: "ขิง",
  พริกชี้ฟ้าแดง: "พริก",
  ใบมะกรูดฉีก: "ใบมะกรูด",
  ตะไคร้ทุบ: "ตะไคร้",
  ข่าหั่นแว่น: "ข่า",
};

function matchIngredient(rawName) {
  const cTarget = cleanStr(rawName);
  // 1. Direct match
  for (const n of ingredientLookupList) {
    if (cleanStr(n.nameTh) === cTarget) return n;
  }
  // 2. Alias match
  if (aliases[rawName]) {
    const aTarget = cleanStr(aliases[rawName]);
    for (const n of ingredientLookupList) {
      if (cleanStr(n.nameTh).includes(aTarget) || aTarget.includes(cleanStr(n.nameTh))) return n;
    }
  }
  // 3. Substring
  for (const n of ingredientLookupList) {
    const cRaw = cleanStr(n.nameTh);
    if (cRaw.includes(cTarget) || cTarget.includes(cRaw)) return n;
  }
  // 4. Token overlap
  for (const n of ingredientLookupList) {
    const tokens = n.nameTh.split(/[\/\(\)\s,]+/);
    for (const t of tokens) {
      if (t.length >= 3 && rawName.includes(t)) return n;
    }
  }
  return ingredientLookupList[0];
}

// 2. Dish Sheet mapping
const DISH_SHEET_MAP = {
  dish_001: { file: "northern.xlsx", sheet: "น้ำพริกอ่อง" },
  dish_002: { file: "northern.xlsx", sheet: "ข้าวซอย" },
  dish_003: { file: "northern.xlsx", sheet: "ลาบเหนือ" },
  dish_004: { file: "northern.xlsx", sheet: "แกงฮังเล" },
  dish_005: { file: "northern.xlsx", sheet: "แกงขนุน" },
  dish_006: { file: "desserts.xlsx", sheet: "ข้าวแต๋น" },

  dish_007: { file: "isan.xlsx", sheet: "ข้าวปุ้นซาว (ขนมจีนคลุกน้ำปลาร้" },
  dish_008: { file: "isan.xlsx", sheet: "แกงอ่อม" },
  dish_009: { file: "isan.xlsx", sheet: "แกงหน่อไม้ใบย่านาง" },
  dish_010: { file: "isan.xlsx", sheet: "ส้มตำไทย" },
  dish_011: { file: "isan.xlsx", sheet: "ต้มแซ่บกระดูกหมู" },
  dish_012: { file: "desserts.xlsx", sheet: "ทับทิมกรอบ" },

  dish_013: { file: "central.xlsx", sheet: "แกงรัญจวน" },
  dish_014: { file: "central.xlsx", sheet: "แกงเทโพ" },
  dish_015: { file: "central.xlsx", sheet: "แกงมัสมั่นไก่" },
  dish_016: { file: "central.xlsx", sheet: "แกงโสฬส" },
  dish_017: { file: "central.xlsx", sheet: "หมูชะมวง" },
  dish_018: { file: "desserts.xlsx", sheet: "ข้าวเหนียวมะม่วง" },

  dish_019: { file: "southern.xlsx", sheet: "หน่อไม้หวานต้มกะทิ" },
  dish_020: { file: "southern.xlsx", sheet: "แกงระแวง" },
  dish_021: { file: "southern.xlsx", sheet: "ผัดสะตอกับกะปิใส่กุ้ง" },
  dish_022: { file: "southern.xlsx", sheet: "ยำไตปลา" },
  dish_023: { file: "southern.xlsx", sheet: "ไก่กอแระ" },
  dish_024: { file: "desserts.xlsx", sheet: "สาคูน้ำกะทิ" },

  dish_025: { file: "fusion.xlsx", sheet: "สปาเกตตีผัดหอยลายน้ำพริกเผา" },
  dish_026: { file: "fusion.xlsx", sheet: "เปาะเปี๊ยะสดผัดไทยเส้นชาร์โคล" },
  dish_027: { file: "fusion.xlsx", sheet: "มักกะโรนีต้มยำไข่ชีสทอดกรอบ" },
  dish_028: { file: "fusion.xlsx", sheet: "เกี๊ยวซ่าราดหน้า" },
  dish_029: { file: "fusion.xlsx", sheet: "ข้าวมันไก่ (พร้อมน้ำจิ้มและน้ำซ" },
  dish_030: { file: "desserts.xlsx", sheet: "ขนมถ้วยไข่หวาน" },
};

function assignRealisticQuantity(ing) {
  const cat = ing.category;
  const name = ing.nameTh;
  if (cat === "meat" || cat === "seafood") return { qty: 200, unit: "g" };
  if (cat === "carb") {
    if (name.includes("เส้น") || name.includes("ข้าว")) return { qty: 150, unit: "g" };
    return { qty: 100, unit: "g" };
  }
  if (cat === "coconut" || name.includes("กะทิ")) return { qty: 200, unit: "ml" };
  if (cat === "vegetable") {
    if (name.includes("มะละกอ") || name.includes("หน่อไม้") || name.includes("ผักบุ้ง")) return { qty: 150, unit: "g" };
    if (name.includes("มะเขือเทศ")) return { qty: 80, unit: "g" };
    return { qty: 40, unit: "g" };
  }
  if (cat === "herb_spice") {
    if (name.includes("พริกแห้ง") || name.includes("พริกขี้หนู")) return { qty: 15, unit: "g" };
    if (name.includes("หอม") || name.includes("กระเทียม")) return { qty: 25, unit: "g" };
    if (name.includes("ตะไคร้") || name.includes("ข่า")) return { qty: 20, unit: "g" };
    return { qty: 10, unit: "g" };
  }
  if (cat === "seasoning") {
    if (name.includes("น้ำปลา") || name.includes("น้ำมะนาว") || name.includes("น้ำมะขาม")) return { qty: 20, unit: "ml" };
    if (name.includes("น้ำตาล")) return { qty: 15, unit: "g" };
    if (name.includes("กะปิ") || name.includes("ปลาร้า")) return { qty: 25, unit: "g" };
    if (name.includes("เกลือ")) return { qty: 5, unit: "g" };
    if (name.includes("น้ำมัน")) return { qty: 15, unit: "ml" };
    return { qty: 15, unit: "g" };
  }
  if (cat === "dessert") return { qty: 50, unit: "g" };
  return { qty: 20, unit: "g" };
}

// 3. Process all dishes
const dishesResult = {};

// Read existing dishes file to preserve metadata (nameEn, images, description, history, price, etc.)
const existingDishesModule = await import("../server/src/mockDB/dishes.js");
const existingDishes = existingDishesModule.default;

for (const [dishId, info] of Object.entries(DISH_SHEET_MAP)) {
  const existing = existingDishes[dishId] || {};
  const wb = xlsx.readFile(path.join(dataDir, info.file));
  const sheet = wb.Sheets[info.sheet];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let currentCatTh = "";
  const recipe = [];
  const elementCounts = { ดิน: 0, น้ำ: 0, ลม: 0, ไฟ: 0 };

  let totalCalories = 0;
  let totalCarbs = 0;
  let totalSugar = 0;
  let totalFiber = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalSodium = 0;

  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[1]) continue;
    if (r[0]) currentCatTh = String(r[0]).trim();
    const rawIngName = String(r[1]).trim();
    const sheetTaste = r[2] ? String(r[2]).trim() : "";
    const sheetElementStr = r[3] ? String(r[3]).trim() : "";
    const sheetElements = parseElements(sheetElementStr);

    const matchedMaster = matchIngredient(rawIngName);
    const { qty, unit } = assignRealisticQuantity(matchedMaster);

    const ratio = qty / 100;
    const n = matchedMaster.nutrientsPer100g;

    totalCalories += n.calories * ratio;
    totalCarbs += n.carbs * ratio;
    totalSugar += n.sugar * ratio;
    totalFiber += n.fiber * ratio;
    totalProtein += n.protein * ratio;
    totalFat += n.fat * ratio;
    totalSodium += n.sodium * ratio;

    const ingElements = sheetElements.length > 0 ? sheetElements : matchedMaster.elements;
    ingElements.forEach((el) => {
      if (elementCounts[el] !== undefined) elementCounts[el]++;
    });

    recipe.push({
      ingredientId: matchedMaster._id,
      nameTh: rawIngName,
      category: matchedMaster.category,
      categoryTh: currentCatTh || matchedMaster.categoryTh,
      quantity: qty,
      unit: unit,
      medicinalTaste: sheetTaste || matchedMaster.medicinalTaste,
      elements: ingElements,
      basisWeightG: 100,
      nutrientsPer100g: n,
    });
  }

  // Determine dominant element
  let dominantElement = "ดิน";
  let maxCount = -1;
  for (const [el, count] of Object.entries(elementCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantElement = el;
    }
  }

  const servings = existing.servings || 2;
  const nutritionCache = {
    basisWeightUnit: "100g_ingredients",
    servings: servings,
    totals: {
      calories: Math.round(totalCalories),
      carbs: Math.round(totalCarbs * 10) / 10,
      sugar: Math.round(totalSugar * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      protein: Math.round(totalProtein * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      sodium: Math.round(totalSodium),
    },
    perServing: {
      calories: Math.round(totalCalories / servings),
      carbs: Math.round((totalCarbs / servings) * 10) / 10,
      sugar: Math.round((totalSugar / servings) * 10) / 10,
      fiber: Math.round((totalFiber / servings) * 10) / 10,
      protein: Math.round((totalProtein / servings) * 10) / 10,
      fat: Math.round((totalFat / servings) * 10) / 10,
      sodium: Math.round(totalSodium / servings),
    },
  };

  dishesResult[dishId] = {
    _id: dishId,
    nameTh: existing.nameTh,
    nameEn: existing.nameEn,
    region: existing.region,
    regionNameTh: existing.regionNameTh,
    type: existing.type || "cooking_kit",
    dishType: existing.dishType || "curry",
    dominantElement: dominantElement,
    elementSuitability: Object.keys(elementCounts).filter((k) => elementCounts[k] > 0),
    description: existing.description,
    history: existing.history,
    storageInstruction: existing.storageInstruction,
    reheatingInstruction: existing.reheatingInstruction,
    imageUrl: existing.imageUrl,
    price: existing.price,
    servings: servings,
    recipe: recipe,
    nutritionCache: nutritionCache,
    cookingSteps: existing.cookingSteps || [],
    version: 1,
    isActive: true,
    createdAt: existing.createdAt || "2026-08-24T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  };
}

console.log(`Generated master ingredients: ${Object.keys(masterIngredients).length}`);
console.log(`Generated dishes with full recipes: ${Object.keys(dishesResult).length}`);

// 4. Serialize to files
function generateIngredientsFileContent(data) {
  return `// Mock Ingredients Master Catalog Generated From Domain Database
// อิงข้อมูลสารอาหารจริง รสยา และธาตุเจ้าเรือนต่อ 100 กรัม จากฐานข้อมูล
export const ingredients = ${JSON.stringify(data, null, 2)};

export default ingredients;
`;
}

function generateDishesFileContent(dishesObj) {
  let content = `// Mock dishes แบบ key-value โดยใช้ _id เป็น key
// สร้างจากฐานข้อมูลสูตรอาหาร วัตถุดิบแยกย่อย สารอาหารต่อ 100g และธาตุเจ้าเรือน (ER Diagram Spec)

const dishes = {\n`;

  for (const [key, dish] of Object.entries(dishesObj)) {
    content += `  ${key}: {\n`;
    content += `    _id: ${JSON.stringify(dish._id)},\n`;
    content += `    nameTh: ${JSON.stringify(dish.nameTh)},\n`;
    content += `    nameEn: ${JSON.stringify(dish.nameEn)},\n`;
    content += `    region: ${JSON.stringify(dish.region)},\n`;
    content += `    regionNameTh: ${JSON.stringify(dish.regionNameTh)},\n`;
    content += `    type: ${JSON.stringify(dish.type)},\n`;
    content += `    dishType: ${JSON.stringify(dish.dishType)},\n`;
    content += `    dominantElement: ${JSON.stringify(dish.dominantElement)},\n`;
    content += `    elementSuitability: ${JSON.stringify(dish.elementSuitability)},\n`;
    content += `    description: ${JSON.stringify(dish.description)},\n`;
    content += `    history: ${JSON.stringify(dish.history)},\n`;
    content += `    storageInstruction: ${JSON.stringify(dish.storageInstruction)},\n`;
    content += `    reheatingInstruction: ${JSON.stringify(dish.reheatingInstruction)},\n`;

    // Reconstruct new URL for local assets
    const images = Array.isArray(dish.imageUrl) ? dish.imageUrl : [dish.imageUrl];
    const firstImg = images[0] || "";
    const match = firstImg.match(/assets\/([^\/]+)\/([^\/]+)$/);
    if (match) {
      const folder = match[1];
      const baseName = match[2].split("?")[0].split("-")[0].replace(/(\.jpg)+$/i, "");
      const file = `${baseName}.jpg`;
      const otherImgs = images.slice(1).map((s) => JSON.stringify(s)).join(", ");
      content += `    imageUrl: [\n      new URL("./assets/${folder}/${file}", import.meta.url).href${otherImgs ? ",\n      " + otherImgs : ""}\n    ],\n`;
    } else {
      content += `    imageUrl: ${JSON.stringify(images, null, 6)},\n`;
    }

    content += `    price: ${dish.price},\n`;
    content += `    servings: ${dish.servings},\n`;
    content += `    recipe: ${JSON.stringify(dish.recipe, null, 6)},\n`;
    content += `    nutritionCache: ${JSON.stringify(dish.nutritionCache, null, 6)},\n`;
    content += `    cookingSteps: ${JSON.stringify(dish.cookingSteps, null, 6)},\n`;
    content += `    version: ${dish.version},\n`;
    content += `    isActive: ${dish.isActive},\n`;
    content += `    createdAt: ${JSON.stringify(dish.createdAt)},\n`;
    content += `    updatedAt: ${JSON.stringify(dish.updatedAt)},\n`;
    content += `  },\n`;
  }

  content += `};\n\nexport default dishes;\n`;
  return content;
}

// Write to Server & Client mock directories
const serverIngPath = path.resolve(__dirname, "../server/src/mockDB/ingredients.js");
const clientIngPath = path.resolve(__dirname, "../client/src/mock-data/ingredients.js");
const serverDishesPath = path.resolve(__dirname, "../server/src/mockDB/dishes.js");
const clientDishesPath = path.resolve(__dirname, "../client/src/mock-data/dishes.js");

const ingContent = generateIngredientsFileContent(masterIngredients);
const dishesContent = generateDishesFileContent(dishesResult);

fs.writeFileSync(serverIngPath, ingContent, "utf-8");
fs.writeFileSync(clientIngPath, ingContent, "utf-8");
console.log("Wrote ingredients to server and client!");

fs.writeFileSync(serverDishesPath, dishesContent, "utf-8");
fs.writeFileSync(clientDishesPath, dishesContent, "utf-8");
console.log("Wrote dishes to server and client!");
