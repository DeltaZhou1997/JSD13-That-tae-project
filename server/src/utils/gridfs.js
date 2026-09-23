import mongoose from "mongoose";

let gfsBucket = null;
let bucketDb = null;

/**
 * ดึง GridFSBucket instance สำหรับ stream ไฟล์รูปภาพ
 * Bucket name: "images"
 * สร้างใหม่ถ้า connection.db เปลี่ยน (เช่น reconnect) เพื่อไม่ให้ใช้ bucket ที่ผูกกับ db เก่า
 */
export function getGridFSBucket() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB ยังไม่ได้เชื่อมต่อ กรุณารอเชื่อมต่อฐานข้อมูลก่อน");
  }
  if (gfsBucket && bucketDb === db) return gfsBucket;
  gfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "images",
  });
  bucketDb = db;
  return gfsBucket;
}

/**
 * ดึง GridFS file id จาก URL รูป เช่น "/api/v2/images/<id>" หรือ "http://host/api/v2/images/<id>"
 * คืนค่า null ถ้าไม่ใช่รูปใน GridFS
 */
export function extractGridFSId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/\/api\/v\d\/images\/([a-f0-9]{24})(?:[/?#]|$)/i);
  return match ? match[1] : null;
}
