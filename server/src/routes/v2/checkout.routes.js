import express from "express";
import Stripe from "stripe";

const router = express.Router();

// ดึง Stripe Secret Key จาก .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========================================================================
// POST /api/v2/checkout/create-session
// หน้าที่: สร้าง Stripe Checkout Session แล้วส่ง URL กลับไปให้ Frontend Redirect
// ========================================================================
router.post("/create-session", async (req, res) => {
  try {
    const {
      items,
      grandTotal,
      shippingFee = 60,
      orderId = `ORD-${Date.now()}`,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบรายการสินค้าในคำสั่งซื้อ",
      });
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // 1. แปลงรายการสินค้าในตะกร้าให้อยู่ในรูปแบบ Stripe Line Items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name:
            item.productName || item.nameTh || item.name || "ชุด Cooking Kit",
        },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe คิดหน่วยเป็นสตางค์
      },
      quantity: Number(item.quantity) || 1,
    }));

    // 2. เพิ่มค่าจัดส่ง (ถ้ามี)
    if (shippingFee && Number(shippingFee) > 0) {
      line_items.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: "ค่าจัดส่ง (Shipping Fee)",
          },
          unit_amount: Math.round(Number(shippingFee) * 100),
        },
        quantity: 1,
      });
    }

    // 3. สร้าง Checkout Session กับ Stripe
    // (มีระบบกันเหนียว: พยายามเปิดทั้ง Card + PromptPay ก่อน หาก Account ยังไม่ได้เปิด PromptPay จะสลับใช้ Card อัตโนมัติ)
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "promptpay"],
        line_items,
        mode: "payment",
        success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&status=success`,
        cancel_url: `${clientUrl}/checkout?canceled=true`,
        metadata: {
          orderId: orderId,
        },
      });
    } catch (promptPayError) {
      // กรณี Dashboard ของ Stripe ยังไม่ได้เปิดสวิตช์ PromptPay ให้ใช้ Card อย่างเดียว
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&status=success`,
        cancel_url: `${clientUrl}/checkout?canceled=true`,
        metadata: {
          orderId: orderId,
        },
      });
    }

    console.log(`✅ [v2 Stripe] สร้าง Checkout Session สำเร็จ: ${session.id}`);

    // 4. ส่ง URL กลับไปให้ Frontend
    res.status(200).json({
      success: true,
      url: session.url, // URL นี้ที่ Frontend จะใช้ Redirect
      sessionId: session.id,
    });
  } catch (error) {
    console.error("❌ [v2 Stripe] เกิดข้อผิดพลาด:", error.message);
    res.status(500).json({
      success: false,
      message: "ไม่สามารถสร้างหน้าชำระเงินของ Stripe ได้",
      error: error.message,
    });
  }
});

export default router;
