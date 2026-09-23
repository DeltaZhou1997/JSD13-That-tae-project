import fs from "fs";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { Product } from "../models/Product.model.js";
import { Ingredient } from "../models/Ingredient.model.js";

// โหลด .env อัตโนมัติ
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  if (typeof process.loadEnvFile === "function" && fs.existsSync(".env")) {
    try {
      process.loadEnvFile(".env");
    } catch (_) {}
  }
}

async function clearData() {
  try {
    console.log("🔌 กำลังเชื่อมต่อ MongoDB Atlas...");
    await connectDB();

    const productCountBefore = await Product.countDocuments();
    const ingredientCountBefore = await Ingredient.countDocuments();

    console.log(`📦 พบเมนูอาหาร (Products) เดิม: ${productCountBefore} รายการ`);
    console.log(`🌿 พบวัตถุดิบ (Ingredients) เดิม: ${ingredientCountBefore} รายการ`);

    const delProducts = await Product.deleteMany({});
    const delIngredients = await Ingredient.deleteMany({});

    console.log(`🗑️ ลบเมนูอาหารสำเร็จ: ${delProducts.deletedCount} รายการ`);
    console.log(`🗑️ ลบวัตถุดิบสำเร็จ: ${delIngredients.deletedCount} รายการ`);

    const productCountAfter = await Product.countDocuments();
    const ingredientCountAfter = await Ingredient.countDocuments();

    console.log(`✅ ยืนยันคงเหลือในฐานข้อมูล Atlas: Products = ${productCountAfter}, Ingredients = ${ingredientCountAfter}`);
    console.log("🎉 ล้างข้อมูลเมนูและวัตถุดิบทั้งหมดเรียบร้อยแล้ว!");
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการลบข้อมูล:", err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

clearData();
