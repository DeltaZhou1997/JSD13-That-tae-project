/*// server/src/routes/v2/checkout.routes.js ที่เชื่อมกับมองโกแล้ว ให้เอไอช่วย เช็คอีกทีโดยละเอียด
import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Cart from "../../models/Cart.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ============================================================================
// 1. POST /api/v2/checkout/create-session
// หน้าที่: บันทึก Order สถานะ PENDING และสร้าง Stripe Checkout Session ตามวิธีที่เลือก
// ============================================================================
router.post("/create-session", async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      userId = "USR-001",
      planType = "SINGLE_KIT",
      paymentMethod = "PROMPTPAY", // 👈 รับวิธีที่ผู้ใช้เลือก (PROMPTPAY หรือ CREDIT_CARD)
      shippingFee = 60,
      grandTotal,
      orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    } = req.body;

    // 1. ตรวจสอบข้อมูล
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ไม่มีสินค้าในคำสั่งซื้อ",
      });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.phone) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลผู้รับและที่อยู่จัดส่งให้ครบถ้วน",
      });
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // 2. แปลงรายการสินค้าเป็น Stripe Line Items (หน่วยเป็นสตางค์)
    const line_items = items.map((item) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name:
            item.productName || item.nameTh || item.name || "ชุด Cooking Kit",
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    // เพิ่มค่าจัดส่ง
    if (Number(shippingFee) > 0) {
      line_items.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: "ค่าบริการจัดส่ง (Shipping Fee)",
          },
          unit_amount: Math.round(Number(shippingFee) * 100),
        },
        quantity: 1,
      });
    }

    // 3. จัดเตรียมข้อมูลสำหรับบันทึกลง MongoDB
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
    const finalGrandTotal =
      Number(grandTotal) || subtotal + Number(shippingFee);

    const validUserObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : new mongoose.Types.ObjectId();

    const formattedItems = items.map((item) => {
      const rawId = item.productId || item.product || item._id;
      return {
        product: mongoose.Types.ObjectId.isValid(rawId)
          ? rawId
          : new mongoose.Types.ObjectId(),
        productName:
          item.productName || item.nameTh || item.name || "ชุด Cooking Kit",
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
      };
    });

    // 4. บันทึกคำสั่งซื้อลง MongoDB สถานะ PENDING / UNPAID
    let pendingOrder = null;
    if (mongoose.connection.readyState === 1) {
      pendingOrder = await Order.create({
        orderId,
        user: validUserObjectId,
        items: formattedItems,
        planType,
        shippingAddress: {
          fullName:
            shippingAddress.fullName || shippingAddress.recipient || "-",
          phone: shippingAddress.phone || "-",
          address: shippingAddress.address || "-",
          district: shippingAddress.district || "-",
          province: shippingAddress.province || "-",
          zipcode: shippingAddress.zipcode || shippingAddress.postalCode || "-",
          deliveryDate:
            shippingAddress.deliveryDate ||
            new Date().toISOString().split("T")[0],
        },
        paymentMethod:
          paymentMethod === "PROMPTPAY" ? "PROMPTPAY" : "CREDIT_CARD",
        paymentStatus: "UNPAID",
        status: "PENDING",
        itemsSubtotal: subtotal,
        shippingFee: Number(shippingFee),
        grandTotal: finalGrandTotal,
        earnedPoints: Math.floor(subtotal * 0.1),
      });

      console.log(
        `📦 [v2 DB] บันทึก Order รอดำเนินการลง MongoDB สำเร็จ: ${orderId}`,
      );
    }

    // 5. 🌟 กำหนดวิธีชำระเงินของ Stripe ให้ตรงกับที่ลูกค้าเลือก
    const isPromptPaySelected = paymentMethod === "PROMPTPAY";
    // ถ้าลูกค้าเลือก PromptPay ให้เปิด promptpay ขึ้นมาเป็นอันดับแรก
    const preferredMethods = isPromptPaySelected
      ? ["promptpay", "card"]
      : ["card", "promptpay"];

    let session;
    const sessionConfig = {
      line_items,
      mode: "payment",
      success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&status=success`,
      cancel_url: `${clientUrl}/checkout?canceled=true`,
      metadata: {
        orderId,
        mongoOrderId: pendingOrder ? pendingOrder._id.toString() : "",
        userId: userId.toString(),
      },
    };

    try {
      session = await stripe.checkout.sessions.create({
        ...sessionConfig,
        payment_method_types: preferredMethods,
      });
    } catch (methodErr) {
      // หากกรณี PromptPay ยังไม่ได้เปิดใน Dashboard ของ Stripe ให้ fallback เป็น card
      console.warn("⚠️ สลับไปใช้ Card สำรอง:", methodErr.message);
      session = await stripe.checkout.sessions.create({
        ...sessionConfig,
        payment_method_types: ["card"],
      });
    }

    console.log(`✅ [v2 Stripe] สร้าง Session สำเร็จ: ${session.id}`);

    // 6. ส่ง URL กลับไปให้ Frontend ทำการ Redirect
    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      orderId,
    });
  } catch (error) {
    console.error("❌ [v2 Checkout] สร้าง Session ล้มเหลว:", error.message);
    next(error);
  }
});

// ============================================================================
// 2. POST /api/v2/checkout/webhook
// ============================================================================
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(
        req.rawBody || req.body,
        sig,
        endpointSecret,
      );
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error(`⚠️ [Webhook Error]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const paymentIntentId = session.payment_intent;

    console.log(`🔔 [Stripe Webhook] ชำระเงินสำเร็จสำหรับ Order: ${orderId}`);

    if (mongoose.connection.readyState === 1 && orderId) {
      try {
        // 1. อัปเดตสถานะใน MongoDB เป็น PAID
        const updatedOrder = await Order.findOneAndUpdate(
          { orderId },
          {
            $set: {
              paymentStatus: "PAID",
              status: "PAID",
              stripePaymentIntentId: paymentIntentId,
            },
          },
          { new: true },
        );

        // 2. ตัดสต็อกสินค้าใน MongoDB แบบ Atomic ($inc)
        if (updatedOrder && updatedOrder.items) {
          for (const item of updatedOrder.items) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { quantity: -item.quantity },
            });
            console.log(
              `📉 [Stock] ตัดสต็อกสินค้า ID: ${item.product} ไป ${item.quantity} ชิ้น`,
            );
          }
        }

        // 3. ล้างตะกร้าสินค้าใน MongoDB
        if (session.metadata?.userId) {
          await Cart.findOneAndUpdate(
            { userId: session.metadata.userId },
            { $set: { items: [] } },
          );
        }
      } catch (dbErr) {
        console.error("❌ [Webhook DB Error]:", dbErr.message);
      }
    }
  }

  res.status(200).json({ received: true });
});

export default router;

*/
