import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../data/products.js";
import { validateProduct } from "../../../validation/validateProduct.js";

const router = Router();

// GET /api/v1/products — รายการสินค้าทั้งหมด พร้อมรองรับ Query Search & Filters
router.get("/", (req, res) => {
  let products = getAllProducts();
  const { search, region, tag, health, element, sort, limit, page } = req.query;

  // 1. Filter: ค้นหาด้วยชื่อเมนู หรือรายละเอียด
  if (search) {
    const q = String(search).trim().toLowerCase();
    products = products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.history && p.history.toLowerCase().includes(q))
    );
  }

  // 2. Filter: กรองตามภูมิภาค (รองรับทั้งภาษาอังกฤษ เช่น northern หรือภาษาไทย เช่น ภาคเหนือ)
  if (region) {
    const reg = String(region).trim().toLowerCase();
    products = products.filter(
      (p) =>
        (p.region && p.region.toLowerCase() === reg) ||
        (p.regionNameTh && p.regionNameTh.includes(region))
    );
  }

  // 3. Filter: กรองตามแท็กสุขภาพ / ธาตุเจ้าเรือน
  const targetTag = tag || health || element;
  if (targetTag) {
    const t = String(targetTag).trim().toLowerCase();
    products = products.filter((p) => {
      if (!Array.isArray(p.tags)) return false;
      return p.tags.some((item) => String(item).toLowerCase().includes(t));
    });
  }

  // 4. Sort: จัดเรียงราคาหรือชื่อ
  if (sort === "price_asc") {
    products.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (sort === "price_desc") {
    products.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (sort === "name_asc") {
    products.sort((a, b) => (a.name || "").localeCompare(b.name || "", "th"));
  }

  // 5. Pagination: ถ้ามีการระบุ limit / page
  if (limit) {
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const total = products.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: paginatedProducts,
    });
  }

  res.status(200).json(products);
});

// GET /api/v1/products/:id — สินค้าชิ้นเดียว
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = getProductById(id);
  if (!product) {
    return res.status(404).json({ message: `ไม่พบสินค้า id "${id}"` });
  }
  res.status(200).json(product);
});

// POST /api/v1/products — สร้างสินค้าใหม่ (ตรวจ validation ก่อนบันทึกเสมอ)
router.post("/", (req, res) => {
  const { isValid, errors } = validateProduct(req.body);
  if (!isValid) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง", errors });
  }
  const created = createProduct(req.body);
  res.status(201).json({
    message: "สร้างสินค้าใหม่สำเร็จ",
    product: created,
  });
});

// PUT /api/v1/products/:id — แก้ไขสินค้า (ต้อง validate ครบทุก field เหมือน POST)
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
  res.status(200).json({
    message: "แก้ไขสินค้าสำเร็จ",
    product: updated,
  });
});

// DELETE /api/v1/products/:id — ลบสินค้า
router.delete("/:id", (req, res) => {
  const deleted = deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: `ไม่พบสินค้า id "${req.params.id}"` });
  }
  res.status(200).json({ message: "ลบสินค้าสำเร็จ", product: deleted });
});

export default router;
