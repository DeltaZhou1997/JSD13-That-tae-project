import mongoose from "mongoose";

let gfsBucket = null;

/**
 * ดึง GridFSBucket instance สำหรับ stream ไฟล์รูปภาพ
 * Bucket name: "images"
 */
export function getGridFSBucket() {
  if (gfsBucket) return gfsBucket;
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB ยังไม่ได้เชื่อมต่อ กรุณารอเชื่อมต่อฐานข้อมูลก่อน");
  }
  gfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "images",
  });
  return gfsBucket;
}
