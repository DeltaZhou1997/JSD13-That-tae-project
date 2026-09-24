import React from "react";
import { formatDate } from "../../utils/dateFormatter.js";

// แมปชื่อ paymentMethod ให้เป็นภาษาไทยที่อ่านง่าย
// ช่องทางจริงที่จ่ายผ่าน Stripe (บันทึกตอนยืนยันการชำระเงิน)
const PAYMENT_CHANNEL_LABELS = {
  card: "บัตรเครดิต / เดบิต",
  promptpay: "ThaiQR PromptPay",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
};

const PAYMENT_METHOD_LABELS = {
  STRIPE: "ชำระผ่าน Stripe (PromptPay / บัตร / Wallet)",
  PROMPTPAY: "สแกน QR Code พร้อมเพย์",
  CREDIT_CARD: "บัตรเครดิต / เดบิต",
  COD: "เก็บเงินปลายทาง (เงินสด / สแกนโอน)",
};

export default function OrderDetailsCard({ orderData }) {
  const {
    orderId,
    createdAt,
    shippingAddress = {},
    items = [],
    planDetails,
    itemsSubtotal = 0,
    shippingFee = 0,
    pointsDiscount = 0,
    pointsRedeemed = 0,
    grandTotal = 0,
    paymentMethod,
    paymentStatus,
    paymentChannel,
  } = orderData;

  // ข้อมูลจริงจากคำสั่งซื้อใน DB
  const recipientName =
    shippingAddress.fullName || `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}`.trim() || "-";
  const recipientPhone = shippingAddress.phone || "-";
  const fullAddress =
    [shippingAddress.address, shippingAddress.subdistrict, shippingAddress.district, shippingAddress.province, shippingAddress.zipcode]
      .filter(Boolean)
      .join(" ") || "-";
  const shipDate = shippingAddress.deliveryDate ? `วันที่ ${shippingAddress.deliveryDate}` : "รอบจัดส่งถัดไป";

  const isCOD = paymentMethod === "COD";
  const isPaid = paymentStatus === "PAID";
  const channelLabel = PAYMENT_CHANNEL_LABELS[paymentChannel];
  const paymentLabel = channelLabel
    ? `${PAYMENT_METHOD_LABELS[paymentMethod] ? "Stripe — " : ""}${channelLabel}`
    : PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || "-";
  const statusBadge = isPaid
    ? { cls: "bg-emerald-100 text-emerald-700", text: "✅ ชำระแล้ว" }
    : isCOD
      ? { cls: "bg-amber-100 text-amber-700", text: "⏳ รอเก็บเงินปลายทาง" }
      : paymentStatus === "FAILED"
        ? { cls: "bg-rose-100 text-rose-700", text: "✕ ชำระไม่สำเร็จ" }
        : { cls: "bg-sky-100 text-sky-800", text: "⏳ รอยืนยันการชำระเงิน" };

  return (
    <div className="bg-white border border-[#e8dfd1] rounded-2xl p-5 text-left text-xs space-y-3 mb-8">
      {/* หมายเลขคำสั่งซื้อ */}
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">หมายเลขคำสั่งซื้อ:</span>
        <span className="font-bold text-[#3d2c2e]">{orderId}</span>
      </div>

      {/* วันที่สั่งซื้อ */}
      {createdAt && (
        <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
          <span className="text-[#6f675f]">วันที่สั่งซื้อ:</span>
          <span className="font-medium text-[#2f2119]">{formatDate(createdAt)}</span>
        </div>
      )}

      {/* ช่องทางชำระเงิน */}
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ช่องทางชำระเงิน:</span>
        <span className="font-medium text-[#2f2119]">{paymentLabel}</span>
      </div>

      {/* สถานะการชำระเงิน (Badge เปลี่ยนสีตามเคส) */}
      <div className="flex justify-between items-center border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">สถานะชำระเงิน:</span>
        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${statusBadge.cls}`}>
          {statusBadge.text}
        </span>
      </div>

      {/* รอบการจัดส่ง */}
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">รอบการจัดส่ง:</span>
        <span className="font-bold text-[#8d593a]">{shipDate}</span>
      </div>

      {/* ผู้รับ */}
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ผู้รับ:</span>
        <span className="font-medium text-[#2f2119]">
          {recipientName} ({recipientPhone})
        </span>
      </div>

      {/* ที่อยู่จัดส่ง */}
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ที่อยู่จัดส่ง:</span>
        <span className="font-medium text-[#2f2119] text-right max-w-[60%]">
          {fullAddress}
        </span>
      </div>

      {/* รายการสินค้า */}
      <div className="border-b border-[#e8dfd1] pb-2">
        <p className="text-[#6f675f] mb-1.5">
          รายการ{planDetails?.planName ? ` (แพ็กเกจ ${planDetails.planName})` : ""}:
        </p>
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={`${item.productId}-${i}`} className="flex justify-between gap-3">
              <span className="text-[#2f2119]">{item.productName}</span>
              <span className="shrink-0 text-[#6f675f]">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* สรุปยอด */}
      <div className="space-y-1 border-b border-[#e8dfd1] pb-2 text-[#6f675f]">
        <div className="flex justify-between">
          <span>ค่าสินค้า</span>
          <span className="text-[#2f2119]">฿{Number(itemsSubtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>ค่าจัดส่ง</span>
          <span className="text-[#2f2119]">฿{Number(shippingFee).toLocaleString()}</span>
        </div>
        {pointsDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>ส่วนลดจากเบี้ย ({Number(pointsRedeemed).toLocaleString()} เบี้ย)</span>
            <span>-฿{Number(pointsDiscount).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* ยอดชำระสุทธิ */}
      <div className="flex justify-between pt-1">
        <span className="text-sm font-bold text-[#3d2c2e]">
          {isCOD ? "ยอดเก็บเงินปลายทาง:" : "ยอดชำระสุทธิ:"}
        </span>
        <span className="text-base font-bold text-[#8d593a]">
          ฿{Number(grandTotal).toLocaleString()} THB
        </span>
      </div>
    </div>
  );
}
