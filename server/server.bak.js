import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import checkoutRoutes from "./src/routes/v1/checkout.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Cooking Kit API Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Middleware ตรวจสอบการเชื่อมต่อ MongoDB ก่อนเรียกใช้งาน API Database
// เพื่อป้องกันการค้าง 10 วินาที (Buffering Timeout) ในกรณีที่ยังไม่ได้ต่อ Database
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "⚠️ ยังไม่ได้เชื่อมต่อ MongoDB! กรุณาใส่ MONGO_URI ในไฟล์ .env ให้ถูกต้องก่อนทดสอบ API นี้",
      database: "Disconnected",
    });
  }
  next();
});

// Test Route: สำหรับสร้างสินค้าทดลองเพื่อเอา ID ไปเทส Checkout
app.post("/api/test/seed-product", async (req, res) => {
  try {
    const Product = mongoose.model("Product");
    const sampleProduct = await Product.create({
      name: req.body.name || "ชุดทำอาหารไทย น้ำพริกอ่อง",
      price: req.body.price || 189,
      quantity: req.body.quantity || 50,
      category: "cooking_kit",
    });

    res.status(201).json({
      success: true,
      message: "สร้างสินค้าตัวอย่างสำเร็จ สามารถนำ _id ไปทดสอบ checkout ได้",
      product: sampleProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ผูก Checkout Routes เข้ากับ /api
app.use("/api", checkoutRoutes);

// Handle 404 สำหรับ Route ที่ไม่มีอยู่
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const startServer = async () => {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ เชื่อมต่อ MongoDB สำเร็จเรียบร้อยแล้ว");
    } catch (err) {
      console.error("⚠️ ไม่สามารถเชื่อมต่อ MongoDB ได้:", err.message);
      console.log(
        "👉 คุณสามารถรัน Server ทดสอบ route เบื้องต้นได้ หรือตั้งค่า MONGO_URI ใน .env ให้ถูกต้อง",
      );
    }
  } else {
    console.warn("⚠️ คำเตือน: ยังไม่ได้ตั้งค่า MONGO_URI ในไฟล์ .env");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server กำลังรันอยู่ที่ http://localhost:${PORT}`);
    console.log(`📡 ทดสอบ Health Check ได้ที่ http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
