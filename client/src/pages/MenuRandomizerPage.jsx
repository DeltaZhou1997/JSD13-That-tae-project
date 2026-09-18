import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import ElementSelector from "../components/menu-randomizer/ElementSelector.jsx";
import RandomResultCard from "../components/menu-randomizer/RandomResultCard.jsx";
import { useProducts } from "../context/ProductsContext.js";
import { dishes } from "../mock-data/index.js";

const ELEMENT_MAP = {
  earth: ["ดิน", "earth"],
  water: ["น้ำ", "water"],
  air: ["ลม", "wind", "air"],
  fire: ["ไฟ", "fire"],
};

export default function MenuRandomizerPage() {
  const outletContext = useOutletContext() || {};
  const contextAddToCart = outletContext.handleAddToCart;
  const { products } = useProducts();

  const [selectedElement, setSelectedElement] = useState("earth");
  const [currentDish, setCurrentDish] = useState(null);

  // modalState: 'IDLE' | 'SPINNING' | 'RESULT'
  const [modalState, setModalState] = useState("IDLE");
  const timeoutRef = useRef(null);

  const handleRandomize = () => {
    if (modalState === "SPINNING") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const sourceList =
      products && products.length > 0
        ? products
        : Array.isArray(dishes)
          ? dishes
          : Object.values(dishes || {});

    if (sourceList.length === 0) return;

    // กรองเมนูตามธาตุ
    const allowed = ELEMENT_MAP[selectedElement] || [selectedElement];
    const filteredDishes = sourceList.filter((dish) => {
      if (!dish) return false;

      const dom = (dish.dominantElement || dish.element || "").toLowerCase();
      const domEn = (dish.dominantElementEn || "").toLowerCase();
      if (allowed.includes(dom) || allowed.includes(domEn)) return true;

      if (Array.isArray(dish.elementSuitability)) {
        if (dish.elementSuitability.some((e) => allowed.includes(String(e).toLowerCase()))) {
          return true;
        }
      }
      if (Array.isArray(dish.elementSuitabilityEn)) {
        if (dish.elementSuitabilityEn.some((e) => allowed.includes(String(e).toLowerCase()))) {
          return true;
        }
      }

      return false;
    });

    const targetList = filteredDishes.length > 0 ? filteredDishes : sourceList;

    // 1. สุ่มเมนู
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const selectedDish = targetList[randomIndex];

    // 2. แสดง Modal หน้ากำลังสุ่ม (Loading Animation)
    setModalState("SPINNING");

    // 3. หน่วงเวลา 1.2 วินาทีเพื่อให้เห็น Animation แล้วแสดงผลลัพธ์
    timeoutRef.current = setTimeout(() => {
      setCurrentDish(selectedDish);
      setModalState("RESULT");
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddToCart = (dish) => {
    if (!dish) return;

    if (contextAddToCart) {
      contextAddToCart(dish, 1);
    }
    setModalState("IDLE");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4 flex flex-col items-center justify-center">
      {/* หน้าหลักเมนูสุ่ม */}
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#ebe4dc] text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8b5e34] tracking-widest uppercase mb-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-[#8b5e34]"
            aria-hidden="true"
          >
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
          </svg>
          <span>MENU RANDOMIZER</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-[#8b5e34]"
            aria-hidden="true"
          >
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
          </svg>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          วันนี้ทานอะไรดีนะ?
        </h1>
        <p className="text-sm text-stone-600 mb-8 leading-relaxed max-w-md mx-auto">
          เลือกธาตุเจ้าเรือนที่คุณต้องการปรับสมดุล แล้วกดปุ่มให้ระบบสุ่มเมนู Cooking Kit ท้องถิ่นที่เหมาะสมที่สุด
        </p>

        <div className="mb-8">
          <ElementSelector
            selectedElement={selectedElement}
            onSelect={setSelectedElement}
          />
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="w-full py-4 px-6 bg-[#8b5e34] hover:bg-[#704924] text-white font-bold text-base rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
          <span>เริ่มสุ่มเมนูมื้อนี้!</span>
        </button>
      </div>

      {/* Pop-up Modal */}
      {modalState !== "IDLE" && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ebe4dc] text-center relative overflow-hidden">
            {/* 1. หน้ากำลังสุ่ม */}
            {modalState === "SPINNING" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-5 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#ebe4dc] border-t-[#8b5e34] rounded-full animate-spin"></div>
                  <span className="text-2xl animate-bounce">🍲</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  กำลังคัดสรรเมนูตามธาตุ...
                </h3>
                <p className="text-xs text-stone-500">
                  รอสักครู่นะครับ กำลังเลือกเมนูท้องถิ่นที่ปรับสมดุลธาตุให้คุณ
                </p>
              </div>
            )}

            {/* 2. หน้าสรุปผลลัพธ์ */}
            {modalState === "RESULT" && (
              <div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#f4ebd9] text-[#8b5e34] rounded-full text-xs font-bold">
                    ✨ เมนูแนะนำปรับสมดุลสำหรับคุณ
                  </span>
                </div>

                <RandomResultCard dish={currentDish} />

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="py-3 px-4 bg-[#f5f1eb] hover:bg-[#ebe4dc] text-stone-800 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>สุ่มใหม่</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(currentDish)}
                    className="py-3 px-4 bg-[#8b5e34] hover:bg-[#704924] text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>เพิ่มลงตะกร้า</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

