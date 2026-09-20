import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    console.log("ℹ️ ไม่พบ MONGO_URI ใน .env — เซิร์ฟเวอร์จะทำงานในโหมด In-memory Mock");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("🍃 เชื่อมต่อ MongoDB Atlas สำเร็จเรียบร้อยแล้ว");
    return true;
  } catch (error) {
    console.warn("⚠️ ไม่สามารถเชื่อมต่อ MongoDB ได้:", error.message);
    console.log("ℹ️ เซิร์ฟเวอร์จะสลับไปทำงานในโหมด In-memory Mock อัตโนมัติ");
    return false;
  }
}
