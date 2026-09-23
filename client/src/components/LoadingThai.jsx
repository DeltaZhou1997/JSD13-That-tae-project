export default function LoadingThai({ label = "กำลังเตรียมเมนูไทยให้คุณ...", className = "" }) {
  return (
    <div className={`flex min-h-48 flex-col items-center justify-center gap-3 text-center ${className}`} role="status" aria-live="polite">
      <div className="relative grid h-16 w-16 place-items-center rounded-full border-4 border-[#ead7c2] bg-[#fffaf3] shadow-inner">
        <span className="absolute inset-1 rounded-full border-4 border-transparent border-t-[#8d593a] border-r-[#c58a42] animate-spin" />
        <span className="text-2xl" aria-hidden="true">🍚</span>
      </div>
      <div>
        <p className="font-bold text-[#4c1f08]">{label}</p>
        <p className="mt-1 text-xs text-[#9b806d]">หอมกรุ่นจากครัว That Tae</p>
      </div>
    </div>
  );
}

export function MenuSkeletons({ count = 6 }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: count }, (_, i) => <div key={i} className="animate-pulse rounded-2xl border border-[#eadfd4] bg-white p-3"><div className="h-40 rounded-xl bg-[#f1e5d8]" /><div className="mt-4 h-4 w-2/3 rounded bg-[#eadfd4]" /><div className="mt-2 h-3 w-full rounded bg-[#f1e5d8]" /><div className="mt-2 h-3 w-1/2 rounded bg-[#f1e5d8]" /></div>)}</div>;
}
