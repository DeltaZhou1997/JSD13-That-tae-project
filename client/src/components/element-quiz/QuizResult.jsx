import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ELEMENT_INFO } from "../../data/quizData";
import { useAuth } from "../../context/AuthContext.js";
import gsap from "gsap";

// ข้อมูลคำคมและลักษณะเด่นเฉพาะธาตุ (ใช้ SVG แทน Emoji)
const ELEMENT_RESULT_DETAILS = {
  water: {
    titleColor: "text-[#2B6CB0]",
    badgeBg: "bg-[#EBF8FF] text-[#2B6CB0] border-[#BEE3F8]",
    quote: '"อ่อนโยน แต่ปรับตัวเก่ง"',
    emotion: "รู้สึกไว ใส่ใจคนรอบข้าง ใจดีและมีความสดชื่น",
    health: "ระบบไหลเวียนดี อาจไวต่อความเครียดหรืออากาศเย็น",
    food: "อาหารที่ช่วยเติมน้ำ รสเปรี้ยว ขม เช่น ซุป ผัก ผลไม้",
    badgeSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#2B6CB0]">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  earth: {
    titleColor: "text-[#8D593A]",
    badgeBg: "bg-[#FDF6E2] text-[#8D593A] border-[#F2E0BD]",
    quote: '"หนักแน่น มั่นคง และอดทนสูง"',
    emotion: "สุขุม ใจเย็น มีความรับผิดชอบและน่าเชื่อถือ",
    health: "กระดูกและกล้ามเนื้อแข็งแรง แต่อาจเผาผลาญช้า",
    food: "อาหารรสฝาด หวาน มัน เค็ม เช่น แกงเลียง ฟักทอง ธัญพืช",
    badgeSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8D593A]">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  air: {
    titleColor: "text-[#2F855A]",
    badgeBg: "bg-[#F0FFF4] text-[#2F855A] border-[#C6F6D5]",
    quote: '"คล่องแคล่ว ปราดเปรียว ว่องไว"',
    emotion: "คิดเร็ว ทำเร็ว ช่างเจรจา ตื่นตัวและปรับตัวเก่ง",
    health: "ระบบประสาทไว อาจมีลมในท้องเยอะ ท้องอืดง่าย",
    food: "อาหารรสเผ็ดร้อน หอมเครื่องเทศ เช่น ขิง ข่า กะเพรา ขับลม",
    badgeSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#2F855A]">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
  },
  fire: {
    titleColor: "text-[#C53030]",
    badgeBg: "bg-[#FFF5F5] text-[#C53030] border-[#FED7D7]",
    quote: '"กระตือรือร้น เปี่ยมด้วยพลังและมุ่งมั่น"',
    emotion: "ตรงไปตรงมา มีความเป็นผู้นำ กล้าได้กล้าเสีย",
    health: "ระบบเผาผลาญสูง ขี้ร้อน หิวง่าย อาจเป็นร้อนในบ่อย",
    food: "อาหารรสขม เย็น จืด เช่น แกงจืด มะระ สมุนไพรดับร้อน",
    badgeSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C53030]">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
};

export default function QuizResult({ resultElement, onReset }) {
  const { currentUser } = useAuth();
  const containerRef = useRef(null);

  const info = ELEMENT_INFO[resultElement] || ELEMENT_INFO.water;
  const detail =
    ELEMENT_RESULT_DETAILS[resultElement] || ELEMENT_RESULT_DETAILS.water;

  // Animate enter with GSAP
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.2)" }
    );
  }, [resultElement]);

  return (
    <div
      ref={containerRef}
      className="max-w-5xl mx-auto py-1 sm:py-2 px-2 sm:px-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
        {/* ========================================= */}
        {/* ฝั่งซ้าย: สัญลักษณ์ธาตุ + หัวข้อ + คำคม   */}
        {/* ========================================= */}
        <div className="lg:col-span-5 flex flex-col items-center text-center space-y-2 sm:space-y-3">
          {/* หัวข้อบนสุด พร้อมดาวประกายวิบวับรอบตัวอักษร */}
          <div className="relative inline-block">
            <span className="absolute -top-3 -left-6 sm:-left-8 text-[#E0A955] text-lg animate-sparkle-1 pointer-events-none">
              ✦
            </span>
            <span className="absolute top-2 -right-6 sm:-right-8 text-[#E5B56A] text-base animate-sparkle-2 pointer-events-none">
              ✦
            </span>
            <span className="absolute -bottom-2 -left-4 text-[#C49758] text-sm animate-sparkle-3 pointer-events-none">
              ✦
            </span>
            <span className="absolute bottom-1 -right-4 text-[#E0A955] text-lg animate-sparkle-1 pointer-events-none">
              ✦
            </span>

            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#C49758] font-bold mb-0.5">
              <span className="animate-sparkle-1">✦</span>
              <span>ผลลัพธ์ของคุณ</span>
              <span className="animate-sparkle-2">✦</span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#7A6B63]">คุณคือ...</p>

            <h2
              className={`text-3xl sm:text-4xl lg:text-4xl font-black mt-0.5 tracking-tight flex items-center justify-center gap-1.5 ${detail.titleColor}`}
            >
              <span className="text-xl animate-sparkle-3">✦</span>
              <span>{info.nameTh}</span>
              <span className="text-xl animate-sparkle-2">✦</span>
            </h2>
          </div>

          {/* ภาพตราสัญลักษณ์ธาตุ (ลอย + มีดาววิบวับล้อมรอบ) */}
          <div className="relative flex justify-center items-center py-1 w-full">
            <div className="absolute top-1 left-4 text-[#E0A955] text-lg animate-sparkle-1 pointer-events-none z-10">
              ✦
            </div>
            <div className="absolute top-4 right-4 text-[#E5B56A] text-base animate-sparkle-2 pointer-events-none z-10">
              ✦
            </div>
            <div className="absolute bottom-2 left-6 text-[#C49758] text-sm animate-sparkle-3 pointer-events-none z-10">
              ✦
            </div>
            <div className="absolute bottom-4 right-6 text-[#E0A955] text-lg animate-sparkle-1 pointer-events-none z-10">
              ✦
            </div>

            {/* รูปสัญลักษณ์ธาตุ พร้อมอนิเมชันลอย animate-float */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center animate-float">
              <img
                src={info.icon}
                alt={info.nameTh}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* ป้ายคำคมประจำธาตุ */}
          <div>
            <div className="bg-[#F5EDE0] border border-[#E8DFD1] text-[#4A3228] px-4 py-1.5 rounded-full inline-block font-bold text-xs shadow-xs">
              {detail.quote}
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* ฝั่งขวา: รายละเอียดเด่น + กล่องบันทึก + ปุ่มแอ็กชัน */}
        {/* ========================================= */}
        <div className="lg:col-span-7 flex flex-col space-y-3 text-left">
          {/* กล่องสถานะการบันทึกลงระบบบัญชี */}
          {currentUser ? (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium shadow-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-emerald-600 shrink-0"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>
                บันทึก <strong>{info.nameTh}</strong> เข้าสู่ระบบบัญชีของคุณแล้ว — เมื่อเลือกดูเมนู ระบบจะแนะนำธาตุนี้ให้อัตโนมัติ
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-xs">
              <span>บันทึกผลไว้ในเครื่องแล้ว ล็อกอินเพื่อผูกกับบัญชีถาวร</span>
              <Link
                to="/login"
                className="font-bold underline text-amber-950 hover:text-[#4A3228] ml-2 shrink-0"
              >
                เข้าสู่ระบบ &rarr;
              </Link>
            </div>
          )}

          {/* กล่องการ์ดสรุป "ธาตุของคุณเด่นเรื่อง" */}
          <div className="bg-white border border-[#E8DFD1] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-[#3D2E2B] pb-1.5 border-b border-[#F0EAE1] flex items-center gap-1.5">
              <span className="text-[#C49758] text-xs">✦</span>
              <span>ลักษณะเด่นของ {info.nameTh}</span>
              <span className="text-[#C49758] text-xs">✦</span>
            </h3>

            <div className="space-y-2.5 text-xs sm:text-[13px] text-[#4A3B35]">
              {/* อารมณ์ */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-[#3D2E2B]">อารมณ์ดี :</strong>{" "}
                  <span className="text-[#63534B] leading-relaxed">{detail.emotion}</span>
                </div>
              </div>

              {/* สุขภาพ */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <div>
                  <strong className="text-[#3D2E2B]">สุขภาพ :</strong>{" "}
                  <span className="text-[#63534B] leading-relaxed">{detail.health}</span>
                </div>
              </div>

              {/* อาหารแนะนำ */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="M18 10a6 6 0 0 1-12 0" />
                    <line x1="4" y1="10" x2="20" y2="10" />
                    <path d="M12 2v2" />
                  </svg>
                </div>
                <div>
                  <strong className="text-[#3D2E2B]">อาหารแนะนำ :</strong>{" "}
                  <span className="text-[#63534B] leading-relaxed">{detail.food}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่มดูคำแนะนำเพิ่มเติม และทำใหม่อีกครั้ง */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              to={`/menus?element=${resultElement}`}
              className="flex-1 px-5 py-3 bg-[#8D593A] hover:bg-[#72462C] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M18 10a6 6 0 0 0-12 0" />
                <line x1="4" y1="10" x2="20" y2="10" />
              </svg>
              <span>ดูคำแนะนำและเมนูเพิ่มเติม</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={onReset}
              className="px-4 py-3 bg-white border border-[#E8DFD1] hover:border-[#8D593A] text-[#63534B] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 text-center"
            >
              ทำแบบทดสอบใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
