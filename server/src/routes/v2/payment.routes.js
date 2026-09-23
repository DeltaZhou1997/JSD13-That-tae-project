import { Router } from "express";
import Stripe from "stripe";

const router = Router();

// ========================================================================
// 💳 Stripe Payment Routes (v2)
// ========================================================================
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (stripeSecretKey && stripeSecretKey.startsWith("sk_")) {
  stripe = new Stripe(stripeSecretKey);
  console.log("✅ [v2] Stripe SDK เชื่อมต่อสำเร็จ");
} else {
  console.warn(
    "⚠️ [v2] ไม่พบ STRIPE_SECRET_KEY ใน .env — Stripe Payment Intent จะทำงานในโหมด Mock",
  );
}

// -----------------------------------------------------------------------
// POST /create-payment-intent (หรือ /api/v1/payment/create-payment-intent)
// -----------------------------------------------------------------------
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, paymentMethodType = "card" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุยอดเงินที่ถูกต้อง (amount > 0)",
      });
    }

    // กรณีไม่มี Stripe Key → ใช้ Mock Response สำหรับ Demo
    if (!stripe) {
      console.log(
        `🔶 [Mock Stripe] สร้าง Payment Intent: ฿${amount} (${paymentMethodType})`,
      );
      return res.json({
        success: true,
        clientSecret: `mock_secret_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        paymentIntentId: `mock_pi_${Date.now()}`,
        isMock: true,
        message:
          "ระบบทำงานในโหมด Mock เนื่องจากไม่ได้ตั้งค่า STRIPE_SECRET_KEY",
      });
    }

    // กรณีมี Stripe Key → สร้าง Payment Intent จริง (แปลงเป็นสตางค์)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "thb",
      payment_method_types:
        paymentMethodType === "promptpay" ? ["promptpay"] : ["card"],
      metadata: {
        source: "thattae-cooking-kit-v2",
        method: paymentMethodType,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isMock: false,
    });
  } catch (error) {
    console.error("❌ [Stripe] สร้าง Payment Intent ไม่สำเร็จ:", error.message);
    res.status(500).json({
      success: false,
      message: "ไม่สามารถสร้างคำขอชำระเงินได้",
      error: error.message,
    });
  }
});

// -----------------------------------------------------------------------
// POST /confirm-status
// -----------------------------------------------------------------------
router.post("/confirm-status", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res
        .status(400)
        .json({ success: false, message: "กรุณาระบุ paymentIntentId" });
    }

    if (!stripe || paymentIntentId.startsWith("mock_")) {
      return res.json({
        success: true,
        status: "succeeded",
        isMock: true,
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      isMock: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ตรวจสอบสถานะการชำระเงินไม่สำเร็จ",
      error: error.message,
    });
  }
});

export default router;
