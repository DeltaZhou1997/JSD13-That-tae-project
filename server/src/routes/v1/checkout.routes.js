import express from "express";
import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";

const router = express.Router();

// GET /api/cart/:user_id - ดึงรายการสินค้าในตะกร้าของ User ID
router.get("/cart/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const cart = await Cart.findOne({ userId: user_id }).populate(
      "items.product",
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

// POST /api/checkout - สร้าง Order, ตัด Stock และล้าง Cart
router.post("/checkout", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId,
      items,
      planType,
      shippingAddress,
      paymentMethod,
      itemsSubtotal,
      grandTotal,
      earnedPoints,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("กรุณาระบุรายการสินค้าในคำสั่งซื้อ (items)");
    }

    // 1. ตัดสต็อกร่วมกับ Product Model
    const Product = mongoose.model("Product");
    for (const item of items) {
      // รองรับทั้งคนที่ส่งชื่อ productId หรือ product
      const targetProductId = item.productId || item.product;

      const product = await Product.findById(targetProductId).session(session);
      if (!product) {
        throw new Error(`ไม่พบสินค้าไอดี: ${targetProductId}`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(
          `สินค้า "${product.name}" มีจำนวนไม่พอในคลัง (เหลือ ${product.quantity} ชิ้น)`,
        );
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // 2. จัดรูปแบบ items ให้มีฟิลด์ `product` ตรงตาม Schema ของ Order.js
    const formattedItems = items.map((item) => ({
      product: item.product || item.productId, // ใส่ฟิลด์ product เสมอ
      productName: item.productName || "สินค้า",
      price: item.price || 0,
      quantity: item.quantity || 1,
    }));

    // 3. สร้าง Order ใหม่
    const generatedOrderId =
      "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = new Order({
      orderId: generatedOrderId,
      user: userId,
      items: formattedItems,
      planType: planType || "SINGLE_KIT",
      shippingAddress,
      paymentMethod,
      itemsSubtotal,
      grandTotal,
      earnedPoints: earnedPoints || 0,
      status: "PAID",
    });

    await newOrder.save({ session });

    // 4. ล้าง Cart ของ User เมื่อสั่งซื้อสำเร็จ (ถ้ามีตะกร้า)
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จและตัดสต็อกเรียบร้อยแล้ว",
      order: newOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
