import React, { useState } from "react";
import QuizForm from "../components/element-quiz/QuizForm";
import QuizResult from "../components/element-quiz/QuizResult";
import { calculatePrimaryElement } from "../utils/quizHelpers";

export default function ElementQuizPage() {
  const [answers, setAnswers] = useState({});
  const [resultElement, setResultElement] = useState(null);

  const handleSelectAnswer = (questionId, element) => {
    setAnswers((prev) => ({ ...prev, [questionId]: element }));
  };

  const handleCalculate = () => {
    const topElement = calculatePrimaryElement(answers);
    setResultElement(topElement);
  };

  const handleReset = () => {
    setAnswers({});
    setResultElement(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#8C7B73] tracking-widest uppercase block mb-1">
            ELEMENT ANALYSIS
          </span>
          <h1 className="text-3xl font-black text-[#3D2E2B] tracking-tight mb-2">
            วิเคราะห์ธาตุเจ้าเรือน
          </h1>
          <p className="text-xs text-[#63534B]">
            ค้นหาธาตุประจำตัวผ่านคำถาม 5 ข้อ เพื่อปรับสมดุลการรับประทานอาหาร
          </p>
        </div>

        {!resultElement ? (
          <QuizForm
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onSubmit={handleCalculate}
          />
        ) : (
          <QuizResult resultElement={resultElement} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
