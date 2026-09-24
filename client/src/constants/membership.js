// กติกาแต้ม "เบี้ย" และระดับสมาชิก (Tier) — ⚠️ ต้องตรงกับ server/src/utils/membership.js
// รายละเอียดแผนสมาชิกทั้งหมดอยู่ที่ MEMBERSHIP_PLAN.md (root ของโปรเจกต์)

// A La Carte: ทุก 10 บาท = 1 เบี้ย (ไม่มียอดขั้นต่ำ)
export const BAHT_PER_POINT = 10;

// เบี้ยต่อกล่อง Cooking Kit — ไม่เป็นเชิงเส้น กล่องใหญ่คุ้มกว่า (อัตราเทียบ A La Carte ในวงเล็บ)
// S 599฿ → 60 (x1.0) | M 899฿ → 110 (x1.22) | L 1,169฿ → 170 (x1.45) | XL 1,599฿ → 280 (x1.75)
export const PLAN_POINTS = { S: 60, M: 110, L: 170, XL: 280 };

// ระดับสมาชิก — ขึ้นอัตโนมัติจาก "เบี้ยสะสมตลอดชีพ" (lifetimePoints) ไม่ลดลงเมื่อใช้เบี้ย
// multiplier = ตัวคูณเบี้ยที่ได้จากการซื้อ
export const TIERS = [
  { id: "BRONZE", name: "Bronze", minLifetime: 0, multiplier: 1 },
  { id: "SILVER", name: "Silver", minLifetime: 1500, multiplier: 1.1 },
  { id: "GOLD", name: "Gold", minLifetime: 5000, multiplier: 1.25 },
  { id: "PLATINUM", name: "Platinum", minLifetime: 12000, multiplier: 1.5 },
];

// การใช้เบี้ยเป็นส่วนลด: 10 เบี้ย = 1 บาท ใช้ขั้นต่ำ 10 และเพิ่มทีละ 10
export const REDEEM = { POINTS_PER_BAHT: 10, STEP: 10, MIN: 10 };

const TIER_INDEX = Object.fromEntries(TIERS.map((t, i) => [t.id, i]));

export function normalizeTier(tier) {
  const id = String(tier || "BRONZE").toUpperCase();
  return TIER_INDEX[id] === undefined ? "BRONZE" : id;
}

export function getTier(tier) {
  return TIERS[TIER_INDEX[normalizeTier(tier)]];
}

export function tierForLifetime(lifetimePoints = 0) {
  let found = TIERS[0];
  for (const t of TIERS) if (lifetimePoints >= t.minLifetime) found = t;
  return found;
}

/** เบี้ยสะสมตลอดชีพ (ผู้ใช้เก่าที่ยังไม่มี lifetimePoints ใช้ยอดเบี้ยคงเหลือแทน) */
export function effectiveLifetime(user) {
  return Math.max(Number(user?.lifetimePoints) || 0, Number(user?.points) || 0);
}

/** ระดับที่ควรเป็น — ขึ้นอย่างเดียว ไม่ลดระดับที่แอดมินตั้งไว้สูงกว่า */
export function resolveTier(currentTier, lifetimePoints) {
  const byPoints = tierForLifetime(lifetimePoints);
  const current = getTier(currentTier);
  return TIER_INDEX[byPoints.id] > TIER_INDEX[current.id] ? byPoints.id : current.id;
}

/** ข้อมูลความคืบหน้าไประดับถัดไป (ใช้แสดงผลหน้าโปรไฟล์/checkout) */
export function tierProgress(currentTier, lifetimePoints) {
  const tier = getTier(resolveTier(currentTier, lifetimePoints));
  const next = TIERS[TIER_INDEX[tier.id] + 1] || null;
  return {
    tier: tier.id,
    nextTier: next?.id || null,
    pointsToNext: next ? Math.max(0, next.minLifetime - lifetimePoints) : 0,
  };
}

/**
 * เบี้ยที่จะได้จากคำสั่งซื้อ
 * - แพ็กเกจ: เบี้ยตามขนาดกล่อง + เมนูเสริมเกินโควตาคิดแบบ A La Carte
 * - คูณตาม Tier แล้วลดตามสัดส่วนที่จ่ายด้วยเบี้ย (ส่วนลดไม่ได้เบี้ยซ้ำ)
 */
export function calculateEarnedPoints({ planId = null, itemsSubtotal = 0, extraSubtotal = 0, discount = 0, tier } = {}) {
  if (!itemsSubtotal || itemsSubtotal <= 0) return 0;
  const base = planId && PLAN_POINTS[planId]
    ? PLAN_POINTS[planId] + Math.floor(extraSubtotal / BAHT_PER_POINT)
    : Math.floor(itemsSubtotal / BAHT_PER_POINT);
  const paidRatio = Math.max(0, itemsSubtotal - discount) / itemsSubtotal;
  return Math.floor(base * getTier(tier).multiplier * paidRatio);
}

/** ส่วนลดสูงสุดที่ใช้เบี้ยได้ = ค่าสินค้า (ค่าจัดส่งต้องจ่ายเสมอ) */
export function maxRedeemablePoints(availablePoints, itemsSubtotal) {
  const cap = Math.min(Math.max(0, Number(availablePoints) || 0), Math.max(0, itemsSubtotal) * REDEEM.POINTS_PER_BAHT);
  return Math.floor(cap / REDEEM.STEP) * REDEEM.STEP;
}

/** ตรวจจำนวนเบี้ยที่ขอใช้ — คืน { points, discount } หรือ { error } */
export function validateRedeem(requested, availablePoints, itemsSubtotal) {
  const points = Number(requested) || 0;
  if (points === 0) return { points: 0, discount: 0 };
  if (!Number.isInteger(points) || points < REDEEM.MIN || points % REDEEM.STEP !== 0) {
    return { error: `ใช้เบี้ยได้ขั้นต่ำ ${REDEEM.MIN} และเพิ่มทีละ ${REDEEM.STEP} เบี้ย` };
  }
  if (points > (Number(availablePoints) || 0)) return { error: "เบี้ยสะสมไม่พอ" };
  if (points > maxRedeemablePoints(availablePoints, itemsSubtotal)) {
    return { error: "ใช้เบี้ยลดได้ไม่เกินมูลค่าสินค้า (ไม่รวมค่าจัดส่ง)" };
  }
  return { points, discount: points / REDEEM.POINTS_PER_BAHT };
}
