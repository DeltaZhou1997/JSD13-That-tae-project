import React, { useState, useEffect, useRef } from "react";
import ElementSelector from "../components/menu-randomizer/ElementSelector.jsx";
import RandomResultCard from "../components/menu-randomizer/RandomResultCard.jsx";

import dishes from "../mock-data/dishes.js";

const rawDishes = dishes || {};

export default function MenuRandomizerPage() {
  const [selectedElement, setSelectedElement] = useState("earth");
  const [currentDish, setCurrentDish] = useState(null);

  // modalState: 'IDLE' | 'SPINNING' | 'RESULT'
  const [modalState, setModalState] = useState("IDLE");
  const timeoutRef = useRef(null);

  const handleRandomize = () => {
    if (modalState === "SPINNING") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const allDishes = Array.isArray(rawDishes)
      ? rawDishes
      : typeof rawDishes === "object" && rawDishes !== null
        ? Object.values(rawDishes)
        : [];

    if (allDishes.length === 0) return;

    // กรองเมนูตามธาตุ
    const filteredDishes = allDishes.filter((dish) => {
      if (!dish) return false;
      const actualElement = dish.element || dish.elementId;
      if (actualElement) {
        return actualElement.toLowerCase() === selectedElement.toLowerCase();
      }

      const tempElementMapping = {
        earth: ["dip", "stew", "northern"],
        water: ["noodle", "soup", "southern"],
        air: ["salad", "stir-fry", "isan"],
        fire: ["grill", "curry", "central"],
      };

      const matchedKeywords = tempElementMapping[selectedElement] || [];
      return (
        matchedKeywords.includes(dish.dishType) ||
        matchedKeywords.includes(dish.region)
      );
    });

    const targetList = filteredDishes.length > 0 ? filteredDishes : allDishes;

    // 1. สุ่มเมนูไว้ก่อนทันที
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const selectedDish = targetList[randomIndex];

    // 2. แสดง Modal หน้ากำลังสุ่ม (Loading Animation)
    setModalState("SPINNING");

    // 3. หน่วงเวลา 1.5 วินาทีเพื่อให้เห็น Animation หมุนอย่างคลีนๆ แล้วแสดงผลลัพธ์
    timeoutRef.current = setTimeout(() => {
      setCurrentDish(selectedDish);
      setModalState("RESULT");
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddToCart = (dish) => {
    if (!dish) return;

    // TODO: เมื่อมี CartContext ให้เปลี่ยนเป็น addToCart(dish);
    alert(
      `เพิ่ม "${dish.name || dish.nameTh || "เมนูอาหาร"}" ลงในตะกร้าเรียบร้อยแล้วครับ!`,
    );

    setModalState("IDLE");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col items-center justify-center">
      {/* 🏡 หน้ากลาง (Landing Page) */}
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-sm border border-[#F2EFE9] text-center">
        <span className="text-xs font-bold text-[#C5A880] tracking-widest uppercase block mb-2">
          ✨ MENU RANDOMIZER ✨
        </span>
        <h1 className="text-3xl font-black text-[#3D2E2B] tracking-tight mb-3">
          วันนี้ทานอะไรดีนะ?
        </h1>
        <p className="text-xs text-[#8C7B73] mb-6 leading-relaxed">
          เลือกธาตุเจ้าเรือนของคุณ
          แล้วกดปุ่มให้เราช่วยเลือกเมนูอร่อยปรับสมดุลมื้อนี้!
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
          className="w-full py-4 px-6 bg-[#3D2E2B] hover:bg-[#2A201E] text-white font-bold text-base rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <span>🎲</span>
          <span>เริ่มสุ่มเมนูมื้อนี้!</span>
        </button>
      </div>

      {/* 🔮 Pop-up Modal */}
      {modalState !== "IDLE" && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#F2EFE9] text-center relative overflow-hidden">
            {/* 🟡 1. หน้ากำลังสุ่ม (คลีนๆ มีแค่ Spinner + ข้อความ) */}
            {modalState === "SPINNING" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-20 h-20 mb-5 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#E6DFD5] border-t-[#C5A880] rounded-full animate-spin"></div>
                  <span className="text-3xl animate-bounce">🍳</span>
                </div>
                <h3 className="text-lg font-bold text-[#3D2E2B] mb-1">
                  กำลังตั้งใจรังสรรค์เมนู...
                </h3>
                <p className="text-xs text-[#8C7B73]">
                  รอสักครู่นะครับ ครัวกำลังเลือกสิ่งที่เหมาะกับธาตุของคุณ
                </p>
              </div>
            )}

            {/* 🟢 2. หน้าสรุปผลลัพธ์ */}
            {modalState === "RESULT" && (
              <div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#F2EFE9] text-[#8C7B73] rounded-full text-xs font-bold">
                    🎉 เมนูพิเศษสำหรับคุณ!
                  </span>
                </div>

                <RandomResultCard dish={currentDish} />

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="py-3 px-4 bg-[#F2EFE9] hover:bg-[#E6DFD5] text-[#3D2E2B] font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>🔄</span> สุ่มใหม่
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(currentDish)}
                    className="py-3 px-4 bg-[#C5A880] hover:bg-[#B3956E] text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>🛒</span> ใส่ตะกร้า
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
