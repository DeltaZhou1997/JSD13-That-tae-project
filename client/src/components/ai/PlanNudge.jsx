import { useEffect, useMemo, useState } from "react";
import { SUBSCRIPTION_PLANS } from "../../constants/checkout.js";

const PLANS = Object.values(SUBSCRIPTION_PLANS).sort((a, b) => a.kitsPerWeek - b.kitsPerWeek);

/**
 * การ์ดแนะนำแพ็กเกจเหนือปุ่ม Advisor (หน้าเมนู)
 * นับจำนวนชุดในตะกร้า → บอกว่าอีกกี่ชุดจะครบแพ็กเกจถัดไป / ครบแล้วแนะนำสั่งแบบแพ็กเกจ
 */
export default function PlanNudge({ cartItems = [], selectedPlan, onSelectPlan, onGoCart, onBrowse }) {
  const count = cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const subtotal = cartItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
  const [dismissedAt, setDismissedAt] = useState(null);
  const [visible, setVisible] = useState(false);

  // แพ็กเกจเป้าหมาย = ไซส์เล็กสุดที่ยังรับจำนวนชุดได้
  const target = useMemo(() => PLANS.find((p) => p.kitsPerWeek >= count) || null, [count]);
  const complete = Boolean(target && target.kitsPerWeek === count);
  const missing = target ? target.kitsPerWeek - count : 0;
  const saving = complete ? subtotal - target.price : 0;
  const alreadyChosen = complete && selectedPlan?.id === target.id;

  // ซ่อนเมื่อผู้ใช้กดปิด แล้วค่อยโผล่ใหม่เมื่อจำนวนชุดเปลี่ยน
  const hidden = count === 0 || dismissedAt === count || (!target && count > 0 && dismissedAt === "over");

  useEffect(() => {
    if (hidden) {
      setVisible(false);
      return undefined;
    }
    const t = setTimeout(() => setVisible(true), 250); // หน่วงเล็กน้อยให้ดูนุ่มนวล
    return () => clearTimeout(t);
  }, [hidden, count]);

  if (hidden) return null;

  const pct = target ? Math.round((count / target.kitsPerWeek) * 100) : 100;

  let title;
  let body;
  if (!target) {
    title = `เลือกไว้ ${count} ชุด`;
    body = `เกินแพ็กเกจใหญ่สุด (${PLANS.at(-1).name} ${PLANS.at(-1).kitsPerWeek} ชุด) — เลือก ${PLANS.at(-1).name} แล้วชุดที่เกินคิดราคาเพิ่มรายชุด`;
  } else if (complete) {
    title = `ครบ ${target.name} แล้ว!`;
    body =
      saving > 0
        ? `สั่งเป็นแพ็กเกจรายสัปดาห์ ${target.price.toLocaleString()} ฿ ถูกกว่าซื้อแยก ${saving.toLocaleString()} ฿`
        : `สั่งเป็นแพ็กเกจรายสัปดาห์ ${target.name} (${target.kitsPerWeek} ชุด) ในราคา ${target.price.toLocaleString()} ฿ ได้เลย`;
  } else {
    title = `อีก ${missing} ชุด ครบ ${target.name}`;
    body = `เลือกไว้ ${count}/${target.kitsPerWeek} ชุด — ครบแล้วสั่งแบบแพ็กเกจ ${target.price.toLocaleString()} ฿/สัปดาห์ ได้`;
  }

  return (
    <div
      className={`mb-3 w-[88vw] max-w-[320px] rounded-2xl border border-[#e8dfd1] bg-white p-3.5 shadow-xl transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      style={{ transformOrigin: "bottom right" }}
      role="status"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fbf3e6] text-amber-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
            </svg>
          </span>
          <p className="text-sm font-extrabold text-[#3b2a20]">{title}</p>
        </div>
        <button
          type="button"
          onClick={() => setDismissedAt(target ? count : "over")}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 cursor-pointer"
          title="ปิดคำแนะนำ"
        >
          ✕
        </button>
      </div>

      <p className="mt-1.5 text-xs leading-relaxed text-[#6b4e3d]">{body}</p>

      {target && (
        <div className="mt-2.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1ead7]">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${complete ? "bg-emerald-500" : "bg-gradient-to-r from-[#b58145] to-[#8d593a]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* จุดบอกไซส์ S M L XL */}
          <div className="mt-1.5 flex justify-between text-[10px] font-semibold">
            {PLANS.map((p) => (
              <span key={p.id} className={count >= p.kitsPerWeek ? "text-[#8d593a]" : "text-stone-400"}>
                {p.id} · {p.kitsPerWeek}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {complete || !target ? (
          <button
            type="button"
            onClick={() => {
              const plan = target || PLANS.at(-1);
              if (!alreadyChosen) onSelectPlan?.(plan);
              onGoCart?.();
            }}
            className="flex-1 rounded-xl bg-[#4c1f08] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#6b3215] cursor-pointer"
          >
            {alreadyChosen ? "ไปที่ตะกร้า →" : `สั่งแบบแพ็กเกจ ${(target || PLANS.at(-1)).name} →`}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onBrowse}
              className="flex-1 rounded-xl bg-[#4c1f08] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#6b3215] cursor-pointer"
            >
              เลือกอีก {missing} ชุด
            </button>
            <button
              type="button"
              onClick={onGoCart}
              className="rounded-xl border border-[#dfd1c1] px-3 py-2 text-xs font-bold text-[#6b3215] transition hover:bg-[#f8f3eb] cursor-pointer"
            >
              ดูตะกร้า
            </button>
          </>
        )}
      </div>
    </div>
  );
}
