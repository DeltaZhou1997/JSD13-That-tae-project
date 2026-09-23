import fs from "fs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

// โหลด .env อัตโนมัติกรณีรันแบบ standalone และยังไม่มี env ใน process
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  if (typeof process.loadEnvFile === "function" && fs.existsSync(".env")) {
    try {
      process.loadEnvFile(".env");
    } catch (_) {}
  }
}
import dishes from "../mockDB/dishes.js";
import rawIngredients from "../mockDB/ingredients.js";
import Product from "../models/Product.model.js";
import Ingredient, { REGION, INGREDIENT_CATEGORIES } from "../models/Ingredient.model.js";
import { mapDishToProduct } from "../data/products.js";

async function seedAll() {
  const connected = await connectDB();
  if (!connected && mongoose.connection.readyState !== 1) {
    console.error("❌ ไม่พบ MONGO_URI/MONGODB_URI ใน .env หรือต่อ DB ไม่สำเร็จ — ยกเลิกการ seed");
    process.exit(1);
  }

  console.log("🌱 กำลังเตรียมข้อมูลเริ่มต้น (Ingredients & Products)...");

  // 1. Seed วัตถุดิบ (Ingredients)
  const defaultRegions = ["north", "northeast", "central", "south", "all"];
  const ingredientDocs = Object.entries(rawIngredients).map(([key, item], index) => {
    const assignedRegion = item.region || defaultRegions[index % defaultRegions.length];
    return {
      nameTh: item.nameTh,
      nameEn: item.nameEn || item.nameTh,
      category: item.category || "vegetable",
      categoryTh: item.categoryTh || INGREDIENT_CATEGORIES[item.category] || "อื่น ๆ",
      medicinalTaste: Array.isArray(item.medicinalTaste)
        ? item.medicinalTaste[0] || "จืด"
        : item.medicinalTaste || "จืด",
      elements: Array.isArray(item.elements) && item.elements.length > 0 ? item.elements : ["ดิน"],
      basisWeightG: item.basisWeightG || 100,
      nutritionPer100G: {
        calories: item.nutrientsPer100g?.calories || item.calories || 0,
        carb: item.nutrientsPer100g?.carbs || 0,
        sugar: item.nutrientsPer100g?.sugar || 0,
        fiber: item.nutrientsPer100g?.fiber || 0,
        protein: item.nutrientsPer100g?.protein || 0,
        fat: item.nutrientsPer100g?.fat || 0,
        sodium: item.nutrientsPer100g?.sodium || 0,
      },
      stockQuantity: item.stockQuantity ?? (50 + (index % 10) * 10), // สต็อกเริ่มต้น 50 - 140
      unit: item.unit || "g",
      pricePerUnit: item.pricePerUnit || 15,
      region: assignedRegion,
      regions: [assignedRegion, "all"],
      regionNameTh: REGION[assignedRegion] || "ทั่วไป",
      isActive: true,
    };
  });

  await Ingredient.deleteMany({});
  const insertedIngredients = await Ingredient.insertMany(ingredientDocs, { ordered: false });
  console.log(`✅ Seed สำเร็จ: ${insertedIngredients.length} วัตถุดิบ เข้า collection "ingredients"`);

  // Map เพื่อผูก ObjectId ของ Ingredient เข้ากับ Recipe ของ Product
  const ingredientMap = new Map();
  insertedIngredients.forEach((ing) => {
    ingredientMap.set(ing.nameTh, ing._id);
  });

  // 2. Seed เมนูอาหาร (Products)
  const productDocs = Object.values(dishes)
    .map(mapDishToProduct)
    .map(({ _id, ...doc }) => {
      // ผูก ObjectId ของ Ingredient ในสูตร
      const updatedRecipe = (doc.recipe || []).map((r) => ({
        ...r,
        ingredient: ingredientMap.get(r.nameTh) || undefined,
      }));

      return {
        ...doc,
        recipe: updatedRecipe,
        // กำหนดแท็กเริ่มต้นของโรคและการแพ้
        foodRestrictions: ["gerd_friendly", "low_sodium"],
        isActive: true,
      };
    });

  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(productDocs, { ordered: false });
  console.log(`✅ Seed สำเร็จ: ${insertedProducts.length} เมนูอาหาร เข้า collection "products"`);

  console.log("🎉 Seed ฐานข้อมูล MongoDB ทั้งหมดเสร็จสมบูรณ์ พร้อมใช้งาน 100%!");
  await mongoose.disconnect();
  process.exit(0);
}

seedAll().catch((err) => {
  console.error("❌ Seed ล้มเหลว:", err);
  process.exit(1);
});
