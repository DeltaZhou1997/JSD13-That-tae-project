import React, { useEffect, useState } from "react";
import { BagIcon, CrownIcon, PlusCircleIcon, HeartIcon } from "./MembershipIcons";
import TierBadge from "./TierBadge";
import { TIER_THEME } from "../../constants/tierTheme";
import {
  TIERS,
  PLAN_POINTS,
  BAHT_PER_POINT,
  REDEEM,
  calculateEarnedPoints,
  getTier,
} from "../../constants/membership";
import { SUBSCRIPTION_PLANS, SHIPPING_FEE } from "../../constants/checkout";

// ยอดใช้จ่ายโดยประมาณถึงแต่ละระดับ (อ้างอิง MEMBERSHIP_PLAN.md)
const TIER_SPEND_HINT = {
  BRONZE: "สมัครสมาชิก",
  SILVER: "≈ ฿12,000 (กล่อง M ~3 เดือน)",
  GOLD: "≈ ฿38,000 (~8–9 เดือน)",
  PLATINUM: "≈ ฿80,000 (~1 ปี)",
};

function SectionTitle({ no, title, sub }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3D2E2B] text-xs font-black text-white">
        {no}
      </span>
      <h4 className="text-sm font-black text-[#3D2E2B]">
        {title}
        {sub && <span className="ml-1.5 text-[11px] font-semibold text-[#7A6B63]">{sub}</span>}
      </h4>
    </div>
  );
}

/**
 * คู่มือเบี้ยและระดับสมาชิก (Help Modal) — ดูอย่างเดียว กดเล่นได้
 * เปิดซ้อนจาก PointsHistoryModal
 */
export default function TierDetailsModal({ open, onClose, currentTier = "BRONZE" }) {
  const [viewTier, setViewTier] = useState(currentTier); // ใช้คูณเบี้ยในตารางกล่อง
  const [focusPlan, setFocusPlan] = useState("M");
  const [alcAmount, setAlcAmount] = useState(500);
  const [redeem, setRedeem] = useState(0);

  useEffect(() => {
    if (open) setViewTier(currentTier);
  }, [open, currentTier]);

  // Esc ปิดเฉพาะ modal นี้ (ไม่ปิด modal ด้านล่าง)
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  const tier = getTier(viewTier);
  const theme = TIER_THEME[tier.id];

  // ตัวอย่าง A La Carte ที่ปรับได้
  const maxRedeem = Math.floor((alcAmount * REDEEM.POINTS_PER_BAHT) / REDEEM.STEP) * REDEEM.STEP;
  const redeemPts = Math.min(redeem, maxRedeem);
  const discount = redeemPts / REDEEM.POINTS_PER_BAHT;
  const alcEarned = calculateEarnedPoints({ itemsSubtotal: alcAmount, discount, tier: tier.id });

  return (
    <div
      className="modal-backdrop-enter fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-3 sm:p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="คู่มือเบี้ยและระดับสมาชิก"
        onClick={(e) => e.stopPropagation()}
        className="modal-panel-enter flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl"
      >
        {/* หัว */}
        <div className="flex items-start justify-between gap-3 border-b border-[#EAE2D5] bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8D593A]">That-Tae Membership</p>
            <h3 className="text-lg font-black text-[#3D2E2B] sm:text-xl">แผนสมาชิก “เบี้ย” ธาตุแท้</h3>
            <p className="text-xs text-[#7A6B63]">กินดี...ได้คุ้มกว่า • ยิ่งกิน ยิ่งได้เบี้ย ยิ่งคุ้ม!</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="rounded-full p-2 text-[#7A6B63] hover:bg-[#FAF7F2] cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
          {/* ===== 1. การได้เบี้ย ===== */}
          <section className="rounded-3xl border border-[#EAE2D5] bg-white p-4 sm:p-5">
            <SectionTitle no="1" title="การได้เบี้ย" sub="(หลังชำระเงินสำเร็จเท่านั้น)" />

            {/* เลือกระดับเพื่อดูตัวคูณ */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-[#7A6B63]">ดูเบี้ยของระดับ:</span>
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setViewTier(t.id)}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                    viewTier === t.id ? "text-white shadow-sm" : "border-[#EAE2D5] bg-white text-[#5c4f48] hover:border-[#8D593A]"
                  }`}
                  style={viewTier === t.id ? { background: TIER_THEME[t.id].ribbon, borderColor: TIER_THEME[t.id].ribbon } : undefined}
                >
                  {t.name} x{t.multiplier}
                  {t.id === currentTier && <span className="opacity-80">(คุณ)</span>}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              {/* A La Carte + ลองคิด */}
              <div className="rounded-2xl p-4" style={{ background: theme.soft }}>
                <p className="flex items-center gap-1.5 text-sm font-black text-[#3D2E2B]"><BagIcon className="h-4 w-4" style={{ color: theme.text }} /> A La Carte</p>
                <p className="mt-1 text-2xl font-black" style={{ color: theme.text }}>
                  ฿{BAHT_PER_POINT} = 1 เบี้ย
                </p>
                <p className="text-[11px] text-[#7A6B63]">ปัดเศษลง • ไม่รวมค่าจัดส่ง • ไม่มียอดขั้นต่ำ</p>

                <div className="mt-4 rounded-xl bg-white/80 p-3">
                  <p className="text-[11px] font-bold text-[#3D2E2B]">ลองคิดเบี้ย</p>
                  <label className="mt-2 block text-[11px] text-[#7A6B63]">
                    <span className="flex justify-between">
                      <span>ค่าสินค้า</span>
                      <strong className="text-[#3D2E2B]">฿{alcAmount.toLocaleString()}</strong>
                    </span>
                    <input
                      type="range"
                      min={100}
                      max={3000}
                      step={10}
                      value={alcAmount}
                      onChange={(e) => setAlcAmount(Number(e.target.value))}
                      className="w-full accent-[#8D593A]"
                    />
                  </label>
                  <label className="mt-1 block text-[11px] text-[#7A6B63]">
                    <span className="flex justify-between">
                      <span>ใช้เบี้ยลด</span>
                      <strong className="text-[#3D2E2B]">{redeemPts.toLocaleString()} เบี้ย</strong>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={Math.min(maxRedeem, 3000)}
                      step={REDEEM.STEP}
                      value={redeemPts}
                      onChange={(e) => setRedeem(Number(e.target.value))}
                      className="w-full accent-[#8D593A]"
                    />
                  </label>
                  <div className="mt-2 space-y-0.5 border-t border-dashed border-[#EAE2D5] pt-2 text-[11px] text-[#5c4f48]">
                    <p className="flex justify-between">
                      <span>จ่ายจริง</span>
                      <span>
                        ฿{alcAmount.toLocaleString()}
                        {discount > 0 && ` − ฿${discount.toLocaleString()}`} + ส่ง ฿{SHIPPING_FEE} ={" "}
                        <strong className="text-[#3D2E2B]">฿{(alcAmount - discount + SHIPPING_FEE).toLocaleString()}</strong>
                      </span>
                    </p>
                    <p className="flex justify-between text-sm font-black" style={{ color: theme.text }}>
                      <span>ได้รับ</span>
                      <span key={alcEarned} className="points-row-in">+{alcEarned.toLocaleString()} เบี้ย</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* ตารางกล่อง */}
              <div>
                <p className="mb-2 flex flex-wrap items-center gap-x-1.5 text-sm font-black text-[#3D2E2B]">
                  <CrownIcon className="h-4 w-4" style={{ color: theme.text }} />
                  กล่อง Cooking Kit รายสัปดาห์{" "}
                  <span className="text-[11px] font-semibold text-[#7A6B63]">(ยิ่งกล่องใหญ่ ยิ่งคุ้ม — กดแถวเพื่อเทียบ)</span>
                </p>
                <div className="overflow-x-auto rounded-2xl border border-[#EAE2D5]">
                  <table className="w-full min-w-[440px] text-center text-xs">
                    <thead className="bg-[#FAF7F2] text-[11px] text-[#7A6B63]">
                      <tr>
                        <th className="px-2 py-2 text-left">ขนาดกล่อง</th>
                        <th className="px-2 py-2">ราคา</th>
                        <th className="px-2 py-2 text-white" style={{ background: theme.ribbon }}>
                          เบี้ยที่ได้{tier.multiplier > 1 && ` (x${tier.multiplier})`}
                        </th>
                        <th className="px-2 py-2">เทียบ A La Carte</th>
                        <th className="px-2 py-2">คุ้มค่า</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(SUBSCRIPTION_PLANS).map((p, i) => {
                        const earned = calculateEarnedPoints({ planId: p.id, itemsSubtotal: p.price, tier: tier.id });
                        const alc = calculateEarnedPoints({ itemsSubtotal: p.price, tier: tier.id });
                        const ratio = PLAN_POINTS[p.id] / Math.floor(p.price / BAHT_PER_POINT);
                        const active = focusPlan === p.id;
                        return (
                          <tr
                            key={p.id}
                            onClick={() => setFocusPlan(p.id)}
                            className="points-row-in cursor-pointer border-t border-[#EAE2D5] transition-colors hover:bg-[#FAF7F2]"
                            style={{ animationDelay: `${i * 60}ms`, background: active ? theme.soft : undefined }}
                          >
                            <td className="px-2 py-2 text-left font-bold text-[#3D2E2B]">
                              {p.id} <span className="font-normal text-[#7A6B63]">({p.kitsPerWeek} ชุด)</span>
                            </td>
                            <td className="px-2 py-2 text-[#5c4f48]">฿{p.price.toLocaleString()}</td>
                            <td className="px-2 py-2 text-sm font-black" style={{ color: theme.text, background: `${theme.soft}` }}>
                              {earned.toLocaleString()}
                            </td>
                            <td className="px-2 py-2 text-[#A09289]">{alc.toLocaleString()}</td>
                            <td className="px-2 py-2 font-bold text-[#8D593A]">x{ratio.toFixed(2).replace(/\.?0+$/, "")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const p = SUBSCRIPTION_PLANS[focusPlan];
                  const planPts = calculateEarnedPoints({ planId: p.id, itemsSubtotal: p.price, tier: tier.id });
                  const alcPts = calculateEarnedPoints({ itemsSubtotal: p.price, tier: tier.id });
                  return (
                    <p key={focusPlan + tier.id} className="points-row-in mt-2 rounded-full bg-[#FAF7F2] px-3 py-1.5 text-[11px] text-[#5c4f48]">
                      กล่อง <strong>{p.id}</strong> ฿{p.price.toLocaleString()} ได้ <strong style={{ color: theme.text }}>{planPts} เบี้ย</strong>
                      {planPts > alcPts ? ` — มากกว่าซื้อแยกยอดเท่ากัน ${planPts - alcPts} เบี้ย` : " — เท่ากับซื้อแยก"}
                    </p>
                  );
                })()}
                <p className="mt-2 flex items-center gap-1 text-[11px] text-[#7A6B63]"><PlusCircleIcon className="h-3.5 w-3.5 shrink-0 text-[#8D593A]" /> เมนูเสริมที่เกินโควตากล่อง คิดแบบ A La Carte (฿{BAHT_PER_POINT} = 1 เบี้ย) บวกเพิ่ม</p>
              </div>
            </div>
          </section>

          {/* ===== 2. ระดับสมาชิก ===== */}
          <section className="rounded-3xl border border-[#EAE2D5] bg-white p-4 sm:p-5">
            <SectionTitle no="2" title="ระดับสมาชิก" sub="(ขึ้นอัตโนมัติจากเบี้ยสะสมตลอดชีพ — ใช้เบี้ยแล้วระดับไม่ลด)" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {TIERS.map((t, i) => {
                const th = TIER_THEME[t.id];
                const active = viewTier === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setViewTier(t.id)}
                    className={`points-row-in flex flex-col items-center rounded-2xl border-2 p-3 text-center transition-all cursor-pointer hover:-translate-y-0.5 ${
                      active ? "shadow-md" : "border-transparent"
                    }`}
                    style={{ animationDelay: `${i * 70}ms`, background: th.soft, borderColor: active ? th.ribbon : "transparent" }}
                  >
                    <TierBadge tier={t.id} size={72} animated={active} />
                    <p className="mt-1 text-sm font-black" style={{ color: th.text }}>
                      {t.name}
                      {t.id === currentTier && <span className="ml-1 text-[10px] font-bold">(คุณ)</span>}
                    </p>
                    <p className="text-base font-black text-[#3D2E2B]">{t.minLifetime.toLocaleString()}</p>
                    <p className="text-[10px] text-[#7A6B63]">เบี้ยสะสม</p>
                    <p className="mt-1 rounded-full bg-white px-2 py-0.5 text-xs font-black" style={{ color: th.text }}>
                      เบี้ย x{t.multiplier}
                    </p>
                    <p className="mt-1 text-[10px] text-[#7A6B63]">{TIER_SPEND_HINT[t.id]}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== 3. ใช้เบี้ย ===== */}
          <section className="rounded-3xl border border-[#EAE2D5] bg-white p-4 sm:p-5">
            <SectionTitle no="3" title="ใช้เบี้ยเป็นส่วนลดตอนชำระเงิน" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                ["อัตราแลก", `${REDEEM.POINTS_PER_BAHT} เบี้ย = ฿1`],
                ["ขั้นต่ำ", `${REDEEM.MIN} เบี้ย`],
                ["เพิ่ม/ลด", `ทีละ ${REDEEM.STEP} เบี้ย`],
                ["ใช้ทั้งหมด", "กดปุ่มเดียว"],
                ["เพดาน", "ไม่เกินค่าสินค้า (ค่าส่งจ่ายเสมอ)"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-[#FAF7F2] p-3">
                  <p className="text-[10px] font-semibold text-[#7A6B63]">{k}</p>
                  <p className="text-xs font-black text-[#3D2E2B]">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-[#7A6B63]">
              ออเดอร์ที่ใช้เบี้ยลดราคาจะได้เบี้ยตามสัดส่วนที่จ่ายจริง • ยกเลิกคำสั่งซื้อ ระบบคืนเบี้ยที่ใช้ให้อัตโนมัติ
            </p>
          </section>

          <p className="flex items-center justify-center gap-1 pb-1 text-xs font-semibold text-[#8D593A]">เบี้ยทุกบาท... คือรอยยิ้มของคุณ <HeartIcon className="h-3.5 w-3.5" /></p>
        </div>
      </div>
    </div>
  );
}
