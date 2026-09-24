// อ่านออกเสียง (Text-to-Speech) ด้วย Web Speech API ที่มีในเบราว์เซอร์ — ฟรี ไม่ต้องใช้ API key ไม่ต้องต่อเน็ตเพิ่ม
// เสียงที่ได้ขึ้นกับอุปกรณ์: Android/iOS/macOS มีเสียงไทยในตัว, Windows ต้องมีชุดภาษาไทย (Microsoft Pattara/Achara)
// Chrome บนคอมมีเสียง Google ออนไลน์บางภาษาให้เพิ่ม

export const isSpeechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

// รายชื่อเสียงโหลดแบบ async (Chrome) — รอครั้งแรก
let voicesReady = null;
function loadVoices() {
  if (!isSpeechSupported()) return Promise.resolve([]);
  if (voicesReady) return voicesReady;
  voicesReady = new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) return resolve(voices);
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener?.("voiceschanged", done, { once: true });
    setTimeout(done, 1200); // บางเบราว์เซอร์ไม่ยิง event
  });
  return voicesReady;
}

/** เลือกเสียงที่ตรงภาษา — ชอบเสียงคุณภาพสูง (Google / Microsoft Online / Natural) ก่อน */
function pickVoice(voices, lang) {
  const prefix = lang.slice(0, 2).toLowerCase();
  const matches = voices.filter((v) => v.lang?.toLowerCase().replace("_", "-").startsWith(prefix));
  const score = (v) =>
    (v.lang?.toLowerCase().replace("_", "-") === lang.toLowerCase() ? 4 : 0) +
    (/google|natural|online|premium|enhanced/i.test(v.name) ? 2 : 0) +
    (v.localService ? 1 : 0);
  return matches.sort((a, b) => score(b) - score(a))[0] || null;
}

/** มีเสียงของภาษานี้ในอุปกรณ์ไหม */
export async function hasVoiceFor(lang) {
  return Boolean(pickVoice(await loadVoices(), lang));
}

/**
 * อ่านข้อความ — เรียกซ้ำจะหยุดเสียงเดิมก่อน
 * @param {string} text
 * @param {{ lang?: "th-TH"|"en-US", rate?: number, onStart?: ()=>void, onEnd?: ()=>void }} opts
 */
export async function speak(text, { lang = "th-TH", rate = 0.95, onStart, onEnd } = {}) {
  if (!isSpeechSupported() || !String(text || "").trim()) {
    onEnd?.();
    return false;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = pickVoice(await loadVoices(), lang);

  const utter = new SpeechSynthesisUtterance(String(text).trim());
  utter.lang = voice?.lang || lang; // ไม่มีเสียงตรงภาษา → ให้เบราว์เซอร์เลือกเอง
  if (voice) utter.voice = voice;
  utter.rate = rate;
  utter.pitch = 1;
  utter.onstart = () => onStart?.();
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  synth.speak(utter);
  return true;
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
