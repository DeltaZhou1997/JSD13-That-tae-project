import React, { useState } from "react";
import { useLocation, Link, useOutletContext } from "react-router-dom";
import OrderEarnedPoints from "../components/order-success/OrderEarnedPoints";
import OrderDetailsCard from "../components/order-success/OrderDetailsCard";
import { formatDate } from "../utils/dateFormatter.js";
import { getAuthHeaders } from "../utils/authHeader.js";

const DEFAULT_ORDER_DATA = {
  orderId: "ORD-882940",
  createdAt: formatDate(new Date()),
  grandTotal: 959,
  earnedPoints: 0,
  deliveryDate: "12 พ.ย.",
  shippingAddress: {
    fullName: "ณัฐชา สุขใจ",
    phone: "081-234-5678",
    address: "123/45 ถนนวงศ์สว่าง บางซื่อ กรุงเทพมหานคร 10800",
  },
  paymentMethod: "PROMPTPAY",
  isFallbackPayment: false,
};

export default function OrderSuccess() {
  const { handleClearCart } = useOutletContext() || {};
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // ดึงข้อมูลจาก URL Query Params (กรณีเด้งกลับมาจาก Stripe v2)
  const sessionId = searchParams.get("session_id");
  const urlOrderId = searchParams.get("order_id");

  // 1. อ่านจาก React Router State (กรณีสั่งซื้อผ่าน v1)
  const stateOrder = location.state?.order;

  // 2. อ่านจาก sessionStorage (กรณีเด้งกลับมาจาก Stripe v2)
  let savedV2Order = null;
  try {
    const raw = sessionStorage.getItem("last_v2_order");
    if (raw) savedV2Order = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse last_v2_order:", err);
  }

  // เลือกลำดับข้อมูล: state (v1) ➔ sessionStorage (v2) ➔ DEFAULT_ORDER_DATA (fallback สุดท้าย)
  const baseOrder = stateOrder || savedV2Order || DEFAULT_ORDER_DATA;

  const orderData = {
    ...baseOrder,
    orderId: urlOrderId || baseOrder.orderId,
    paymentMethod: sessionId ? "STRIPE" : baseOrder.paymentMethod,
    isFallbackPayment: false,
  };

  const points = orderData.earnedPoints ?? orderData.pricing?.earnedPoints ?? 0;
  const isCOD = orderData.paymentMethod === "COD";
  // แสดงกล่องแนบสลิปเฉพาะเมื่อเป็น PromptPay ที่เข้าโหมด Fallback เท่านั้น (COD ห้ามแสดง)
  const isFallback = !isCOD && orderData.isFallbackPayment === true;
  const displayTotal =
    orderData.grandTotal || orderData.pricing?.grandTotal || 0;

  // ยืนยันการชำระเงิน Stripe กับฐานข้อมูลและเคลียร์ตะกร้า
  React.useEffect(() => {
    async function confirmPaymentOnServer() {
      if (urlOrderId || sessionId) {
        const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
        for (let attempt = 0; attempt < 5; attempt += 1) {
          try {
            const res = await fetch(`${apiUrl}/api/v2/checkout/confirm-stripe`, {
              method: "POST",
              headers: getAuthHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({ orderId: urlOrderId, sessionId }),
            });
            if (res.ok && res.status !== 202) {
              sessionStorage.removeItem("last_v2_order");
              if (handleClearCart) handleClearCart();
              return;
            }
            if (res.status !== 202) return; // จ่ายไม่สำเร็จ/ไม่พบ — ไม่ต้องลองซ้ำ
          } catch (err) {
            console.warn("Auto-confirm payment error:", err);
          }
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }
    confirmPaymentOnServer();
  }, [urlOrderId, sessionId, handleClearCart]);

  // State สำหรับจัดการสลิป
  const [slipImage, setSlipImage] = useState(null);
  const [isSubmittingSlip, setIsSubmittingSlip] = useState(false);
  const [isSlipSubmitted, setIsSlipSubmitted] = useState(false);

  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipImage(URL.createObjectURL(file));
      setIsSlipSubmitted(false);
    }
  };

  const handleConfirmSubmitSlip = () => {
    setIsSubmittingSlip(true);
    setTimeout(() => {
      setIsSubmittingSlip(false);
      setIsSlipSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-2xl mx-auto bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-8 shadow-sm text-center">
        {/* 1. Icon ด้านบน */}
        <div
          className={`w-20 h-20 border rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${
            isFallback
              ? "bg-sky-50 border-sky-200 text-sky-600"
              : isCOD
                ? "bg-amber-50 border-amber-200 text-amber-600"
                : "bg-[#f6ede5] border-[#e8dfd1] text-[#8d593a]"
          }`}
        >
          {isFallback ? (
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ) : isCOD ? (
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

        {/* 2. Badge สถานะ */}
        <span
          className={`inline-block text-xs font-bold uppercase tracking-[.22em] px-3 py-1 rounded-full mb-2 ${
            isFallback
              ? "bg-sky-100 text-sky-800"
              : isCOD
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isFallback
            ? "WAITING FOR VERIFICATION"
            : isCOD
              ? "ORDER PLACED"
              : "ORDER CONFIRMED"}
        </span>

        {/* 3. หัวข้อหลัก */}
        <h1 className="text-3xl font-bold text-[#3d2c2e] mt-1 mb-2">
          {isFallback
            ? "สั่งซื้อแล้ว — รอตรวจสอบยอดเงิน"
            : "สั่งซื้อเรียบร้อยแล้ว!"}
        </h1>

        <p className="text-sm text-[#6f675f] mb-4">
          {isFallback
            ? "ระบบได้รับคำสั่งซื้อของคุณแล้ว กรุณาแนบหลักฐานการโอนเงินเพื่อให้เจ้าหน้าที่ยืนยันคำสั่งซื้อ"
            : "ขอบคุณที่สั่งซื้อ Cooking Kit กับธาตุแท้ เรากำลังเตรียมวัตถุดิบสดใหม่ส่งตรงถึงบ้านคุณ"}
        </p>

        {/* 🚨 แสดงเฉพาะเคส PromptPay สำรอง (Stripe ล่ม) */}
        {isFallback && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📑</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-sky-900">
                  แนบหลักฐานการโอนเงิน (สลิป PromptPay)
                </p>
                <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                  เนื่องจากระบบ Gateway ปิดปรับปรุงชั่วคราว
                  เจ้าหน้าที่จะทำการตรวจสอบยอดเงิน ฿
                  {displayTotal.toLocaleString()} ของคุณภายใน 15-30 นาที
                </p>

                <div className="mt-4 bg-white border-2 border-dashed border-sky-200 rounded-xl p-4 text-center">
                  {slipImage ? (
                    <div className="space-y-3">
                      <img
                        src={slipImage}
                        alt="สลิปโอนเงิน"
                        className="max-h-48 mx-auto rounded-lg shadow-sm border border-gray-200"
                      />

                      {isSlipSubmitted ? (
                        <div className="space-y-2">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <p className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                              <span>✅</span> ส่งสลิปให้เจ้าหน้าที่เรียบร้อยแล้ว
                            </p>
                            <p className="text-[11px] text-emerald-600 mt-0.5">
                              ระบบจะดำเนินการจัดเตรียมสินค้าหลังการตรวจสอบ
                            </p>
                          </div>

                          <label className="inline-flex items-center gap-1 text-[11px] text-sky-700 hover:text-sky-900 underline cursor-pointer pt-1 font-medium transition-colors">
                            <span>🔄</span>
                            <span>อัปโหลดสลิปใหม่ (หากเลือกรูปผิด)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlipChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={handleConfirmSubmitSlip}
                            disabled={isSubmittingSlip}
                            className="w-full sm:w-auto px-6 py-2.5 bg-[#3d2c2e] hover:bg-[#8d593a] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                          >
                            {isSubmittingSlip ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>กำลังส่งหลักฐาน...</span>
                              </>
                            ) : (
                              <>
                                <span>📤</span>
                                <span>ยืนยันส่งหลักฐานการโอนเงิน</span>
                              </>
                            )}
                          </button>

                          <label className="text-xs text-sky-700 underline cursor-pointer hover:text-sky-900 block pt-1">
                            เปลี่ยนรูปภาพใหม่
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlipChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl block mb-1">📤</span>
                      <label className="bg-[#3d2c2e] hover:bg-[#8d593a] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer inline-block transition-all shadow-sm">
                        เลือกไฟล์รูปสลิปโอนเงิน
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSlipChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-gray-400 mt-2">
                        รองรับไฟล์ JPG, PNG หรือภาพถ่ายหน้าจอ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💵 กล่อง COD */}
        {isCOD && (
          <div className="bg-[#fffdfa] border border-[#f5e6cf] rounded-2xl p-4 mb-6 text-left shadow-sm">
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">💵</span>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  กรุณาเตรียมเงินสด ฿ {displayTotal.toLocaleString()}{" "}
                  หรือแอปธนาคารให้พร้อมในวันที่พนักงานจัดส่งสินค้า
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  พนักงานจะนำสินค้าไปส่งตามรอบจัดส่ง
                  สามารถชำระด้วยเงินสดหรือสแกน QR หน้าร้าน/หน้าบ้านได้เลยครับ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* กล่อง Online ปกติ (Stripe ไม่ล่ม) */}
        {!isCOD && !isFallback && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-sm font-semibold text-emerald-700">
                ชำระเงิน ฿{displayTotal.toLocaleString()} เรียบร้อยแล้ว
                (ยืนยันผ่าน Stripe อัตโนมัติ)
              </p>
            </div>
          </div>
        )}

        {/* แต้มสะสม & รายละเอียดการสั่งซื้อ */}
        <OrderEarnedPoints points={points} />
        <OrderDetailsCard orderData={orderData} />

        {/* ปุ่มกลับหน้าหลัก */}
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
