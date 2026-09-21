// client/src/components/checkout/PlanSelector.jsx
import React from "react";
import { SUBSCRIPTION_PLANS } from "../../constants/checkout";

export default function PlanSelector({ selectedPlan, onSelectPlan }) {
  return (
    <div className="mb-8 bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#3d2c2e] mb-3 flex items-center gap-2">
        <span>📦</span> เลือกรูปแบบการสั่งซื้อ
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* A La Carte */}
        <button
          type="button"
          onClick={() => onSelectPlan(null)}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
            selectedPlan === null
              ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
              : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
          }`}
        >
          <div className="font-bold text-sm">A La Carte</div>
          <div className="text-xs opacity-80 mt-0.5">ซื้อแยกรายชุด</div>
        </button>

        {/* Subscription Plans */}
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelectPlan(plan)}
            className={`p-3.5 rounded-2xl border text-center transition-all relative cursor-pointer ${
              selectedPlan?.id === plan.id
                ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
                : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-[#8d593a] text-white px-2 py-0.5 rounded-full font-bold">
                ยอดนิยม
              </span>
            )}
            <div className="font-bold text-sm">{plan.name}</div>
            <div className="text-xs opacity-90 font-semibold mt-0.5">
              ฿{plan.price}/สัปดาห์
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              ({plan.kitsPerWeek} Kits)
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
