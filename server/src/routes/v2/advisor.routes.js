import { Router } from "express";
import { verifyToken, requireAdmin, getOptionalUser } from "./users.routes.js";
import { askAdvisor } from "../../services/advisor/advisorService.js";
import { syncAdvisorIndex } from "../../services/advisor/indexer.js";
import { getAdvisorConfig, isAdvisorEnabled } from "../../services/advisor/config.js";
import { AdvisorChunk } from "../../models/AdvisorChunk.model.js";
import { GeminiError } from "../../services/advisor/geminiClient.js";

const router = Router();

// -------------------------------------------------------------
// Rate limit แบบง่ายในหน่วยความจำ (ต่อ userId หรือ IP) — กันยิงถี่จนเปลือง API
// -------------------------------------------------------------
const hits = new Map(); // ต่อนาที
const daily = { day: "", perWho: new Map(), total: 0 }; // ต่อวัน (รีเซ็ตเมื่อขึ้นวันใหม่)

function advisorRateLimit(req, res, next) {
  const cfg = getAdvisorConfig();
  const who = req.advisorUser?.id ? `u:${req.advisorUser.id}` : `ip:${req.ip}`;
  const now = Date.now();

  const today = new Date(now).toISOString().slice(0, 10);
  if (daily.day !== today) {
    daily.day = today;
    daily.perWho.clear();
    daily.total = 0;
  }
  if (daily.total >= cfg.dailyLimitGlobal) {
    return res.status(429).json({ message: "วันนี้มีผู้ใช้งาน AI Advisor ครบโควตาแล้ว กรุณาลองใหม่พรุ่งนี้" });
  }
  if ((daily.perWho.get(who) || 0) >= cfg.dailyLimitPerUser) {
    return res.status(429).json({ message: "วันนี้คุณถามครบจำนวนที่กำหนดแล้ว กรุณาลองใหม่พรุ่งนี้" });
  }

  const recent = (hits.get(who) || []).filter((t) => now - t < 60_000);
  if (recent.length >= cfg.rateLimitPerMinute) {
    return res.status(429).json({ message: "ถามถี่เกินไป กรุณารอสักครู่แล้วลองใหม่" });
  }
  recent.push(now);
  hits.set(who, recent);
  if (hits.size > 5000) hits.clear(); // กันหน่วยความจำโต

  daily.perWho.set(who, (daily.perWho.get(who) || 0) + 1);
  daily.total += 1;
  next();
}

// อ่าน token แบบไม่บังคับ: ไม่มี/ไม่ถูกต้อง → guest
function attachOptionalUser(req, res, next) {
  req.advisorUser = getOptionalUser(req);
  next();
}

// =========================================================================
// POST /api/v2/advisor/chat — ถาม That-Tae Advisor
// body: { message, history?: [{role:"user"|"assistant", text}], guestElement?, guestCartProductIds?: [] }
// role มาจาก token เท่านั้น (ไม่รับจาก body)
// =========================================================================
router.post("/chat", attachOptionalUser, advisorRateLimit, async (req, res, next) => {
  if (!isAdvisorEnabled()) {
    return res.status(503).json({ message: "ยังไม่ได้เปิดใช้งาน AI Advisor (ไม่พบ GEMINI_API_KEY)" });
  }
  const { message, history, guestElement, guestCartProductIds } = req.body || {};
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ message: "กรุณาพิมพ์คำถาม" });
  }

  try {
    const result = await askAdvisor({
      tokenUser: req.advisorUser,
      message,
      history,
      guestElement,
      guestCartProductIds,
    });
    res.json(result);
  } catch (err) {
    if (err instanceof GeminiError) {
      console.error("Advisor Gemini error:", err.message);
      return res.status(err.status === 422 ? 422 : 503).json({
        message: err.status === 422 ? "ไม่สามารถตอบคำถามนี้ได้" : "AI Advisor ไม่พร้อมใช้งานชั่วคราว",
      });
    }
    // ไม่ส่งรายละเอียดข้อผิดพลาดภายใน (เช่น error ของ DB) กลับไปหาผู้ใช้
    console.error("Advisor error:", err);
    res.status(500).json({ message: "AI Advisor เกิดข้อผิดพลาด กรุณาลองใหม่" });
  }
});

// =========================================================================
// GET /api/v2/advisor/status — สถานะ index (Admin)
// =========================================================================
router.get("/status", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const cfg = getAdvisorConfig();
    const counts = await AdvisorChunk.aggregate([
      { $group: { _id: { type: "$sourceType", visibility: "$visibility" }, count: { $sum: 1 } } },
    ]);
    res.json({
      enabled: isAdvisorEnabled(),
      generationModel: cfg.generationModel,
      embeddingModel: cfg.embeddingModel,
      embeddingDim: cfg.embeddingDim,
      vectorSearch: cfg.vectorIndexName ? `atlas:${cfg.vectorIndexName}` : "in-memory",
      chunks: counts.map((c) => ({ ...c._id, count: c.count })),
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// POST /api/v2/advisor/reindex — สร้าง index ใหม่ทันที (Admin) ?force=true = ฝังใหม่ทั้งหมด
// =========================================================================
router.post("/reindex", verifyToken, requireAdmin, async (req, res, next) => {
  if (!isAdvisorEnabled()) {
    return res.status(503).json({ message: "ไม่พบ GEMINI_API_KEY" });
  }
  try {
    const result = await syncAdvisorIndex({ force: req.query.force === "true" });
    res.json({ message: "อัปเดต index เรียบร้อย", ...result });
  } catch (err) {
    if (err instanceof GeminiError) return res.status(503).json({ message: err.message });
    next(err);
  }
});

export default router;
