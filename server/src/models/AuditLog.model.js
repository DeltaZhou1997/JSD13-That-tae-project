import mongoose from "mongoose";
import { actorSchema } from "./auditPlugin.js";

// ประวัติการสร้าง / แก้ไข / ลบ ข้อมูลหลังบ้าน (ใครทำอะไร กับข้อมูลไหน เมื่อไร)
const changeSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    from: { type: mongoose.Schema.Types.Mixed, default: null },
    to: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false },
);

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, enum: ["create", "update", "delete", "stock"], required: true },
    entity: { type: String, enum: ["user", "ingredient", "product"], required: true },
    entityId: { type: String, required: true },
    entityName: { type: String, default: "" },
    actor: { type: actorSchema, required: true },
    changes: { type: [changeSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ "actor.id": 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
