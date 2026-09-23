import React from "react";
import { formatDate } from "../../utils/dateFormatter.js";

// แมปชื่อ paymentMethod ให้เป็นภาษาไทยที่อ่านง่าย
const PAYMENT_METHOD_LABELS = {
  PROMPTPAY: "สแกน QR Code พร้อมเพย์",
  CREDIT_CARD: "บัตรเครดิต / เดบิต",
  COD: "เก็บเงินปลายทาง (เงินสด / สแกนโอน)",
};

export default function OrderDetailsCard({ orderData }) {
  const {
    orderId,
    createdAt,
    deliveryDate,
    shippingAddress,
    grandTotal,
    pricing,
    paymentMethod,
    isFallbackPayment,
  } = orderData;

  // รองรับการรับค่าทั้งจาก orderData.grandTotal และ orderData.pricing.grandTotal
  const finalTotal = grandTotal || pricing?.grandTotal || 0;

  // รองรับชื่อผู้รับ และที่อยู่ทั้ง 2 Format
  const recipientName =
    shippingAddress?.recipientName || shippingAddress?.fullName || "-";
  const recipientPhone = shippingAddress?.phone || "-";
  const fullAddress =
    shippingAddress?.fullAddress || shippingAddress?.address || "-";
  const shipDate =
    deliveryDate || shippingAddress?.deliveryDate || "รอบจัดส่งถัดไป";

  // เช็คเงื่อนไขสถานะการจ่ายเงิน
  const isCOD = paymentMethod === "COD";
  const isFallback = isFallbackPayment === true;
  const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

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
        <span
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${
            isFallback
              ? "bg-sky-100 text-sky-800"
              : isCOD
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isFallback
            ? "⏳ รอเจ้าหน้าที่ตรวจสอบยอดเงิน"
            : isCOD
              ? "⏳ รอเก็บเงินปลายทาง"
              : "✅ ชำระแล้ว"}
        </span>
      </div>

      {/* รอบการจัดส่ง */}
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">รอบการจัดส่ง:</span>
        <span className="font-bold text-[#8d593a]">
          วันที่ {shipDate} (จัดส่งช่วงเช้า)
        </span>
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

      {/* ยอดชำระสุทธิ */}
      <div className="flex justify-between pt-1">
        <span className="text-sm font-bold text-[#3d2c2e]">
          {isCOD ? "ยอดเก็บเงินปลายทาง:" : "ยอดชำระสุทธิ:"}
        </span>
        <span className="text-base font-bold text-[#8d593a]">
          ฿{finalTotal.toLocaleString()} THB
        </span>
      </div>
    </div>
  );
}
