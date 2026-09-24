// client/src/pages/MenuRandomizerPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import RandomResultCard from "../components/menu-randomizer/RandomResultCard.jsx";
import { useProducts } from "../context/ProductsContext.js";
import gsap from "gsap";
import LoadingThai from "../components/LoadingThai.jsx";
import { resolveImageUrl } from "../utils/imageUrl.js";

// 1. Import รูปภาพทั้งหมดจาก src/assets โดยตรง
import elementEarth from "../assets/element-earth.png";
import elementWater from "../assets/element-water.png";
import elementAir from "../assets/element-wind.png";
import elementFire from "../assets/element-fire.png";
import randomMenuDish from "../assets/randomizer/random_menu.png";

// รูปสำรองสำหรับเมนู 4 ภาค

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
  const { products, loading: productsLoading } = useProducts();

  const [selectedElement, setSelectedElement] = useState("water");
  const [currentDish, setCurrentDish] = useState(null);
  const [tickerDish, setTickerDish] = useState(null);

  // modalState: 'IDLE' | 'SPINNING' | 'RESULT'
  const [modalState, setModalState] = useState("IDLE");
  const timeoutRef = useRef(null);
  const resultModalRef = useRef(null);
  const dishImgRef = useRef(null);

  // ใช้เมนูจากฐานข้อมูลเท่านั้น ไม่ fallback ไป mock data
  const allDishes = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  // สุ่มเมนู 4 ภาค จาก Database จริง (ภาคละ 1 เมนู)
  const regionalFeatured = useMemo(() => {
    const regionKeys = [
      {
        id: "northern",
        label: "ภาคเหนือ",
      },
      {
        id: "northeastern",
        label: "ภาคอีสาน",
      },
      {
        id: "central",
        label: "ภาคกลาง",
      },
      {
        id: "southern",
        label: "ภาคใต้",
      },
    ];

    // ภาคที่ยังไม่มีเมนู → ไม่แสดงการ์ด (กันรูปเสีย/การ์ดว่าง)
    return regionKeys.map((r) => {
      const matchDishes = allDishes.filter(
        (d) =>
          d.region === r.id ||
          d.regionNameTh === r.label ||
          (d.regionNameTh &&
            d.regionNameTh.includes(r.label.replace("ภาค", "")))
      );

      if (matchDishes.length > 0) {
        const randomItem =
          matchDishes[Math.floor(Math.random() * matchDishes.length)];
        const img =
          randomItem.image ||
          randomItem.imgUrl ||
          (Array.isArray(randomItem.imageUrl)
            ? randomItem.imageUrl[0]
            : randomItem.imageUrl);

        return {
          region: r.label,
          name: randomItem.nameTh || randomItem.name || "เมนูจากฐานข้อมูล",
          image: img ? resolveImageUrl(img) : "",
          id: randomItem._id || randomItem.id,
        };
      }

      return null;
    }).filter(Boolean);
  }, [allDishes]);

  // รูปที่โหลดไม่ขึ้น → ซ่อนเฉพาะรูป (แสดงพื้นหลังแทน) ไม่ให้เห็นไอคอนรูปเสีย
  const [brokenImages, setBrokenImages] = useState({});

  // ข้อมูลการ์ดธาตุทั้ง 4
  const elementsList = [
    {
      id: "earth",
      name: "ธาตุดิน",
      subtitle: "หนักแน่น มั่นคง ย่อยช้า",
      desc: "ชอบอาหารรสฝาด หวาน มัน เค็ม แต่เผาผลาญช้า ต้องเน้นอาหารย่อยง่าย",
      image: elementEarth,
      color: "#8D593A",
    },
    {
      id: "water",
      name: "ธาตุน้ำ",
      subtitle: "ชุ่มชื่น อ่อนโยน เฉื่อยง่าย",
      desc: "บวมน้ำได้ง่าย เหมาะกับรสเผ็ดร้อน เปรี้ยว และขม เพื่อช่วยกระตุ้นการไหลเวียน",
      image: elementWater,
      color: "#2B6CB0",
    },
    {
      id: "air",
      name: "ธาตุลม",
      subtitle: "คล่องแคล่ว ตื่นตัว ท้องอืดง่าย",
      desc: "ลมในท้องเยอะ เบื่อง่าย ต้องเน้นรสเผ็ดร้อนและเผ็ดร้อนหอมระเหยเพื่อขับลม",
      image: elementAir,
      color: "#2F855A",
    },
    {
      id: "fire",
      name: "ธาตุไฟ",
      subtitle: "กระฉับกระเฉง ใจร้อน ร้อนในง่าย",
      desc: "ระบบเผาผลาญดีแต่ร้อนในง่าย เหมาะกับรสขม เย็น และจืด เพื่อดับพิษร้อน",
      image: elementFire,
      color: "#C53030",
    },
  ];

  // Cycling ticker effect while spinning
  useEffect(() => {
    if (modalState === "SPINNING") {
      const interval = setInterval(() => {
        if (allDishes.length > 0) {
          const rand = allDishes[Math.floor(Math.random() * allDishes.length)];
          setTickerDish(rand);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [modalState, allDishes]);

  // GSAP animation for result modal appearance
  useEffect(() => {
    if (modalState === "RESULT" && resultModalRef.current) {
      gsap.fromTo(
        resultModalRef.current,
        { scale: 0.9, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  }, [modalState]);

  // ฟังก์ชันสุ่มเมนูอาหารตามธาตุ
  const handleRandomize = () => {
    if (modalState === "SPINNING") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (allDishes.length === 0) return;

    // Haptic bounce on central dish
    if (dishImgRef.current) {
      gsap.fromTo(
        dishImgRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    }

    const allowed = ELEMENT_MAP[selectedElement] || [selectedElement];
    const filteredDishes = allDishes.filter((dish) => {
      if (!dish) return false;
      const dom = (dish.dominantElement || dish.element || "").toLowerCase();
      const domEn = (dish.dominantElementEn || "").toLowerCase();
      if (allowed.includes(dom) || allowed.includes(domEn)) return true;

      if (Array.isArray(dish.elementSuitability)) {
        if (
          dish.elementSuitability.some((e) =>
            allowed.includes(String(e).toLowerCase())
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
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
      {productsLoading && <LoadingThai className="min-h-[70vh]" />}
      {!productsLoading && allDishes.length === 0 && <LoadingThai label="ยังไม่มีเมนูจากฐานข้อมูล" className="min-h-[70vh]" />}
      {!productsLoading && allDishes.length > 0 && <>
      {/* 1. Header ส่วนหัวข้อพร้อมประกายดาว */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#8B5E34] tracking-[0.25em] uppercase mb-1.5 sm:mb-2">
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#3B2A1A] tracking-tight flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-[#C49758] animate-sparkle-1 text-xl sm:text-2xl">✦</span>
          วันนี้กินอะไรดีนะ?
          <span className="text-[#C49758] animate-sparkle-2 text-xl sm:text-2xl">✦</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-base text-[#6E5A4E] max-w-lg mx-auto">
          เลือกธาตุที่ตรงกับธาตุเจ้าเรือนของคุณ แล้วให้เราเซ็ตเมนู Cooking Kit
          ที่ใช่
        </p>
      </div>

      {/* 2. Layout หลัก: วางจานตรงกลาง ขนาบข้างด้วย 4 ธาตุ */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 items-center mb-10 sm:mb-16">
        {/* การ์ดซ้าย 1: ธาตุดิน */}
        <div className="order-2 lg:order-1">
          <ElementCard
            data={elementsList[0]}
            isSelected={selectedElement === "earth"}
            onClick={() => setSelectedElement("earth")}
          />
        </div>

        {/* การ์ดซ้าย 2: ธาตุน้ำ */}
        <div className="order-3 lg:order-2">
          <ElementCard
            data={elementsList[1]}
            isSelected={selectedElement === "water"}
            onClick={() => setSelectedElement("water")}
          />
        </div>

        {/* ตรงกลาง: จานอาหารใหญ่ random_menu.png + Animation ลอย + ประกายดาว */}
        <div className="order-1 lg:order-3 col-span-2 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center relative py-2 sm:py-6 mb-2 lg:mb-0">
          {/* ประกายดาววิบวับรอบจานอาหาร */}
          <div className="absolute top-0 left-8 sm:left-6 text-[#E0A955] text-lg sm:text-xl animate-sparkle-1 pointer-events-none">
            ✦
          </div>
          <div className="absolute bottom-20 sm:bottom-28 left-4 text-[#E5B56A] text-base sm:text-lg animate-sparkle-3 pointer-events-none">
            ✦
          </div>
          <div className="absolute top-1/2 right-2 sm:-right-1 text-[#E0A955] text-lg sm:text-xl animate-sparkle-1 pointer-events-none">
            ✦
          </div>

          {/* จานอาหารลอยขึ้นลงเบาๆ ด้วย animate-float */}
          <div
            ref={dishImgRef}
            onClick={handleRandomize}
            className="relative animate-float cursor-pointer transition-transform hover:scale-105 duration-300"
            title="คลิกเพื่อสุ่มเมนู!"
          >
            {/* เงาใต้จานอาหาร */}
            <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-6 sm:h-8 bg-[#3D2E2B]/15 rounded-full blur-md"></div>

            {/* ภาพจานอาหาร random_menu.png */}
            <img
              src={randomMenuDish}
              alt="จานอาหารเมนูสุ่ม"
              className="w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain relative z-10 drop-shadow-2xl"
            />
          </div>

          {/* ปุ่มกดสุ่มเมนู (ใช้ SVG Dice แทน emoji) */}
          <div className="mt-5 sm:mt-8 flex flex-col items-center gap-2 z-20 w-full max-w-[240px]">
            <button
              type="button"
              onClick={handleRandomize}
              className="w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#6B4423] to-[#8B5E34] hover:from-[#5A381C] hover:to-[#734C28] text-white font-bold text-xs sm:text-sm lg:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
            >
              {/* SVG Dice Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 shrink-0"
              >
                <rect width="18" height="18" x="3" y="3" rx="4" />
                <path d="M16 8h.01" />
                <path d="M12 12h.01" />
                <path d="M8 16h.01" />
                <path d="M8 8h.01" />
                <path d="M16 16h.01" />
              </svg>
              <span>สุ่มเมนูให้ฉัน!</span>
            </button>
          </div>
        </div>

        {/* การ์ดขวา 1: ธาตุลม */}
        <div className="order-4 lg:order-4">
          <ElementCard
            data={elementsList[2]}
            isSelected={selectedElement === "air"}
            onClick={() => setSelectedElement("air")}
          />
        </div>

        {/* การ์ดขวา 2: ธาตุไฟ */}
        <div className="order-5 lg:order-5">
          <ElementCard
            data={elementsList[3]}
            isSelected={selectedElement === "fire"}
            onClick={() => setSelectedElement("fire")}
          />
        </div>
      </div>

      {/* 3. เมนูแนะนำประจำภาค (ดึงมาจาก Database จริง — แสดงเฉพาะภาคที่มีเมนู) */}
      {regionalFeatured.length > 0 && (
      <div className="max-w-5xl mx-auto pt-6 border-t border-[#EAE2D5]">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-[#8B5E34] tracking-[0.2em] uppercase">
            ✦ เมนูแนะนำ {regionalFeatured.length} ภาค ✦
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {regionalFeatured.map((item) => (
            <div
              key={item.region}
              onClick={() => {
                if (item.id) navigate(`/menus/${item.id}`);
              }}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.75rem)] bg-white rounded-2xl overflow-hidden border border-[#EAE2D5] shadow-xs hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="h-28 overflow-hidden bg-gradient-to-br from-[#FAF7F2] to-[#EFE6DA]">
                {item.image && !brokenImages[item.region] && (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={() => setBrokenImages((prev) => ({ ...prev, [item.region]: true }))}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
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
      )}

      {/* 4. Pop-up Modal สุ่มผลลัพธ์ (SVG Icons + Fluid Transitions) */}
      {modalState !== "IDLE" && (
        <div className="fixed inset-0 z-[110] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-all duration-300">
          <div
            ref={resultModalRef}
            className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 max-w-md w-full max-h-[88vh] flex flex-col shadow-2xl border border-[#ebe4dc] text-center relative overflow-hidden"
          >
            {/* ปุ่มปิด Modal มุมขวาบน */}
            <button
              type="button"
              onClick={() => setModalState("IDLE")}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EBE4D8] text-[#6E5A4E] flex items-center justify-center transition-colors cursor-pointer z-10 shadow-2xs"
              title="ปิด"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {modalState === "SPINNING" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                {/* SVG Cooking Cloche / Pot Spinner */}
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#ebe4dc] border-t-[#8b5e34] rounded-full animate-spin"></div>
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 text-[#8b5e34] animate-pulse"
                    >
                      <path d="M18 10a6 6 0 0 0-12 0" />
                      <line x1="4" y1="10" x2="20" y2="10" />
                      <path d="M12 2v2" />
                      <line x1="8" y1="14" x2="16" y2="14" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">
                    กำลังคัดสรรเมนูตามธาตุ...
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    {tickerDish
                      ? `กำลังพิจารณา: ${tickerDish.nameTh || tickerDish.name}`
                      : "รอสักครู่นะครับ กำลังเลือกเมนูท้องถิ่นที่ปรับสมดุลธาตุให้คุณ"}
                  </p>
                </div>
              </div>
            )}

            {modalState === "RESULT" && (
              <div className="flex flex-col min-h-0 flex-1">
                <div className="mb-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4ebd9] text-[#8b5e34] rounded-full text-xs font-bold border border-[#e8dfd1]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-[#8b5e34]"
                    >
                      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                    </svg>
                    <span>เมนูแนะนำปรับสมดุลสำหรับคุณ</span>
                  </span>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0 px-0.5">
                  <RandomResultCard dish={currentDish} />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 pt-2 border-t border-[#f0eae1] shrink-0">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="py-2.5 sm:py-3 px-3 sm:px-4 bg-[#f5f1eb] hover:bg-[#ebe4dc] text-stone-800 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                    <span>สุ่มใหม่</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(currentDish)}
                    className="py-2.5 sm:py-3 px-3 sm:px-4 bg-[#8b5e34] hover:bg-[#704924] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>เพิ่มลงตะกร้า</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </>}
    </div>
  );
}

// การ์ดธาตุขอบมนสวยงาม
function ElementCard({ data, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 bg-white border-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center select-none active:scale-[0.98] ${isSelected
          ? "border-[#8B5E34] shadow-lg ring-2 ring-[#8B5E34]/20 transform -translate-y-1 sm:-translate-y-1.5 bg-gradient-to-b from-white to-[#FAF7F2]"
          : "border-[#ECE5DA] hover:border-[#C4B5A5] hover:shadow-sm hover:-translate-y-0.5"
        }`}
    >
      {/* รูปภาพมังกรประจำธาตุ */}
      <div className="w-full h-28 sm:h-36 lg:h-44 flex items-center justify-center mb-2 sm:mb-3 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* ป้ายชื่อธาตุ */}
      <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
        <h3 className="font-extrabold text-sm sm:text-base text-[#3B2A1A]">{data.name}</h3>
      </div>

      {/* คำบรรยาย */}
      <p className="text-[11px] sm:text-xs font-semibold text-[#6E5A4E] mb-0.5 sm:mb-1">
        {data.subtitle}
      </p>
      <p className="text-[10px] sm:text-[11px] text-[#9E8B80] leading-tight line-clamp-2">{data.desc}</p>
    </div>
  );
}
