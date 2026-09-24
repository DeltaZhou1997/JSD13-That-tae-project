import mongoose from "mongoose";

// เอกสาร (chunk) ที่ฝังเวกเตอร์แล้ว สำหรับ That-Tae Advisor (RAG)
// visibility กำหนดว่า role ไหนค้นเจอได้: public = ทุกคน, admin = แอดมินเท่านั้น
// ข้อมูลส่วนตัว (ตะกร้า/คำสั่งซื้อ/โปรไฟล์) ไม่ถูกเก็บที่นี่ — ดึงสดจาก DB ตาม userId ใน token เท่านั้น
const advisorChunkSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // เช่น product:<id>, ingredient:<id>, element:ดิน
    sourceType: {
      type: String,
      enum: ["product", "ingredient", "element", "site"],
      required: true,
      index: true,
    },
    sourceId: { type: String, default: "" },
    visibility: { type: String, enum: ["public", "admin"], default: "public", index: true },
    title: { type: String, default: "" },
    text: { type: String, required: true },
    contentHash: { type: String, required: true },
    embeddingModel: { type: String, default: "" },
    embedding: { type: [Number], default: [] },
  },
  { timestamps: true },
);

export const AdvisorChunk =
  mongoose.models.AdvisorChunk || mongoose.model("AdvisorChunk", advisorChunkSchema);
export default AdvisorChunk;
