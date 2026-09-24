import mongoose from "mongoose";

// ผู้กระทำ (มาจาก JWT ที่ server ตรวจแล้วเท่านั้น — ดู utils/audit.js)
export const actorSchema = new mongoose.Schema(
  {
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: String, default: "" }, // admin / customer / system
  },
  { _id: false },
);

/**
 * Mongoose plugin: เพิ่ม createdBy / updatedBy ให้ schema
 * ใช้คู่กับ timestamps (createdAt / updatedAt) เพื่อดูว่า "ใคร" สร้าง/แก้ไขล่าสุด "เมื่อไร"
 * ประวัติการแก้ไขทุกครั้งเก็บแยกใน collection auditlogs
 */
export function auditPlugin(schema) {
  schema.add({
    createdBy: { type: actorSchema, default: null },
    updatedBy: { type: actorSchema, default: null },
  });
}

export default auditPlugin;
