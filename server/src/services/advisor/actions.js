// Action ที่ Advisor สั่งได้ — ทำงานด้วยโค้ดฝั่ง server ทั้งหมด (AI เลือกแค่ "ชนิด" และพารามิเตอร์)
// ไม่มี action ที่แก้ไขข้อมูลใน DB: การสั่งซื้อ/แก้ไขทุกอย่างผู้ใช้ต้องกดเองในหน้าเว็บ
import { Product } from "../../models/Product.model.js";
import { withAvailability } from "../../utils/stockAvailability.js";
import { SUBSCRIPTION_PLANS } from "../../utils/orderPricing.js";
import { loadProductCards } from "./retriever.js";

// หน้าในเว็บที่นำทางไปได้ตาม role (ตรงกับ client/src/App.jsx)
const PUBLIC_PAGES = {
  "/": "หน้าแรก",
  "/menus": "เมนูทั้งหมด",
  "/element-quiz": "แบบทดสอบธาตุเจ้าเรือน",
  "/menu-randomizer": "สุ่มเมนูตามธาตุ",
  "/cart": "ตะกร้าสินค้า",
};
const GUEST_PAGES = { ...PUBLIC_PAGES, "/login": "เข้าสู่ระบบ", "/register": "สมัครสมาชิก" };
const CUSTOMER_PAGES = {
  ...PUBLIC_PAGES,
  "/checkout": "ชำระเงิน",
  "/orders": "คำสั่งซื้อของฉัน",
  "/profile": "โปรไฟล์ของฉัน",
  "/profile/edit": "แก้ไขโปรไฟล์ / ข้อจำกัดอาหาร",
};
const ADMIN_PAGES = {
  ...PUBLIC_PAGES,
  "/admin/dashboard": "แดชบอร์ดแอดมิน",
  "/admin/orders": "จัดการคำสั่งซื้อ",
  "/admin/users": "จัดการผู้ใช้",
  "/admin/products": "จัดการเมนู",
  "/admin/products/new": "เพิ่มเมนูใหม่",
  "/admin/ingredients": "จัดการวัตถุดิบ/สต็อก",
  "/admin/ingredients/new": "เพิ่มวัตถุดิบใหม่",
  "/admin/recipe-builder": "สร้างสูตรอาหาร",
};

export function pagesForRole(role) {
  if (role === "admin") return ADMIN_PAGES;
  if (role === "customer") return CUSTOMER_PAGES;
  return GUEST_PAGES;
}

/** ตรวจ path ที่ AI เสนอ — อนุญาตเฉพาะหน้าใน whitelist หรือ /menus/<id ที่มีจริง> */
export function resolveNavigation(path, role, allowedProductIds = new Set()) {
  const clean = String(path || "").trim().split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const pages = pagesForRole(role);
  if (pages[clean]) return { path: clean, label: pages[clean] };
  const m = clean.match(/^\/menus\/([a-f0-9]{24})$/i);
  if (m && allowedProductIds.has(m[1])) return { path: clean, label: "ดูรายละเอียดเมนู" };
  return null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** เมนูที่พร้อมขาย (active + วัตถุดิบพอ) และตรงข้อจำกัดอาหารทั้งหมดของผู้ใช้ */
async function loadSellableProducts(restrictions = []) {
  const filter = { isActive: true };
  if (restrictions.length) filter.foodRestrictions = { $all: restrictions };
  const products = await Product.find(filter)
    .select("name nameTh region dominantElement elementSuitability recipe")
    .lean();
  return (await withAvailability(products)).filter(
    (p) => p.availability?.inStock !== false && p.availability?.availableKits !== 0,
  );
}

const matchesElement = (p, el) => p.dominantElement === el || (p.elementSuitability || []).includes(el);

/**
 * จัดเซตอาหารตามไซส์แพ็กเกจ: เลือกเมนูที่ตรงธาตุก่อน กระจายภูมิภาค แล้วเติมด้วยเมนูอื่นจนครบ
 */
export async function buildMealSet({ planId, element, restrictions = [], scope }) {
  const plan = SUBSCRIPTION_PLANS[String(planId || "").toUpperCase()] || SUBSCRIPTION_PLANS.M;
  const pool = await loadSellableProducts(restrictions);

  const preferred = shuffle(element ? pool.filter((p) => matchesElement(p, element)) : pool);
  const others = shuffle(pool.filter((p) => !preferred.includes(p)));

  // กระจายภูมิภาค: รอบแรกหยิบภาคละ 1 ก่อน แล้วค่อยเติม
  const picked = [];
  const usedRegions = new Set();
  for (const p of preferred) {
    if (picked.length >= plan.kitsPerWeek) break;
    if (!usedRegions.has(p.region)) {
      picked.push(p);
      usedRegions.add(p.region);
    }
  }
  for (const p of [...preferred, ...others]) {
    if (picked.length >= plan.kitsPerWeek) break;
    if (!picked.includes(p)) picked.push(p);
  }

  const cards = await loadProductCards(picked.map((p) => String(p._id)), scope, restrictions);
  const order = new Map(picked.map((p, i) => [String(p._id), i]));
  cards.sort((a, b) => order.get(a.id) - order.get(b.id));

  return {
    type: "build_set",
    plan: { id: plan.id, name: plan.name, kitsPerWeek: plan.kitsPerWeek, price: plan.price },
    element: element || null,
    products: cards,
    complete: cards.length >= plan.kitsPerWeek,
  };
}

/** สุ่มเมนู 1–3 เมนู (กรองตามธาตุ/ข้อจำกัดถ้ามี) */
export async function randomMenu({ count = 1, element, restrictions = [], scope }) {
  const n = Math.min(3, Math.max(1, Number(count) || 1));
  const pool = await loadSellableProducts(restrictions);
  const source = element && pool.some((p) => matchesElement(p, element)) ? pool.filter((p) => matchesElement(p, element)) : pool;
  const picked = shuffle(source).slice(0, n);
  const cards = await loadProductCards(picked.map((p) => String(p._id)), scope, restrictions);
  return { type: "random_menu", element: element || null, products: cards };
}
