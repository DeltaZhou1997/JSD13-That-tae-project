// client/src/pages/MenuRandomizerPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import RandomResultCard from "../components/menu-randomizer/RandomResultCard.jsx";
import { useProducts } from "../context/ProductsContext.js";
import { dishes } from "../mock-data/index.js";

// 1. Import รูปภาพทั้งหมดจาก src/assets/randomizer โดยตรง (แก้ปัญหารูปไม่ขึ้น 100%)
import elementEarth from "../assets/element-earth.png";
import elementWater from "../assets/element-water.png";
import elementAir from "../assets/element-wind.png";
import elementFire from "../assets/element-fire.png";
import randomMenuDish from "../assets/randomizer/random_menu.png";

// รูปสำรองสำหรับเมนู 4 ภาค
import khaoSoiImg from "../assets/randomizer/khao_soi.jpg";
import kaopunImg from "../assets/randomizer/kaopun.jpg";
import mudsamunImg from "../assets/randomizer/mudsamun.jpg";
import satorImg from "../assets/randomizer/sator.jpg";

// Mapping ธาตุสำหรับตัวกรอง
const ELEMENT_MAP = {
  earth: ["ดิน", "earth"],
  water: ["น้ำ", "water"],
  air: ["ลม", "wind", "air"],
  fire: ["ไฟ", "fire"],
};

export default function MenuRandomizerPage() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const contextAddToCart = outletContext.handleAddToCart;
  const { products } = useProducts();

  const [selectedElement, setSelectedElement] = useState("water");
  const [currentDish, setCurrentDish] = useState(null);

  // modalState: 'IDLE' | 'SPINNING' | 'RESULT'
  const [modalState, setModalState] = useState("IDLE");
  const timeoutRef = useRef(null);

  // รวมรายการเมนูทั้งหมดจาก Database หรือ Mock-data
  const allDishes = useMemo(() => {
    if (products && products.length > 0) return products;
    return Array.isArray(dishes) ? dishes : Object.values(dishes || {});
  }, [products]);

  // ข้อ 3: สุ่มเมนู 4 ภาค จาก Database จริง (ภาคละ 1 เมนู)
  const regionalFeatured = useMemo(() => {
    const regionKeys = [
      {
        id: "northern",
        label: "ภาคเหนือ",
        fallbackImg: khaoSoiImg,
        defaultName: "ข้าวซอยไก่",
      },
      {
        id: "northeastern",
        label: "ภาคอีสาน",
        fallbackImg: kaopunImg,
        defaultName: "ข้าวปุ้นซาวน้ำปลาร้า",
      },
      {
        id: "central",
        label: "ภาคกลาง",
        fallbackImg: mudsamunImg,
        defaultName: "มัสมั่นไก่",
      },
      {
        id: "southern",
        label: "ภาคใต้",
        fallbackImg: satorImg,
        defaultName: "ผัดสะตอกุ้ง",
      },
    ];

    return regionKeys.map((r) => {
      // ค้นหาเมนูใน Database ที่ตรงกับภาคนั้นๆ
      const matchDishes = allDishes.filter(
        (d) =>
          d.region === r.id ||
          d.regionNameTh === r.label ||
          (d.regionNameTh &&
            d.regionNameTh.includes(r.label.replace("ภาค", ""))),
      );

      if (matchDishes.length > 0) {
        // สุ่ม 1 เมนูจากภาคนั้น
        const randomItem =
          matchDishes[Math.floor(Math.random() * matchDishes.length)];
        const img =
          randomItem.image ||
          randomItem.imgUrl ||
          (Array.isArray(randomItem.imageUrl)
            ? randomItem.imageUrl[0]
            : randomItem.imageUrl) ||
          r.fallbackImg;

        return {
          region: r.label,
          name: randomItem.nameTh || randomItem.name || r.defaultName,
          image: img,
          id: randomItem._id || randomItem.id,
        };
      }

      // กรณีฐานข้อมูลยังโหลดไม่เสร็จ ให้ใช้รูปสำรอง
      return {
        region: r.label,
        name: r.defaultName,
        image: r.fallbackImg,
      };
    });
  }, [allDishes]);

  // ข้อมูลการ์ดธาตุทั้ง 4
  const elementsList = [
    {
      id: "earth",
      name: "ธาตุดิน",
      subtitle: "หนักแน่น มั่นคง ย่อยช้า",
      desc: "ชอบอาหารรสฝาด หวาน มัน เค็ม แต่เผาผลาญช้า ต้องเน้นอาหารย่อยง่าย",
      image: elementEarth,
    },
    {
      id: "water",
      name: "ธาตุน้ำ",
      subtitle: "ชุ่มชื่น อ่อนโยน เฉื่อยง่าย",
      desc: "บวมน้ำได้ง่าย เหมาะกับรสเผ็ดร้อน เปรี้ยว และขม เพื่อช่วยกระตุ้นการไหลเวียน",
      image: elementWater,
    },
    {
      id: "air",
      name: "ธาตุลม",
      subtitle: "คล่องแคล่ว ตื่นตัว ท้องอืดง่าย",
      desc: "ลมในท้องเยอะ เบื่อง่าย ต้องเน้นรสเผ็ดร้อนและเผ็ดร้อนหอมระเหยเพื่อขับลม",
      image: elementAir,
    },
    {
      id: "fire",
      name: "ธาตุไฟ",
      subtitle: "กระฉับกระเฉง ใจร้อน ร้อนในง่าย",
      desc: "ระบบเผาผลาญดีแต่ร้อนในง่าย เหมาะกับรสขม เย็น และจืด เพื่อดับพิษร้อน",
      image: elementFire,
    },
  ];

  // ฟังก์ชันสุ่มเมนูอาหารตามธาตุ
  const handleRandomize = () => {
    if (modalState === "SPINNING") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (allDishes.length === 0) return;

    const allowed = ELEMENT_MAP[selectedElement] || [selectedElement];
    const filteredDishes = allDishes.filter((dish) => {
      if (!dish) return false;
      const dom = (dish.dominantElement || dish.element || "").toLowerCase();
      const domEn = (dish.dominantElementEn || "").toLowerCase();
      if (allowed.includes(dom) || allowed.includes(domEn)) return true;

      if (Array.isArray(dish.elementSuitability)) {
        if (
          dish.elementSuitability.some((e) =>
            allowed.includes(String(e).toLowerCase()),
          )
        ) {
          return true;
        }
      }
      return false;
    });

    const targetList = filteredDishes.length > 0 ? filteredDishes : allDishes;
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const selectedDish = targetList[randomIndex];

    setModalState("SPINNING");

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
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      {/* 1. Header ส่วนหัวข้อพร้อมประกายดาว */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B5E34] tracking-[0.25em] uppercase mb-2">
          <span>✦</span>
          <span>RANDOM MENU</span>
          <span>✦</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3B2A1A] tracking-tight flex items-center justify-center gap-3">
          <span className="text-[#C49758] animate-sparkle-1 text-2xl">✦</span>
          วันนี้กินอะไรดีนะ?
          <span className="text-[#C49758] animate-sparkle-2 text-2xl">✦</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#6E5A4E]">
          เลือกธาตุที่ตรงกับธาตุเจ้าเรือนของคุณ แล้วให้เราเซ็ตเมนู Cooking Kit
          ที่ใช่
        </p>
      </div>

      {/* 2. Layout หลัก: วางจานตรงกลาง ขนาบข้างด้วย 4 ธาตุ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center mb-16">
        {/* การ์ดซ้าย 1: ธาตุดิน */}
        <ElementCard
          data={elementsList[0]}
          isSelected={selectedElement === "earth"}
          onClick={() => setSelectedElement("earth")}
        />

        {/* การ์ดซ้าย 2: ธาตุน้ำ */}
        <ElementCard
          data={elementsList[1]}
          isSelected={selectedElement === "water"}
          onClick={() => setSelectedElement("water")}
        />

        {/* ตรงกลาง: จานอาหารใหญ่ random_menu.png + Animation ลอย + ประกายดาว */}
        <div className="order-first lg:order-none col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center relative py-6">
          {/* ประกายดาววิบวับรอบจานอาหาร */}
          <div className="absolute top-2 left-6 text-[#E0A955] text-xl animate-sparkle-1 pointer-events-none">
            ✦
          </div>

          <div className="absolute bottom-28 left-4 text-[#E5B56A] text-lg animate-sparkle-3 pointer-events-none">
            ✦
          </div>
          <div className="absolute top-1/2 -right-1 text-[#E0A955] text-xl animate-sparkle-1 pointer-events-none">
            ✦
          </div>

          {/* จานอาหารลอยขึ้นลงเบาๆ ด้วย animate-float */}
          <div
            onClick={handleRandomize}
            className="relative animate-float cursor-pointer transition-transform hover:scale-105 duration-300"
            title="คลิกเพื่อสุ่มเมนู!"
          >
            {/* เงาใต้จานอาหาร */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#3D2E2B]/15 rounded-full blur-md"></div>

            {/* ภาพจานอาหาร random_menu.png */}
            <img
              src={randomMenuDish}
              alt="จานอาหารเมนูสุ่ม"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain relative z-10 drop-shadow-2xl"
            />
          </div>

          {/* ปุ่มกดสุ่มเมนู */}
          <div className="mt-8 flex flex-col items-center gap-2 z-20 w-full max-w-[240px]">
            <button
              type="button"
              onClick={handleRandomize}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#6B4423] to-[#8B5E34] hover:from-[#5A381C] hover:to-[#734C28] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-lg">🎲</span>
              <span>สุ่มเมนูให้ฉัน!</span>
            </button>
          </div>
        </div>

        {/* การ์ดขวา 1: ธาตุลม */}
        <ElementCard
          data={elementsList[2]}
          isSelected={selectedElement === "air"}
          onClick={() => setSelectedElement("air")}
        />

        {/* การ์ดขวา 2: ธาตุไฟ */}
        <ElementCard
          data={elementsList[3]}
          isSelected={selectedElement === "fire"}
          onClick={() => setSelectedElement("fire")}
        />
      </div>

      {/* 3. เมนูแนะนำจาก 4 ภาค(ดึงมาจาก Database จริง) */}
      <div className="max-w-5xl mx-auto pt-6 border-t border-[#EAE2D5]">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-[#8B5E34] tracking-[0.2em] uppercase">
            ✦ เมนูแนะนำ 4 ภาค ✦
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regionalFeatured.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (item.id) navigate(`/menus/${item.id}`);
              }}
              className="bg-white rounded-2xl overflow-hidden border border-[#EAE2D5] shadow-xs hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="h-28 overflow-hidden bg-[#FAF7F2]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center bg-[#FAF7F2]">
                <span className="inline-block px-2.5 py-0.5 bg-white text-[11px] font-bold text-[#6E5A4E] rounded-full border border-[#E0D5C7] mb-1">
                  {item.region}
                </span>
                <p className="text-xs font-semibold text-[#3B2A1A] truncate">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Pop-up Modal สุ่มผลลัพธ์ */}
      {modalState !== "IDLE" && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ebe4dc] text-center relative overflow-hidden">
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

// การ์ดธาตุขอบมนสวยงาม
function ElementCard({ data, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-5 sm:p-6 bg-white border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
        isSelected
          ? "border-[#8B5E34] shadow-md ring-2 ring-[#8B5E34]/20 transform -translate-y-1"
          : "border-[#ECE5DA] hover:border-[#C4B5A5] hover:shadow-sm"
      }`}
    >
      {/* รูปภาพมังกรประจำธาตุ */}
      <div className="w-full h-40 sm:h-44 flex items-center justify-center mb-3 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* ป้ายชื่อธาตุ */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{data.icon}</span>
        <h3 className="font-extrabold text-base text-[#3B2A1A]">{data.name}</h3>
      </div>

      {/* คำบรรยาย */}
      <p className="text-xs font-semibold text-[#6E5A4E] mb-1">
        {data.subtitle}
      </p>
      <p className="text-[11px] text-[#9E8B80] leading-tight">{data.desc}</p>
    </div>
  );
}
