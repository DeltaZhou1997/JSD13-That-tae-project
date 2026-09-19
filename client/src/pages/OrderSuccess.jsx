import React from "react";
import { useLocation, Link } from "react-router-dom";
import OrderEarnedPoints from "../components/order-success/OrderEarnedPoints";
import OrderDetailsCard from "../components/order-success/OrderDetailsCard";

// 🟢 ปรับ Default Mock Data ให้ถูกต้องตาม Business Logic
const DEFAULT_ORDER_DATA = {
  orderId: "ORD-882940",
  createdAt: new Date().toLocaleDateString("th-TH"),
  grandTotal: 959,
  earnedPoints: 0,
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
  const orderData = location.state?.order || DEFAULT_ORDER_DATA;

  // ดึงแต้มสะสม
  const points = orderData.earnedPoints ?? orderData.pricing?.earnedPoints ?? 0;

  // 🆕 ตรวจสอบว่าเป็น COD หรือไม่
  const isCOD = orderData.paymentMethod === "COD";

  // 🆕 กำหนดยอดเงินสำหรับแสดงผล
  const displayTotal =
    orderData.grandTotal || orderData.pricing?.grandTotal || 0;

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-2xl mx-auto bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-8 shadow-sm text-center">
        {/* ============================================================ */}
        {/* Icon Success — เปลี่ยนสีตามสถานะการชำระเงิน                    */}
        {/* COD = สีเหลือง/ส้ม (รอชำระ) | Online = สีเขียว/น้ำตาล (จ่ายแล้ว) */}
        {/* ============================================================ */}
        <div
          className={`w-20 h-20 border rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${
            isCOD
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-[#f6ede5] border-[#e8dfd1] text-[#8d593a]"
          }`}
        >
          {isCOD ? (
            // COD Icon: กล่องพัสดุ + เงินสด
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 3H8l-2 4h12l-2-4Z" />
              <circle cx="12" cy="14" r="3" />
            </svg>
          ) : (
            // Online Payment Icon: เครื่องหมายถูก
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        {/* ============================================================ */}
        {/* Badge สถานะการชำระเงิน                                        */}
        {/* ============================================================ */}
        <span
          className={`inline-block text-xs font-bold uppercase tracking-[.22em] px-3 py-1 rounded-full mb-2 ${
            isCOD
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isCOD ? "ORDER PLACED" : "ORDER CONFIRMED"}
        </span>

        {/* ============================================================ */}
        {/* หัวข้อหลัก — ข้อความต่างกันตาม paymentMethod                   */}
        {/* ============================================================ */}
        <h1 className="text-3xl font-bold text-[#3d2c2e] mt-1 mb-2">
          {isCOD
            ? "สั่งซื้อเรียบร้อยแล้ว!"
            : "สั่งซื้อและชำระเงินเรียบร้อยแล้ว!"}
        </h1>

        <p className="text-sm text-[#6f675f] mb-4">
          {isCOD
            ? "ขอบคุณที่สั่งซื้อ Cooking Kit กับธาตุแท้ เรากำลังเตรียมวัตถุดิบสดใหม่ส่งตรงถึงบ้านคุณ"
            : "ขอบคุณที่สั่งซื้อ Cooking Kit กับธาตุแท้ เรากำลังเตรียมวัตถุดิบสดใหม่ส่งตรงถึงบ้านคุณ"}
        </p>

        {/* ============================================================ */}
        {/* 🆕 กล่องแจ้งเตือนพิเศษสำหรับ COD                             */}
        {/* ============================================================ */}
        {isCOD && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">💵</span>
              <div>
                <p className="text-sm font-bold text-amber-800">
                  กรุณาเตรียมเงินสด ฿{displayTotal.toLocaleString()}{" "}
                  ให้พนักงานจัดส่ง
                </p>
                <p className="text-xs text-amber-700 mt-1.5 leading-relaxed">
                  พนักงานจัดส่งจะเก็บเงินสดตามยอดที่แจ้งไว้เมื่อนำสินค้ามาส่งถึงบ้านคุณ
                  กรุณาตรวจสอบสินค้าก่อนชำระเงิน
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    📋 ตรวจสอบสินค้าก่อนจ่าย
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    💰 เตรียมเงินสดให้พอดี
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    🏠 มีคนอยู่รับสินค้า
                  </span>
                </div>
                <p className="text-[10px] text-amber-600 mt-2">
                  หมายเหตุ: หากไม่มีผู้รับ หรือไม่สามารถชำระเงินได้
                  สินค้าจะถูกส่งคืนคลังสินค้า
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 🆕 กล่องยืนยันสำหรับ Online Payment                          */}
        {/* ============================================================ */}
        {!isCOD && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-sm font-semibold text-emerald-700">
                ชำระเงิน ฿{displayTotal.toLocaleString()} เรียบร้อยแล้ว
                {orderData.paymentMethod === "CREDIT_CARD" && " (บัตรเครดิต)"}
                {orderData.paymentMethod === "PROMPTPAY" && " (PromptPay)"}
              </p>
            </div>
            {orderData.stripePaymentIntentId && (
              <p className="text-[10px] text-emerald-500 mt-1">
                Ref: {orderData.stripePaymentIntentId}
              </p>
            )}
          </div>
        )}

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
          <Link
            to="/orders"
            className="bg-white text-[#3d2c2e] border border-[#e8dfd1] px-8 py-3.5 rounded-full font-bold hover:border-[#8d593a] transition-colors shadow-sm text-sm"
          >
            ดูประวัติคำสั่งซื้อ
          </Link>
        </div>
      </div>
    </div>
  );
}
