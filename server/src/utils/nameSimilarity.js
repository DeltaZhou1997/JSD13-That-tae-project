// ตรวจชื่อซ้ำ/ใกล้เคียง (ใช้ทั้งตอนเพิ่มผ่านฟอร์มและตอนนำเข้า ZIP)

/** ตัดช่องว่าง/เครื่องหมาย/ตัวพิมพ์ ให้ "ลาบ หมู" กับ "ลาบหมู" ถือว่าเท่ากัน */
export function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/[\s\-_.,/()[\]{}'"`~!@#$%^&*+=|\\:;<>?]/g, "");
}

/** ชื่อหลักก่อนวงเล็บหรือ "/" เช่น "กะทิ (หัวกะทิ)" → "กะทิ" */
const baseOf = (name) => normalizeName(String(name || "").split(/\s*[(/]/)[0]);

function levenshtein(a, b) {
  const s = [...a];
  const t = [...b];
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  let prev = Array.from({ length: t.length + 1 }, (_, i) => i);
  for (let i = 1; i <= s.length; i++) {
    const cur = [i];
    for (let j = 1; j <= t.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[t.length];
}

const ratio = (a, b) => (!a || !b ? 0 : 1 - levenshtein(a, b) / Math.max([...a].length, [...b].length));

// Dice coefficient ของคู่ตัวอักษร (bigram) — ไม่สนลำดับคำ เช่น "ลาบหมูเหนือ" ≈ "ลาบเหนือหมู"
function dice(a, b) {
  const grams = (s) => {
    const chars = [...s];
    const map = new Map();
    for (let i = 0; i < chars.length - 1; i++) {
      const g = chars[i] + chars[i + 1];
      map.set(g, (map.get(g) || 0) + 1);
    }
    return map;
  };
  const ga = grams(a);
  const gb = grams(b);
  const total = [...ga.values(), ...gb.values()].reduce((s, n) => s + n, 0);
  if (!total) return 0;
  let shared = 0;
  for (const [g, n] of ga) shared += Math.min(n, gb.get(g) || 0);
  return (2 * shared) / total;
}

/**
 * คะแนนความเหมือน 0..1
 * - ชื่อเท่ากันหลังตัดช่องว่าง/เครื่องหมาย = 1
 * - ชื่อหลักเท่ากัน (เช่น "กะทิ" กับ "กะทิ (หัวกะทิ)") หรือชื่อหนึ่งอยู่ในอีกชื่อ (ยาว ≥ 3 ตัว) = 0.9
 * - นอกนั้นใช้ค่าสูงสุดของ edit distance และ bigram (ไม่สนลำดับคำ)
 */
export function nameSimilarity(a, b) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const ba = baseOf(a);
  const bb = baseOf(b);
  if (ba && ba === bb) return 0.9;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = shorter === na ? nb : na;
  if ([...shorter].length >= 3 && longer.includes(shorter)) return 0.9;
  return Math.max(ratio(na, nb), ratio(ba, bb), dice(na, nb));
}

export const SIMILAR_THRESHOLD = 0.75;

/**
 * หาชื่อที่ซ้ำ/ใกล้เคียงจากรายการ
 * @param {string} name
 * @param {Array<{ id: string, name: string, nameEn?: string }>} candidates
 * @returns {Array<{ id, name, score, exact }>} เรียงจากเหมือนมากไปน้อย (สูงสุด 5)
 */
export function findSimilarNames(name, candidates, { threshold = SIMILAR_THRESHOLD, limit = 5 } = {}) {
  return candidates
    .map((c) => {
      const score = Math.max(nameSimilarity(name, c.name), c.nameEn ? nameSimilarity(name, c.nameEn) * 0.95 : 0);
      return { id: c.id, name: c.name, score: Number(score.toFixed(2)), exact: normalizeName(name) === normalizeName(c.name) };
    })
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
