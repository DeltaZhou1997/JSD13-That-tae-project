import React from "react";
import { Link } from "react-router-dom";

const ELEMENT_CONFIG = {
  'ดิน': {
    th: 'ธาตุดิน',
    badgeClass: 'bg-amber-100/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    iconColor: 'text-amber-700 dark:text-amber-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  'น้ำ': {
    th: 'ธาตุน้ำ',
    badgeClass: 'bg-blue-100/95 dark:bg-blue-950/90 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    iconColor: 'text-blue-700 dark:text-blue-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  'ลม': {
    th: 'ธาตุลม',
    badgeClass: 'bg-emerald-100/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
  },
  'ไฟ': {
    th: 'ธาตุไฟ',
    badgeClass: 'bg-rose-100/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    iconColor: 'text-rose-700 dark:text-rose-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
};

const ELEMENT_MAP = {
  earth: 'ดิน',
  water: 'น้ำ',
  air: 'ลม',
  wind: 'ลม',
  fire: 'ไฟ',
  ดิน: 'ดิน',
  น้ำ: 'น้ำ',
  ลม: 'ลม',
  ไฟ: 'ไฟ',
};

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
  const rawElement = (dish.dominantElement || dish.element || '').trim();
  const normalizedElement = ELEMENT_MAP[rawElement.toLowerCase()] || rawElement;
  const elConfig = ELEMENT_CONFIG[normalizedElement] || null;

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#ebe4dc] text-left shadow-xs">
      {/* ภาพประกอบเมนู */}
      <div className="w-full h-36 sm:h-44 mb-3 rounded-xl overflow-hidden bg-[#faf8f5] border border-[#ebe4dc] relative group">
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
        {/* Badges ขอบเมนู: แยกภูมิภาค และ ธาตุพร้อมโลโก้และสี Fill เด่นชัด อ่านง่าย */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap pointer-events-none">
          {regionName && (
            <span className="backdrop-blur-md bg-black/60 text-white border border-white/20 rounded-full px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium shadow-sm select-none">
              {regionName}
            </span>
          )}
          {elConfig && (
            <span className={`backdrop-blur-md rounded-full px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 shadow-sm border select-none transition-transform duration-200 group-hover:scale-105 ${elConfig.badgeClass}`}>
              <span className="shrink-0">{elConfig.svg}</span>
              <span>{elConfig.th}</span>
            </span>
          )}
        </div>
      </div>

      {/* Header: หมวดหมู่ธาตุ + ราคา */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] sm:text-xs font-semibold text-[#8b5e34] bg-[#f4ebd9] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#e8dfd1]">
          {dish.category || "Cooking Kit เมนูท้องถิ่น"}
        </span>
        <span className="text-lg sm:text-xl font-black text-[#8b5e34]">
          ฿{dish.price || dish.priceThb || 0}
        </span>
      </div>

      {/* ชื่อเมนู + คำอธิบาย */}
      <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-0.5 leading-snug">
        {dish.nameTh || dish.name || "เมนูอาหาร"}
      </h3>
      {dish.nameEn && (
        <p className="text-[11px] sm:text-xs text-stone-400 font-medium -mt-0.5 mb-1.5 truncate">
          {dish.nameEn}
        </p>
      )}

      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-2">
        {dish.description ||
          dish.desc ||
          "ชุดทำอาหารท้องถิ่น คัดสรรวัตถุดิบคุณภาพพร้อมปรุง ปรับสมดุลธาตุอย่างลงตัว"}
      </p>

      {/* ลิงก์ดูรายละเอียดเมนู (ใช้ SVG arrow แทน &rarr;) */}
      {dishId && (
        <div className="pt-2 border-t border-[#f0eae1] flex justify-end">
          <Link
            to={`/menus/${dishId}`}
            className="text-xs text-[#8b5e34] hover:text-[#704924] font-bold inline-flex items-center gap-1.5 group"
          >
            <span>ดูสูตรและโภชนาการ</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
