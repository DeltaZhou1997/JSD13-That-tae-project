import { Router } from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import { Order } from "../../models/Order.model.js";
import { Product } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import { Cart } from "../../models/Cart.model.js";
import { User } from "../../models/User.model.js";
import { verifyToken, requireAdmin } from "./users.routes.js";
import { priceOrder } from "../../utils/orderPricing.js";
import { recipeQtyInStockUnit } from "../../utils/units.js";

const router = Router();

// Stripe Client Setup (ถ้ามี STRIPE_SECRET_KEY ให้ใช้ SDK จริง)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey && stripeSecretKey.startsWith("sk_") ? new Stripe(stripeSecretKey) : null;

const isAdmin = (req) => req.user?.role === "admin";
const canAccessOrder = (req, order) => isAdmin(req) || String(order.userId) === String(req.user?.id);

function orderQuery(id) {
  return mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { orderId: id }] }
    : { orderId: id };
}

// Helper ตัดสต็อก (direction = 1) หรือคืนสต็อก (direction = -1) สินค้าและวัตถุดิบใน MongoDB
async function adjustStockForOrder(items, direction = 1) {
  for (const item of items) {
    const productId = item.productId || item.product;
    const qty = (Number(item.quantity) || 1) * direction;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    if (product) {
      // 1. ตัด/คืนสต็อกชุดสินค้า
      if (product.quantity !== undefined) {
        product.quantity = Math.max(0, product.quantity - qty);
      }
      if (product.stock !== undefined) {
        product.stock = Math.max(0, product.stock - qty);
      }
      await product.save();

      // 2. ตัด/คืนสต็อกวัตถุดิบ (Ingredient Inventory) ตามสูตร Recipe และเฉพาะภูมิภาคของเมนู
      if (Array.isArray(product.recipe)) {
        const regionMap = {
          northern: "north",
          northeastern: "northeast",
          central: "central",
          southern: "south",
          fusion: "central", // ไทยฟิวชั่น ภาคกลางเป็นคนซัพพอร์ตเสมอ
        };
        const targetRegion = regionMap[product.region] || "central";

        for (const recipeItem of product.recipe) {
          const ingId = recipeItem.ingredient || recipeItem.ingredientId;
          let ing = null;
          if (ingId && mongoose.Types.ObjectId.isValid(ingId)) {
            ing = await Ingredient.findById(ingId).select("unit gramsPerPiece").lean();
          } else if (recipeItem.nameTh) {
            ing = await Ingredient.findOne({ nameTh: recipeItem.nameTh }).select("unit gramsPerPiece").lean();
          }
          if (!ing) continue;

          // ปริมาณในสูตรอาจเป็นคนละหน่วยกับสต็อก (เช่น สูตรใช้ ml แต่สต็อกเก็บเป็น g) → แปลงก่อนตัด
          const usedAmount = recipeQtyInStockUnit(recipeItem, ing) * qty;

          await Ingredient.updateOne(
            { _id: ing._id },
            {
              $inc: {
                stockQuantity: -usedAmount,
                currentStockGrams: -usedAmount,
                [`regionalStocks.${targetRegion}`]: -usedAmount,
              },
            },
          );
        }
      }
    }
  }
}

async function checkStockForItems(items) {
  for (const item of items) {
    const product = mongoose.Types.ObjectId.isValid(item.productId)
      ? await Product.findById(item.productId)
      : null;
    if (!product) continue;
    const stockCheck = await product.checkStockAvailability(item.quantity || 1);
    if (!stockCheck.isAvailable) {
      return {
        message: `ไม่สามารถสั่งซื้อได้: สต็อกวัตถุดิบไม่พอสำหรับ "${product.nameTh || product.name}"`,
        details: stockCheck.details,
      };
    }
  }
  return null;
}

// ให้แต้มสะสมครั้งเดียวต่อคำสั่งซื้อ (atomic กันเรียกซ้ำ)
async function awardPointsOnce(order) {
  if (!order?.earnedPoints || !mongoose.Types.ObjectId.isValid(order.userId)) return;
  const claimed = await Order.findOneAndUpdate(
    { _id: order._id, pointsAwarded: false },
    { $set: { pointsAwarded: true } },
  );
  if (claimed) {
    await User.findByIdAndUpdate(order.userId, { $inc: { points: order.earnedPoints } });
    order.pointsAwarded = true;
  }
}

// ตรวจสอบ Payment Intent กับ Stripe จริง (ใช้กับบัตรเครดิตโหมด v1)
async function verifyPaymentIntent(paymentIntentId, grandTotal) {
  if (!stripe) return { ok: true }; // โหมด Mock
  if (!paymentIntentId || String(paymentIntentId).startsWith("mock_")) {
    return { ok: false, message: "ไม่พบข้อมูลการชำระเงินด้วยบัตร" };
  }
  const used = await Order.exists({ stripePaymentIntentId: paymentIntentId });
  if (used) return { ok: false, message: "รายการชำระเงินนี้ถูกใช้กับคำสั่งซื้ออื่นแล้ว" };

  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== "succeeded") {
    return { ok: false, message: `การชำระเงินยังไม่สำเร็จ (สถานะ: ${pi.status})` };
  }
  if ((pi.amount_received ?? pi.amount) < Math.round(grandTotal * 100)) {
    return { ok: false, message: "ยอดที่ชำระไม่ตรงกับยอดคำสั่งซื้อ" };
  }
  return { ok: true };
}

// =========================================================================
// 1. POST /api/v2/checkout — สร้างคำสั่งซื้อ (COD / PromptPay / บัตรเครดิต v1)
// ราคา ยอดรวม และแต้ม คำนวณใหม่ที่ Server จากราคาใน DB
// =========================================================================
const handleCreateOrder = async (req, res, next) => {
  try {
    const {
      orderId,
      planType,
      items = [],
      shippingAddress,
      paymentMethod = "PROMPTPAY",
      stripePaymentIntentId,
    } = req.body;
    const userId = String(req.user.id);

    if (!shippingAddress) {
      return res.status(400).json({ message: "กรุณาระบุที่อยู่สำหรับจัดส่ง" });
    }

    const pricing = await priceOrder(items, planType);
    if (pricing.error) return res.status(400).json({ message: pricing.error });

    // 1. ตรวจสอบสต็อกวัตถุดิบก่อนดำเนินการ
    const stockError = await checkStockForItems(pricing.items);
    if (stockError) return res.status(400).json(stockError);

    // 2. ตรวจสอบการชำระเงินด้วยบัตรกับ Stripe
    if (paymentMethod === "CREDIT_CARD") {
      const verify = await verifyPaymentIntent(stripePaymentIntentId, pricing.grandTotal);
      if (!verify.ok) return res.status(400).json({ message: verify.message });
    }

    // 3. สร้าง Order ใหม่ลง DB
    // หมายเหตุ: PromptPay โหมด v1 เป็น QR จำลอง ไม่มีการยืนยันจากธนาคาร จึงยังถือว่าชำระแล้ว
    const newOrder = new Order({
      orderId: orderId && !(await Order.exists({ orderId })) ? orderId : `ORD-${Date.now()}`,
      userId,
      planType: pricing.planType,
      planDetails: pricing.planDetails,
      items: pricing.items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      orderStatus: "PROCESSING",
      itemsSubtotal: pricing.itemsSubtotal,
      shippingFee: pricing.shippingFee,
      grandTotal: pricing.grandTotal,
      earnedPoints: pricing.earnedPoints,
      pointsAwarded: false,
      stripePaymentIntentId: stripePaymentIntentId || null,
    });

    const savedOrder = await newOrder.save();

    // 4. ตัดสต็อกสินค้าและวัตถุดิบ
    await adjustStockForOrder(pricing.items, 1);

    // 5. ให้แต้มสะสมเมื่อชำระเงินแล้ว (COD ได้แต้มตอนแอดมินปรับเป็นจัดส่งสำเร็จ/ชำระแล้ว)
    if (savedOrder.paymentStatus === "PAID") {
      await awardPointsOnce(savedOrder);
    }

    // 6. เคลียร์ตะกร้าสินค้าของผู้ใช้
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    return res.status(201).json({
      message: "สร้างคำสั่งซื้อและตัดสต็อกสินค้าเรียบร้อยแล้ว",
      order: savedOrder,
    });
  } catch (err) {
    next(err);
  }
};

router.post("/", verifyToken, handleCreateOrder);
router.post("/order", verifyToken, handleCreateOrder);

// =========================================================================
// 2. POST /create-session — สร้าง Stripe Hosted Checkout Session
// =========================================================================
const handleCreateStripeSession = async (req, res, next) => {
  try {
    const {
      items = [],
      orderId,
      planType,
      shippingAddress = {},
      clientUrl: customClientUrl,
    } = req.body;
    const userId = String(req.user.id);

    const clientUrl = customClientUrl || process.env.CLIENT_URL || "http://localhost:5173";
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    // 1. ตรวจสอบว่าคำสั่งซื้อนี้มีอยู่ในระบบแล้วหรือไม่ (เช่น กดชำระเงินอีกครั้งจากหน้าคำสั่งซื้อ)
    let existingOrder = await Order.findOne(orderQuery(finalOrderId));

    if (existingOrder) {
      if (!canAccessOrder(req, existingOrder)) {
        return res.status(403).json({ message: "คุณไม่มีสิทธิ์ชำระเงินคำสั่งซื้อนี้" });
      }
      if (existingOrder.paymentStatus === "PAID") {
        return res.status(400).json({ message: "คำสั่งซื้อนี้ชำระเงินเรียบร้อยแล้ว" });
      }
      if (existingOrder.orderStatus === "CANCELLED") {
        return res.status(400).json({ message: "คำสั่งซื้อนี้ถูกยกเลิกแล้ว" });
      }
    } else {
      const pricing = await priceOrder(items, planType);
      if (pricing.error) return res.status(400).json({ message: pricing.error });

      const stockError = await checkStockForItems(pricing.items);
      if (stockError) return res.status(400).json(stockError);

      // บันทึกคำสั่งซื้อลงฐานข้อมูลเป็นสถานะ PENDING ทันที
      existingOrder = new Order({
        orderId: finalOrderId,
        userId,
        planType: pricing.planType,
        planDetails: pricing.planDetails,
        items: pricing.items,
        shippingAddress,
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        status: "PENDING",
        itemsSubtotal: pricing.itemsSubtotal,
        shippingFee: pricing.shippingFee,
        grandTotal: pricing.grandTotal,
        earnedPoints: pricing.earnedPoints,
        pointsAwarded: false,
      });

      await existingOrder.save();
      // ตัดสต็อกสินค้าและวัตถุดิบ (คืนให้อัตโนมัติถ้าแอดมินยกเลิกคำสั่งซื้อ)
      await adjustStockForOrder(pricing.items, 1);
    }

    if (stripe) {
      // เก็บเงินตามยอดใน DB (รวมค่าส่งแล้ว) เป็นรายการเดียว ให้ยอดบน Stripe ตรงกับคำสั่งซื้อเสมอ
      const summary = existingOrder.items
        .map((i) => `${i.productName} x${i.quantity}`)
        .join(", ")
        .slice(0, 480);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "thb",
              product_data: {
                name: existingOrder.planDetails?.planName
                  ? `แพ็กเกจ ${existingOrder.planDetails.planName} (${existingOrder.orderId})`
                  : `คำสั่งซื้อ Cooking Kit (${existingOrder.orderId})`,
                description: `${summary} + ค่าจัดส่ง ${existingOrder.shippingFee} บาท`,
              },
              unit_amount: Math.round(Number(existingOrder.grandTotal) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${existingOrder.orderId}`,
        cancel_url: `${clientUrl}/orders?canceled=true&order_id=${existingOrder.orderId}`,
        metadata: {
          orderId: existingOrder.orderId,
          userId: String(existingOrder.userId),
        },
      });

      existingOrder.stripeSessionId = session.id;
      await existingOrder.save();

      return res.status(200).json({
        success: true,
        url: session.url,
        orderId: existingOrder.orderId,
        sessionId: session.id,
        order: existingOrder,
      });
    }

    // Mock response ถ้าไม่ได้ตั้งค่า STRIPE_SECRET_KEY
    return res.status(200).json({
      success: true,
      url: `${clientUrl}/order-success?mock_stripe=true&order_id=${existingOrder.orderId}`,
      orderId: existingOrder.orderId,
      order: existingOrder,
      message: "Stripe Demo Session Created (Mock)",
    });
  } catch (err) {
    next(err);
  }
};

router.post("/create-session", verifyToken, handleCreateStripeSession);
router.post("/checkout/create-session", verifyToken, handleCreateStripeSession);

// =========================================================================
// 2.1 POST /confirm-stripe — ยืนยันการชำระเงินเมื่อลูกค้ากลับมาจาก Stripe
// =========================================================================
const handleConfirmStripePayment = async (req, res, next) => {
  try {
    const { orderId, sessionId } = req.body;
    if (!orderId && !sessionId) {
      return res.status(400).json({ message: "กรุณาระบุ orderId หรือ sessionId" });
    }

    const order = await Order.findOne(orderId ? orderQuery(orderId) : { stripeSessionId: sessionId });
    if (!order) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคำสั่งซื้อในระบบ" });
    }
    if (!canAccessOrder(req, order)) {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์ยืนยันคำสั่งซื้อนี้" });
    }

    // ชำระแล้ว → ตอบกลับเฉย ๆ (เรียกซ้ำได้ แต่ไม่ให้แต้มซ้ำ)
    if (order.paymentStatus === "PAID") {
      return res.status(200).json({ success: true, message: "คำสั่งซื้อนี้ชำระเงินแล้ว", order });
    }

    // มี Stripe จริง → ต้องถาม Stripe ว่าจ่ายแล้วจริงหรือไม่ ห้ามเชื่อ query string
    if (stripe) {
      const stripeSessionId = order.stripeSessionId || sessionId;
      if (!stripeSessionId) {
        return res.status(400).json({ message: "ไม่พบ Stripe Session ของคำสั่งซื้อนี้" });
      }
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
      if (session.metadata?.orderId !== order.orderId || session.payment_status !== "paid") {
        return res.status(400).json({ success: false, message: "ยังไม่ได้รับการชำระเงินจาก Stripe" });
      }
      order.stripeSessionId = stripeSessionId;
      if (session.payment_intent) order.stripePaymentIntentId = String(session.payment_intent);
    }

    // อัปเดตสถานะเป็น PAID
    order.status = "PAID";
    order.orderStatus = "PAID";
    order.paymentStatus = "PAID";
    await order.save();

    // เพิ่มแต้มสะสม (ครั้งเดียว)
    await awardPointsOnce(order);

    // เคลียร์ตะกร้าสินค้าของผู้ใช้
    await Cart.findOneAndUpdate({ userId: order.userId }, { $set: { items: [] } });

    return res.status(200).json({
      success: true,
      message: "อัปเดตสถานะการชำระเงินในฐานข้อมูลเรียบร้อยแล้ว",
      order,
    });
  } catch (err) {
    next(err);
  }
};

router.post("/confirm-stripe", verifyToken, handleConfirmStripePayment);
router.post("/checkout/confirm-stripe", verifyToken, handleConfirmStripePayment);

// =========================================================================
// 3. GET /orders/user/:userId หรือ /user/:userId — ประวัติคำสั่งซื้อของลูกค้า (เจ้าของ/แอดมิน)
// =========================================================================
const handleGetUserOrders = async (req, res, next) => {
  try {
    if (!isAdmin(req) && String(req.params.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์ดูคำสั่งซื้อของผู้ใช้อื่น" });
    }
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

router.get("/user/:userId", verifyToken, handleGetUserOrders);
router.get("/orders/user/:userId", verifyToken, handleGetUserOrders);

// =========================================================================
// 4. GET /orders หรือ GET / — แอดมินดูรายการคำสั่งซื้อทั้งหมดจาก MongoDB
// =========================================================================
const handleGetAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const normalized = orders.map((o) => ({
      ...o,
      status: o.status || o.orderStatus || o.paymentStatus || "PENDING",
    }));
    return res.status(200).json(normalized);
  } catch (err) {
    next(err);
  }
};

router.get("/", verifyToken, requireAdmin, handleGetAllOrders);
router.get("/orders", verifyToken, requireAdmin, handleGetAllOrders);
router.get("/all", verifyToken, requireAdmin, handleGetAllOrders);

// =========================================================================
// 5. GET /:id หรือ /orders/:id — ดูรายละเอียดคำสั่งซื้อเดี่ยว (เจ้าของ/แอดมิน)
// =========================================================================
const handleGetSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (["orders", "order", "user", "create-session", "all"].includes(id)) {
      return next();
    }

    const order = await Order.findOne(orderQuery(id)).lean();
    if (!order) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคำสั่งซื้อนี้" });
    }
    if (!canAccessOrder(req, order)) {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์ดูคำสั่งซื้อนี้" });
    }
    return res.status(200).json({
      ...order,
      status: order.status || order.orderStatus || order.paymentStatus || "PENDING",
    });
  } catch (err) {
    next(err);
  }
};

router.get("/:id", verifyToken, handleGetSingleOrder);
router.get("/orders/:id", verifyToken, handleGetSingleOrder);

// =========================================================================
// 6. PATCH /:id/status หรือ /orders/:id/status — แอดมินอัปเดตสถานะคำสั่งซื้อ
// =========================================================================
const ORDER_STATUSES = ["PENDING", "PROCESSING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "PAID"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const handleUpdateStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, status } = req.body;
    const finalStatus = status || orderStatus;

    if (finalStatus && !ORDER_STATUSES.includes(finalStatus)) {
      return res.status(400).json({ message: `สถานะ "${finalStatus}" ไม่ถูกต้อง` });
    }
    if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({ message: `สถานะการชำระเงิน "${paymentStatus}" ไม่ถูกต้อง` });
    }

    const order = await Order.findOne(orderQuery(req.params.id));
    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อเพื่อทำการอัปเดต" });
    }

    if (finalStatus) {
      order.orderStatus = finalStatus;
      order.status = finalStatus;
      if (finalStatus === "PAID") {
        order.paymentStatus = "PAID";
      } else if (finalStatus === "CANCELLED" && order.paymentStatus !== "PAID") {
        order.paymentStatus = "FAILED";
      } else if (finalStatus === "DELIVERED" && order.paymentMethod === "COD") {
        // เก็บเงินปลายทางสำเร็จ
        order.paymentStatus = "PAID";
      }
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // ยกเลิกคำสั่งซื้อ → คืนสต็อกสินค้าและวัตถุดิบ (ครั้งเดียว)
    if (order.orderStatus === "CANCELLED" && !order.stockRestored) {
      await adjustStockForOrder(order.items, -1);
      order.stockRestored = true;
    } else if (order.orderStatus !== "CANCELLED" && order.stockRestored) {
      // เปิดคำสั่งซื้อที่ยกเลิกไปแล้วกลับมา → ตัดสต็อกอีกครั้ง
      await adjustStockForOrder(order.items, 1);
      order.stockRestored = false;
    }

    await order.save();

    if (order.paymentStatus === "PAID" && order.orderStatus !== "CANCELLED") {
      await awardPointsOnce(order);
    }

    return res.status(200).json({
      message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ",
      order,
    });
  } catch (err) {
    next(err);
  }
};

router.patch("/:id/status", verifyToken, requireAdmin, handleUpdateStatus);
router.patch("/orders/:id/status", verifyToken, requireAdmin, handleUpdateStatus);

export default router;
