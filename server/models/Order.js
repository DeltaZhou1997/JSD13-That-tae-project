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
