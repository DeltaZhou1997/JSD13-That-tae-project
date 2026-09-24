// ตัวช่วยบันทึก "ใครสร้าง/แก้ไข" (createdBy / updatedBy) และประวัติ (AuditLog)
import { AuditLog } from "../models/AuditLog.model.js";

// ฟิลด์ที่ไม่บันทึกใน changes (ซ้ำซ้อน/ระบบจัดการเอง/ความลับ)
const IGNORED_FIELDS = new Set([
  "_id",
  "__v",
  "id",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "password",
  "nutritionPer100G", // ซ้ำกับ nutrientsPer100g
  "stockQuantity", // ซ้ำกับ currentStockGrams
  "stock", // ซ้ำกับ quantity
]);
const MAX_VALUE_LENGTH = 300;

/** ผู้กระทำจาก JWT (req.user) — ไม่รับจาก body */
export function actorFromReq(req) {
  const u = req?.user;
  if (!u?.id) return null;
  return {
    id: String(u.id),
    name: u.firstName || "",
    email: u.email || "",
    role: u.role || "",
  };
}

export const SYSTEM_ACTOR = (name) => ({ id: "system", name, email: "", role: "system" });

/** ลบฟิลด์ audit ที่ client ส่งมา (กันปลอมว่าใครแก้) */
export function stripAuditFields(body = {}) {
  const clean = { ...body };
  delete clean.createdBy;
  delete clean.updatedBy;
  delete clean.createdAt;
  delete clean.updatedAt;
  return clean;
}

function compact(value) {
  if (value === undefined) return null;
  const plain = value && typeof value.toObject === "function" ? value.toObject() : value;
  const json = JSON.stringify(plain);
  if (json === undefined) return null;
  return json.length > MAX_VALUE_LENGTH ? `${json.slice(0, MAX_VALUE_LENGTH)}…` : JSON.parse(json);
}

/**
 * เทียบค่าก่อน/หลัง เฉพาะฟิลด์ที่ถูกส่งมาแก้ (fields) — คืน [{ field, from, to }]
 */
export function diffFields(before = {}, after = {}, fields = []) {
  const b = before && typeof before.toObject === "function" ? before.toObject() : before || {};
  const a = after && typeof after.toObject === "function" ? after.toObject() : after || {};
  const changes = [];
  for (const field of new Set(fields)) {
    if (IGNORED_FIELDS.has(field)) continue;
    const from = JSON.stringify(b[field] ?? null);
    const to = JSON.stringify(a[field] ?? null);
    if (from !== to) changes.push({ field, from: compact(b[field]), to: compact(a[field]) });
  }
  return changes;
}

/**
 * บันทึกประวัติ — ไม่ throw (ถ้าเขียน log ไม่ได้ งานหลักต้องไม่ล้ม)
 * @param {{ action, entity, doc, actor, changes? }} input
 */
export async function logAudit({ action, entity, doc, actor, changes = [] }) {
  try {
    if (!doc || !actor) return;
    await AuditLog.create({
      action,
      entity,
      entityId: String(doc._id || doc.id),
      entityName: doc.nameTh || doc.name || [doc.firstName, doc.lastName].filter(Boolean).join(" ") || doc.email || "",
      actor,
      changes,
    });
  } catch (err) {
    console.error("⚠️ บันทึก audit log ไม่สำเร็จ:", err.message);
  }
}
