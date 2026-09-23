import React from "react";
import { PAYMENT_METHODS } from "../../constants/checkout";

// ป้ายช่องทางที่ Stripe Checkout รองรับ (แสดงในหน้า Stripe ตามอุปกรณ์/เบราว์เซอร์ของลูกค้า)
const STRIPE_CHANNELS = ["ThaiQR PromptPay", "Visa", "Mastercard", "JCB", "Apple Pay", "Google Pay"];

function OptionCard({ checked, onSelect, title, subtitle, badge, children }) {
  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 ${
        checked ? "border-[#3d2c2e] bg-white shadow-md" : "border-[#e8dfd1] bg-white/70 hover:border-[#c9b6a4]"
      }`}
    >
      <label className="flex cursor-pointer items-start justify-between gap-3 p-4">
        <span className="flex items-start gap-3">
          <input
            type="radio"
            name="paymentMethod"
            checked={checked}
            onChange={onSelect}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#3d2c2e]"
          />
          <span>
            <span className="block text-sm font-bold text-[#3d2c2e]">{title}</span>
            {subtitle && <span className="mt-0.5 block text-xs text-[#6f675f]">{subtitle}</span>}
          </span>
        </span>
        {badge}
      </label>
      {checked && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod, paymentError }) {
  const isCOD = paymentMethod === PAYMENT_METHODS.COD;
  const isStripe = !isCOD;

  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3d2c2e] text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
            <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
            <path strokeLinecap="round" d="M2.5 10h19M6.5 15h4" />
          </svg>
        </span>
        <h2 className="text-xl font-bold text-[#3d2c2e]">ช่องทางการชำระเงิน</h2>
      </div>

      <div className="space-y-3">
        {/* 1. Stripe: ThaiQR PromptPay + บัตรเดบิต/เครดิต + Apple Pay / Google Pay */}
        <OptionCard
          checked={isStripe}
          onSelect={() => setPaymentMethod(PAYMENT_METHODS.STRIPE)}
          title="ชำระผ่าน Stripe ที่รองรับ ThaiQR PromptPay - Debit - Credit"
          subtitle="เลือกช่องทางที่สะดวกในหน้าชำระเงินของ Stripe"
          badge={
            <span className="shrink-0 rounded-full bg-[#635bff]/10 px-2.5 py-1 text-[11px] font-bold text-[#635bff]">
              Stripe
            </span>
          }
        >
          <div className="flex flex-wrap gap-1.5">
            {STRIPE_CHANNELS.map((c) => (
              <span key={c} className="rounded-full border border-[#e8dfd1] bg-[#fcf8f2] px-2.5 py-1 text-[11px] font-semibold text-[#6f675f]">
                {c}
              </span>
            ))}
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>
              กดยืนยันแล้วระบบจะพาไปหน้าชำระเงินที่ปลอดภัยของ Stripe (PCI-DSS) — สแกน QR พร้อมเพย์ด้วยแอปธนาคาร
              หรือใช้บัตร / Apple Pay / Google Pay เมื่อชำระสำเร็จจะกลับมาที่หน้าคำสั่งซื้อสำเร็จอัตโนมัติ
            </span>
          </p>
          {import.meta.env.DEV && (
            <p className="mt-2 text-[11px] text-stone-500">
              โหมดทดสอบ: ใช้บัตร <code className="rounded bg-stone-100 px-1 font-mono">4242 4242 4242 4242</code> วันหมดอายุใดก็ได้ในอนาคต
            </p>
          )}
        </OptionCard>

        {/* 2. เก็บเงินปลายทาง */}
        <OptionCard
          checked={isCOD}
          onSelect={() => setPaymentMethod(PAYMENT_METHODS.COD)}
          title="เก็บเงินปลายทาง (COD)"
          subtitle="จ่ายเงินสดหรือสแกนจ่ายกับพนักงานจัดส่ง"
        >
          <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            เตรียม<strong>เงินสด</strong>ให้พอดี หรือ<strong>สแกน QR Code</strong>โอนผ่าน Mobile Banking กับพนักงานได้เมื่อสินค้าถึงบ้าน
          </p>
        </OptionCard>
      </div>

      {paymentError && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {paymentError}
        </p>
      )}
    </div>
  );
}
