import { Router } from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import { Order } from "../../models/Order.model.js";
import { Product } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import { Cart } from "../../models/Cart.model.js";
import { User } from "../../models/User.model.js";
import { verifyToken, requireAdmin } from "./users.routes.js";

const router = Router();

// Stripe Client Setup (ถ้ามี STRIPE_SECRET_KEY ให้ใช้ SDK จริง)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey && stripeSecretKey.startsWith("sk_") ? new Stripe(stripeSecretKey) : null;

// Helper สำหรับตัดสต็อกสินค้าและวัตถุดิบจริงใน MongoDB
async function deductStockForOrder(items) {
  for (const item of items) {
    const productId = item.productId || item.product;
    const qty = Number(item.quantity) || 1;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    if (product) {
      // 1. ตัดสต็อกชุดสินค้า
      if (product.quantity !== undefined) {
        product.quantity = Math.max(0, product.quantity - qty);
      }
      if (product.stock !== undefined) {
        product.stock = Math.max(0, product.stock - qty);
      }
      await product.save();

      // 2. ตัดสต็อกวัตถุดิบ (Ingredient Inventory) ตามสูตร Recipe
      if (Array.isArray(product.recipe)) {
        for (const recipeItem of product.recipe) {
          const ingId = recipeItem.ingredient || recipeItem.ingredientId;
          const usedAmount = (Number(recipeItem.quantity) || 1) * qty;

          if (ingId && mongoose.Types.ObjectId.isValid(ingId)) {
            await Ingredient.findByIdAndUpdate(ingId, {
              $inc: { stockQuantity: -usedAmount },
            });
          } else if (recipeItem.nameTh) {
            await Ingredient.findOneAndUpdate(
              { nameTh: recipeItem.nameTh },
              { $inc: { stockQuantity: -usedAmount } }
            );
          }
        }
      }
    }
  }
}

// =========================================================================
// 1. POST /api/v2/checkout/order หรือ /api/v1/checkout — สร้างคำสั่งซื้อ
// =========================================================================
const handleCreateOrder = async (req, res, next) => {
  try {
    const {
      orderId,
      userId = "USR-001",
      planType = "SINGLE_KIT",
      planDetails = null,
      items = [],
      shippingAddress,
      paymentMethod = "PROMPTPAY",
      itemsSubtotal,
      shippingFee = 60,
      grandTotal,
      earnedPoints = 0,
      stripePaymentIntentId,
      stripeSessionId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "ไม่มีสินค้าในรายการสั่งซื้อ" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "กรุณาระบุที่อยู่สำหรับจัดส่ง" });
    }

    // 1. ตรวจสอบสต็อกวัตถุดิบก่อนดำเนินการ
    for (const item of items) {
      const productId = item.productId || item.product;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        const product = await Product.findById(productId);
        if (product) {
          const stockCheck = await product.checkStockAvailability(item.quantity);
          if (!stockCheck.isAvailable) {
            return res.status(400).json({
              message: `ไม่สามารถสั่งซื้อได้: สต็อกวัตถุดิบไม่พอสำหรับ "${product.nameTh || product.name}"`,
              details: stockCheck.details,
            });
          }
        }
      }
    }

    // 2. สร้าง Order ใหม่ลง DB
    const finalOrderId = orderId || `ORD-${Date.now()}`;
    const newOrder = new Order({
      orderId: finalOrderId,
      userId,
      planType,
      planDetails,
      items: items.map((i) => ({
        productId: String(i.productId || i.product || i._id),
        productName: i.productName || i.name || i.nameTh || "Cooking Kit",
        price: Number(i.price || 0),
        quantity: Number(i.quantity || 1),
        imageUrl: i.imageUrl || "",
      })),
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      orderStatus: "PROCESSING",
      itemsSubtotal: Number(itemsSubtotal || 0),
      shippingFee: Number(shippingFee || 0),
      grandTotal: Number(grandTotal || 0),
      earnedPoints: Number(earnedPoints || 0),
      stripePaymentIntentId: stripePaymentIntentId || null,
      stripeSessionId: stripeSessionId || null,
    });

    const savedOrder = await newOrder.save();

    // 3. ตัดสต็อกสินค้าและวัตถุดิบ
    await deductStockForOrder(items);

    // 4. เพิ่มคะแนนสะสมให้ผู้ใช้ (ถ้ามี)
    if (earnedPoints > 0 && mongoose.Types.ObjectId.isValid(userId)) {
      await User.findByIdAndUpdate(userId, { $inc: { points: earnedPoints } });
    }

    // 5. เคลียร์ตะกร้าสินค้าของผู้ใช้
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    return res.status(201).json({
      message: "สร้างคำสั่งซื้อและตัดสต็อกสินค้าเรียบร้อยแล้ว",
      order: savedOrder,
    });
  } catch (err) {
    next(err);
  }
};

router.post("/", handleCreateOrder);
router.post("/order", handleCreateOrder);

// =========================================================================
// 2. POST /create-session — สร้าง Stripe Hosted Checkout Session
// =========================================================================
const handleCreateStripeSession = async (req, res, next) => {
  try {
    const { items = [], orderId, grandTotal, clientUrl: customClientUrl } = req.body;
    const clientUrl = customClientUrl || process.env.CLIENT_URL || "http://localhost:5173";
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    if (stripe) {
      const line_items = items.map((item) => ({
        price_data: {
          currency: "thb",
          product_data: {
            name: item.productName || item.name || "ชุดอาหาร That Tae Cooking Kit",
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(Number(item.price || 0) * 100),
        },
        quantity: Number(item.quantity) || 1,
      }));

      if (line_items.length === 0 && grandTotal) {
        line_items.push({
          price_data: {
            currency: "thb",
            product_data: { name: "คำสั่งซื้อชุดอาหาร Cooking Kit" },
            unit_amount: Math.round(Number(grandTotal) * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/checkout`,
        metadata: {
          orderId: finalOrderId,
        },
      });

      return res.status(200).json({
        success: true,
        url: session.url,
        orderId: finalOrderId,
        sessionId: session.id,
      });
    }

    // Mock response ถ้าไม่ได้ตั้งค่า STRIPE_SECRET_KEY
    return res.status(200).json({
      success: true,
      url: `${clientUrl}/order-success?mock_stripe=true&order_id=${finalOrderId}`,
      orderId: finalOrderId,
      message: "Stripe Demo Session Created (Mock)",
    });
  } catch (err) {
    next(err);
  }
};

router.post("/create-session", handleCreateStripeSession);
router.post("/checkout/create-session", handleCreateStripeSession);

// =========================================================================
// 3. GET /orders/user/:userId หรือ /user/:userId — ประวัติคำสั่งซื้อของลูกค้า
// =========================================================================
const handleGetUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

router.get("/user/:userId", handleGetUserOrders);
router.get("/orders/user/:userId", handleGetUserOrders);

// =========================================================================
// 4. GET /orders หรือ GET / — แอดมินดูรายการคำสั่งซื้อทั้งหมด
// =========================================================================
const handleGetAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

router.get("/", handleGetAllOrders);
router.get("/orders", handleGetAllOrders);
router.get("/all", handleGetAllOrders);

// =========================================================================
// 5. GET /:id หรือ /orders/:id — ดูรายละเอียดคำสั่งซื้อเดี่ยว
// =========================================================================
const handleGetSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (["orders", "order", "user", "create-session", "all"].includes(id)) {
      return next();
    }
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { orderId: id }] }
      : { orderId: id };

    const order = await Order.findOne(query).lean();
    if (!order) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคำสั่งซื้อนี้" });
    }
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

router.get("/:id", handleGetSingleOrder);
router.get("/orders/:id", handleGetSingleOrder);

// =========================================================================
// 6. PATCH /:id/status หรือ /orders/:id/status — อัปเดตสถานะคำสั่งซื้อ
// =========================================================================
const handleUpdateStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, status } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (status) updateData.orderStatus = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อเพื่อทำการอัปเดต" });
    }

    return res.status(200).json({
      message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ",
      order,
    });
  } catch (err) {
    next(err);
  }
};

router.patch("/:id/status", handleUpdateStatus);
router.patch("/orders/:id/status", handleUpdateStatus);

export default router;
