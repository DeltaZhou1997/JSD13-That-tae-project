import { Router } from "express";
import mongoose from "mongoose";
import { Cart } from "../../models/Cart.model.js";
import { Product } from "../../models/Product.model.js";
import { verifyToken } from "./users.routes.js";

const router = Router();

// Helper คำนวณยอดรวมและจำนวนชิ้น
function calculateCartTotals(items) {
  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  return { totalItems, subtotal };
}

// =========================================================================
// 1. GET /api/v2/cart/:userId — ดึงตะกร้าสินค้าของผู้ใช้
// =========================================================================
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const { totalItems, subtotal } = calculateCartTotals(cart.items);
    return res.status(200).json({ ...cart.toObject(), totalItems, subtotal });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 2. POST /api/v2/cart/items — เพิ่มสินค้าลงตะกร้า (พร้อมเช็กสต็อกสินค้า & วัตถุดิบ)
// =========================================================================
router.post("/items", async (req, res, next) => {
  try {
    const { userId = "USR-001", productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "กรุณาระบุรหัสสินค้า (productId)" });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // ตรวจสอบสินค้าในฐานข้อมูล
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    // ตรวจสอบความพร้อมของวัตถุดิบในสูตรอาหาร
    if (product) {
      const stockCheck = await product.checkStockAvailability(qty);
      if (!stockCheck.isAvailable) {
        return res.status(400).json({
          message: `ไม่สามารถเพิ่ม "${product.nameTh || product.name}" ลงตะกร้าได้เนื่องจากวัตถุดิบไม่พอ`,
          details: stockCheck.details,
        });
      }
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => String(item.productId || item.product || item._id) === String(productId)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({
        product: product?._id || (mongoose.Types.ObjectId.isValid(productId) ? productId : undefined),
        productId: String(productId),
        name: product?.nameTh || product?.name || req.body.name || "Cooking Kit",
        price: Number(product?.price ?? req.body.price ?? 0),
        quantity: qty,
        imageUrl: product?.imageUrl || req.body.imageUrl || "",
      });
    }

    await cart.save();
    const { totalItems, subtotal } = calculateCartTotals(cart.items);

    return res.status(200).json({
      message: "เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว",
      cart: { ...cart.toObject(), totalItems, subtotal },
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 3. PUT /api/v2/cart/items/:itemId — ปรับจำนวนสินค้าในตะกร้า
// =========================================================================
router.put("/items/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId = "USR-001", quantity, delta } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    const item = cart.items.find(
      (i) => String(i.productId || i._id) === String(itemId)
    );

    if (!item) {
      return res.status(404).json({ message: "ไม่พบสินค้าชิ้นนี้ในตะกร้า" });
    }

    if (typeof quantity === "number") {
      item.quantity = Math.max(1, quantity);
    } else if (typeof delta === "number") {
      item.quantity = Math.max(1, item.quantity + delta);
    }

    await cart.save();
    const { totalItems, subtotal } = calculateCartTotals(cart.items);

    return res.status(200).json({
      message: "อัปเดตจำนวนสินค้าสำเร็จ",
      cart: { ...cart.toObject(), totalItems, subtotal },
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 4. DELETE /api/v2/cart/items/:itemId — ลบสินค้าชิ้นหนึ่งออกจากตะกร้า
// =========================================================================
router.delete("/items/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.body.userId || req.query.userId || "USR-001";

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    const prevLength = cart.items.length;
    cart.items = cart.items.filter(
      (i) => String(i.productId || i._id) !== String(itemId)
    );

    if (cart.items.length === prevLength) {
      return res.status(404).json({ message: "ไม่พบสินค้านี้ในตะกร้าเพื่อทำการลบ" });
    }

    await cart.save();
    const { totalItems, subtotal } = calculateCartTotals(cart.items);

    return res.status(200).json({
      message: "ลบสินค้าออกจากตะกร้าเรียบร้อยแล้ว",
      cart: { ...cart.toObject(), totalItems, subtotal },
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 5. DELETE /api/v2/cart/:userId/clear — ล้างตะกร้าทั้งหมด
// =========================================================================
router.delete("/:userId/clear", async (req, res, next) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    return res.status(200).json({
      message: "ล้างตะกร้าสินค้าเรียบร้อยแล้ว",
      cart: { userId, items: [], totalItems: 0, subtotal: 0 },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
