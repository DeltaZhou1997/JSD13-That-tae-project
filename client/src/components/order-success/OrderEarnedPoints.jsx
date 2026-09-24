import React from "react";
import { BAHT_PER_POINT } from "../../constants/membership";

// เบี้ยจากคำสั่งซื้อนี้ (ข้อมูลจริงจาก Order) — ได้รับจริงหลังชำระเงินสำเร็จ
export default function OrderEarnedPoints({ points = 0, awarded = false, order = {} }) {
  const redeemed = Number(order.pointsRedeemed) || 0;

  if (!points || points <= 0) {
    return (
      <div className="bg-[#f7f5f0] border border-[#e8dfd1] rounded-2xl p-4 mb-6">
        <p className="text-xs text-[#8c827a] font-semibold">
          💡 ทุก ๆ ฿{BAHT_PER_POINT} ได้รับ 1 เบี้ย • กล่องแพ็กเกจยิ่งใหญ่ยิ่งได้เบี้ยคุ้ม
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-6">
      <p className="text-xs text-[#8d593a] font-semibold">
        {awarded ? "เบี้ยที่ได้รับจากคำสั่งซื้อนี้" : "เบี้ยที่จะได้รับหลังชำระเงินสำเร็จ"}
      </p>
      <p className="text-2xl font-bold text-[#3d2c2e] mt-0.5">+{points.toLocaleString()} เบี้ย 🪙</p>
      {redeemed > 0 && (
        <p className="mt-1 text-[11px] text-[#7a5c4d]">
          ใช้ไป {redeemed.toLocaleString()} เบี้ย เป็นส่วนลด ฿{Number(order.pointsDiscount || 0).toLocaleString()}
        </p>
      )}
    </div>
  );
}
