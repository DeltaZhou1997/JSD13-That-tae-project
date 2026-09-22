import React from "react";
import { PAYMENT_METHODS } from "../../constants/checkout";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

// สไตล์ตกแต่งภายในช่อง Stripe Elements
const ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#2f2119",
      fontFamily: '"Noto Sans Thai", sans-serif',
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
  promptPayQrUrl,
  cardData,
  onCardInputChange,
  paymentError,
  paymentVersion = "v1", // 🌟 รับ paymentVersion เพื่อแยกการแสดงผล v1 กับ v2
}) {
  const isCreditCard = paymentMethod === PAYMENT_METHODS.CREDIT_CARD;
  const isCOD = paymentMethod === PAYMENT_METHODS.COD;
  const isPromptPay = paymentMethod === PAYMENT_METHODS.PROMPTPAY;

  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
      {/* หัวข้อ */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">💳</span>
        <h2 className="text-xl font-bold text-[#3d2c2e]">ช่องทางการชำระเงิน</h2>
      </div>

      <div className="space-y-3">
        {/* ==================== 1. PromptPay ==================== */}
        <label
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            isPromptPay
              ? "border-[#8d593a] bg-[#f6ede5]"
              : "border-[#e8dfd1] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value={PAYMENT_METHODS.PROMPTPAY}
              checked={isPromptPay}
              onChange={() => setPaymentMethod(PAYMENT_METHODS.PROMPTPAY)}
              className="accent-[#8d593a] w-4 h-4"
            />
            <span className="font-semibold text-sm">
              สแกน QR Code พร้อมเพย์
            </span>
          </div>
          <span className="text-xs bg-[#8d593a]/10 text-[#8d593a] px-2.5 py-1 rounded font-bold">
            PromptPay
          </span>
        </label>

        {/* แสดง QR Code ในหน้าเว็บเฉพาะตอนเป็น v1 */}
        {isPromptPay && paymentVersion === "v1" && (
          <div className="p-5 bg-white border border-[#e8dfd1] rounded-2xl text-center my-2">
            <span className="inline-block text-xs bg-[#f6ede5] text-[#8d593a] px-3 py-1 rounded-full font-medium mb-3">
              สแกน QR Code เพื่อชำระเงินผ่าน PromptPay
            </span>
            <div className="flex justify-center mb-3">
              <img
                src={promptPayQrUrl}
                alt="PromptPay QR Code"
                className="w-48 h-48 border p-2 rounded-xl bg-white shadow-inner"
              />
            </div>
            <p className="text-xs text-[#6f675f]">
              เมื่อชำระเงินเสร็จสิ้น ระบบจะทำการยืนยันให้อัตโนมัติใน 1-2 นาที
            </p>
          </div>
        )}

        {/* กล่องแจ้งเตือนของ v2 (ไม่แสดง QR ที่นี่ ให้ไปสแกนที่ Stripe) */}
        {isPromptPay && paymentVersion === "v2" && (
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-left my-2 flex items-start gap-3">
            <span className="text-xl mt-0.5">📱</span>
            <div>
              <p className="text-xs font-bold text-sky-900">
                ชำระเงินผ่าน PromptPay QR Code บนหน้า Stripe
              </p>
              <p className="text-xs text-sky-700 mt-0.5 leading-relaxed">
                เมื่อกดยืนยันการสั่งซื้อ ระบบจะนำท่านไปยังหน้าชำระเงินของ Stripe
                เพื่อแสดง QR Code พร้อมเพย์ที่สามารถบันทึกหรือสแกนจ่ายได้ทันที
              </p>
            </div>
          </div>
        )}

        {/* ==================== 2. Credit Card ==================== */}
        <label
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            isCreditCard
              ? "border-[#8d593a] bg-[#f6ede5]"
              : "border-[#e8dfd1] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value={PAYMENT_METHODS.CREDIT_CARD}
              checked={isCreditCard}
              onChange={() => setPaymentMethod(PAYMENT_METHODS.CREDIT_CARD)}
              className="accent-[#8d593a] w-4 h-4"
            />
            <span className="font-semibold text-sm">บัตรเครดิต / เดบิต</span>
          </div>
          <span className="text-xs text-[#6f675f] flex items-center gap-1">
            💳 Visa / Mastercard
          </span>
        </label>

        {/* แสดงฟอร์มกรอกบัตรในหน้าเว็บเฉพาะตอนเป็น v1 */}
        {isCreditCard && paymentVersion === "v1" && (
          <div className="p-6 bg-white border border-[#e8dfd1] rounded-2xl space-y-4 my-2">
            <div>
              <label className="block text-xs font-semibold text-[#6f675f] mb-1.5">
                หมายเลขบัตร
              </label>
              <div className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#8d593a] focus-within:outline-none transition-all">
                <CardNumberElement
                  options={{
                    ...ELEMENT_STYLE,
                    placeholder: "1234 5678 9012 3456",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6f675f] mb-1.5">
                ชื่อบนบัตร
              </label>
              <input
                type="text"
                name="cardName"
                placeholder="NATCHA SOOKJAI"
                value={cardData.cardName}
                onChange={onCardInputChange}
                className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6f675f] mb-1.5">
                  วันหมดอายุ (MM/YY)
                </label>
                <div className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#8d593a] focus-within:outline-none transition-all">
                  <CardExpiryElement
                    options={{
                      ...ELEMENT_STYLE,
                      placeholder: "MM/YY",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6f675f] mb-1.5">
                  รหัส CVC / CVV
                </label>
                <div className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#8d593a] focus-within:outline-none transition-all">
                  <CardCvcElement
                    options={{
                      ...ELEMENT_STYLE,
                      placeholder: "123",
                    }}
                  />
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mt-3 flex items-start gap-2.5 text-left animate-in fade-in duration-200">
                <span className="text-red-600 font-bold text-base leading-none mt-0.5">
                  ✖
                </span>
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  {paymentError}
                </p>
              </div>
            )}
          </div>
        )}

        {/* กล่องแจ้งเตือนของ v2 (ไม่แสดงฟอร์มกรอกบัตรที่นี่ ให้ไปกรอกที่หน้า Stripe) */}
        {isCreditCard && paymentVersion === "v2" && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left my-2 flex items-start gap-3">
            <span className="text-xl mt-0.5">🔒</span>
            <div>
              <p className="text-xs font-bold text-emerald-900">
                ชำระเงินผ่านบัตรเครดิต / เดบิต อย่างปลอดภัย
              </p>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                ระบบจะนำท่านไปยังหน้าชำระเงินที่ได้รับมาตรฐานความปลอดภัยระดับโลก
                (PCI-DSS) ของ Stripe เพื่อกรอกข้อมูลบัตรได้อย่างปลอดภัย 100%
              </p>
            </div>
          </div>
        )}

        {/* ==================== 3. COD ==================== */}
        <label
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            isCOD
              ? "border-[#8d593a] bg-[#f6ede5]"
              : "border-[#e8dfd1] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value={PAYMENT_METHODS.COD}
              checked={isCOD}
              onChange={() => setPaymentMethod(PAYMENT_METHODS.COD)}
              className="accent-[#8d593a] w-4 h-4"
            />
            <span className="font-semibold text-sm">เก็บเงินปลายทาง (COD)</span>
          </div>
          <span className="text-xs text-[#6f675f] flex items-center gap-1.5">
            <span>💵 เงินสด</span>
            <span className="opacity-40">|</span>
            <span>📱 สแกนจ่าย</span>
          </span>
        </label>

        {isCOD && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl my-2">
            <div className="flex items-start gap-2.5">
              <span className="text-xl mt-0.5">📦</span>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  ชำระเงินเมื่อได้รับสินค้า (เงินสด หรือ สแกนจ่าย)
                </p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  ท่านสามารถเตรียม{" "}
                  <span className="font-semibold text-amber-900">เงินสด</span>{" "}
                  ให้พอดี หรือเลือก{" "}
                  <span className="font-semibold text-amber-900">
                    สแกน QR Code
                  </span>{" "}
                  เพื่อโอนเงินผ่าน Mobile Banking
                  กับพนักงานจัดส่งได้โดยตรงเมื่อสินค้าถึงบ้าน
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
