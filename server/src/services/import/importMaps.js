// ตารางแปลงค่าที่แอดมินพิมพ์ใน CSV → ค่าที่ระบบใช้ (รับทั้งรหัสอังกฤษและชื่อไทย)
import { INGREDIENT_CATEGORIES } from "../../models/Ingredient.model.js";
import { RESTRICTION_LABELS, REGION_LABELS } from "../advisor/knowledgeBase.js";
import { normalizeName } from "../../utils/nameSimilarity.js";

// ชื่อหมวดไทยที่หน้าเว็บใช้ (client CATEGORY_MAP) — บางชื่อสะกดต่างจากใน model
export const CATEGORY_TH = {
  meat: "เนื้อสัตว์ & โปรตีน",
  poultry: "สัตว์ปีก",
  seafood: "อาหารทะเล",
  plantprotein: "โปรตีนจากพืช",
  vegetable: "ผัก & พืชสมุนไพร",
  herb_spice: "สมุนไพร & เครื่องเทศ",
  seasoning_spice: "เครื่องปรุง & เครื่องเทศ",
  carb: "แป้ง & คาร์โบไฮเดรต",
  seasoning: "เครื่องปรุงรส",
  dairy: "นม",
  egg: "ไข่",
  other: "อื่น ๆ",
};

const categoryLookup = new Map();
for (const map of [CATEGORY_TH, INGREDIENT_CATEGORIES]) {
  for (const [key, label] of Object.entries(map)) {
    categoryLookup.set(normalizeName(key), key);
    categoryLookup.set(normalizeName(label), key);
  }
}
// คำที่แอดมินน่าจะพิมพ์
[
  ["ผัก", "vegetable"],
  ["สมุนไพร", "herb_spice"],
  ["เครื่องเทศ", "herb_spice"],
  ["เนื้อสัตว์", "meat"],
  ["หมู", "meat"],
  ["ไก่", "poultry"],
  ["ทะเล", "seafood"],
  ["แป้ง", "carb"],
  ["เส้น", "carb"],
  ["ข้าว", "carb"],
  ["เครื่องปรุง", "seasoning"],
  ["ซอส", "seasoning"],
  ["ถั่ว", "plantprotein"],
  ["นมเนย", "dairy"],
  ["อื่นๆ", "other"],
].forEach(([th, key]) => categoryLookup.set(normalizeName(th), key));

export const resolveCategory = (value) => categoryLookup.get(normalizeName(value)) || null;

// ภูมิภาคเมนู
const regionLookup = new Map();
for (const [key, label] of Object.entries(REGION_LABELS)) {
  regionLookup.set(normalizeName(key), key);
  regionLookup.set(normalizeName(label), key);
  regionLookup.set(normalizeName(label.replace("ภาค", "")), key);
}
[
  ["ฟิวชั่น", "fusion"],
  ["ฟิวชัน", "fusion"],
  ["ไทยฟิวชัน", "fusion"],
  ["ขนมหวาน", "fusion"], // ขนมหวานใช้สต็อกภาคกลางเหมือนไทยฟิวชั่น
  ["north", "northern"],
  ["northeast", "northeastern"],
  ["isan", "northeastern"],
  ["south", "southern"],
].forEach(([alias, key]) => regionLookup.set(normalizeName(alias), key));

export const resolveRegion = (value) => regionLookup.get(normalizeName(value)) || null;
export const regionLabel = (key) => REGION_LABELS[key] || key;

// ข้อจำกัดอาหาร: รับรหัส (low_sodium) หรือชื่อไทย (ลดเค็ม)
const restrictionLookup = new Map();
for (const [id, label] of Object.entries(RESTRICTION_LABELS)) {
  restrictionLookup.set(normalizeName(id), id);
  restrictionLookup.set(normalizeName(label), id);
}
export const resolveRestriction = (value) => restrictionLookup.get(normalizeName(value)) || null;
export const restrictionLabel = (id) => RESTRICTION_LABELS[id] || id;

export const UNITS = ["g", "kg", "ml", "l", "piece"];
const unitLookup = new Map(
  [
    ["g", "g"], ["กรัม", "g"], ["gram", "g"],
    ["kg", "kg"], ["กิโลกรัม", "kg"], ["กก", "kg"],
    ["ml", "ml"], ["มล", "ml"], ["มิลลิลิตร", "ml"],
    ["l", "l"], ["ลิตร", "l"],
    ["piece", "piece"], ["pcs", "piece"], ["ชิ้น", "piece"], ["ฟอง", "piece"], ["ลูก", "piece"], ["หัว", "piece"],
  ].map(([k, v]) => [normalizeName(k), v]),
);
export const resolveUnit = (value) => (String(value || "").trim() ? unitLookup.get(normalizeName(value)) || null : "g");

/** แยกค่าหลายค่าในช่องเดียว: คั่นด้วย | , หรือขึ้นบรรทัดใหม่ */
export const splitMulti = (value, { newlineOnly = false } = {}) =>
  String(value || "")
    .split(newlineOnly ? /\r?\n|\|/ : /\r?\n|\||,/)
    .map((s) => s.trim())
    .filter(Boolean);

/** ตัวเลขจาก CSV (รองรับ "1,200" และช่องว่าง) — คืน null ถ้าว่าง, NaN ถ้าไม่ใช่ตัวเลข */
export function toNumber(value) {
  const s = String(value ?? "").replace(/,/g, "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
