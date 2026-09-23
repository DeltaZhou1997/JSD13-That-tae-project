import { Router } from "express";
import mongoose from "mongoose";
import { Cart } from "../../models/Cart.model.js";
import { Product } from "../../models/Product.model.js";
import { verifyToken } from "./users.routes.js";

const router = Router();

// ตะกร้าผูกกับผู้ใช้ที่ล็อกอิน (userId มาจาก token เท่านั้น ไม่รับจาก body)
router.use(verifyToken);

const MAX_QTY_PER_ITEM = 99;

function firstImage(imageUrl) {
  return (Array.isArray(imageUrl) ? imageUrl[0] : imageUrl) || "";
}

// รวมรายการที่ซ้ำ + จำกัดจำนวน
function normalizeLines(rawItems = []) {
  const map = new Map();
  for (const raw of Array.isArray(rawItems) ? rawItems : []) {
    const id = String(raw?.productId || raw?.id || raw?._id || "");
    const qty = Math.floor(Number(raw?.quantity) || 0);
    if (!mongoose.Types.ObjectId.isValid(id) || qty <= 0) continue;
    map.set(id, Math.min(MAX_QTY_PER_ITEM, (map.get(id) || 0) + qty));
  }
  return map;
}

// สร้างรายการตะกร้าจากข้อมูลสินค้าใน DB (ราคา/ชื่อ/รูปจาก DB เสมอ ไม่เชื่อ client)
async function buildCartItems(lineMap) {
  if (lineMap.size === 0) return [];
  const products = await Product.find({ _id: { $in: [...lineMap.keys()] }, isActive: { $ne: false } })
    .select("name nameTh price imageUrl")
    .lean();
  return products.map((p) => ({
    product: p._id,
    productId: String(p._id),
    name: p.nameTh || p.name || "Cooking Kit",
    price: Number(p.price) || 0,
    quantity: lineMap.get(String(p._id)),
    imageUrl: firstImage(p.imageUrl),
  }));
}

function toResponse(cart) {
  const items = (cart?.items || []).map((i) => ({
    productId: i.productId || String(i.product || ""),
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    imageUrl: i.imageUrl,
  }));
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { items, totalItems, subtotal };
}

async function saveCart(userId, items) {
  return Cart.findOneAndUpdate(
    { userId },
    { $set: { items } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

// =========================================================================
// GET /api/v2/cart — ดึงตะกร้าของผู้ใช้ (อัปเดตราคา/ชื่อจาก DB ล่าสุด)
// =========================================================================
router.get("/", async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const cart = await Cart.findOne({ userId }).lean();
    const lines = normalizeLines(cart?.items || []);
    const items = await buildCartItems(lines);
    const saved = await saveCart(userId, items);
    return res.status(200).json(toResponse(saved));
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// PUT /api/v2/cart — แทนที่ตะกร้าทั้งใบ { items: [{ productId, quantity }] }
// =========================================================================
router.put("/", async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const items = await buildCartItems(normalizeLines(req.body?.items));
    const saved = await saveCart(userId, items);
    return res.status(200).json(toResponse(saved));
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// POST /api/v2/cart/merge — รวมตะกร้า guest (จากคุกกี้) เข้าตะกร้าของบัญชี ตอนล็อกอิน/สมัคร
// =========================================================================
router.post("/merge", async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const existing = await Cart.findOne({ userId }).lean();
    const lines = normalizeLines([...(existing?.items || []), ...(req.body?.items || [])]);
    const items = await buildCartItems(lines);
    const saved = await saveCart(userId, items);
    return res.status(200).json(toResponse(saved));
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// DELETE /api/v2/cart — ล้างตะกร้า
// =========================================================================
router.delete("/", async (req, res, next) => {
  try {
    const saved = await saveCart(String(req.user.id), []);
    return res.status(200).json(toResponse(saved));
  } catch (err) {
    next(err);
  }
});

export default router;
