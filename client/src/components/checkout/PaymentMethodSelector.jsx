import React, { useState } from "react";
import { PAYMENT_METHODS } from "../../constants/checkout";
import { CardElement } from "@stripe/react-stripe-js";

// ========================================================================
// 💳 PaymentMethodSelector — Component เลือกวิธีการชำระเงิน
// ========================================================================
// อธิบาย: Component นี้ให้ลูกค้าเลือก 3 ช่องทางชำระเงิน:
//   1. PromptPay — แสดง QR Code (มี 2 โหมด: QR เดิม หรือ Stripe PromptPay)
//   2. บัตรเครดิต/เดบิต — ใช้ Stripe CardElement (ปลอดภัย)
//   3. เก็บเงินปลายทาง (COD) — ไม่ต้องกรอกข้อมูลชำระเงิน
//
// สิ่งที่เปลี่ยน:
//   - ช่องกรอกบัตรเครดิตเดิม (input ธรรมดา) → แทนที่ด้วย Stripe CardElement
//     Stripe CardElement คือ iframe ที่ Stripe สร้างให้ เลขบัตรจริง
//     ไม่เคยผ่าน Server ของเรา ปลอดภัยตามมาตรฐาน PCI DSS
//   - เพิ่มข้อความอธิบายสำหรับ COD
// ========================================================================

// Style สำหรับ Stripe CardElement ให้เข้ากับ Theme ของเว็บ "ธาตุแท้"
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "#2f2119",
      fontFamily: '"Noto Sans Thai", sans-serif',
      "::placeholder": {
        color: "#a89f95",
      },
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
  hidePostalCode: true, // ซ่อน Zip Code เพราะเรามีในฟอร์มที่อยู่แล้ว
};

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
  promptPayQrUrl,
  cardData,
  onCardInputChange,
}) {
  // สถานะ Error จาก Stripe CardElement
  const [cardError, setCardError] = useState(null);

  // สกัด Boolean Flag เพื่อให้โค้ดอ่านง่าย
  const isCreditCard = paymentMethod === PAYMENT_METHODS.CREDIT_CARD;
  const isCOD = paymentMethod === PAYMENT_METHODS.COD;

  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">💳</span>
        <h2 className="text-xl font-bold text-[#3d2c2e]">ช่องทางการชำระเงิน</h2>
      </div>

      <div className="space-y-3">
        {/* ==================== PromptPay ==================== */}
        <label
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            paymentMethod === PAYMENT_METHODS.PROMPTPAY
              ? "border-[#8d593a] bg-[#f6ede5]"
              : "border-[#e8dfd1] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value={PAYMENT_METHODS.PROMPTPAY}
              checked={paymentMethod === PAYMENT_METHODS.PROMPTPAY}
              onChange={() => setPaymentMethod(PAYMENT_METHODS.PROMPTPAY)}
              className="accent-[#8d593a]"
            />
            <span className="font-semibold text-sm">
              สแกน QR Code พร้อมเพย์
            </span>
          </div>
          <span className="text-xs bg-[#8d593a]/10 text-[#8d593a] px-2 py-1 rounded font-bold">
            PromptPay
          </span>
        </label>

        {paymentMethod === PAYMENT_METHODS.PROMPTPAY && (
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
            <p className="text-[10px] text-[#a89f95] mt-1">
              ระบบชำระเงินผ่าน Stripe Payment Gateway (Test Mode)
            </p>
          </div>
        )}

        {/* ==================== Credit Card (Stripe) ==================== */}
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
              className="accent-[#8d593a]"
            />
            <span className="font-semibold text-sm">บัตรเครดิต / เดบิต</span>
          </div>
          <span className="text-xs text-[#6f675f]">💳 Visa / Mastercard</span>
        </label>

        {isCreditCard && (
          <div className="p-5 bg-white border border-[#e8dfd1] rounded-2xl space-y-4 my-2">
            {/* ============================================================ */}
            {/* Stripe CardElement                                           */}
            {/* ============================================================ */}
            {/* อธิบาย: CardElement คือ "secure iframe" ที่ Stripe สร้างให้   */}
            {/* ข้อมูลบัตรเครดิตจะถูกเก็บใน iframe ของ Stripe                 */}
            {/* ไม่เคยผ่าน Server ของเรา → ปลอดภัยตามมาตรฐาน PCI DSS         */}
            {/* ============================================================ */}
            <div>
              <label className="block text-xs font-semibold text-[#6f675f] mb-2">
                ข้อมูลบัตรเครดิต / เดบิต
              </label>
              <div className="bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-3">
                <CardElement
                  options={CARD_ELEMENT_OPTIONS}
                  onChange={(event) => {
                    if (event.error) {
                      setCardError(event.error.message);
                    } else {
                      setCardError(null);
                    }
                  }}
                />
              </div>
              {cardError && (
                <p className="text-xs text-red-600 mt-1.5">⚠️ {cardError}</p>
              )}
            </div>

            {/* ข้อมูลเพิ่มเติม: ชื่อบนบัตร (เก็บไว้เพื่อแสดงผลเท่านั้น) */}
            <div>
              <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                ชื่อบนบัตร
              </label>
              <input
                type="text"
                name="cardName"
                placeholder="NATCHA SOOKJAI"
                value={cardData.cardName}
                onChange={onCardInputChange}
                className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[#a89f95]">🔒</span>
              <p className="text-[10px] text-[#a89f95]">
                ข้อมูลบัตรถูกเข้ารหัสและส่งตรงถึง Stripe อย่างปลอดภัย —
                ไม่ผ่านเซิร์ฟเวอร์ของเรา
              </p>
            </div>

            {/* บัตรทดสอบ Stripe — แนะนำให้ครูและนักเรียนใช้ทดลอง */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-[10px] text-blue-700 font-bold mb-1">
                🧪 บัตรทดสอบ (Stripe Test Mode):
              </p>
              <p className="text-[10px] text-blue-600 font-mono">
                เลขบัตร: 4242 4242 4242 4242
              </p>
              <p className="text-[10px] text-blue-600 font-mono">
                วันหมดอายุ: 12/34 &nbsp;|&nbsp; CVC: 123
              </p>
            </div>
          </div>
        )}

        {/* ==================== COD (เก็บเงินปลายทาง) ==================== */}
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
              className="accent-[#8d593a]"
            />
            <span className="font-semibold text-sm">เก็บเงินปลายทาง (COD)</span>
          </div>
          <span className="text-xs text-[#6f675f]">💵 เงินสด</span>
        </label>

        {/* ข้อความแจ้งเตือนสำหรับ COD */}
        {isCOD && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl my-2">
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">💵</span>
              <div>
                <p className="text-sm font-bold text-amber-800">
                  ชำระเงินสดเมื่อรับสินค้า
                </p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  กรุณาเตรียมเงินสดให้พร้อมเมื่อพนักงานจัดส่งนำสินค้ามาส่ง
                  พนักงานจะเก็บเงินตามยอดที่แสดงในสรุปคำสั่งซื้อ
                </p>
                <p className="text-[10px] text-amber-600 mt-2">
                  หมายเหตุ: หากไม่มีผู้รับสินค้าหรือไม่สามารถชำระเงินได้
                  สินค้าจะถูกส่งคืนคลังสินค้า
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
