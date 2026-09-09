import React from "react";

export default function RandomResultCard({ dish }) {
  if (!dish) return null;

  return (
    <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EBE5DF] text-left">
      {/* ภาพประกอบเมนู (ถ้ามี) */}
      {(dish.image || dish.imgUrl || dish.imageUrl) && (
        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-white border border-[#EBE5DF]">
          <img
            src={dish.image || dish.imgUrl || dish.imageUrl}
            alt={dish.name || dish.nameTh}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header: หมวดหมู่ธาตุ + ราคา */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold text-[#8C7B73] bg-[#EFEBE4] px-2.5 py-0.5 rounded-full">
          {dish.category || "เมนูแนะนำตามธาตุ"}
        </span>
        <span className="text-lg font-extrabold text-[#3D2E2B]">
          ฿{dish.price || dish.priceThb || 0}
        </span>
      </div>

      {/* ชื่อเมนู + คำอธิบาย */}
      <h3 className="text-xl font-bold text-[#3D2E2B] mb-1">
        {dish.name || dish.nameTh || "เมนูอาหาร"}
      </h3>

      <p className="text-xs text-[#63534B] leading-relaxed line-clamp-3">
        {dish.description ||
          dish.desc ||
          "เมนูอร่อยที่เหมาะสำหรับปรับสมดุลมื้อนี้ของคุณ"}
      </p>
    </div>
  );
}
