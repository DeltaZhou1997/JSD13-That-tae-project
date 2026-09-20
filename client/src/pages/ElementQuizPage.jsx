// client/src/pages/ElementQuizPage.jsx
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
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#2c1e16]">
      <section className="w-full px-5 py-10 text-center sm:py-12 bg-[#f4ebd9] dark:bg-[#3b2a1a]">
        <p className="text-xs tracking-[0.25em] opacity-60 text-[#8b5e34] dark:text-[#dcb37b] font-bold uppercase">
          ELEMENT ANALYSIS
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl text-[#3b2a1a] dark:text-[#f0e6d8]">
          วิเคราะห์ธาตุเจ้าเรือน
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base opacity-70 text-[#3b2a1a] dark:text-[#f0e6d8]">
          ค้นหาธาตุประจำตัวผ่านคำถาม 5 ข้อ เพื่อปรับสมดุลการรับประทานอาหาร
        </p>
      </section>

      {/* กล่องเนื้อหาแบบทดสอบ / ผลลัพธ์ */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        {!resultElement ? (
          <QuizForm
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onSubmit={handleCalculate}
          />
        ) : (
          <QuizResult resultElement={resultElement} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
