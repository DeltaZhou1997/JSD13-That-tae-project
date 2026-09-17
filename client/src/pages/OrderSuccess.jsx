import React from "react";
import { useLocation, Link } from "react-router-dom";
import OrderEarnedPoints from "../components/order-success/OrderEarnedPoints";
import OrderDetailsCard from "../components/order-success/OrderDetailsCard";

// 🟢 ปรับ Default Mock Data ให้ถูกต้องตาม Business Logic (ยอดไม่ถึง 1499 ได้ 0 แต้ม)
const DEFAULT_ORDER_DATA = {
  orderId: "ORD-882940",
  createdAt: new Date().toLocaleDateString("th-TH"),
  grandTotal: 959,
  earnedPoints: 0, // 🟢 แก้จาก 80 เป็น 0 ให้ตรงเงื่อนไข
  deliveryDate: "12 พ.ย.",
  shippingAddress: {
    fullName: "ณัฐชา สุขใจ",
    phone: "081-234-5678",
    address: "123/45 ถนนวงศ์สว่าง บางซื่อ กรุงเทพมหานคร 10800",
  },
  paymentMethod: "PROMPTPAY",
};

export default function OrderSuccess() {
  const location = useLocation();

  // =========================================================================
  // 📌 [จุดที่จะต้องเปลี่ยนเมื่อต่อกับ Backend / Router]
  // -------------------------------------------------------------------------
  // 🟢 รับค่า state ที่ถูก navigate ส่งมาจากหน้า CheckoutPage.jsx
  //    - ถ้าเข้ามาตรงๆ โดยไม่มี state จะใช้ DEFAULT_ORDER_DATA เป็น fallback
  //    - ถ้าส่งมาจาก Checkout จะดึงค่า orderId และ earnedPoints จริงมาแสดง
  // =========================================================================
  const orderData = location.state?.order || DEFAULT_ORDER_DATA;

  // 🟢 ดึงแต้มสะสม (รองรับทั้ง orderData.earnedPoints และ orderData.pricing.earnedPoints)
  const points = orderData.earnedPoints ?? orderData.pricing?.earnedPoints ?? 0;

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-2xl mx-auto bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-8 shadow-sm text-center">
        {/* Icon Success */}
        <div className="w-20 h-20 bg-[#f6ede5] border border-[#e8dfd1] text-[#8d593a] rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
          🎉
        </div>

        <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl font-bold text-[#3d2c2e] mt-1 mb-2">
          สั่งซื้อเรียบร้อยแล้ว!
        </h1>
        <p className="text-sm text-[#6f675f] mb-6">
          ขอบคุณที่สั่งซื้อ Cooking Kit กับธาตุแท้
          เรากำลังเตรียมวัตถุดิบสดใหม่ส่งตรงถึงบ้านคุณ
        </p>

        {/* Component 1: Earned Points */}
        <OrderEarnedPoints points={points} />

        {/* Component 2: Order Details */}
        <OrderDetailsCard orderData={orderData} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-[#3d2c2e] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#8d593a] transition-colors shadow-md text-sm"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
