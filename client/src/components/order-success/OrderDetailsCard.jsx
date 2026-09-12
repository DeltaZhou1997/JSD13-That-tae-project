import React from "react";

export default function OrderDetailsCard({ orderData }) {
  // 📌 [จุดที่จะต้องเปลี่ยน/สังเกต]: ดึงข้อมูลรองรับทั้งตัวแปร Payload จริง และ Mock Data
  // ตรงนี้รองรับทั้งข้อมูล Mockup ที่เราลองรันตอนนี้ และรองรับข้อมูลจริงจากหลังบ้าน (Backend) ในอนาคต
  const { orderId, deliveryDate, shippingAddress, grandTotal, pricing } =
    orderData;

  // 🟢 รองรับการรับค่าทั้งจาก orderData.grandTotal และ orderData.pricing.grandTotal
  const finalTotal = grandTotal || pricing?.grandTotal || 0;

  // 🟢 รองรับชื่อผู้รับ และที่อยู่ทั้ง 2 Format
  const recipientName =
    shippingAddress?.recipientName || shippingAddress?.fullName || "-";
  const recipientPhone = shippingAddress?.phone || "-";
  const fullAddress =
    shippingAddress?.fullAddress || shippingAddress?.address || "-";
  const shipDate =
    deliveryDate || shippingAddress?.deliveryDate || "รอบจัดส่งถัดไป";

  return (
    <div className="bg-white border border-[#e8dfd1] rounded-2xl p-5 text-left text-xs space-y-3 mb-8">
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">หมายเลขคำสั่งซื้อ:</span>
        <span className="font-bold text-[#3d2c2e]">{orderId}</span>
      </div>
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">รอบการจัดส่ง:</span>
        <span className="font-bold text-[#8d593a]">
          วันที่ {shipDate} (จัดส่งช่วงเช้า)
        </span>
      </div>
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ผู้รับ:</span>
        <span className="font-medium text-[#2f2119]">
          {recipientName} ({recipientPhone})
        </span>
      </div>
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ที่อยู่จัดส่ง:</span>
        <span className="font-medium text-[#2f2119] text-right max-w-[60%]">
          {fullAddress}
        </span>
      </div>
      <div className="flex justify-between pt-1">
        <span className="text-sm font-bold text-[#3d2c2e]">ยอดชำระสุทธิ:</span>
        <span className="text-base font-bold text-[#8d593a]">
          ฿{finalTotal.toLocaleString()} THB
        </span>
      </div>
    </div>
  );
}
