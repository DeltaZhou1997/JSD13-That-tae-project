import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

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

    // หมายเหตุ: ตัดสต็อกร่วมกับ Product Model ของเพื่อน
    const Product = mongoose.model("Product");
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`ไม่พบสินค้าไอดี: ${item.productId}`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`สินค้า "${product.name}" มีจำนวนไม่พอในคลัง`);
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    const generatedOrderId =
      "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = new Order({
      orderId: generatedOrderId,
      user: userId,
      items,
      planType,
      shippingAddress,
      paymentMethod,
      itemsSubtotal,
      grandTotal,
      earnedPoints,
      status: "PAID",
    });

    await newOrder.save({ session });

    // ล้าง Cart ของ User เมื่อสั่งซื้อสำเร็จ
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
