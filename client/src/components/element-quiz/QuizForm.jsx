import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "../../data/quizData";
import lotusOrnament from "../../assets/quiz/quiz_head.png";

export default function QuizForm({ answers, onSelectAnswer, onSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleOptionClick = (element) => {
    onSelectAnswer(currentQuestion.id, element);

    // Auto next question if not last
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250); // ดีเลย์เล็กน้อยให้เห็นแอนิเมชันตอนเลือก
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isAllAnswered = Object.keys(answers).length === totalQuestions;
  const progressPercent = Math.round(
    ((currentIndex + 1) / totalQuestions) * 100,
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* 1. Progress Bar & Step Indicator */}
      <div className="mb-6 max-w-xl mx-auto">
        <div className="flex justify-between items-center text-xs font-bold text-[#63534B] mb-2">
          <span>
            คำถามที่ {currentIndex + 1} จาก {totalQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#EFE9E1] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3D2E2B] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Main Question Card */}
      <div className="bg-[#FAF8F5] border border-[#EBE4D8] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        {/* ลวดลายประดับด้านบนหัวข้อคำถาม */}
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="h-[1px] w-12 sm:w-16 bg-[#D8CEBE]"></div>
          <img
            src={lotusOrnament}
            alt="ประดับ"
            className="w-10 h-10 sm:w-8 sm:h-8 object-contain"
          />
          <div className="h-[1px] w-12 sm:w-16 bg-[#D8CEBE]"></div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#3D2E2B] mb-8 text-center leading-relaxed">
          {currentQuestion.title}
        </h3>

        {/* 3. Grid 2 Columns (ช้อยส์แบบ 2x2 ตามภาพอ้างอิง) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = answers[currentQuestion.id] === opt.element;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(opt.element)}
                className={`relative p-4 rounded-2xl text-left transition-all border flex items-center gap-4 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-[#5A3E36] bg-[#F7F2EB] shadow-sm ring-1 ring-[#5A3E36]"
                    : "border-[#E8DFD1] bg-white hover:border-[#8C7B73] hover:bg-[#FAF7F2]"
                }`}
              >
                {/* ไอคอนเครื่องหมายถูกที่มุมขวาบนเมื่อถูกเลือก */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#5A3E36] text-white rounded-full flex items-center justify-center text-[10px] shadow-sm animate-in zoom-in duration-150">
                    ✓
                  </div>
                )}

                {/* รูปภาพประกอบของแต่ละช้อยส์ (เช่น quiz1_c1.png) */}
                <div className="w-28 h-24 sm:w-32 sm:h-28 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={opt.image}
                    alt={opt.text}
                    className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* ข้อความและตัวอักษร A, B, C, D */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#8D593A] text-white"
                          : "bg-[#A68A78] text-white"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-bold text-sm text-[#3D2E2B] truncate block">
                      {opt.text}
                    </span>
                  </div>
                  {opt.subtext && (
                    <p className="text-[11px] text-[#7A6B63] leading-tight truncate">
                      {opt.subtext}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Navigation Buttons */}
      <div className="flex justify-between items-center gap-4 max-w-xl mx-auto">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#63534B] bg-[#EFE9E1] hover:bg-[#E5DDD0] disabled:opacity-0 disabled:cursor-default transition-all cursor-pointer"
        >
          ← ข้อย้อนกลับ
        </button>

        {isLastQuestion && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isAllAnswered}
            className="px-8 py-3 bg-[#3D2E2B] hover:bg-[#8D593A] text-white font-bold rounded-xl shadow-md transition-all text-xs disabled:opacity-50 cursor-pointer"
          >
            วิเคราะห์ผลลัพธ์ ✨
          </button>
        )}
      </div>
    </div>
  );
}
