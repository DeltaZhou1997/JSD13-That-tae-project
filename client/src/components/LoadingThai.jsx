import { useEffect, useState } from "react";

const ELEMENTS = [
  { color: "#b77945", path: <path d="m8 3 4 8 5-5 5 15H2L8 3z" /> },
  { color: "#3b82a0", path: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /> },
  { color: "#4c8b66", path: <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /> },
  { color: "#c85b45", path: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" /> },
];

export default function LoadingThai({ label = "กำลังเตรียมเมนูไทยให้คุณ...", className = "" }) {
  const [elementIndex, setElementIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setElementIndex((index) => (index + 1) % ELEMENTS.length), 900);
    return () => window.clearInterval(timer);
  }, []);
  const element = ELEMENTS[elementIndex];
  return (
    <div className={`flex min-h-48 flex-col items-center justify-center gap-3 text-center ${className}`} role="status" aria-live="polite">
      <div className="relative grid h-16 w-16 place-items-center rounded-full border-4 border-[#ead7c2] bg-[#fffaf3] shadow-inner">
        <span className="absolute inset-1 rounded-full border-4 border-transparent border-t-[#8d593a] border-r-[#c58a42] animate-spin" />
        <svg key={elementIndex} viewBox="0 0 24 24" fill="none" stroke={element.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 animate-[navDrop_400ms_ease-out]" aria-hidden="true">
          {element.path}
        </svg>
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
