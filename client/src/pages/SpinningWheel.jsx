import React, { useState, useEffect, useRef } from "react";
import rawDishes from "../mock-data/dishes";

import earthImg from "../assets/element-earth.png";
import fireImg from "../assets/element-fire.png";
import waterImg from "../assets/element-water.png";
import windImg from "../assets/element-wind.png";

// =========================================================================
// 📌 [จุดจำลองข้อมูลธาตุ (MOCKUP ELEMENT MAPPING)]
// -------------------------------------------------------------------------
// 💡 เหตุผล: dishes.js ยังไม่มี field "element" คำนวณจากวัตถุดิบ
// จึงต้องแมป region เข้ากับธาตุชั่วคราวก่อน เพื่อให้หมุนวงล้อได้ไม่ค้าง
// 🟢 อนาคต: เมื่อ dishes.js มี item.element หรือ item.elementId แล้ว ให้ใช้ค่าจริงได้เลย
// =========================================================================
const rawData = rawDishes?.dishes || rawDishes?.default || rawDishes || {};
const dishList = Object.values(rawData).map((item) => {
  let element = item.element || item.elementId;

  if (!element) {
    switch (item.region) {
      case "northern":
        element = "earth";
        break;
      case "central":
        element = "water";
        break;
      case "northeastern":
        element = "fire";
        break;
      case "southern":
        element = "wind"; // หรือ "air" ตามที่ระบบหลักใช้
        break;
      default:
        element = "earth";
    }
  }

  return {
    ...item,
    name: item.nameTh || item.nameEn || "เมนูอาหาร",
    element: element.toLowerCase(),
    benefit: item.description,
  };
});

// Palette สีตามธีม Warm Cream & Dark Brown
const ELEMENT_INFO = {
  all: { name: "รวมทุกธาตุ", sub: "สุ่มทุกเมนู", color: "#CBB69D", img: null },
  earth: {
    name: "ธาตุดิน",
    sub: "รสชาติ: ฝาด หวาน มัน เค็ม",
    color: "#A87C4F",
    img: earthImg,
  },
  water: {
    name: "ธาตุน้ำ",
    sub: "รสชาติ: เปรี้ยว ขม",
    color: "#5A9AB5",
    img: waterImg,
  },
  wind: {
    name: "ธาตุลม",
    sub: "รสชาติ: เผ็ด ร้อน",
    color: "#83A97B",
    img: windImg,
  },
  fire: {
    name: "ธาตุไฟ",
    sub: "รสชาติ: ขม เย็น จืด",
    color: "#D96B43",
    img: fireImg,
  },
};

export default function SpinningWheelApp() {
  const [selectedElement, setSelectedElement] = useState("earth");
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);

  const currentItems =
    selectedElement === "all"
      ? dishList
      : dishList.filter((item) => item.element === selectedElement);

  useEffect(() => {
    const images = {
      fire: fireImg,
      water: waterImg,
      wind: windImg,
      earth: earthImg,
    };

    const loaded = {};
    let count = 0;
    const keys = Object.keys(images);

    keys.forEach((key) => {
      const img = new Image();
      img.src = images[key];
      img.onload = () => {
        loaded[key] = img;
        count++;
        if (count === keys.length) setLoadedImages(loaded);
      };
      img.onerror = () => {
        count++;
        if (count === keys.length) setLoadedImages(loaded);
      };
    });
  }, []);

  const playTickSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  const drawWheel = (angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;

    ctx.clearRect(0, 0, width, height);

    if (!currentItems || currentItems.length === 0) {
      ctx.fillStyle = "#8C7A6B";
      ctx.font = "14px Sarabun, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ไม่พบข้อมูลเมนูในธาตุนี้", centerX, centerY);
      return;
    }

    const sliceAngle = (2 * Math.PI) / currentItems.length;
    const wheelPalette = ["#F5EFE6", "#E8DFD1", "#DFD3C3", "#D2C4B1"];

    currentItems.forEach((item, index) => {
      const startAngle = angle + index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = wheelPalette[index % wheelPalette.length];
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#E6DDD0";
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#3D2E28";
      ctx.font = "bold 13px Sarabun, sans-serif";

      ctx.fillText(item.name, radius - 40, 5);

      const iconImg = loadedImages[item.element];
      if (iconImg) {
        ctx.drawImage(iconImg, radius - 32, -10, 20, 20);
      }

      ctx.restore();
    });

    // แกนกลางวงล้อ
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = "#3D2E28";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#F9F6F0";
    ctx.stroke();

    ctx.fillStyle = "#F9F6F0";
    ctx.font = "bold 13px Sarabun, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("สุ่ม", centerX, centerY);
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [selectedElement, loadedImages, currentItems]);

  const spinWheel = () => {
    if (isSpinning || currentItems.length === 0) return;

    setIsSpinning(true);
    setShowModal(false);

    const spinDuration = 4500;
    const startTime = performance.now();
    const startRotation = rotationRef.current;

    const totalSpinAngle = 5 * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const sliceAngle = (2 * Math.PI) / currentItems.length;
    let lastSliceIndex = -1;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalSpinAngle * easeOut;

      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      const normalizedAngle =
        ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSliceIndex = Math.floor(normalizedAngle / sliceAngle);
      if (currentSliceIndex !== lastSliceIndex) {
        playTickSound();
        lastSliceIndex = currentSliceIndex;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        const finalAngle =
          ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle =
          ((3 * Math.PI) / 2 - finalAngle + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex =
          Math.floor(pointerAngle / sliceAngle) % currentItems.length;

        setResult(currentItems[winningIndex]);
        setShowModal(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // =========================================================================
  // 📌 [จุดที่จะต้องปรับเพิ่มเมื่อต่อกับระบบจริง (CART INTEGRATION NOTE)]
  // -------------------------------------------------------------------------
  // 🟢 สิ่งที่ต้องทำในอนาคต (เมื่อเพื่อนทำ CartContext เสร็จ):
  // 1. import { useCart } from "../context/CartContext.jsx";
  // 2. const { addToCart } = useCart();
  // 3. เปลี่ยนจาก alert() เป็น addToCart(dish);
  // =========================================================================
  const handleAddToCart = (dish) => {
    if (!dish) return;
    alert(
      `เพิ่ม "${dish.name || dish.nameTh || "เมนูอาหาร"}" ลงในตะกร้าเรียบร้อยแล้วครับ!`,
    );
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D2E28] flex flex-col items-center justify-start p-4 md:p-8 font-sans">
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Header Section */}
        <span className="text-xs font-bold tracking-widest text-[#8C7A6B] uppercase mb-1">
          Menu Randomizer
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-[#3D2E28] mb-2 text-center">
          สุ่มเมนูอาหารตามธาตุ
        </h1>
        <p className="text-[#78685A] text-xs md:text-sm mb-8 text-center max-w-md">
          เลือกธาตุเจ้าเรือนของคุณ เพื่อให้เราแนะนำเมนูอาหารปรับสมดุลมื้อนี้
        </p>

        {/* Element Selection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mb-10">
          {["earth", "water", "wind", "fire"].map((key) => {
            const isSelected = selectedElement === key;
            const info = ELEMENT_INFO[key];
            return (
              <button
                key={key}
                onClick={() => {
                  if (!isSpinning) setSelectedElement(key);
                }}
                disabled={isSpinning}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 text-center ${
                  isSelected
                    ? "bg-[#3D2E28] text-white border-[#3D2E28] shadow-lg scale-105"
                    : "bg-[#F9F6F0] text-[#3D2E28] border-[#E8DFD1] hover:bg-[#F2ECE1]"
                } ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {info.img ? (
                  <img
                    src={info.img}
                    alt={info.name}
                    className="w-12 h-12 object-contain mb-3"
                  />
                ) : (
                  <div className="w-12 h-12 mb-3" />
                )}
                <span className="font-bold text-base mb-1">{info.name}</span>
                <span
                  className={`text-[10px] leading-tight ${
                    isSelected ? "text-[#D9C8B4]" : "text-[#8C7A6B]"
                  }`}
                >
                  {info.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wheel Canvas Section */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute -top-3 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-[#3D2E28] drop-shadow-md" />

          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="rounded-full shadow-xl border-8 border-[#F9F6F0] bg-[#FDFBF7]"
          />
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || currentItems.length === 0}
          className={`px-10 py-3.5 rounded-2xl font-bold text-base shadow-md transition-all transform active:scale-95 ${
            isSpinning || currentItems.length === 0
              ? "bg-[#E2D9CC] text-[#A39585] cursor-not-allowed"
              : "bg-[#3D2E28] text-[#F9F6F0] hover:bg-[#2A1F1B]"
          }`}
        >
          {isSpinning ? "กำลังสุ่มเมนู..." : "หมุนวงล้อเสี่ยงทาย"}
        </button>
      </div>

      {/* Result Card Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-[#3D2E28]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#F9F6F0] border border-[#E8DFD1] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-left animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#EFE8DC] text-[#78685A]">
                เมนูตามธาตุ
              </span>
              {result.price && (
                <span className="text-xl font-bold text-[#3D2E28]">
                  ฿{result.price}
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#3D2E28] mb-3">
              {result.name}
            </h2>

            {result.benefit && (
              <p className="text-[#665647] text-sm leading-relaxed mb-8">
                {result.benefit}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={spinWheel}
                className="flex-1 py-3 px-4 bg-[#EFE8DC] hover:bg-[#E4DACB] text-[#3D2E28] font-bold rounded-xl text-sm transition-colors text-center"
              >
                ✨ สุ่มใหม่อีกครั้ง
              </button>
              <button
                onClick={() => handleAddToCart(result)}
                className="flex-1 py-3 px-4 bg-[#3D2E28] hover:bg-[#2A1F1B] text-[#F9F6F0] font-bold rounded-xl text-sm transition-colors text-center"
              >
                🛒 สั่งซื้อเมนูนี้เลย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
