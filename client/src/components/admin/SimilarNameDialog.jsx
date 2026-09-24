import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * ถามยืนยันก่อนบันทึก เมื่อมีชื่อซ้ำ/ใกล้เคียงกับที่มีในระบบ
 * @param {{ open, kind: "เมนู"|"วัตถุดิบ", name, matches, editPath: (id)=>string, onConfirm, onCancel }} props
 */
export default function SimilarNameDialog({ open, kind, name, matches = [], editPath, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  const hasExact = matches.some((m) => m.exact);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-3xl border border-[#dfd1c1] bg-[#fdfbf7] p-6 shadow-2xl duration-150">
        <div className="flex items-start gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${hasExact ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-[#4c1f08]">
              {hasExact ? `มี${kind}ชื่อนี้อยู่แล้ว` : `มี${kind}ชื่อใกล้เคียงกัน`}
            </h3>
            <p className="mt-0.5 text-sm text-[#6b3215]">
              กำลังบันทึก <strong>"{name}"</strong> — ตรวจสอบก่อนว่าไม่ได้เพิ่มซ้ำ
            </p>
          </div>
        </div>

        <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto">
          {matches.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2 rounded-xl border border-[#f1ead7] bg-white px-3 py-2 text-sm">
              <div className="min-w-0">
                <span className="font-semibold text-[#4c1f08]">{m.name}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.exact ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                  {m.exact ? "ชื่อเดียวกัน" : `คล้าย ${Math.round(m.score * 100)}%`}
                </span>
                {m.inactive && <span className="ml-1 rounded-full bg-stone-200 px-2 py-0.5 text-[10px] text-stone-600">ปิดใช้งานอยู่</span>}
              </div>
              {editPath && (
                <Link to={editPath(m.id)} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-bold text-[#8d593a] hover:underline">
                  เปิดดู ↗
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#dfd1c1] bg-white px-4 py-2 text-sm font-bold text-[#6b3215] transition hover:bg-[#f1ead7] cursor-pointer"
          >
            กลับไปแก้ไข
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#4c1f08] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#6b3215] cursor-pointer"
          >
            ยืนยัน บันทึก{kind}นี้
          </button>
        </div>
      </div>
    </div>
  );
}
