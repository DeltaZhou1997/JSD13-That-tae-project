import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    planType: {
      type: String,
      default: "SINGLE_KIT",
    },
    planDetails: {
      planId: String,
      planName: String,
      kitsPerWeek: Number,
      planPrice: Number,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      district: { type: String, required: true },
      province: { type: String, required: true },
      zipcode: { type: String, required: true },
      deliveryDate: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["PROMPTPAY", "CREDIT_CARD", "COD"],
      required: true,
    },

    // ========== ฟิลด์ใหม่สำหรับระบบชำระเงิน ==========

    // สถานะการชำระเงิน (แยกจากสถานะ Order)
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "PAID",
    },

    // ยอดเงินที่พนักงานต้องเก็บสำหรับ COD
    codAmount: {
      type: Number,
      default: null,
    },

    // Stripe Payment Intent ID (เก็บไว้อ้างอิงกับ Stripe)
    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    // เหตุผลกรณียกเลิก Order (เช่น COD ลูกค้าปฏิเสธรับของ)
    cancelReason: {
      type: String,
      default: null,
    },

    // ========== ฟิลด์เดิม ==========
    itemsSubtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 60 },
    grandTotal: { type: Number, required: true },
    earnedPoints: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "PREPARING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PAID",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
