import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ingredients from "../server/src/mockDB/ingredients.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recipe mapping for the 30 dishes
const dishRecipeMap = {
  dish_001: [ // น้ำพริกอ่อง
    { id: "ing_pork_mince", qty: 180, unit: "g" },
    { id: "ing_tomato_cherry", qty: 150, unit: "g" },
    { id: "ing_garlic_thai", qty: 20, unit: "g" },
    { id: "ing_shallot", qty: 30, unit: "g" },
    { id: "ing_chili_jinda", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
    { id: "ing_palm_sugar", qty: 10, unit: "g" },
  ],
  dish_002: [ // ข้าวซอยไก่
    { id: "ing_chicken_drumstick", qty: 250, unit: "g" },
    { id: "ing_egg_noodle", qty: 150, unit: "g" },
    { id: "ing_coconut_milk", qty: 250, unit: "ml" },
    { id: "ing_curry_paste_khao_soi", qty: 50, unit: "g" },
    { id: "ing_shallot", qty: 25, unit: "g" },
    { id: "ing_lime_juice", qty: 15, unit: "ml" },
    { id: "ing_palm_sugar", qty: 15, unit: "g" },
  ],
  dish_003: [ // ลาบคั่วเมือง
    { id: "ing_pork_mince", qty: 220, unit: "g" },
    { id: "ing_shallot", qty: 25, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_culantro", qty: 15, unit: "g" },
    { id: "ing_mint", qty: 10, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
    { id: "ing_roasted_rice_powder", qty: 15, unit: "g" },
  ],
  dish_004: [ // แกงฮังเล
    { id: "ing_pork_belly", qty: 250, unit: "g" },
    { id: "ing_curry_paste_hung_lay", qty: 50, unit: "g" },
    { id: "ing_shallot", qty: 30, unit: "g" },
    { id: "ing_garlic_thai", qty: 20, unit: "g" },
    { id: "ing_tamarind_paste", qty: 30, unit: "g" },
    { id: "ing_palm_sugar", qty: 20, unit: "g" },
  ],
  dish_005: [ // แกงขนุน
    { id: "ing_pork_mince", qty: 150, unit: "g" },
    { id: "ing_tomato_cherry", qty: 100, unit: "g" },
    { id: "ing_shallot", qty: 20, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
  ],
  dish_006: [ // ข้าวแต๋น
    { id: "ing_rice_noodle", qty: 150, unit: "g" },
    { id: "ing_palm_sugar", qty: 40, unit: "g" },
    { id: "ing_coconut_milk", qty: 50, unit: "ml" },
  ],
  dish_007: [ // ข้าวปุ้นซาวน้ำปลาร้า
    { id: "ing_rice_noodle", qty: 200, unit: "g" },
    { id: "ing_pla_ra", qty: 40, unit: "g" },
    { id: "ing_chili_jinda", qty: 15, unit: "g" },
    { id: "ing_string_bean", qty: 50, unit: "g" },
    { id: "ing_lime_juice", qty: 20, unit: "ml" },
  ],
  dish_008: [ // แกงอ่อม
    { id: "ing_beef_shank", qty: 200, unit: "g" },
    { id: "ing_culantro", qty: 20, unit: "g" },
    { id: "ing_string_bean", qty: 40, unit: "g" },
    { id: "ing_shallot", qty: 20, unit: "g" },
    { id: "ing_pla_ra", qty: 25, unit: "g" },
    { id: "ing_roasted_rice_powder", qty: 15, unit: "g" },
  ],
  dish_009: [ // แกงหน่อไม้ใบย่านาง
    { id: "ing_bamboo_shoot", qty: 180, unit: "g" },
    { id: "ing_pla_ra", qty: 30, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
    { id: "ing_shallot", qty: 20, unit: "g" },
    { id: "ing_roasted_rice_powder", qty: 15, unit: "g" },
  ],
  dish_010: [ // ส้มตำไทย
    { id: "ing_green_papaya", qty: 180, unit: "g" },
    { id: "ing_string_bean", qty: 30, unit: "g" },
    { id: "ing_tomato_cherry", qty: 40, unit: "g" },
    { id: "ing_garlic_thai", qty: 10, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
    { id: "ing_palm_sugar", qty: 20, unit: "g" },
    { id: "ing_fish_sauce", qty: 20, unit: "g" },
    { id: "ing_lime_juice", qty: 25, unit: "ml" },
  ],
  dish_011: [ // ต้มแซ่บกระดูกหมู
    { id: "ing_pork_mince", qty: 200, unit: "g" },
    { id: "ing_lemongrass", qty: 20, unit: "g" },
    { id: "ing_galangal", qty: 15, unit: "g" },
    { id: "ing_kaffir_leaf", qty: 5, unit: "g" },
    { id: "ing_culantro", qty: 15, unit: "g" },
    { id: "ing_chili_jinda", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 25, unit: "g" },
    { id: "ing_lime_juice", qty: 25, unit: "ml" },
  ],
  dish_012: [ // ทับทิมกรอบ
    { id: "ing_coconut_milk", qty: 200, unit: "ml" },
    { id: "ing_palm_sugar", qty: 50, unit: "g" },
  ],
  dish_013: [ // แกงรัญจวน
    { id: "ing_beef_shank", qty: 200, unit: "g" },
    { id: "ing_lemongrass", qty: 15, unit: "g" },
    { id: "ing_shallot", qty: 20, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_sweet_basil", qty: 15, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
    { id: "ing_lime_juice", qty: 20, unit: "ml" },
  ],
  dish_014: [ // แกงเทโพหมูสามชั้น
    { id: "ing_pork_belly", qty: 200, unit: "g" },
    { id: "ing_morning_glory", qty: 120, unit: "g" },
    { id: "ing_coconut_milk", qty: 250, unit: "ml" },
    { id: "ing_curry_paste_green", qty: 45, unit: "g" },
    { id: "ing_kaffir_leaf", qty: 5, unit: "g" },
    { id: "ing_tamarind_paste", qty: 25, unit: "g" },
    { id: "ing_palm_sugar", qty: 20, unit: "g" },
    { id: "ing_fish_sauce", qty: 20, unit: "g" },
  ],
  dish_015: [ // มัสมั่นไก่
    { id: "ing_chicken_drumstick", qty: 260, unit: "g" },
    { id: "ing_coconut_milk", qty: 250, unit: "ml" },
    { id: "ing_curry_paste_massaman", qty: 50, unit: "g" },
    { id: "ing_shallot", qty: 30, unit: "g" },
    { id: "ing_palm_sugar", qty: 25, unit: "g" },
    { id: "ing_tamarind_paste", qty: 20, unit: "g" },
    { id: "ing_fish_sauce", qty: 20, unit: "g" },
  ],
  dish_016: [ // แกงสิบหก
    { id: "ing_chicken_breast", qty: 200, unit: "g" },
    { id: "ing_coconut_milk", qty: 200, unit: "ml" },
    { id: "ing_thai_eggplant", qty: 80, unit: "g" },
    { id: "ing_curry_paste_green", qty: 40, unit: "g" },
    { id: "ing_sweet_basil", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_017: [ // หมูชะมวง
    { id: "ing_pork_belly", qty: 220, unit: "g" },
    { id: "ing_shallot", qty: 25, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_palm_sugar", qty: 25, unit: "g" },
    { id: "ing_fish_sauce", qty: 20, unit: "g" },
  ],
  dish_018: [ // ข้าวเหนียวมะม่วง
    { id: "ing_coconut_milk", qty: 200, unit: "ml" },
    { id: "ing_palm_sugar", qty: 50, unit: "g" },
  ],
  dish_019: [ // หน่อไม้หวานต้มกะทิ
    { id: "ing_bamboo_shoot", qty: 180, unit: "g" },
    { id: "ing_shrimp", qty: 120, unit: "g" },
    { id: "ing_coconut_milk", qty: 250, unit: "ml" },
    { id: "ing_shallot", qty: 25, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_020: [ // แกงระแวงเนื้อ
    { id: "ing_beef_shank", qty: 220, unit: "g" },
    { id: "ing_coconut_milk", qty: 220, unit: "ml" },
    { id: "ing_curry_paste_southern_sour", qty: 45, unit: "g" },
    { id: "ing_lemongrass", qty: 20, unit: "g" },
    { id: "ing_kaffir_leaf", qty: 5, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_021: [ // ผัดสะตอกะปิกุ้ง
    { id: "ing_shrimp", qty: 180, unit: "g" },
    { id: "ing_pork_mince", qty: 80, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_shallot", qty: 20, unit: "g" },
    { id: "ing_chili_jinda", qty: 15, unit: "g" },
    { id: "ing_palm_sugar", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_022: [ // ยำไตปลา
    { id: "ing_sea_bass", qty: 180, unit: "g" },
    { id: "ing_lemongrass", qty: 20, unit: "g" },
    { id: "ing_shallot", qty: 20, unit: "g" },
    { id: "ing_chili_jinda", qty: 15, unit: "g" },
    { id: "ing_kaffir_leaf", qty: 5, unit: "g" },
    { id: "ing_lime_juice", qty: 25, unit: "ml" },
  ],
  dish_023: [ // ไก่กอและ
    { id: "ing_chicken_drumstick", qty: 280, unit: "g" },
    { id: "ing_coconut_milk", qty: 150, unit: "ml" },
    { id: "ing_shallot", qty: 25, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_tamarind_paste", qty: 20, unit: "g" },
    { id: "ing_palm_sugar", qty: 20, unit: "g" },
  ],
  dish_024: [ // สาคูต้นราดกะทิ
    { id: "ing_coconut_milk", qty: 200, unit: "ml" },
    { id: "ing_palm_sugar", qty: 45, unit: "g" },
  ],
  dish_025: [ // สปาเกตตีผัดหอยลายน้ำพริกเผา
    { id: "ing_egg_noodle", qty: 180, unit: "g" },
    { id: "ing_squid", qty: 100, unit: "g" },
    { id: "ing_sweet_basil", qty: 15, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_026: [ // เปาะเปี๊ยะสดผัดไทยเส้นชาร์โคล
    { id: "ing_tofu_firm", qty: 100, unit: "g" },
    { id: "ing_shrimp", qty: 100, unit: "g" },
    { id: "ing_egg", qty: 60, unit: "g" },
    { id: "ing_tamarind_paste", qty: 25, unit: "g" },
    { id: "ing_palm_sugar", qty: 20, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_027: [ // มักกะโรนีต้มยำไข่ชีสทอดกรอบ
    { id: "ing_shrimp", qty: 120, unit: "g" },
    { id: "ing_squid", qty: 80, unit: "g" },
    { id: "ing_lemongrass", qty: 15, unit: "g" },
    { id: "ing_galangal", qty: 10, unit: "g" },
    { id: "ing_kaffir_leaf", qty: 5, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
    { id: "ing_lime_juice", qty: 20, unit: "ml" },
    { id: "ing_egg", qty: 60, unit: "g" },
  ],
  dish_028: [ // เกี๊ยวซ่าราดหน้า
    { id: "ing_pork_mince", qty: 160, unit: "g" },
    { id: "ing_morning_glory", qty: 80, unit: "g" },
    { id: "ing_garlic_thai", qty: 15, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
    { id: "ing_palm_sugar", qty: 10, unit: "g" },
  ],
  dish_029: [ // ข้าวมันไก่
    { id: "ing_chicken_breast", qty: 220, unit: "g" },
    { id: "ing_garlic_thai", qty: 20, unit: "g" },
    { id: "ing_galangal", qty: 15, unit: "g" },
    { id: "ing_chili_jinda", qty: 10, unit: "g" },
    { id: "ing_fish_sauce", qty: 15, unit: "g" },
  ],
  dish_030: [ // ขนมถ้วยใบเตยไข่หวาน
    { id: "ing_coconut_milk", qty: 220, unit: "ml" },
    { id: "ing_palm_sugar", qty: 45, unit: "g" },
    { id: "ing_egg", qty: 60, unit: "g" },
  ],
};

function computeDishData(recipeList, servings = 2) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;

  const fullRecipe = recipeList.map((item) => {
    const ing = ingredients[item.id];
    if (!ing) return null;
    const ratio = item.qty / 100;
    const n = ing.nutrientsPer100g;

    totalCalories += n.calories * ratio;
    totalProtein += n.protein * ratio;
    totalCarbs += n.carbs * ratio;
    totalFat += n.fat * ratio;
    totalFiber += n.fiber * ratio;
    totalSodium += n.sodium * ratio;

    return {
      ingredientId: ing._id,
      nameTh: ing.nameTh,
      nameEn: ing.nameEn,
      category: ing.category,
      quantity: item.qty,
      unit: item.unit,
      basisWeightG: 100,
      nutrientsPer100g: n,
    };
  }).filter(Boolean);

  const nutritionCache = {
    basisWeightUnit: "100g_ingredients",
    servings: servings,
    totals: {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      sodium: Math.round(totalSodium),
    },
    perServing: {
      calories: Math.round(totalCalories / servings),
      protein: Math.round((totalProtein / servings) * 10) / 10,
      carbs: Math.round((totalCarbs / servings) * 10) / 10,
      fat: Math.round((totalFat / servings) * 10) / 10,
      fiber: Math.round((totalFiber / servings) * 10) / 10,
      sodium: Math.round(totalSodium / servings),
    },
  };

  return { fullRecipe, nutritionCache };
}

// Generate the updated dishes file
async function updateDishesFile(targetPath) {
  const fileContent = fs.readFileSync(targetPath, "utf-8");

  // Replace recipe: [] and nutritionCache: [] for each dish
  let updated = fileContent;

  for (const [dishId, rawRecipe] of Object.entries(dishRecipeMap)) {
    const { fullRecipe, nutritionCache } = computeDishData(rawRecipe);
    
    // Find the dish block and replace recipe: [] and nutritionCache: []
    // Match dish_001: { ... }
    const regex = new RegExp(`(${dishId}:\\s*\\{[\\s\\S]*?recipe:\\s*)\\[\\]([\\s\\S]*?nutritionCache:\\s*)\\[\\]`, "m");
    if (regex.test(updated)) {
      const recipeStr = JSON.stringify(fullRecipe, null, 6).replace(/\n/g, "\n    ");
      const nutritionStr = JSON.stringify(nutritionCache, null, 6).replace(/\n/g, "\n    ");
      updated = updated.replace(regex, `$1${recipeStr}$2${nutritionStr}`);
    }
  }

  fs.writeFileSync(targetPath, updated, "utf-8");
  console.log(`Updated ${targetPath} successfully!`);
}

const serverDishesPath = path.resolve(__dirname, "../server/src/mockDB/dishes.js");
const clientDishesPath = path.resolve(__dirname, "../client/src/mock-data/dishes.js");

await updateDishesFile(serverDishesPath);
await updateDishesFile(clientDishesPath);
