// สร้าง/อัปเดต index เวกเตอร์ของ That-Tae Advisor
// ใช้: npm run advisor:index            (ฝังเฉพาะที่เปลี่ยน)
//      npm run advisor:index -- --force (ฝังใหม่ทั้งหมด เช่น หลังเปลี่ยน embedding model / ขนาดเวกเตอร์)
import fs from "fs";
import { connectDB, disconnectDB } from "../config/db.js";

if (typeof process.loadEnvFile === "function" && fs.existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch (_) {}
}

const { syncAdvisorIndex } = await import("../services/advisor/indexer.js");

try {
  if (!process.env.GEMINI_API_KEY) throw new Error("ไม่พบ GEMINI_API_KEY ใน .env");
  await connectDB();
  const force = process.argv.includes("--force");
  console.log(`🧠 กำลังสร้าง Advisor index${force ? " (force)" : ""}...`);
  const result = await syncAdvisorIndex({ force });
  console.log("✅ เสร็จแล้ว:", result);
} catch (err) {
  console.error("❌ สร้าง index ไม่สำเร็จ:", err.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
