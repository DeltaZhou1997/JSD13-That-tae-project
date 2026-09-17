import React from "react";
import { ELEMENT_INFO } from "../../data/quizData";

export default function QuizResult({ resultElement, onReset }) {
  const info = ELEMENT_INFO[resultElement];

  if (!info) return null;

  return (
    <div className="max-w-xl mx-auto bg-[#F8F5EE] border border-[#EBE4D8] rounded-2xl p-6 text-center space-y-4 shadow-sm">
      <div className="inline-block px-3 py-1 bg-[#EBE4D8] text-[#3D2E2B] text-xs font-bold rounded-full uppercase tracking-wider">
        ผลการวิเคราะห์ธาตุเจ้าเรือน
      </div>

      {info.icon && (
        <div className="flex justify-center my-2">
          <img
            src={info.icon}
            alt={info.nameTh}
            className="w-24 h-24 object-contain drop-shadow-sm"
          />
        </div>
      )}

      <h2 className="text-3xl font-black text-[#3D2E2B] mt-1">{info.nameTh}</h2>

      <p className="text-xs text-[#8C7B73] font-medium">
        (กลุ่มเดือนเกิดตามตำรา: {info.months})
      </p>

      <div className="bg-white p-5 rounded-xl text-left text-sm space-y-3 border border-[#E5DDD0] text-[#4A3B35] leading-relaxed">
        <div>
          <strong className="text-[#3D2E2B] block mb-1">
            🌿 ลักษณะธาตุประจำตัว:
          </strong>
          <p className="text-xs text-[#63534B]">{info.desc}</p>
        </div>
        <div className="pt-2 border-t border-[#F2EDE4]">
          <strong className="text-[#3D2E2B] block mb-1">
            🍲 อาหารที่ช่วยปรับสมดุล:
          </strong>
          <p className="text-xs text-[#63534B]">{info.advice}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full py-3 bg-[#3D2E2B] hover:bg-[#2A1F1D] text-white font-bold rounded-xl text-sm transition-all shadow-md"
      >
        ทำแบบทดสอบอีกครั้ง
      </button>
    </div>
  );
}
