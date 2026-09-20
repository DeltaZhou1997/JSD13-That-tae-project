import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "../../data/quizData";

export default function QuizForm({ answers, onSelectAnswer, onSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleOptionClick = (element) => {
    onSelectAnswer(currentQuestion.id, element);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
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
    <div className="max-w-xl mx-auto">
      {/* Progress Bar & Step Indicator */}
      <div className="mb-6">
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

      {/* Card คำถาม */}
      <div className="bg-[#F8F5EE] border border-[#EBE4D8] rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-xl font-bold text-[#3D2E2B] mb-6 text-center leading-relaxed">
          {currentQuestion.title}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = answers[currentQuestion.id] === opt.element;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(opt.element)}
                className={`w-full p-4 text-left rounded-xl text-sm font-medium transition-all border ${
                  isSelected
                    ? "border-[#3D2E2B] bg-[#3D2E2B] text-white shadow-md transform scale-[1.01]"
                    : "border-[#E5DDD0] bg-white text-[#4A3B35] hover:border-[#3D2E2B] hover:bg-[#FAF7F2]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? "border-white bg-white text-[#3D2E2B]"
                        : "border-[#D1C7BD] text-[#8C7B73]"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#63534B] bg-[#EFE9E1] hover:bg-[#E5DDD0] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ← ข้อย้อนกลับ
        </button>

        {isLastQuestion && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isAllAnswered}
            className="flex-1 py-3 bg-[#3D2E2B] hover:bg-[#2A1F1D] text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
          >
            วิเคราะห์ผลลัพธ์ ✨
          </button>
        )}
      </div>
    </div>
  );
}
