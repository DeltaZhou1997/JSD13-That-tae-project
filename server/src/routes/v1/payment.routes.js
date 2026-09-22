import express from "express";
import Stripe from "stripe";

const router = express.Router();

// ========================================================================
// 💳 Stripe Payment Routes
// ========================================================================
// อธิบาย: ไฟล์นี้จัดการเรื่อง "การสร้างคำขอชำระเงิน" ผ่าน Stripe
//
// วิธีการทำงาน:
//   1. Frontend ส่งยอดเงิน + ประเภทการชำระ มาที่ API นี้
//   2. Server ส่งข้อมูลไป Stripe เพื่อสร้าง "Payment Intent"
//      (Payment Intent = คำขอชำระเงิน ที่ Stripe เตรียมไว้ให้)
//   3. Stripe ส่ง "clientSecret" กลับมา
//   4. Server ส่ง clientSecret กลับไปให้ Frontend
//   5. Frontend ใช้ clientSecret เพื่อยืนยันการชำระเงินกับ Stripe โดยตรง
//      (ข้อมูลบัตรเครดิต/PromptPay จะส่งจาก Browser ไป Stripe เลย ไม่ผ่าน Server เรา)
// ========================================================================

// ตรวจสอบว่ามี STRIPE_SECRET_KEY หรือไม่
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (stripeSecretKey && stripeSecretKey.startsWith("sk_")) {
  stripe = new Stripe(stripeSecretKey);
  console.log("✅ Stripe SDK เชื่อมต่อสำเร็จ (Test Mode)");
} else {
  console.warn(
    "⚠️ ไม่พบ STRIPE_SECRET_KEY ใน .env — Stripe จะทำงานในโหมด Mock",
  );
}

// -----------------------------------------------------------------------
// POST /api/v1/payment/create-payment-intent
// -----------------------------------------------------------------------
// สร้าง Payment Intent สำหรับ บัตรเครดิต หรือ PromptPay
//
// Request Body:
//   {
//     "amount": 959,              // ยอดเงินเป็น "บาท"
//     "paymentMethodType": "card"  // "card" หรือ "promptpay"
//   }
//
// Response:
//   {
//     "clientSecret": "pi_xxxxx_secret_xxxxx"   // ส่งให้ Frontend ใช้
//   }
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

    // กรณีมี Stripe Key → สร้าง Payment Intent จริง
    // amount ต้องแปลงเป็นหน่วยสตางค์ (1 บาท = 100 สตางค์)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "thb",
      payment_method_types:
        paymentMethodType === "promptpay" ? ["promptpay"] : ["card"],
      metadata: {
        source: "thattae-cooking-kit",
        method: paymentMethodType,
      },
    });

    console.log(
      `✅ [Stripe] Payment Intent สร้างสำเร็จ: ${paymentIntent.id} | ฿${amount}`,
    );

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
// POST /api/v1/payment/confirm-status
// -----------------------------------------------------------------------
// ตรวจสอบสถานะการชำระเงินจาก Payment Intent ID
// (Frontend เรียกหลังจากชำระเงินสำเร็จ เพื่อ double-check)
// -----------------------------------------------------------------------
router.post("/confirm-status", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res
        .status(400)
        .json({ success: false, message: "กรุณาระบุ paymentIntentId" });
    }

    // Mock Mode
    if (!stripe || paymentIntentId.startsWith("mock_")) {
      return res.json({
        success: true,
        status: "succeeded",
        isMock: true,
      });
    }

    // Stripe จริง
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
