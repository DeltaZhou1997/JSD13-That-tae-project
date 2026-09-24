import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { verifyToken, requireAdmin } from "./users.routes.js";
import { actorFromReq } from "../../utils/audit.js";
import { findSimilarNames } from "../../utils/nameSimilarity.js";
import { Product } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import {
  IMPORT_TYPES,
  createPreview,
  getSession,
  deleteSession,
  startCommit,
  statusOf,
  buildTemplate,
  columnsOf,
} from "../../services/import/importService.js";

const router = Router();
router.use(verifyToken, requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ok = /\.zip$/i.test(file.originalname) || /zip/.test(file.mimetype);
    cb(ok ? null : new Error("รองรับเฉพาะไฟล์ .zip"), ok);
  },
});

const validType = (type) => IMPORT_TYPES.includes(type);

// =========================================================================
// GET /api/v2/import/similar/:type?name=&excludeId= — ตรวจชื่อซ้ำ/ใกล้เคียง (ใช้ในฟอร์มเพิ่ม/แก้ไข)
// =========================================================================
router.get("/similar/:type", async (req, res, next) => {
  try {
    const { type } = req.params;
    const name = String(req.query.name || "").trim();
    if (!validType(type) || !name) return res.status(400).json({ message: "ระบุชนิดและชื่อให้ถูกต้อง" });
    const excludeId = mongoose.Types.ObjectId.isValid(req.query.excludeId) ? String(req.query.excludeId) : null;

    const rows =
      type === "products"
        ? (await Product.find().select("name nameTh nameEn isActive").lean()).map((p) => ({ id: String(p._id), name: p.nameTh || p.name, nameEn: p.nameEn, inactive: p.isActive === false }))
        : (await Ingredient.find().select("nameTh nameEn isActive").lean()).map((i) => ({ id: String(i._id), name: i.nameTh, nameEn: i.nameEn, inactive: i.isActive === false }));

    const matches = findSimilarNames(name, rows.filter((r) => r.id !== excludeId)).map((m) => ({
      ...m,
      inactive: rows.find((r) => r.id === m.id)?.inactive || false,
    }));
    res.json({ matches });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// GET /api/v2/import/template/:type — ดาวน์โหลดไฟล์ตัวอย่าง (.zip)
// =========================================================================
router.get("/template/:type", (req, res) => {
  const { type } = req.params;
  if (!validType(type)) return res.status(400).json({ message: "ชนิดไม่ถูกต้อง" });
  const zip = buildTemplate(type);
  res.set({
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="that-tae-${type}-template.zip"`,
    "Content-Length": zip.length,
  });
  res.send(zip);
});

// GET /api/v2/import/columns/:type — คำอธิบายคอลัมน์ (แสดงในหน้าวิธีเตรียมไฟล์)
router.get("/columns/:type", (req, res) => {
  const { type } = req.params;
  if (!validType(type)) return res.status(400).json({ message: "ชนิดไม่ถูกต้อง" });
  res.json({ files: columnsOf(type) });
});

// =========================================================================
// POST /api/v2/import/:type/preview — อัปโหลด zip → ตรวจข้อมูล (ยังไม่บันทึก)
// =========================================================================
router.post("/:type/preview", (req, res, next) => {
  const { type } = req.params;
  if (!validType(type)) return res.status(400).json({ message: "ชนิดไม่ถูกต้อง" });

  upload.single("file")(req, res, async (uploadErr) => {
    if (uploadErr) {
      const message = uploadErr.code === "LIMIT_FILE_SIZE" ? "ไฟล์ zip ใหญ่เกิน 50MB" : uploadErr.message;
      return res.status(400).json({ message });
    }
    if (!req.file) return res.status(400).json({ message: "กรุณาแนบไฟล์ .zip (field: file)" });
    try {
      const result = await createPreview(type, req.file.buffer, actorFromReq(req));
      if (result.error) return res.status(400).json({ message: result.error });
      res.json(result.session);
    } catch (err) {
      next(err);
    }
  });
});

// GET /api/v2/import/:importId/image/:name — รูปจาก zip สำหรับ preview
router.get("/:importId/image/:name", (req, res) => {
  const s = getSession(req.params.importId, actorFromReq(req));
  const img = s?.images?.get(String(req.params.name).toLowerCase());
  if (!img) return res.status(404).json({ message: "ไม่พบรูป" });
  res.set({ "Content-Type": img.contentType, "Cache-Control": "private, max-age=600" });
  res.send(img.buffer);
});

// =========================================================================
// POST /api/v2/import/:importId/commit — เริ่มนำเข้า
// body: { choices: { [rowIndex]: { action: "create"|"update"|"skip", targetId? } } }
// =========================================================================
router.post("/:importId/commit", (req, res) => {
  const s = getSession(req.params.importId, actorFromReq(req));
  if (!s) return res.status(404).json({ message: "รอบนำเข้าหมดอายุหรือไม่พบ กรุณาอัปโหลดใหม่" });
  const result = startCommit(s, req.body?.choices || {});
  if (result.error) return res.status(400).json({ message: result.error });
  res.status(202).json(statusOf(s));
});

// GET /api/v2/import/:importId/status — ความคืบหน้า
router.get("/:importId/status", (req, res) => {
  const s = getSession(req.params.importId, actorFromReq(req));
  if (!s) return res.status(404).json({ message: "ไม่พบรอบนำเข้า" });
  res.json(statusOf(s));
});

// DELETE /api/v2/import/:importId — ยกเลิก
router.delete("/:importId", (req, res) => {
  const ok = deleteSession(req.params.importId, actorFromReq(req));
  res.status(ok ? 200 : 404).json({ ok });
});

export default router;
