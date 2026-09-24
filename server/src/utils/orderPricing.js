import mongoose from "mongoose";
import { Product } from "../models/Product.model.js";
import { calculateEarnedPoints, validateRedeem } from "./membership.js";

// ⚠️ ต้องตรงกับ client/src/constants/checkout.js
export const SHIPPING_FEE = 120;
export const SUBSCRIPTION_PLANS = {
  S: { id: "S", name: "SIZE S", kitsPerWeek: 4, price: 599 },
  M: { id: "M", name: "SIZE M", kitsPerWeek: 6, price: 899 },
  L: { id: "L", name: "SIZE L", kitsPerWeek: 8, price: 1169 },
  XL: { id: "XL", name: "SIZE XL", kitsPerWeek: 12, price: 1599 },
};

function firstImage(imageUrl) {
  return (Array.isArray(imageUrl) ? imageUrl[0] : imageUrl) || "";
}

/**
 * คำนวณราคาคำสั่งซื้อฝั่ง Server จากราคาสินค้าใน DB (ไม่เชื่อราคา/ยอดรวม/แต้มที่ Frontend ส่งมา)
 * ใช้สูตรเดียวกับ CheckoutPage.jsx: ถ้าเลือกแพ็กเกจ = ราคาแพ็กเกจ + เมนูที่เกินโควตา
 * ใช้เบี้ยลดราคา: ตรวจกับเบี้ยคงเหลือจริงของผู้ใช้ (availablePoints) และคูณเบี้ยที่ได้ตาม tier
 * @returns {{ error?: string, items, planType, planDetails, itemsSubtotal, pointsRedeemed, pointsDiscount, shippingFee, grandTotal, earnedPoints, extraLines }}
 */
export async function priceOrder(rawItems = [], planType, { tier, availablePoints = 0, pointsToRedeem = 0 } = {}) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: "ไม่มีสินค้าในรายการสั่งซื้อ" };
  }

  const items = [];
  for (const raw of rawItems) {
    const productId = String(raw.productId || raw.product || raw._id || "");
    const product = mongoose.Types.ObjectId.isValid(productId) ? await Product.findById(productId).lean() : null;
    if (!product) {
      return { error: `ไม่พบสินค้า "${raw.productName || raw.name || productId}" ในระบบ` };
    }
    items.push({
      productId: String(product._id),
      productName: product.nameTh || product.name || "Cooking Kit",
      price: Number(product.price) || 0,
      quantity: Math.max(1, parseInt(raw.quantity, 10) || 1),
      imageUrl: firstImage(product.imageUrl),
    });
  }

  const plan = SUBSCRIPTION_PLANS[planType] || null;
  let itemsSubtotal = 0;
  // รายการที่ต้องจ่ายเพิ่ม (ใช้สร้าง line items ของ Stripe)
  const extraLines = [];

  if (plan) {
    let countedInBox = 0;
    for (const item of items) {
      const space = plan.kitsPerWeek - countedInBox;
      const extraQty = space <= 0 ? item.quantity : Math.max(0, item.quantity - space);
      countedInBox += item.quantity - extraQty;
      if (extraQty > 0) extraLines.push({ ...item, quantity: extraQty });
    }
    itemsSubtotal = plan.price + extraLines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  } else {
    itemsSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    extraLines.push(...items);
  }

  const redeem = validateRedeem(pointsToRedeem, availablePoints, itemsSubtotal);
  if (redeem.error) return { error: redeem.error };
  const extraSubtotal = plan ? itemsSubtotal - plan.price : 0;

  return {
    items,
    planType: plan ? plan.id : "SINGLE_KIT",
    planDetails: plan
      ? { planId: plan.id, planName: plan.name, kitsPerWeek: plan.kitsPerWeek, planPrice: plan.price }
      : null,
    plan,
    extraLines,
    itemsSubtotal,
    pointsRedeemed: redeem.points,
    pointsDiscount: redeem.discount,
    shippingFee: SHIPPING_FEE,
    grandTotal: itemsSubtotal - redeem.discount + SHIPPING_FEE,
    earnedPoints: calculateEarnedPoints({
      planId: plan?.id,
      itemsSubtotal,
      extraSubtotal,
      discount: redeem.discount,
      tier,
    }),
  };
}
