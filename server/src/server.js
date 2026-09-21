import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import mainRouter from "./routes/index.js";
import v1Router from "./routes/v1/index.js";
import v2Router from "./routes/v2/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images for cooking kit dishes
app.use("/assets", express.static(path.join(__dirname, "mockDB/assets")));

// Health Check & Root Endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Cooking Kit 'That Tae' API Server",
    version: "1.0.0",
    docs: "/api/v1",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (รองรับทั้ง /api/v1, /api, และ /v1 ผ่าน mainRouter)
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);
app.use("/api", v1Router);
app.use("/", mainRouter);

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
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌐 Base URL: http://localhost:${port}/api/v1`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
