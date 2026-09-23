// client/src/pages/ElementQuizPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import QuizForm from "../components/element-quiz/QuizForm";
import QuizResult from "../components/element-quiz/QuizResult";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";
import {
  calculatePrimaryElement,
  getUserElement,
  ELEMENT_TH_TO_EN,
} from "../utils/quizHelpers";
import gsap from "gsap";

// รูปภาพประกอบสำหรับหน้าเริ่มต้น
import fourElementsHero from "../assets/feature-four-elements.png";
import earthIcon from "../assets/element-earth.png";
import waterIcon from "../assets/element-water.png";
import airIcon from "../assets/element-wind.png";
import fireIcon from "../assets/element-fire.png";

const ELEMENT_TH_MAP = {
  earth: "ดิน",
  water: "น้ำ",
  air: "ลม",
  fire: "ไฟ",
};

export default function ElementQuizPage() {
  const location = useLocation();
  const { currentUser, accessToken, updateUser } = useAuth();
  const toast = useToast();
  const stageContainerRef = useRef(null);

  // ตรวจสอบว่ามาจากการสมัครสมาชิกหรือไม่
  const isFromRegister = Boolean(location.state?.fromRegister);

  // ตรวจสอบว่าผู้ใช้เคยทำแบบทดสอบไปแล้วหรือไม่ (จาก currentUser หรือ localStorage)
  const existingElementTh = useMemo(() => getUserElement(currentUser), [currentUser]);
  const existingElementId = useMemo(() => {
    if (!existingElementTh) return null;
    return ELEMENT_TH_TO_EN[existingElementTh] || existingElementTh;
  }, [existingElementTh]);

  // สถานะหน้า: 'intro' (หน้าเริ่ม) ➔ 'quiz' (ทำแบบทดสอบ) ➔ 'result' (ดูผล)
  // ถ้าสมาชิกคนนั้นเคยทำไปแล้ว ให้จำค่าไว้และเปิดหน้าผลลัพธ์เดิมให้อัตโนมัติ (แต่สามารถกดทำใหม่ได้)
  const [quizStage, setQuizStage] = useState(() => {
    if (location.state?.autoStart) return "quiz";
    if (existingElementId && !location.state?.forceRetake) return "result";
    return "intro";
  });
  const [answers, setAnswers] = useState({});
  const [resultElement, setResultElement] = useState(() => {
    if (location.state?.autoStart) return null;
    return existingElementId || null;
  });
  const [isSavedToBackend, setIsSavedToBackend] = useState(
    Boolean(currentUser?.element || currentUser?.bodyElement)
  );

  // เมื่อ currentUser โหลดเสร็จ ถ้ายังไม่มี resultElement แต่มีประวัติ ให้จำค่าไว้
  useEffect(() => {
    if (existingElementId && !resultElement && quizStage === "intro") {
      setResultElement(existingElementId);
    }
  }, [existingElementId, resultElement, quizStage]);

  // Animate stage switch smoothly with GSAP
  useEffect(() => {
    if (!stageContainerRef.current) return;
    gsap.fromTo(
      stageContainerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [quizStage]);

  const handleStart = () => {
    setAnswers({});
    setResultElement(null);
    setIsSavedToBackend(false);
    setQuizStage("quiz");
  };

  const handleSelectAnswer = (questionId, element) => {
    setAnswers((prev) => ({ ...prev, [questionId]: element }));
  };

  const handleCalculate = async () => {
    const topElement = calculatePrimaryElement(answers);
    const elementTh = ELEMENT_TH_MAP[topElement] || topElement;
    setResultElement(topElement);
    setQuizStage("result");

    // บันทึกลงใน localStorage เสมอ
    try {
      localStorage.setItem("userElement", elementTh);
      localStorage.setItem(
        "quizResult",
        JSON.stringify({
          id: topElement,
          element: elementTh,
          timestamp: new Date().toISOString(),
          answers,
        })
      );
    } catch (e) {
      console.error("Failed to save quizResult to localStorage:", e);
    }

    // ถ้าผู้ใช้ล็อกอินอยู่ ให้บันทึกธาตุเจ้าเรือนลงระบบ (API + AuthContext)
    if (currentUser) {
      try {
        updateUser({ element: elementTh, bodyElement: elementTh });

        const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
        const userId = currentUser.id || currentUser._id;
        const res = await fetch(`${apiUrl}/api/v2/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            element: elementTh,
            bodyElement: elementTh,
          }),
        });

        if (res.ok) {
          setIsSavedToBackend(true);
          toast.success(
            `บันทึกธาตุเจ้าเรือน (ธาตุ${elementTh}) ลงในระบบของคุณเรียบร้อยแล้ว`
          );
        } else {
          setIsSavedToBackend(true);
          toast.success(`บันทึกธาตุเจ้าเรือน (ธาตุ${elementTh}) เรียบร้อยแล้ว`);
        }
      } catch (err) {
        console.error("Error saving element to backend:", err);
        setIsSavedToBackend(false);
      }
    }
  };

  // รีเซ็ตเพื่อทำแบบทดสอบใหม่อีกครั้งทันที
  const handleReset = () => {
    setAnswers({});
    setResultElement(null);
    setIsSavedToBackend(false);
    setQuizStage("quiz");
  };

  return (
    <div className="w-full lg:h-[calc(100vh-9.75rem)] lg:max-h-[calc(100vh-9.75rem)] min-h-[calc(100vh-9.75rem)] bg-[#FAF7F2] text-[#2F2119] flex flex-col justify-center py-2 sm:py-3 lg:py-0 px-4 sm:px-6 relative overflow-y-auto lg:overflow-hidden">
      <div className="max-w-6xl mx-auto w-full my-auto flex flex-col justify-center">
        {/* แถบต้อนรับพิเศษสำหรับสมาชิกใหม่ */}
        {isFromRegister && quizStage !== "result" && (
          <div className="mb-3 p-3 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-800 shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-700">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">ยินดีต้อนรับสมาชิกใหม่!</p>
                <p className="text-xs text-amber-900">
                  กรุณาทำแบบทดสอบเพื่อค้นหาและบันทึกธาตุเจ้าเรือนประจำตัวของคุณเข้าสู่ระบบ
                </p>
              </div>
            </div>
            {quizStage === "intro" && (
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-1.5 bg-[#4A3228] text-white text-xs font-bold rounded-full hover:bg-[#634335] transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>เริ่มทำทันที</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Dynamic Animated Content Container */}
        <div ref={stageContainerRef}>
          {/* 1. หน้าเริ่มต้น (INTRO STAGE) */}
          {quizStage === "intro" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 relative">
              {/* ฝั่งซ้าย: ข้อความ */}
              <div className="lg:col-span-5 text-center lg:text-left space-y-5 relative">
                <div className="absolute -top-5 left-4 lg:-left-6 text-[#E0A955] text-xl animate-sparkle-1 pointer-events-none">
                  ✦
                </div>
                <div className="absolute top-10 right-4 lg:-right-4 text-[#E5B56A] text-2xl animate-sparkle-2 pointer-events-none">
                  ✦
                </div>
                <div className="absolute bottom-16 left-6 text-[#C49758] text-base animate-sparkle-3 pointer-events-none">
                  ✦
                </div>

                {/* ป้ายหัวข้อเล็ก ELEMENT QUIZ */}
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C49758] font-bold">
                  <span className="animate-sparkle-1">✦</span>
                  <span>ELEMENT QUIZ</span>
                  <span className="animate-sparkle-2">✦</span>
                </div>

                {/* หัวข้อใหญ่ */}
                <h1 className="text-3xl sm:text-5xl font-black text-[#3D2E2B] leading-tight relative">
                  <span className="absolute -top-7 -left-4 text-[#E0A955] text-2xl animate-sparkle-2 hidden sm:inline">
                    ✦
                  </span>
                  ค้นพบธาตุประจำตัว <br className="hidden sm:inline" />
                  ของคุณ
                  <span className="text-[#C49758] text-2xl ml-2 inline-block animate-sparkle-1">
                    ✦
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[#7A6B63] max-w-md mx-auto lg:mx-0 leading-relaxed">
                  เลือกธาตุที่ตรงกับธาตุเจ้าเรือนของคุณ แล้วค้นหาเมนู
                  &lsquo;Cooking Kit&rsquo; ที่ใช่
                </p>

                {/* ถ้ามีประวัติผลทดสอบเดิม แสดงปุ่มดูผลลัพธ์เดิม */}
                {existingElementTh && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 max-w-md mx-auto lg:mx-0">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-700 shrink-0">
                        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                      </svg>
                      <span>ธาตุของคุณที่เคยบันทึกไว้: <strong>ธาตุ{existingElementTh}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResultElement(existingElementId);
                        setQuizStage("result");
                      }}
                      className="px-3 py-1 bg-[#8D593A] text-white font-bold text-[11px] rounded-full hover:bg-[#6e432a] transition cursor-pointer shrink-0"
                    >
                      ดูผลวิเคราะห์
                    </button>
                  </div>
                )}

                {/* ปุ่มเริ่มทำแบบทดสอบ */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStart}
                    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#4A3228] hover:bg-[#634335] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm cursor-pointer group hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{existingElementTh ? "ทำแบบทดสอบใหม่" : "เริ่มทำแบบทดสอบ"}</span>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* ฝั่งกลาง: ภาพวาด 4 ภูติธาตุในกรอบทอง */}
              <div className="lg:col-span-5 flex justify-center relative py-4">
                <div className="absolute -top-2 right-6 text-[#E0A955] text-xl animate-sparkle-1 pointer-events-none z-20">
                  ✦
                </div>
                <div className="absolute top-1/2 -left-4 text-[#E5B56A] text-lg animate-sparkle-3 pointer-events-none z-20">
                  ✦
                </div>
                <div className="absolute -bottom-2 left-8 text-[#C49758] text-xl animate-sparkle-2 pointer-events-none z-20">
                  ✦
                </div>

                <div className="relative p-4 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-[#E8DFD1] rounded-[2.5rem] shadow-sm max-w-md w-full animate-float">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-6 bg-[#3D2E2B]/10 rounded-full blur-md -z-10"></div>
                  <div className="border border-[#D4C5B0] rounded-3xl p-3 bg-[#FAF8F5]">
                    <img
                      src={fourElementsHero}
                      alt="4 ธาตุเจ้าเรือน"
                      className="w-full h-auto object-contain rounded-2xl drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* ฝั่งขวา: การ์ด 4 สัญลักษณ์ธาตุเรียงตามแนวตั้ง */}
              <div className="lg:col-span-2 hidden lg:flex flex-col gap-3 justify-center items-center">
                {[
                  {
                    name: "ธาตุดิน",
                    icon: earthIcon,
                    bg: "hover:border-[#8D593A]",
                  },
                  {
                    name: "ธาตุน้ำ",
                    icon: waterIcon,
                    bg: "hover:border-[#3182CE]",
                  },
                  { name: "ธาตุลม", icon: airIcon, bg: "hover:border-[#38A169]" },
                  {
                    name: "ธาตุไฟ",
                    icon: fireIcon,
                    bg: "hover:border-[#DD6B20]",
                  },
                ].map((elem, idx) => (
                  <div
                    key={idx}
                    className={`w-24 h-24 bg-white border border-[#E8DFD1] rounded-2xl p-2.5 flex items-center justify-center shadow-xs transition-all duration-300 hover:scale-105 cursor-pointer ${elem.bg}`}
                    title={elem.name}
                  >
                    <img
                      src={elem.icon}
                      alt={elem.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. หน้าตอบคำถาม (QUIZ STAGE) */}
          {quizStage === "quiz" && (
            <QuizForm
              answers={answers}
              onSelectAnswer={handleSelectAnswer}
              onSubmit={handleCalculate}
              onBackToIntro={() => setQuizStage("intro")}
            />
          )}

          {/* 3. หน้าสรุปผลลัพธ์ (RESULT STAGE) */}
          {quizStage === "result" && resultElement && (
            <QuizResult
              resultElement={resultElement}
              onReset={handleReset}
              isSavedToBackend={isSavedToBackend}
            />
          )}
        </div>
      </div>
    </div>
  );
}