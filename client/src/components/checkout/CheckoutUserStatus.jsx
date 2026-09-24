import React from "react";
import { getTier, tierProgress } from "../../constants/membership";

export default function CheckoutUserStatus({ currentUser }) {
  const points = Number(currentUser.biaPoints ?? currentUser.points) || 0;
  const lifetime = Number(currentUser.lifetimePoints) || points;
  const progress = tierProgress(currentUser.tierStatus, lifetime);
  const tier = getTier(progress.tier);
  const nextTier = progress.nextTier ? getTier(progress.nextTier) : null;

  return (
    <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-8 flex flex-wrap justify-between items-center gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#3d2c2e] text-white flex items-center justify-center font-bold">
          {currentUser.firstName ? currentUser.firstName.charAt(0) : "U"}
        </div>
        <div>
          <h2 className="font-bold text-[#3d2c2e]">
            {currentUser.firstName} {currentUser.lastName}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs px-2.5 py-0.5 bg-[#8d593a] text-white rounded-full font-medium">
              {tier.name} Member
            </span>
            {tier.multiplier > 1 && (
              <span className="text-[10px] font-bold text-[#8d593a]">รับเบี้ย x{tier.multiplier}</span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-[#6f675f]">เบี้ยสะสมปัจจุบัน</p>
        <p className="font-bold text-lg text-[#8d593a]">{points.toLocaleString()} เบี้ย</p>
        {nextTier && (
          <p className="text-[10px] text-[#6f675f]">
            อีก {progress.pointsToNext.toLocaleString()} เบี้ยสะสม ขึ้นเป็น {nextTier.name}
          </p>
        )}
      </div>
    </div>
  );
}
