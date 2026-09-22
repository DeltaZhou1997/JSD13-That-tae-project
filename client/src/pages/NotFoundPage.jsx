import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-inner">
        <span className="text-4xl font-bold text-amber-800">404</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2 font-serif">
        ไม่พบหน้าที่คุณกำลังค้นหา
      </h1>
      <p className="text-stone-600 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
        หน้านี้อาจถูกย้าย ลบ หรือที่อยู่ URL ไม่ถูกต้อง ลองกลับไปค้นหาเมนูอาหารเพื่อสุขภาพตามธาตุเจ้าเรือนที่คุณชื่นชอบได้ที่หน้าหลัก
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors shadow-sm"
        >
          กลับสู่หน้าแรก
        </Link>
        <Link
          to="/menus"
          className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm transition-colors"
        >
          ดูเมนูอาหารทั้งหมด
        </Link>
      </div>
    </div>
  );
}
