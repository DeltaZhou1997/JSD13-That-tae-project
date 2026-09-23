import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";
import { getGridFSBucket } from "../../utils/gridfs.js";
import { User } from "../../models/User.model.js";
import { verifyToken } from "./users.routes.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * 1. POST /api/v2/images/upload
 * อัปโหลดรูปภาพเข้า GridFS โดยตรง
 * Response: { fileId, filename, url }
 */
router.post("/upload", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "กรุณาแนบไฟล์รูปภาพ (field: image)" });
    }

    const bucket = getGridFSBucket();
    const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        uploadedAt: new Date(),
      },
    });

    const readable = new Readable();
    readable.push(req.file.buffer);
    readable.push(null);

    readable
      .pipe(uploadStream)
      .on("error", (err) => {
        return res.status(500).json({ message: "อัปโหลดรูปล้มเหลว", error: err.message });
      })
      .on("finish", async () => {
        const fileId = uploadStream.id.toString();
        const url = `/api/v2/images/${fileId}`;
        // อัปโหลดจาก profile/register ให้บันทึก avatar ใน User ทันที
        if (req.user?.id && req.user.role !== "admin") {
          try {
            await User.findByIdAndUpdate(req.user.id, { avatar: url });
          } catch (err) {
            console.error("บันทึก avatar ไม่สำเร็จ:", err.message);
            return res.status(500).json({ message: "อัปโหลดสำเร็จแต่บันทึกรูปโปรไฟล์ไม่สำเร็จ" });
          }
        }
        return res.status(201).json({
          message: "อัปโหลดรูปภาพเข้า GridFS สำเร็จ",
          fileId,
          filename,
          url,
          avatarSaved: Boolean(req.user?.id && req.user.role !== "admin"),
        });
      });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปโหลด", error: error.message });
  }
});

/**
 * 2. GET /api/v2/images/:id
 * ดึงและ Stream รูปภาพจาก GridFS ออกมาแสดงผล
 */
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ObjectId" });
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(id);

    bucket
      .find({ _id: objectId })
      .toArray()
      .then((files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({ message: "ไม่พบรูปภาพนี้ใน GridFS" });
        }

        const file = files[0];
        res.setHeader("Content-Type", file.contentType || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // cache 1 year

        const downloadStream = bucket.openDownloadStream(objectId);
        downloadStream.on("error", (err) => {
          res.status(500).end();
        });
        downloadStream.pipe(res);
      })
      .catch((err) => {
        res.status(500).json({ message: "ดึงรูปภาพล้มเหลว", error: err.message });
      });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

/**
 * 3. DELETE /api/v2/images/:id
 * ลบรูปภาพออกจาก GridFS
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ObjectId" });
    }

    const bucket = getGridFSBucket();
    await bucket.delete(new mongoose.Types.ObjectId(id));
    res.status(200).json({ message: "ลบรูปภาพสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "ลบรูปภาพล้มเหลว", error: error.message });
  }
});

export default router;
