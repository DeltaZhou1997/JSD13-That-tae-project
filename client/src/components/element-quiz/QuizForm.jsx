import React, { useState, useEffect, useRef } from "react";
import { QUIZ_QUESTIONS } from "../../data/quizData";
import gsap from "gsap";

export default function QuizForm({
  answers,
  onSelectAnswer,
  onSubmit,
  onBackToIntro,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardContainerRef = useRef(null);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex] || QUIZ_QUESTIONS[0];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // GSAP animation when question changes
  useEffect(() => {
    if (!cardContainerRef.current) return;
    gsap.fromTo(
      cardContainerRef.current,
      { opacity: 0, y: 15, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [currentIndex]);

  const handleOptionClick = (element) => {
    onSelectAnswer(currentQuestion.id, element);

    // เลื่อนไปข้อถัดไปอัตโนมัติอย่างนุ่มนวล
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    } else {
      // ถ้าเป็นข้อสุดท้ายแล้ว เมื่อเลือกข้อนี้ให้คำนวณผลลัพธ์เลย
      setTimeout(() => {
        onSubmit();
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (onBackToIntro) {
      onBackToIntro();
    }
  };

  const progressPercent = Math.round(
    ((currentIndex + 1) / totalQuestions) * 100
  );

  return (
    <div className="max-w-4xl mx-auto py-1 sm:py-2 w-full">
      {/* 1. Header: Stepper วงกลม 5 จุด + เปอร์เซ็นต์ */}
      <div className="mb-3 sm:mb-4 max-w-xl mx-auto">
        <div className="text-center mb-1.5">
          <span className="text-xs font-bold text-[#7A6B63]">
            คำถามที่ {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Stepper เส้นเชื่อมพร้อมจุด */}
          <div className="flex-1 flex items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E8DFD1] rounded-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#8D593A] rounded-full transition-all duration-300 z-0"
              style={{
                width: `${(currentIndex / (totalQuestions - 1)) * 100}%`,
              }}
            />

            <div className="flex justify-between w-full relative z-10">
              {QUIZ_QUESTIONS.map((_, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                      isCurrent
                        ? "bg-[#8D593A] ring-4 ring-[#8D593A]/20 scale-110"
                        : isPassed
                          ? "bg-[#8D593A]"
                          : "bg-[#E2D7C7]"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <span className="text-xs font-bold text-[#7A6B63] w-10 text-right">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* 2. Question Title (พร้อมประกายดาว ✦ ซ้ายขวา) */}
      <div className="text-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-2xl font-bold text-[#3D2E2B] flex items-center justify-center gap-2 flex-wrap leading-snug">
          <span className="text-[#C49758] text-xs sm:text-sm animate-sparkle-1">✦</span>
          <span>{currentQuestion.title}</span>
          <span className="text-[#C49758] text-xs sm:text-sm animate-sparkle-2">✦</span>
        </h2>
      </div>

      {/* 3. ช้อยส์: ในมือถือเป็นแบบ List แนวนอน (รูปซ้าย ข้อความขวา) / ในคอมเป็น 2x2 Grid กว้างขึ้น สมดุลสวยงาม */}
      <div
        ref={cardContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4"
      >
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = answers[currentQuestion.id] === opt.element;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleOptionClick(opt.element)}
              className={`p-2.5 sm:p-3.5 lg:p-4 rounded-2xl sm:rounded-3xl text-left transition-all duration-200 border bg-white flex flex-row sm:flex-col items-center justify-between gap-3 sm:gap-1 cursor-pointer group shadow-2xs hover:shadow-md ${
                isSelected
                  ? "border-[#8D593A] ring-2 ring-[#8D593A] bg-[#FCFAF7]"
                  : "border-[#E8DFD1] hover:border-[#C49758] hover:-translate-y-0.5"
              }`}
            >
              {/* รูปภาพประกอบตัวเลือก (มือถือ: อยู่ซ้ายมือ / คอม: อยู่ด้านบน) */}
              <div className="w-14 h-14 sm:w-full sm:h-24 lg:h-28 flex items-center justify-center shrink-0 sm:mb-1 bg-[#FAF7F2] sm:bg-transparent rounded-xl sm:rounded-none p-1 sm:p-0">
                <img
                  src={opt.image}
                  alt={opt.text}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-2xs"
                />
              </div>

              {/* บล็อกข้อความ (มือถือ: อยู่ขวา ไม่มีเส้นกั้นบน / คอม: มีเส้นกั้นบน) */}
              <div className="w-full flex-1 sm:pt-2 sm:border-t sm:border-[#F2ECE4] min-w-0 text-left sm:text-center">
                <h4 className="font-bold text-xs sm:text-sm lg:text-base text-[#3D2E2B] leading-snug truncate sm:whitespace-normal">
                  {opt.text}
                </h4>
                {opt.subtext && (
                  <p className="text-[11px] sm:text-xs text-[#7A6B63] mt-0.5 leading-tight line-clamp-1 sm:line-clamp-2">
                    {opt.subtext}
                  </p>
                )}
              </div>

              {/* ไอคอน Checkmark วงกลมเมื่อเลือก บนมือถือ */}
              <div className="sm:hidden shrink-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-[#8D593A] border-[#8D593A] text-white"
                      : "border-[#D8C9B9] bg-stone-50 text-transparent"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. ปุ่มย้อนกลับข้อก่อนหน้า */}
      <div className="flex justify-start max-w-xl mx-auto">
        <button
          type="button"
          onClick={handlePrev}
          className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold text-[#63534B] bg-[#EFE9E1] hover:bg-[#E2D8C9] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{currentIndex === 0 ? "กลับหน้าหลัก" : "ข้อย้อนกลับ"}</span>
        </button>
      </div>
    </div>
  );
}