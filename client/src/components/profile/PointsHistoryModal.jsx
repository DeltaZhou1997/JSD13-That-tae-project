import React, { useCallback, useEffect, useState } from "react";
import { SadFaceIcon, TrophyIcon } from "./MembershipIcons";
import TierBadge from "./TierBadge";
import { TIER_THEME } from "../../constants/tierTheme";
import TierDetailsModal from "./TierDetailsModal";
import { getTier, tierProgress } from "../../constants/membership";
import { getAuthHeaders, getApiUrl } from "../../utils/authHeader.js";

const TYPE_META = {
  EARN: { label: "ได้รับ", color: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  REDEEM: { label: "ใช้ลดราคา", color: "text-rose-600", chip: "bg-rose-50 text-rose-600 border-rose-200" },
  REFUND: { label: "คืนเบี้ย", color: "text-sky-700", chip: "bg-sky-50 text-sky-700 border-sky-200" },
};
const FILTERS = [
  { id: "ALL", label: "ทั้งหมด" },
  { id: "EARN", label: "ได้รับ" },
  { id: "REDEEM", label: "ใช้ไป" },
  { id: "REFUND", label: "คืน" },
];

function formatDateTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: "-", time: "" };
  return {
    date: d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }),
    time: d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
  };
}

// สร้างประวัติเบี้ยจากรายการคำสั่งซื้อ (สำรองเมื่อ Server ยังไม่มี /me/points) — ตรรกะเดียวกับฝั่ง Server
function orderLabel(order) {
  if (order.planDetails?.planName) return `แพ็กเกจ ${order.planDetails.planName}`;
  const count = (order.items || []).reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
  return `A La Carte ${count} ชุด`;
}

function buildTransactionsFromOrders(orders = []) {
  const list = [];
  for (const o of orders) {
    const base = { orderId: o.orderId, label: orderLabel(o) };
    if (o.pointsRedeemed > 0) {
      list.push({ ...base, type: "REDEEM", points: -o.pointsRedeemed, date: o.createdAt, detail: `ใช้เป็นส่วนลด ฿${Number(o.pointsDiscount || 0).toLocaleString()}` });
      if (o.pointsRefunded) {
        list.push({ ...base, type: "REFUND", points: o.pointsRedeemed, date: o.pointsRefundedAt || o.updatedAt, detail: "คืนเบี้ยจากการยกเลิกคำสั่งซื้อ" });
      }
    }
    const awarded = o.pointsAwarded === true || (o.pointsAwarded === undefined && o.paymentStatus === "PAID");
    if (o.earnedPoints > 0 && awarded) {
      list.push({ ...base, type: "EARN", points: o.earnedPoints, date: o.pointsAwardedAt || o.updatedAt || o.createdAt, detail: `ซื้อ ฿${Number(o.itemsSubtotal || 0).toLocaleString()}` });
    }
  }
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  const sum = (type) => list.filter((t) => t.type === type).reduce((s, t) => s + Math.abs(t.points), 0);
  return { transactions: list, totals: { earned: sum("EARN"), redeemed: sum("REDEEM"), refunded: sum("REFUND") } };
}

// วงแหวนความคืบหน้าไประดับถัดไป (เคลื่อนไหวตอนเปิด)
function ProgressRing({ percent, color, size = 132 }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="-rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#EAE2D5" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - shown / 100)}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" }}
      />
    </svg>
  );
}

/** ประวัติเบี้ย + ตรายศ + ความคืบหน้าระดับ (เปิดจากหน้าโปรไฟล์) */
export default function PointsHistoryModal({ open, onClose, currentUser }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${getApiUrl()}/api/v2/users/me/points`, { headers: getAuthHeaders() });
      const json = await res.json().catch(() => null);
      if (res.ok && json) {
        setData(json);
        return;
      }
      // Server ยังไม่อัปเดต (ไม่มี endpoint) → ใช้ประวัติคำสั่งซื้อแทน
      const userId = currentUser?.id || currentUser?._id;
      const ordersRes = userId
        ? await fetch(`${getApiUrl()}/api/v2/orders/user/${userId}`, { headers: getAuthHeaders() })
        : null;
      const orders = ordersRes?.ok ? await ordersRes.json().catch(() => null) : null;
      if (!Array.isArray(orders)) throw new Error(json?.message || "โหลดประวัติเบี้ยไม่สำเร็จ");
      setData(buildTransactionsFromOrders(orders));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, currentUser?._id]);

  useEffect(() => {
    if (open) {
      setFilter("ALL");
      load();
    }
  }, [open, load]);

  // Esc ปิด + ล็อกการเลื่อนหน้าเว็บด้านหลัง
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  // จอมือถือ → ย่อตรายศ/วงแหวน ให้เหลือพื้นที่ตารางประวัติ
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!open) return null;

  // ใช้ข้อมูลจาก server ถ้าโหลดแล้ว ไม่งั้นใช้ข้อมูลผู้ใช้ที่มีอยู่
  const points = data?.points ?? (Number(currentUser?.biaPoints ?? currentUser?.points ?? 0) || 0);
  const lifetime = data?.lifetimePoints ?? (Number(currentUser?.lifetimePoints) || points);
  const progress = data?.tier ? data : tierProgress(currentUser?.tierStatus, lifetime);
  const tier = getTier(progress.tier);
  const next = progress.nextTier ? getTier(progress.nextTier) : null;
  const theme = TIER_THEME[tier.id];
  const percent = next
    ? Math.max(0, Math.min(100, ((lifetime - tier.minLifetime) / (next.minLifetime - tier.minLifetime)) * 100))
    : 100;

  const transactions = (data?.transactions || []).filter((t) => filter === "ALL" || t.type === filter);

  return (
    <>
      <div
        className="modal-backdrop-enter fixed inset-0 z-[150] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-5"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="เบี้ยและระดับสมาชิก"
          onClick={(e) => e.stopPropagation()}
          className="modal-panel-enter flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:overflow-hidden sm:rounded-3xl"
        >
          {/* ===== ส่วนบน: ตรายศ + ความคืบหน้า ===== */}
          <div
            className="relative shrink-0 overflow-hidden px-4 pb-4 pt-5 sm:px-7 sm:pb-5"
            style={{ background: `linear-gradient(135deg, ${theme.soft} 0%, #ffffff 70%)` }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิด"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-[#7A6B63] shadow-xs hover:bg-white cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
              {/* มือถือ: ตรายศ + วงแหวนอยู่แถวเดียวกัน */}
              <div className="flex items-center justify-center gap-4 sm:contents">
                <div className="tier-badge-in shrink-0">
                  <TierBadge tier={tier.id} size={isMobile ? 96 : 150} animated />
                </div>

                {/* วงแหวน */}
                <div className="relative shrink-0 sm:hidden">
                  <ProgressRing percent={percent} color={theme.ribbon} size={96} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black" style={{ color: theme.text }}>
                      {Math.round(percent)}%
                    </span>
                    <span className="text-[9px] text-[#7A6B63]">{next ? `สู่ ${next.name}` : "สูงสุดแล้ว"}</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center">
                {/* วงแหวน */}
                <div className="relative hidden shrink-0 sm:block">
                  <ProgressRing percent={percent} color={theme.ribbon} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black" style={{ color: theme.text }}>
                      {Math.round(percent)}%
                    </span>
                    <span className="text-[10px] text-[#7A6B63]">{next ? `สู่ ${next.name}` : "สูงสุดแล้ว"}</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.text }}>
                    สมาชิกระดับ
                  </p>
                  <h3 className="text-xl font-black text-[#3D2E2B] sm:text-2xl">{tier.name}</h3>
                  <p className="mt-1 text-xs text-[#5c4f48] sm:text-sm">
                    {next ? (
                      <>
                        อีก <strong style={{ color: theme.text }}>{progress.pointsToNext.toLocaleString()} เบี้ย</strong> ขึ้นเป็น{" "}
                        <strong>{next.name}</strong> (ได้เบี้ย x{next.multiplier})
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        คุณอยู่ระดับสูงสุดแล้ว <TrophyIcon className="h-4 w-4" style={{ color: theme.text }} />
                      </span>
                    )}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      ["เบี้ยคงเหลือ", points],
                      ["สะสมตลอดชีพ", lifetime],
                      ["ตัวคูณ", `x${tier.multiplier}`],
                    ].map(([k, v]) => (
                      <div key={k} className="min-w-0 rounded-xl bg-white/90 px-1.5 py-2 text-center shadow-2xs">
                        <p className="text-[10px] text-[#7A6B63]">{k}</p>
                        <p className="truncate text-sm font-black text-[#3D2E2B]">{typeof v === "number" ? v.toLocaleString() : v}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailsOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
                    style={{ background: theme.ribbon }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
                    </svg>
                    รายละเอียดแรงค์
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ส่วนล่าง: ตารางประวัติเบี้ย ===== */}
          <div className="flex flex-col border-t border-[#EAE2D5] sm:min-h-0 sm:flex-1">
            <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 sm:static sm:px-7">
              <div>
                <h4 className="text-sm font-black text-[#3D2E2B]">ประวัติเบี้ย</h4>
                {data?.totals && (
                  <p className="text-[11px] text-[#7A6B63]">
                    ได้รับ <span className="font-bold text-emerald-700">+{data.totals.earned.toLocaleString()}</span> • ใช้ไป{" "}
                    <span className="font-bold text-rose-600">-{data.totals.redeemed.toLocaleString()}</span>
                    {data.totals.refunded > 0 && (
                      <>
                        {" "}• คืน <span className="font-bold text-sky-700">+{data.totals.refunded.toLocaleString()}</span>
                      </>
                    )}
                  </p>
                )}
              </div>
              <div className="flex gap-1 rounded-full bg-[#FAF7F2] p-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                      filter === f.id ? "bg-white text-[#3D2E2B] shadow-xs" : "text-[#7A6B63] hover:text-[#3D2E2B]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[180px] px-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-1 sm:overflow-y-auto sm:px-5 sm:pb-4">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8D593A] border-t-transparent" />
                </div>
              ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-rose-600">
                  {error}
                  <button type="button" onClick={load} className="text-xs font-bold text-[#8D593A] underline cursor-pointer">
                    ลองใหม่
                  </button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-[#7A6B63]">
                  <SadFaceIcon className="mb-1.5 h-10 w-10 text-[#C9A27E]" />
                  ยังไม่มีรายการเบี้ย{filter !== "ALL" && "ในหมวดนี้"}
                  <span className="text-[11px]">สั่งซื้อครั้งแรกเพื่อเริ่มสะสมเบี้ย (฿10 = 1 เบี้ย)</span>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-white sm:sticky sm:top-0 sm:z-10 text-[10px] uppercase tracking-wide text-[#A09289]">
                    <tr className="border-b border-[#EAE2D5]">
                      <th className="px-2 py-2 font-semibold">วันที่ / เวลา</th>
                      <th className="px-2 py-2 font-semibold">รายการ</th>
                      <th className="hidden px-2 py-2 font-semibold sm:table-cell">ประเภท</th>
                      <th className="px-2 py-2 text-right font-semibold">เบี้ย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, i) => {
                      const meta = TYPE_META[t.type] || TYPE_META.EARN;
                      const dt = formatDateTime(t.date);
                      return (
                        <tr
                          key={`${t.orderId}-${t.type}`}
                          className="points-row-in border-b border-dashed border-[#EAE2D5] hover:bg-[#FAF7F2]"
                          style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                        >
                          <td className="whitespace-nowrap px-2 py-2.5 align-top">
                            <p className="font-semibold text-[#3D2E2B]">{dt.date}</p>
                            <p className="text-[10px] text-[#A09289]">{dt.time} น.</p>
                          </td>
                          <td className="px-2 py-2.5 align-top">
                            <p className="font-semibold text-[#3D2E2B]">{t.label}</p>
                            <p className="text-[10px] text-[#7A6B63]">
                              {t.detail} • {t.orderId}
                            </p>
                            <span className={`mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-bold sm:hidden ${meta.chip}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="hidden px-2 py-2.5 align-top sm:table-cell">
                            <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.chip}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className={`whitespace-nowrap px-2 py-2.5 text-right align-top text-sm font-black ${meta.color}`}>
                            {t.points > 0 ? "+" : ""}
                            {t.points.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <TierDetailsModal open={detailsOpen} onClose={closeDetails} currentTier={tier.id} />
    </>
  );
}
