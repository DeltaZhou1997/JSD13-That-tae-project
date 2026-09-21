import React from "react";

export default function PromptPayModal({
  modalState, // 'WAITING' | 'FAILED' | null
  onClose,
  countdown,
  promptPayQrUrl,
  grandTotal,
  orderId,
  onConfirmSuccess, // ปุ่มจำลองสำเร็จ
  onSimulateFail, // ปุ่มจำลองล้มเหลว
  onRetry, // สแกนใหม่
  onSwitchToCod, // เปลี่ยนเป็น COD
}) {
  if (!modalState) return null;

  // แปลงวินาทีเป็น MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#ebe4dc] text-center relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* ============================================================ */}
        {/* 1. สถานะ: กำลังรอการชำระเงิน (WAITING)                       */}
        {/* ============================================================ */}
        {modalState === "WAITING" && (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f6ede5] text-[#8d593a] rounded-full text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#8d593a] animate-ping"></span>
              รอการชำระเงินผ่านพร้อมเพย์
            </div>
            <h3 className="text-xl font-bold text-[#3d2c2e] mb-1">
              สแกน QR Code เพื่อชำระเงิน
            </h3>
            <p className="text-xs text-[#6f675f] mb-4">
              กรุณาเปิดแอปธนาคารและสแกนภายในเวลาที่กำหนด
            </p>

            <div className="inline-block bg-[#fcf8f2] border border-[#e8dfd1] px-4 py-1.5 rounded-xl text-sm font-bold text-[#8d593a] mb-4">
              ⏳ เหลือเวลาทำรายการ: {formatTime(countdown)}
            </div>

            <div className="flex justify-center mb-4">
              <div className="p-3 border border-[#e8dfd1] rounded-2xl bg-white shadow-inner">
                <img
                  src={promptPayQrUrl}
                  alt="PromptPay QR"
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            <div className="bg-[#fcf8f2] p-3 rounded-xl mb-5 text-left border border-[#e8dfd1]">
              <div className="flex justify-between text-xs text-[#6f675f] mb-1">
                <span>ยอดชำระทั้งหมด:</span>
                <span className="font-bold text-sm text-[#8d593a]">
                  ฿{grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#8c827a]">
                <span>เลขที่คำสั่งซื้อ:</span>
                <span className="font-mono">{orderId}</span>
              </div>
            </div>

            {/* แผงปุ่มจำลองการทดสอบ */}
            <div className="p-3 bg-stone-100 rounded-2xl mb-4 border border-dashed border-stone-300">
              <p className="text-[11px] font-bold text-stone-600 mb-2">
                🛠️ แผงจำลองการทดสอบ (Demo Simulator):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onConfirmSuccess}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  ✓ จำลอง: โอนเงินสำเร็จ
                </button>
                <button
                  type="button"
                  onClick={onSimulateFail}
                  className="py-2 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  ✕ จำลอง: โอนไม่สำเร็จ
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#8c827a] hover:text-[#3d2c2e] underline transition cursor-pointer"
            >
              ยกเลิกและกลับไปแก้ไขข้อมูล
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. สถานะ: การชำระเงินไม่สำเร็จ (FAILED)                      */}
        {/* ============================================================ */}
        {modalState === "FAILED" && (
          <div className="py-2">
            <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-1">
              การชำระเงินผ่านพร้อมเพย์ไม่สำเร็จ
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              ไม่พบยอดเงินโอนเข้าสู่ระบบ หรือการทำรายการถูกยกเลิก
            </p>

            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-left mb-4">
              <div className="flex items-start gap-2.5">
                <span className="text-rose-600 text-base">⚠️</span>
                <div className="text-xs text-rose-900 leading-relaxed">
                  <p className="font-bold mb-1">สาเหตุที่เป็นไปได้:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                    <li>ยอดเงินคงเหลือในบัญชีธนาคารไม่เพียงพอ</li>
                    <li>หมดเวลาทำรายการ (QR Code หมดอายุ)</li>
                    <li>การเชื่อมต่ออินเทอร์เน็ตของแอปธนาคารถูกขัดจังหวะ</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-xl p-3 mb-5 text-center">
              <p className="text-xs text-[#6f675f]">
                ✨ <strong className="text-[#3d2c2e]">ไม่ต้องกังวล:</strong>{" "}
                สินค้าของคุณยังคงอยู่ในตะกร้าครบถ้วน ไม่ต้องเริ่มเลือกใหม่
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="w-full py-3 px-4 bg-[#8d593a] hover:bg-[#72462c] text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔄</span>
                <span>ลองสแกนใหม่อีกครั้ง (สร้าง QR ใหม่)</span>
              </button>

              <button
                type="button"
                onClick={onSwitchToCod}
                className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚚</span>
                <span>เปลี่ยนเป็นชำระเงินปลายทาง (COD)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition cursor-pointer"
              >
                ← กลับไปแก้ไขข้อมูลคำสั่งซื้อ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
