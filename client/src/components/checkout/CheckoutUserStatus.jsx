import React from "react";

export default function CheckoutUserStatus({ currentUser }) {
  return (
    <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-8 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#3d2c2e] text-white flex items-center justify-center font-bold">
          {currentUser.firstName ? currentUser.firstName.charAt(0) : "U"}
        </div>
        <div>
          <h2 className="font-bold text-[#3d2c2e]">
            {currentUser.firstName} {currentUser.lastName}
          </h2>
          <span className="text-xs px-2.5 py-0.5 bg-[#8d593a] text-white rounded-full font-medium">
            {currentUser.tierStatus} Member
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-[#6f675f]">แต้มสะสมปัจจุบัน</p>
        <p className="font-bold text-lg text-[#8d593a]">
          {currentUser.biaPoints ? currentUser.biaPoints.toLocaleString() : 0}{" "}
          แต้ม
        </p>
      </div>
    </div>
  );
}
