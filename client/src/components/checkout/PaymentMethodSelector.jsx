import React from "react";
import { PAYMENT_METHODS } from "../../constants/checkout";

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
  promptPayQrUrl,
  cardData,
  onCardInputChange,
}) {
  // สกัด Boolean Flag เพื่อให้โค้ดอ่านง่าย
  const isCreditCard = paymentMethod === PAYMENT_METHODS.CREDIT_CARD;

  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">💳</span>
        <h2 className="text-xl font-bold text-[#3d2c2e]">ช่องทางการชำระเงิน</h2>
      </div>

      <div className="space-y-3">
        {/* PromptPay */}
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
              ทดลองสแกนเพื่อชำระเงิน
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

        {/* Credit Card */}
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
            <div>
              <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                หมายเลขบัตร
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={cardData.cardNumber}
                onChange={onCardInputChange}
                className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                required={isCreditCard} // 🔗 required เฉพาะตอนเลือกบัตร
              />
            </div>
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
                required={isCreditCard} // 🔗 required เฉพาะตอนเลือกบัตร
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                  วันหมดอายุ (MM/YY)
                </label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={cardData.expiry}
                  onChange={onCardInputChange}
                  className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                  required={isCreditCard} // 🔗 required เฉพาะตอนเลือกบัตร
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                  รหัส CVC / CVV
                </label>
                <input
                  type="password"
                  name="cvc"
                  placeholder="123"
                  maxLength="4"
                  value={cardData.cvc}
                  onChange={onCardInputChange}
                  className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                  required={isCreditCard} // 🔗 required เฉพาะตอนเลือกบัตร
                />
              </div>
            </div>
          </div>
        )}

        {/* COD */}
        <label
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            paymentMethod === PAYMENT_METHODS.COD
              ? "border-[#8d593a] bg-[#f6ede5]"
              : "border-[#e8dfd1] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value={PAYMENT_METHODS.COD}
              checked={paymentMethod === PAYMENT_METHODS.COD}
              onChange={() => setPaymentMethod(PAYMENT_METHODS.COD)}
              className="accent-[#8d593a]"
            />
            <span className="font-semibold text-sm">เก็บเงินปลายทาง (COD)</span>
          </div>
          <span className="text-xs text-[#6f675f]">💵 เงินสด</span>
        </label>
      </div>
    </div>
  );
}
