import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import dishes from "../mockDB/dishes.js";
import Product from "../models/Product.model.js";
import { mapDishToProduct } from "../data/products.js";

async function seed() {
  const connected = await connectDB();
  if (!connected) {
    console.error("❌ ไม่พบ MONGO_URI/MONGODB_URI ใน .env — ยกเลิกการ seed");
    process.exit(1);
  }

  const docs = Object.values(dishes)
    .map(mapDishToProduct)
    .map(({ _id, ...doc }) => doc);

  await Product.deleteMany({});
  const inserted = await Product.insertMany(docs, { ordered: true });

  console.log(`✅ seed สำเร็จ ${inserted.length} เมนู เข้า collection "products"`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ seed ล้มเหลว:", error);
  process.exit(1);
});
