// client/src/components/checkout/PlanSelector.jsx
import React, { useRef } from "react";
import gsap from "gsap";
import { SUBSCRIPTION_PLANS } from "../../constants/checkout";

export default function PlanSelector({ selectedPlan, onSelectPlan }) {
  const isALaCarte = selectedPlan === null;
  const cardsRef = useRef({});

  const handleSelect = (e, plan, key) => {
    const target = e.currentTarget || cardsRef.current[key];
    if (target) {
      gsap.fromTo(
        target,
        { scale: 0.92 },
        { scale: 1, duration: 0.35, ease: "back.out(2.2)" }
      );
    }
    onSelectPlan(plan);
  };

  return (
    <div className="mb-6 bg-[#fdfbf7] border border-[#e8dfd1] rounded-2xl p-4 sm:p-5 shadow-2xs">
      {/* ส่วนหัวแบบกระชับ */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="text-sm sm:text-base font-bold text-[#3d2c2e] flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8d593a]">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span>รูปแบบการสั่งซื้อ</span>
        </h3>
        <span className="text-xs sm:text-sm text-[#8d593a] font-semibold">
          {isALaCarte ? "ซื้อแยกรายชุด (A La Carte)" : `แพ็กเกจ ${selectedPlan.name} (${selectedPlan.kitsPerWeek} Kits)`}
        </span>
      </div>

      {/* Grid Cards ขยายตัวหนังสือ คมชัด มี Reaction สปริงตอนกด */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {/* 1. A La Carte Card */}
        <button
          ref={(el) => (cardsRef.current["alacarte"] = el)}
          type="button"
          onClick={(e) => handleSelect(e, null, "alacarte")}
          className={`rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 active:scale-95 select-none ${
            isALaCarte
              ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md ring-2 ring-[#8d593a]/30 scale-[1.01]"
              : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a] hover:bg-[#faf7f2] hover:-translate-y-0.5 hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm sm:text-base font-bold">A La Carte</span>
            {isALaCarte && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div className={`text-xs sm:text-sm font-semibold ${isALaCarte ? "text-stone-200" : "text-[#8d593a]"}`}>
            ซื้อแยกตามชุด
          </div>
          <div className={`text-xs mt-2 pt-2 border-t border-current/10 font-medium ${isALaCarte ? "text-stone-300" : "text-stone-500"}`}>
            ไม่จำกัดจำนวน
          </div>
        </button>

        {/* 2. Subscription Plans Cards */}
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;

          return (
            <button
              key={plan.id}
              ref={(el) => (cardsRef.current[plan.id] = el)}
              type="button"
              onClick={(e) => handleSelect(e, plan, plan.id)}
              className={`rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 active:scale-95 select-none ${
                isSelected
                  ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md ring-2 ring-[#8d593a]/30 scale-[1.01]"
                  : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a] hover:bg-[#faf7f2] hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm sm:text-base font-bold">{plan.name}</span>
                {isSelected && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className={`text-sm sm:text-base font-extrabold ${isSelected ? "text-white" : "text-[#8d593a]"}`}>
                ฿{plan.price.toLocaleString()}
                <span className={`text-xs font-normal ml-0.5 ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                  /สัปดาห์
                </span>
              </div>
              <div className={`text-xs mt-2 pt-2 border-t border-current/10 font-medium ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                {plan.kitsPerWeek} Kits
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
