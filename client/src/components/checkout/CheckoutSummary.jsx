import React from "react";
import { useNavigate } from "react-router-dom";
import { SHIPPING_FEE, PAYMENT_METHODS } from "../../constants/checkout";
import { REDEEM } from "../../constants/membership";

// เลือกจำนวนเบี้ยที่จะใช้ลดราคา: ขั้นต่ำ 10 เพิ่ม/ลดทีละ 10 หรือใช้ทั้งหมด
function PointsRedeemBox({ availablePoints, maxRedeem, pointsToRedeem, onChange, pointsDiscount }) {
  const step = REDEEM.STEP;
  const clamp = (n) => {
    const v = Math.floor((Number(n) || 0) / step) * step;
    return Math.max(0, Math.min(maxRedeem, v));
  };
  const canUse = maxRedeem >= REDEEM.MIN;

  return (
    <div className="mb-5 rounded-2xl border border-[#e8dfd1] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[#3d2c2e]">ใช้เบี้ยเป็นส่วนลด</p>
          <p className="text-[11px] text-[#6f675f]">
            มี {availablePoints.toLocaleString()} เบี้ย • {REDEEM.POINTS_PER_BAHT} เบี้ย = ฿1
          </p>
        </div>
        {canUse && (
          <button
            type="button"
            onClick={() => onChange(pointsToRedeem === maxRedeem ? 0 : maxRedeem)}
            className="shrink-0 rounded-full border border-[#8d593a] px-3 py-1 text-[11px] font-bold text-[#8d593a] hover:bg-[#f6ede5] transition-colors cursor-pointer"
          >
            {pointsToRedeem === maxRedeem ? "ไม่ใช้เบี้ย" : `ใช้ทั้งหมด (${maxRedeem.toLocaleString()})`}
          </button>
        )}
      </div>

      {canUse ? (
        <>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              aria-label="ลดเบี้ย 10"
              disabled={pointsToRedeem <= 0}
              onClick={() => onChange(clamp(pointsToRedeem - step))}
              className="h-9 w-9 shrink-0 rounded-full border border-[#d9cbbd] text-lg font-bold text-[#4c1f08] hover:bg-[#f1ead7] disabled:opacity-40 cursor-pointer"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={maxRedeem}
              step={step}
              value={pointsToRedeem}
              onChange={(e) => onChange(Math.max(0, Math.min(maxRedeem, Number(e.target.value) || 0)))}
              onBlur={(e) => onChange(clamp(e.target.value))}
              className="h-9 w-full min-w-0 rounded-xl border border-[#d9cbbd] px-3 text-center text-sm font-bold text-[#3d2c2e] focus:outline-none focus:ring-2 focus:ring-[#8d593a]/40"
            />
            <button
              type="button"
              aria-label="เพิ่มเบี้ย 10"
              disabled={pointsToRedeem >= maxRedeem}
              onClick={() => onChange(clamp(pointsToRedeem + step))}
              className="h-9 w-9 shrink-0 rounded-full border border-[#d9cbbd] text-lg font-bold text-[#4c1f08] hover:bg-[#f1ead7] disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#6f675f]">
            {pointsDiscount > 0
              ? `ลด ฿${pointsDiscount.toLocaleString()} • `
              : ""}
            ใช้ขั้นต่ำ {REDEEM.MIN} เพิ่มทีละ {step} เบี้ย (สูงสุด {maxRedeem.toLocaleString()} เบี้ย ไม่รวมค่าจัดส่ง)
          </p>
        </>
      ) : (
        <p className="mt-2 text-[11px] text-[#6f675f]">ต้องมีอย่างน้อย {REDEEM.MIN} เบี้ยจึงจะใช้เป็นส่วนลดได้</p>
      )}
    </div>
  );
}

export default function CheckoutSummary({
  cartItems = [],
  selectedPlan,
  itemsSubtotal,
  grandTotal,
  earnedPoints,
  availablePoints = 0,
  maxRedeem = 0,
  pointsToRedeem = 0,
  onPointsToRedeemChange = () => {},
  pointsDiscount = 0,
  canRedeem = false,
  totalKitsCount = 0,
  requiredKits = 0,
  kitsDifference = 0,
  isProcessingPayment = false,
  paymentMethod = "STRIPE",
}) {
  const navigate = useNavigate();

  // กำหนดข้อความปุ่มตาม paymentMethod
  const getSubmitButtonText = () => {
    if (isProcessingPayment) return "กำลังดำเนินการ...";
    if (selectedPlan && kitsDifference < 0) {
      return `เลือกเมนูให้ครบ ${requiredKits} ชุดก่อนชำระเงิน`;
    }
    switch (paymentMethod) {
      case PAYMENT_METHODS.COD:
        return "ยืนยันสั่งซื้อ (เก็บเงินปลายทาง)";
      case PAYMENT_METHODS.STRIPE:
        return "ไปหน้าชำระเงิน Stripe";
      case PAYMENT_METHODS.CREDIT_CARD:
        return "ชำระเงินด้วยบัตรเครดิต";
      case PAYMENT_METHODS.PROMPTPAY:
        return "ยืนยันชำระเงินผ่าน PromptPay";
      default:
        return "ชำระเงิน";
    }
  };

  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-xs sticky top-6">
      <div className="flex justify-between items-center border-b border-[#e8dfd1] pb-4 mb-4">
        <h2 className="text-xl font-bold text-[#3d2c2e]">สรุปคำสั่งซื้อ</h2>
        {selectedPlan ? (
          <span className="text-xs bg-[#3d2c2e] text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            {selectedPlan.name} ({selectedPlan.kitsPerWeek} Kits)
          </span>
        ) : (
          <span className="text-xs bg-[#8d593a] text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            A La Carte (รายชุด)
          </span>
        )}
      </div>

      {/* แจ้งเตือนสิทธิ์โควต้าเมนูอาหารเฉพาะกรณีเลือก Subscription Plan */}
      {selectedPlan && (
        <div className="mb-5">
          {kitsDifference === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 shrink-0">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="font-bold">เลือกเมนูครบตามแพ็กเกจแล้ว</p>
                <p className="text-[11px] opacity-80">
                  เลือกอาหารครบ {requiredKits}/{requiredKits} ชุดเรียบร้อย
                </p>
              </div>
            </div>
          )}

          {kitsDifference < 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-600">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  ในตะกร้ามี {totalKitsCount} ชุด (ขาดอีก {Math.abs(kitsDifference)} ชุด)
                </span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                แพ็กเกจ {selectedPlan.name} ให้สิทธิ์เลือกเมนูได้ {requiredKits} ชุด/สัปดาห์
              </p>
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>กลับไปจัดกล่องในตะกร้าให้ครบ</span>
              </button>
            </div>
          )}

          {kitsDifference > 0 && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>มีเมนูเสริมเกินแพ็กเกจ {kitsDifference} ชุด</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                เมนูส่วนเกินจะถูกแยกคำนวณเป็นราคา A La Carte เสริมอย่างถูกต้อง
              </p>
            </div>
          )}
        </div>
      )}

      {/* Render สินค้าในตะกร้า */}
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
        {cartItems.length === 0 ? (
          <p className="text-xs text-center text-[#6f675f] py-4">
            ไม่มีสินค้าในตะกร้า
          </p>
        ) : (
          cartItems.map((item, idx) => (
            <div
              key={item.id || item._id || idx}
              className="flex justify-between items-start text-xs border-b border-dashed border-[#e8dfd1] pb-3"
            >
              <div>
                <p className="font-bold text-[#2f2119]">{item.name || item.nameTh}</p>
                <p className="text-[#6f675f]">
                  {item.desc || `฿${(Number(item.price) || 0).toLocaleString()} / ชุด`}
                </p>
              </div>
              <div className="text-right ml-2 shrink-0">
                <span className="font-semibold block text-[#3d2c2e]">x{item.quantity}</span>
                <span className="text-[10px] text-[#8d593a] font-bold">
                  ฿{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ใช้เบี้ยลดราคา (เฉพาะสมาชิกที่ล็อกอิน) */}
      {canRedeem && (
        <PointsRedeemBox
          availablePoints={availablePoints}
          maxRedeem={maxRedeem}
          pointsToRedeem={pointsToRedeem}
          onChange={onPointsToRedeemChange}
          pointsDiscount={pointsDiscount}
        />
      )}

      {/* สรุปราคา */}
      <div className="space-y-2 text-sm text-[#6f675f] border-t border-[#e8dfd1] pt-4">
        <div className="flex justify-between">
          <span>มูลค่าสินค้า ({totalKitsCount} ชุด)</span>
          <span className="font-medium text-[#2f2119]">
            ฿{itemsSubtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>ค่าจัดส่ง (ควบคุมอุณหภูมิ)</span>
          <span className="font-medium text-[#2f2119]">฿{SHIPPING_FEE}</span>
        </div>
        {pointsDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>ส่วนลดจากเบี้ย ({(pointsDiscount * REDEEM.POINTS_PER_BAHT).toLocaleString()} เบี้ย)</span>
            <span className="font-medium">-฿{pointsDiscount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#3d2c2e]/20 pt-4 mt-4 flex justify-between items-baseline">
        <span className="font-bold text-[#3d2c2e] text-base">ยอดชำระสุทธิ</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#8d593a]">
            ฿{grandTotal.toLocaleString()}
          </span>
          <span className="text-xs text-[#6f675f] ml-1">THB</span>
        </div>
      </div>

      {/* สิทธิ์แต้มสะสม */}
      {earnedPoints > 0 ? (
        <div className="mt-3 bg-[#f6ede5] p-2.5 rounded-xl text-center text-xs text-[#8d593a] font-semibold flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8d593a]">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <span>คุณจะได้รับ +{earnedPoints.toLocaleString()} เบี้ยหลังชำระเงินสำเร็จ</span>
        </div>
      ) : (
        <div className="mt-3 bg-[#f6ede5] p-2.5 rounded-xl text-center text-xs text-[#8d593a] font-semibold flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8d593a]">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>ทุก ๆ ฿10 ได้รับ 1 เบี้ย • กล่องแพ็กเกจยิ่งใหญ่ยิ่งได้เบี้ยคุ้ม</span>
        </div>
      )}

      {/* ปุ่มกดสั่งซื้อ */}
      <button
        type="submit"
        disabled={
          cartItems.length === 0 ||
          (selectedPlan && kitsDifference < 0) ||
          isProcessingPayment
        }
        className="w-full mt-6 bg-[#3d2c2e] text-white py-4 rounded-full font-bold hover:bg-[#8d593a] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>{getSubmitButtonText()}</span>
        {!isProcessingPayment && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>

      <p className="text-[10px] text-center text-[#6f675f] mt-3">
        การกดปุ่มชำระเงินถือว่าท่านยอมรับ{" "}
        <a href="#terms" className="underline hover:text-[#3d2c2e]">
          เงื่อนไขการให้บริการ
        </a>{" "}
        ของธาตุแท้
      </p>
    </div>
  );
}
