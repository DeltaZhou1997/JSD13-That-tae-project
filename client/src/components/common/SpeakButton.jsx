import { useEffect, useState } from "react";
import { hasVoiceFor, isSpeechSupported, speak, stopSpeaking } from "../../utils/speech.js";

/**
 * ปุ่มลำโพงอ่านออกเสียง (Web Speech API)
 * @param {{ text: string, lang?: "th-TH"|"en-US", label?: string, size?: "sm"|"md", className?: string }} props
 */
export default function SpeakButton({ text, lang = "th-TH", label, size = "md", className = "" }) {
  const [speaking, setSpeaking] = useState(false);
  const [voiceMissing, setVoiceMissing] = useState(false);

  useEffect(() => {
    let alive = true;
    hasVoiceFor(lang).then((ok) => alive && setVoiceMissing(!ok));
    return () => {
      alive = false;
    };
  }, [lang]);

  // ออกจากหน้า → หยุดเสียง
  useEffect(() => () => speaking && stopSpeaking(), [speaking]);

  if (!isSpeechSupported() || !String(text || "").trim()) return null;

  const langName = lang.startsWith("th") ? "ภาษาไทย" : "ภาษาอังกฤษ";
  const title = voiceMissing
    ? `อุปกรณ์นี้ยังไม่มีเสียง${langName} — ระบบจะใช้เสียงที่มีแทน`
    : speaking
      ? "หยุดอ่าน"
      : label || `ฟังการออกเสียง${langName}`;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // กันคลิกทะลุไปการ์ด/ลิงก์
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speak(text, { lang, onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
    setSpeaking(true);
  };

  const box = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={title}
      aria-pressed={speaking}
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer align-middle ${
        speaking
          ? "border-[#8b5e34] bg-[#8b5e34] text-white shadow-md scale-105"
          : "border-[#e6d9c8] bg-white text-[#8b5e34] hover:border-[#8b5e34] hover:bg-[#fbf6ee] hover:scale-105"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon} aria-hidden="true">
        {/* ตัวลำโพง */}
        <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" fillOpacity="0.15" />
        {/* คลื่นเสียง — ขยับขณะกำลังอ่าน */}
        <path d="M15.5 8.5a5 5 0 0 1 0 7" className={speaking ? "animate-pulse" : ""} />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" className={speaking ? "animate-pulse [animation-delay:200ms]" : "opacity-60"} />
      </svg>
    </button>
  );
}
