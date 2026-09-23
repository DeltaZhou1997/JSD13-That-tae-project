import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    // ชื่อเต็มผู้รับ (หน้าแอดมิน/คำสั่งซื้อใช้ฟิลด์นี้) — เติมจาก firstName + lastName อัตโนมัติ
    fullName: { type: String, default: "" },
    // ชื่อที่อยู่ในสมุดที่อยู่ เช่น "บ้าน", "ที่ทำงาน"
    label: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    subdistrict: { type: String, default: "" },
    district: { type: String, default: "" },
    province: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    planType: {
      type: String,
      default: "SINGLE_KIT",
    },
    planDetails: {
      planId: { type: String },
      planName: { type: String },
      kitsPerWeek: { type: Number },
      planPrice: { type: Number },
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["STRIPE", "PROMPTPAY", "CREDIT_CARD", "COD", "promptpay", "card", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "PAID"],
      default: "PROCESSING",
    },
    status: {
      type: String,
      default: function () {
        return this.orderStatus || "PROCESSING";
      },
    },
    itemsSubtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 120,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    earnedPoints: {
      type: Number,
      default: 0,
    },
    // ช่องทางที่จ่ายจริงผ่าน Stripe: card / promptpay / apple_pay / google_pay
    paymentChannel: {
      type: String,
      default: "",
    },
    // กันให้แต้มซ้ำ (เช่น เรียก confirm-stripe หลายครั้ง)
    // ไม่มี default: ออเดอร์เก่าที่ไม่มีฟิลด์นี้ได้แต้มไปแล้วตอนสร้าง จึงห้ามให้ซ้ำ
    // ออเดอร์ใหม่ตั้งเป็น false ตอนสร้างใน checkout.routes.js
    pointsAwarded: {
      type: Boolean,
    },
    // true = คืนสต็อกแล้ว (ตอนยกเลิกคำสั่งซื้อ)
    stockRestored: {
      type: Boolean,
      default: false,
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// เติมชื่อเต็มผู้รับจากชื่อ-นามสกุล (ถ้าส่งมาแค่ fullName ก็แยกกลับเป็นชื่อ/นามสกุลให้)
orderSchema.pre("validate", function () {
  const sa = this.shippingAddress;
  if (!sa) return;
  if (!sa.fullName && (sa.firstName || sa.lastName)) {
    sa.fullName = `${sa.firstName || ""} ${sa.lastName || ""}`.trim();
  } else if (sa.fullName && !sa.firstName) {
    const [first, ...rest] = sa.fullName.trim().split(/\s+/);
    sa.firstName = first || "";
    sa.lastName = rest.join(" ");
  }
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
