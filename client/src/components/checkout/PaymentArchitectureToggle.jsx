import React from "react";

export default function PaymentArchitectureToggle({
  paymentVersion,
  onToggleVersion,
}) {
  return (
    /* ลอยตัวอยู่มุมล่างขวา (fixed bottom-5 right-5) ขนาดเล็กกะทัดรัด ไม่บังเนื้อหา */
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-[#e8dfd1] p-1.5 rounded-full shadow-lg hover:shadow-xl transition-all">
      <button
        type="button"
        onClick={() => onToggleVersion("v2")}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
          paymentVersion === "v2"
            ? "bg-[#8d593a] text-white shadow-xs"
            : "text-[#6f675f] hover:text-[#3d2c2e]"
        }`}
        title="สลับเป็นโหมด v2: Stripe Hosted Checkout"
      >
        <span>v2 (Stripe)</span>
      </button>

      <button
        type="button"
        onClick={() => onToggleVersion("v1")}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
          paymentVersion === "v1"
            ? "bg-[#3d2c2e] text-white shadow-xs"
            : "text-[#6f675f] hover:text-[#3d2c2e]"
        }`}
        title="สลับเป็นโหมด v1: In-App Checkout"
      >
        <span>v1 (In-App)</span>
      </button>
    </div>
  );
}
