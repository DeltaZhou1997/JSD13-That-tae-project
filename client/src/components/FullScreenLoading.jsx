import { useEffect, useState } from "react";

const ELEMENTS = [
  { color: "#a96f45", path: "m8 3 4 8 5-5 5 15H2L8 3z" },
  { color: "#3b82a0", path: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" },
  { color: "#4c8b66", path: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" },
  { color: "#c85b45", path: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" },
];

export default function FullScreenLoading({ label = "กำลังเข้าสู่ระบบ..." }) {
  const [index, setIndex] = useState(0);
  useEffect(() => { const timer = setInterval(() => setIndex((value) => (value + 1) % ELEMENTS.length), 700); return () => clearInterval(timer); }, []);
  const element = ELEMENTS[index];
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3d2c2e]/55 p-6 backdrop-blur-md" role="status" aria-live="polite">
    <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-[#fffaf3]/95 p-8 text-center shadow-2xl">
      <div className="relative mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full border-4 border-[#ead7c2] bg-white shadow-inner">
        <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-[#8d593a] border-r-[#c58a42] animate-spin" />
        <svg key={index} viewBox="0 0 24 24" fill="none" stroke={element.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 animate-[navDrop_400ms_ease-out]"><path d={element.path} /></svg>
      </div>
      <h2 className="text-lg font-black text-[#4c1f08]">{label}</h2>
      <p className="mt-2 text-sm text-[#7a6557]">กำลังเตรียมความพร้อมให้คุณ กรุณารอสักครู่</p>
      <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-[#eadfd4]"><div className="h-full w-1/2 animate-[loadingBar_1.2s_ease-in-out_infinite] rounded-full bg-[#8d593a]" /></div>
    </div>
  </div>;
}
