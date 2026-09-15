// Mock API server — CRUD /api/products บน in-memory store (src/mock-data/dishes.js)
// จุดประสงค์: ให้ทดสอบยิง HTTP จริงได้ก่อนต่อ MongoDB จริงใน Phase 2
// รัน: npm run server (หรือ npm run server:dev สำหรับ auto-restart ตอนแก้โค้ด)
import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Mock API พร้อมใช้งาน — ดู endpoint ที่ /api/products" });
});

app.use("/api/products", productsRouter);

// 404 กลาง สำหรับ path ที่ไม่รู้จัก
app.use((req, res) => {
  res.status(404).json({ message: `ไม่พบ endpoint ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Mock API server รันที่ http://localhost:${PORT}`);
});
