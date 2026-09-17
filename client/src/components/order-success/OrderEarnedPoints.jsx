import React from "react";

export default function OrderEarnedPoints({ points }) {
  // 🟢 ถ้าไม่ได้แต้ม (แต้มเป็น 0 หรือ undefined) ให้แสดงกล่องแจ้งเงื่อนไข
  if (!points || points <= 0) {
    return (
      <div className="bg-[#f7f5f0] border border-[#e8dfd1] rounded-2xl p-4 mb-6">
        <p className="text-xs text-[#8c827a] font-semibold">
          💡 สั่งซื้อครบ ฿1,499 ขึ้นไปในครั้งถัดไป เพื่อเริ่มสะสมแต้มสมาชิก
        </p>
      </div>
    );
  }

  // 🟢 ถ้าได้แต้ม ให้แสดงตามปกติ
  return (
    <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-6">
      <p className="text-xs text-[#8d593a] font-semibold">
        แต้มสะสมที่จะได้รับจากคำสั่งซื้อนี้
      </p>
      <p className="text-2xl font-bold text-[#3d2c2e] mt-0.5">
        +{points} Points 🌟
      </p>
    </div>
  );
}
