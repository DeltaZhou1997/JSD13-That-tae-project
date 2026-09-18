import React from "react";
import { Link } from "react-router-dom";

export default function RandomResultCard({ dish }) {
  if (!dish) return null;

  const rawImg =
    dish.image ||
    dish.imgUrl ||
    (Array.isArray(dish.imageUrl) ? dish.imageUrl[0] : dish.imageUrl) ||
    (Array.isArray(dish.images) ? dish.images[0] : dish.images);

  const imageUrl =
    typeof rawImg === "string" && rawImg.startsWith("file://")
      ? rawImg.replace(/^file:\/\/\/.*?assets\//, "/assets/")
      : rawImg ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  const dishId = dish._id || dish.id;
  const regionName = dish.regionNameTh || dish.region || "";
  const dominantElement = dish.dominantElement || dish.element;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#ebe4dc] text-left shadow-sm">
      {/* ภาพประกอบเมนู */}
      <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-[#faf8f5] border border-[#ebe4dc] relative group">
        <img
          src={imageUrl}
          alt={dish.nameTh || dish.name || "เมนูอาหาร"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            const fallback =
              (dish.images && dish.images[1]) ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            e.currentTarget.src = fallback;
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(regionName || dominantElement) && (
          <div className="absolute top-2.5 left-2.5 bg-[#2c1e16]/80 backdrop-blur-xs text-[#faf8f5] text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
            {regionName && <span>{regionName}</span>}
            {dominantElement && (
              <span className="text-[#e2b887]">
                {regionName ? "• " : ""}ธาตุ{dominantElement}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Header: หมวดหมู่ธาตุ + ราคา */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-[#8b5e34] bg-[#f4ebd9] px-2.5 py-0.5 rounded-full">
          {dish.category || "Cooking Kit เมนูท้องถิ่น"}
        </span>
        <span className="text-xl font-bold text-[#8b5e34]">
          ฿{dish.price || dish.priceThb || 0}
        </span>
      </div>

      {/* ชื่อเมนู + คำอธิบาย */}
      <h3 className="text-lg font-bold text-stone-900 mb-1">
        {dish.nameTh || dish.name || "เมนูอาหาร"}
      </h3>
      {dish.nameEn && (
        <p className="text-xs text-stone-400 font-medium -mt-0.5 mb-2">
          {dish.nameEn}
        </p>
      )}

      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-3">
        {dish.description ||
          dish.desc ||
          "ชุดทำอาหารท้องถิ่น คัดสรรวัตถุดิบคุณภาพพร้อมปรุง ปรับสมดุลธาตุอย่างลงตัว"}
      </p>

      {/* ลิงก์ดูรายละเอียดเมนู */}
      {dishId && (
        <div className="pt-2 border-t border-[#f0eae1] flex justify-end">
          <Link
            to={`/menus/${dishId}`}
            className="text-xs text-[#8b5e34] hover:text-[#704924] font-medium inline-flex items-center gap-1"
          >
            <span>ดูสูตรและโภชนาการ</span>
            <span>&rarr;</span>
          </Link>
        </div>
      )}
    </div>
  );
}

