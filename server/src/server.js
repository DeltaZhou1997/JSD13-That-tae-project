import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import v2Router from "./routes/v2/index.js";

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cookieParser());




//*********************************** เอาไว้รันทดสอบในคอมเรา*************** */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // อนุญาต request ที่ไม่มี origin (เช่น postman หรือ server-to-server) หรือ origin ที่ตรงกับ allowedOrigins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true); // fallback อนุญาตสำหรับการเชื่อมต่อระหว่าง Vercel & Render
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/********************************************************************* */






// Health Check & Root Endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Cooking Kit 'That Tae' API Server (v2)",
    version: "2.0.0",
    docs: "/api/v2",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    version: "2.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes: เปิดเฉพาะ v2 เท่านั้น (Map ทุก endpoint เข้า v2 เพื่อให้ Frontend ทำงานได้ทันที)
app.use("/api/v2", v2Router);
app.use("/api/v1", v2Router); // Forward คำขอเดิมจาก Frontend ที่ยังชี้ /api/v1 ให้มาทำงานบน MongoDB v2 อัตโนมัติ
app.use("/api", v2Router);    // Fallback route สำหรับ /api ให้ชี้เข้า v2

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong on the server",
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port} (v2 Mode)`);
      console.log(`🌐 Base URL: http://localhost:${port}/api/v2`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
