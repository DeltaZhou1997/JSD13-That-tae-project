import { Router } from "express";
import mongoose from "mongoose";
import { verifyToken, requireAdmin } from "./users.routes.js";
import { AuditLog } from "../../models/AuditLog.model.js";

const router = Router();

// =========================================================================
// GET /api/v2/audit-logs — ประวัติการสร้าง/แก้ไข/ลบ ข้อมูลหลังบ้าน (Admin)
// query: entity (user|ingredient|product), entityId, actorId, action, from, to (YYYY-MM-DD), page, limit
// =========================================================================
router.get("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { entity, entityId, actorId, action, from, to } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const filter = {};
    if (["user", "ingredient", "product"].includes(entity)) filter.entity = entity;
    if (["create", "update", "delete", "stock"].includes(action)) filter.action = action;
    if (entityId) filter.entityId = String(entityId);
    if (actorId) filter["actor.id"] = String(actorId);
    if (from || to) {
      filter.createdAt = {};
      if (from && !Number.isNaN(Date.parse(from))) filter.createdAt.$gte = new Date(from);
      if (to && !Number.isNaN(Date.parse(to))) filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
    }

    const [data, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/audit-logs/:entity/:id — ประวัติของข้อมูลชิ้นเดียว (เช่น เมนูหนึ่งรายการ)
router.get("/:entity/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { entity, id } = req.params;
    if (!["user", "ingredient", "product"].includes(entity) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "entity หรือ id ไม่ถูกต้อง" });
    }
    const data = await AuditLog.find({ entity, entityId: id }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
