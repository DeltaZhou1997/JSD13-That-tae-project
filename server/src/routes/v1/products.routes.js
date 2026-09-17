import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../src/data/products.js";
import { validateProduct } from "../../validation/validateProduct.js";

const router = Router();

// GET /api/products — รายการสินค้าทั้งหมด
router.get("/", (req, res) => {
  res.json(getAllProducts());
});

// GET /api/products/:id — สินค้าชิ้นเดียว
router.get("/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: `ไม่พบสินค้า id "${req.params.id}"` });
  }
  res.json(product);
});

// POST /api/products — สร้างสินค้าใหม่ (ตรวจ validation ก่อนบันทึกเสมอ)
router.post("/", (req, res) => {
  const { isValid, errors } = validateProduct(req.body);
  if (!isValid) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง", errors });
  }
  const created = createProduct(req.body);
  res.status(201).json(created);
});

// PUT /api/products/:id — แก้ไขสินค้า (ต้อง validate ครบทุก field เหมือน POST)
router.put("/:id", (req, res) => {
  const existing = getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: `ไม่พบสินค้า id "${req.params.id}"` });
  }
  const { isValid, errors } = validateProduct(req.body);
  if (!isValid) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง", errors });
  }
  const updated = updateProduct(req.params.id, req.body);
  res.json(updated);
});

// DELETE /api/products/:id — ลบสินค้า
router.delete("/:id", (req, res) => {
  const deleted = deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: `ไม่พบสินค้า id "${req.params.id}"` });
  }
  res.status(200).json({ message: "ลบสินค้าสำเร็จ", product: deleted });
});

export default router;
