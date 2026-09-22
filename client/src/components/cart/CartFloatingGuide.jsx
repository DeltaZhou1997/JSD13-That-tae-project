import React, { useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { SUBSCRIPTION_PLANS } from "../../constants/checkout";
import { useAuth } from "../../context/AuthContext.js";

export default function CartFloatingGuide({
  cartItems = [],
  selectedPlan = null,
  setSelectedPlan = () => {},
}) {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin" || location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  const containerRef = useRef(null);
  const fabBtnRef = useRef(null);
  const badgeRef = useRef(null);
  const bubbleRef = useRef(null);
  const progressBarRef = useRef(null);
  const prevCountRef = useRef(null);
  const hasAppearedRef = useRef(false);

  const totalKitsCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const isVisible =
    !(location.pathname === "/cart" || location.pathname === "/checkout") &&
    (totalKitsCount > 0 || selectedPlan !== null);

  // GSAP Appearance Animation (ตอนโผล่ขึ้นมาครั้งแรก)
  useEffect(() => {
    if (isVisible && containerRef.current && !hasAppearedRef.current) {
      hasAppearedRef.current = true;
      gsap.fromTo(
        containerRef.current,
        { scale: 0, opacity: 0, y: 35 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }
      );
    }
  }, [isVisible]);

  // GSAP Bubble Entrance Animation
  useEffect(() => {
    if (isVisible && bubbleRef.current) {
      gsap.fromTo(
        bubbleRef.current,
        { scale: 0.88, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" }
      );
    }
  }, [isVisible]);

  // Animate Badge and FAB on item count change (Tactile interaction)
  useEffect(() => {
    if (prevCountRef.current !== null && prevCountRef.current !== totalKitsCount) {
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0.2, rotate: -30 },
          { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1.2, 0.4)" }
        );
      }

      if (fabBtnRef.current) {
        gsap.fromTo(
          fabBtnRef.current,
          { scale: 0.9 },
          { scale: 1, duration: 0.35, ease: "back.out(2)" }
        );
      }

      if (bubbleRef.current) {
        gsap.fromTo(
          bubbleRef.current,
          { scale: 0.96 },
          { scale: 1, duration: 0.3, ease: "back.out(1.8)" }
        );
      }
    }
    prevCountRef.current = totalKitsCount;
  }, [totalKitsCount]);

  // ---------------------------------------------------------------------------
  // ระบบคำนวณ Upsell & คำแนะนำใน Bubble ตามโจทย์:
  // - 1-3 ชุด -> เชิญชวนเพิ่มเป็น 4 ชุด (SIZE S)
  // - 5 ชุด -> เชิญชวนเพิ่มเป็น 6 ชุด (SIZE M)
  // - 7 ชุด -> เชิญชวนเพิ่มเป็น 8 ชุด (SIZE L)
  // - 9-11 ชุด (โดยเฉพาะ 10-11 ชุด) -> เชิญชวนเพิ่มเป็น 12 ชุด (SIZE XL)
  // ---------------------------------------------------------------------------
  const guideInfo = useMemo(() => {
    // 1. กรณีอยู่ในโหมดแพ็กเกจแล้ว และเลือกยังไม่ครบกล่อง
    if (selectedPlan) {
      const required = selectedPlan.kitsPerWeek;
      if (totalKitsCount < required) {
        const diff = required - totalKitsCount;
        return {
          type: "box_progress",
          title: `กล่องแพ็กเกจ ${selectedPlan.name}`,
          message: `เลือกไปแล้ว ${totalKitsCount} จาก ${required} เมนู (ขาดอีก ${diff} เมนูจะเต็มกล่อง)`,
          targetCount: required,
          currentCount: totalKitsCount,
          isFull: false,
          buttonText: "ดูรายการในกล่อง / เลือกเพิ่ม →",
          action: "link_cart",
        };
      } else if (totalKitsCount === required) {
        return {
          type: "box_full",
          title: `กล่องแพ็กเกจ ${selectedPlan.name}`,
          message: `กล่องของคุณเลือกครบ ${required} เมนูเรียบร้อยแล้ว พร้อมสั่งซื้อ!`,
          targetCount: required,
          currentCount: totalKitsCount,
          isFull: true,
          buttonText: "ดูรายการในกล่อง / จัดการเมนู →",
          action: "link_cart",
        };
      }
      // ถ้าเลือกเกินกล่องปัจจุบัน จะตกไปสู่คำแนะนำการอัปเกรดแพ็กเกจถัดไป
    }

    // 2. แนะนำตามจำนวนชุด (ทั้งแบบ A La Carte หรือกรณีเลือกเกินกล่องเดิม)
    // 1-3 ชุด -> เชิญชวนซื้ออีกชุดเป็น 4 ชุด (SIZE S)
    if (totalKitsCount < 4) {
      const diff = 4 - totalKitsCount;
      return {
        type: "upsell",
        targetPlan: SUBSCRIPTION_PLANS.S,
        title: "ข้อเสนอสุดคุ้มสำหรับคุณ",
        message:
          totalKitsCount === 3
            ? "เลือก 3 ชุดแล้ว — เพิ่มอีกเพียง 1 ชุด เป็น 4 ชุด รับแพ็กเกจ SIZE S คุ้มกว่าสั่งแยกจานทันที!"
            : `เลือก ${totalKitsCount} ชุดแล้ว — เพิ่มอีก ${diff} ชุด เป็น 4 ชุด รับแพ็กเกจ SIZE S สุดคุ้ม!`,
        targetCount: 4,
        currentCount: totalKitsCount,
        isFull: false,
        buttonText: "เปลี่ยนเป็นแพ็กเกจ SIZE S (฿599) ทันที",
        action: "select_plan",
      };
    }

    // 4 ชุด
    if (totalKitsCount === 4) {
      return {
        type: "plan_ready",
        targetPlan: SUBSCRIPTION_PLANS.S,
        title: "ครบ 4 เมนูสุดคุ้ม",
        message:
          selectedPlan?.id === "S"
            ? "กล่อง SIZE S ของคุณเลือกครบ 4 เมนูเรียบร้อยแล้ว พร้อมสั่งซื้อ!"
            : "ในตะกร้ามี 4 ชุดแล้ว! เปลี่ยนเป็นแพ็กเกจ SIZE S เพื่อรับสิทธิ์จัดส่งฟรีและราคาเหมาสุดประหยัด",
        targetCount: 4,
        currentCount: 4,
        isFull: true,
        buttonText:
          selectedPlan?.id === "S"
            ? "ดูรายการในกล่อง / สั่งซื้อ →"
            : "สลับเป็นแพ็กเกจ SIZE S (฿599) ทันที",
        action: selectedPlan?.id === "S" ? "link_cart" : "select_plan",
      };
    }

    // 5 ชุด -> เชิญชวนซื้อเป็น 6 ชุด (SIZE M)
    if (totalKitsCount === 5) {
      return {
        type: "upsell",
        targetPlan: SUBSCRIPTION_PLANS.M,
        title: "แนะนำความคุ้มค่า",
        message:
          "เลือก 5 ชุดแล้ว — เพิ่มอีกเพียง 1 ชุด เป็น 6 ชุด รับแพ็กเกจ SIZE M คุ้มกว่าสั่งแยกจานทันที!",
        targetCount: 6,
        currentCount: 5,
        isFull: false,
        buttonText: "เปลี่ยนเป็นแพ็กเกจ SIZE M (฿899) ทันที",
        action: "select_plan",
      };
    }

    // 6 ชุด
    if (totalKitsCount === 6) {
      return {
        type: "plan_ready",
        targetPlan: SUBSCRIPTION_PLANS.M,
        title: "ครบ 6 เมนูสุดคุ้ม",
        message:
          selectedPlan?.id === "M"
            ? "กล่อง SIZE M ของคุณเลือกครบ 6 เมนูเรียบร้อยแล้ว พร้อมสั่งซื้อ!"
            : "ในตะกร้ามี 6 ชุดแล้ว! เปลี่ยนเป็นแพ็กเกจ SIZE M เพื่อรับราคาเหมาสุดคุ้ม",
        targetCount: 6,
        currentCount: 6,
        isFull: true,
        buttonText:
          selectedPlan?.id === "M"
            ? "ดูรายการในกล่อง / สั่งซื้อ →"
            : "สลับเป็นแพ็กเกจ SIZE M (฿899) ทันที",
        action: selectedPlan?.id === "M" ? "link_cart" : "select_plan",
      };
    }

    // 7 ชุด -> เชิญชวนซื้อเป็น 8 ชุด (SIZE L)
    if (totalKitsCount === 7) {
      return {
        type: "upsell",
        targetPlan: SUBSCRIPTION_PLANS.L,
        title: "แนะนำความคุ้มค่า",
        message:
          "เลือก 7 ชุดแล้ว — เพิ่มอีกเพียง 1 ชุด เป็น 8 ชุด รับแพ็กเกจ SIZE L คุ้มกว่าสั่งแยกจานทันที!",
        targetCount: 8,
        currentCount: 7,
        isFull: false,
        buttonText: "เปลี่ยนเป็นแพ็กเกจ SIZE L (฿1,169) ทันที",
        action: "select_plan",
      };
    }

    // 8 ชุด
    if (totalKitsCount === 8) {
      return {
        type: "plan_ready",
        targetPlan: SUBSCRIPTION_PLANS.L,
        title: "ครบ 8 เมนูสุดคุ้ม",
        message:
          selectedPlan?.id === "L"
            ? "กล่อง SIZE L ของคุณเลือกครบ 8 เมนูเรียบร้อยแล้ว พร้อมสั่งซื้อ!"
            : "ในตะกร้ามี 8 ชุดแล้ว! เปลี่ยนเป็นแพ็กเกจ SIZE L เพื่อรับราคาเหมาสุดคุ้ม",
        targetCount: 8,
        currentCount: 8,
        isFull: true,
        buttonText:
          selectedPlan?.id === "L"
            ? "ดูรายการในกล่อง / สั่งซื้อ →"
            : "สลับเป็นแพ็กเกจ SIZE L (฿1,169) ทันที",
        action: selectedPlan?.id === "L" ? "link_cart" : "select_plan",
      };
    }

    // 9, 10, 11 ชุด (โดยเฉพาะ 10-11 ชุด) -> เชิญชวนซื้อเป็น 12 ชุด (SIZE XL)
    if (totalKitsCount >= 9 && totalKitsCount <= 11) {
      const diff = 12 - totalKitsCount;
      return {
        type: "upsell",
        targetPlan: SUBSCRIPTION_PLANS.XL,
        title: "แนะนำความคุ้มค่าสูงสุด",
        message:
          totalKitsCount === 11
            ? "เลือก 11 ชุดแล้ว — เพิ่มอีกเพียง 1 ชุด เป็น 12 ชุด รับแพ็กเกจใหญ่ SIZE XL คุ้มที่สุด!"
            : `เลือก ${totalKitsCount} ชุดแล้ว — เพิ่มอีก ${diff} ชุด เป็น 12 ชุด รับแพ็กเกจใหญ่ SIZE XL คุ้มที่สุด!`,
        targetCount: 12,
        currentCount: totalKitsCount,
        isFull: false,
        buttonText: "เปลี่ยนเป็นแพ็กเกจ SIZE XL (฿1,599) ทันที",
        action: "select_plan",
      };
    }

    // 12 ชุดขึ้นไป
    return {
      type: "plan_ready",
      targetPlan: SUBSCRIPTION_PLANS.XL,
      title: "แพ็กเกจใหญ่สุดคุ้ม (12 ชุด)",
      message:
        selectedPlan?.id === "XL" && totalKitsCount === 12
          ? "กล่อง SIZE XL ของคุณเลือกครบ 12 เมนูเรียบร้อยแล้ว พร้อมสั่งซื้อ!"
          : `ในตะกร้ามี ${totalKitsCount} เมนูแล้ว เหมาะกับแพ็กเกจ SIZE XL เพื่อความคุ้มค่าสูงสุด`,
      targetCount: 12,
      currentCount: totalKitsCount,
      isFull: totalKitsCount >= 12,
      buttonText:
        selectedPlan?.id === "XL"
          ? "ดูรายการในกล่อง / สั่งซื้อ →"
          : "สลับเป็นแพ็กเกจ SIZE XL (฿1,599) ทันที",
      action: selectedPlan?.id === "XL" ? "link_cart" : "select_plan",
    };
  }, [totalKitsCount, selectedPlan]);

  // Animate Progress Bar with GSAP
  useEffect(() => {
    if (progressBarRef.current && guideInfo.targetCount > 0) {
      const percentage = Math.min(
        100,
        (guideInfo.currentCount / guideInfo.targetCount) * 100
      );
      gsap.to(progressBarRef.current, {
        width: `${percentage}%`,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  }, [guideInfo]);

  // ซ่อนบนหน้า Cart และ Checkout หรือเมื่อไม่มีสินค้า
  if (!isVisible) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      aria-label="สถานะตะกร้าสินค้า"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Bubble คำแนะนำ (ลอยอยู่เหนือปุ่ม FAB - ไม่มีปุ่มกากบาทตามที่ระบุ) */}
      <div
        ref={bubbleRef}
        className="mb-3 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border border-[#e8dfd1] rounded-3xl p-4 shadow-xl text-[#2f2119] relative cursor-default"
      >
        <div className="space-y-2">
          {/* ส่วนหัวของ Bubble */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#f6ede5] text-[#8d593a] flex items-center justify-center shrink-0 border border-[#e8dfd1]">
              {guideInfo.isFull ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-600">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              )}
            </span>
            <span className="text-xs font-bold text-[#3d2c2e]">
              {guideInfo.title}
            </span>
          </div>

          {/* ข้อความเชิญชวนแนะนำความคุ้มค่า */}
          <p className="text-xs text-stone-600 leading-snug">
            {guideInfo.isFull ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{guideInfo.message}</span>
              </span>
            ) : (
              <span>{guideInfo.message}</span>
            )}
          </p>

          {/* หลอดความคืบหน้า (Progress Bar) ไปสู่เป้าหมายแพ็กเกจถัดไป */}
          {guideInfo.targetCount > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                <span>ความคืบหน้า</span>
                <span>
                  {guideInfo.currentCount} / {guideInfo.targetCount} ชุด
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#f1ead7] overflow-hidden">
                <div
                  ref={progressBarRef}
                  className={`h-full rounded-full transition-colors ${
                    guideInfo.isFull ? "bg-emerald-500" : "bg-[#8d593a]"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (guideInfo.currentCount / guideInfo.targetCount) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Button: สลับแพ็กเกจทันที หรือ ลิงก์ไปที่ตะกร้า */}
          {guideInfo.action === "select_plan" ? (
            <button
              type="button"
              onClick={() => setSelectedPlan(guideInfo.targetPlan)}
              className="mt-2 w-full py-2 px-3 bg-[#8d593a] hover:bg-[#73472c] text-white text-xs font-bold rounded-xl text-center transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{guideInfo.buttonText}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <Link
              to="/cart"
              className="mt-2 block w-full py-2 px-3 bg-[#3d2c2e] hover:bg-[#8d593a] text-white text-xs font-bold rounded-xl text-center transition shadow-2xs hover:shadow-sm"
            >
              {guideInfo.buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* ปุ่ม FAB (Floating Action Button) */}
      <Link
        ref={fabBtnRef}
        to="/cart"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#3d2c2e] hover:bg-[#8d593a] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 border-2 border-white/20 cursor-pointer"
        title="ไปที่ตะกร้าสินค้า"
      >
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalKitsCount > 0 && (
            <span
              ref={badgeRef}
              className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-[#8d593a] group-hover:bg-amber-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs"
            >
              {totalKitsCount}
            </span>
          )}
        </div>

        <span className="text-xs font-bold font-mono tracking-tight hidden sm:inline">
          {selectedPlan ? `กล่อง ${selectedPlan.name}` : "ตะกร้าของฉัน"}
        </span>

        {selectedPlan && (
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            {totalKitsCount}/{selectedPlan.kitsPerWeek}
          </span>
        )}
      </Link>
    </aside>
  );
}
