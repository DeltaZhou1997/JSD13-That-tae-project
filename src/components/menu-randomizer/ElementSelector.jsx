import React from "react";
import earthIcon from "../../assets/element-earth.png";
import waterIcon from "../../assets/element-water.png";
import airIcon from "../../assets/element-wind.png";
import fireIcon from "../../assets/element-fire.png";

const ELEMENTS = [
  { id: "earth", name: "ธาตุดิน", icon: earthIcon, taste: "ฝาด หวาน มัน เค็ม" },
  { id: "water", name: "ธาตุน้ำ", icon: waterIcon, taste: "เปรี้ยว ขม" },
  { id: "air", name: "ธาตุลม", icon: airIcon, taste: "เผ็ดร้อน" },
  { id: "fire", name: "ธาตุไฟ", icon: fireIcon, taste: "ขม เย็น จืด" },
];

export default function ElementSelector({ selectedElement, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ELEMENTS.map((item) => {
        const isSelected = selectedElement === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all border ${
              isSelected
                ? "border-[#3D2E2B] bg-[#3D2E2B] text-white shadow-md transform scale-[1.02]"
                : "border-[#EBE4D8] bg-[#F8F5EE] text-[#4A3B35] hover:border-[#3D2E2B] hover:bg-white"
            }`}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-12 h-12 object-contain mb-2 drop-shadow-sm"
            />
            <span className="font-bold text-sm">{item.name}</span>
            <span
              className={`text-[10px] mt-0.5 ${
                isSelected ? "text-[#E5DDD0]" : "text-[#8C7B73]"
              }`}
            >
              รสชาติ: {item.taste}
            </span>
          </button>
        );
      })}
    </div>
  );
}
