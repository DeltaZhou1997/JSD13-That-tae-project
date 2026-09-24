// สร้าง/ซิงก์ index เวกเตอร์ของ That-Tae Advisor จากข้อมูลจริงใน MongoDB
// - ฝังเฉพาะเอกสารที่เนื้อหาเปลี่ยน (เทียบ contentHash) เพื่อลดค่าใช้จ่าย API
// - ข้อมูลที่เปลี่ยนบ่อย (ราคา/สต็อก) ไม่ฝังลงเวกเตอร์ — retriever ดึงสดตอนตอบ
import crypto from "crypto";
import { Product } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import { AdvisorChunk } from "../../models/AdvisorChunk.model.js";
import { SHIPPING_FEE, POINT_CALCULATION, SUBSCRIPTION_PLANS } from "../../utils/orderPricing.js";
import { ELEMENT_KNOWLEDGE_BASE, RESTRICTION_LABELS, REGION_LABELS, buildSiteDocs } from "./knowledgeBase.js";
import { embedDocuments } from "./geminiClient.js";
import { getAdvisorConfig } from "./config.js";
import { invalidateChunkCache } from "./retriever.js";

const clip = (s, n) => {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
};
const list = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "");

function productDoc(p) {
  const recipeNames = (p.recipe || [])
    .map((r) => (r.medicinalTaste ? `${r.nameTh} (รส${r.medicinalTaste})` : r.nameTh))
    .filter(Boolean);
  const text = [
    `เมนู: ${p.nameTh || p.name}${p.nameEn ? ` (${p.nameEn})` : ""}`,
    `ภูมิภาค: ${REGION_LABELS[p.region] || p.regionNameTh || ""}`,
    `ธาตุหลัก: ธาตุ${p.dominantElement || "-"} | เหมาะกับธาตุ: ${list(p.elementSuitability) || "-"}`,
    p.foodRestrictions?.length
      ? `เหมาะกับข้อจำกัด: ${p.foodRestrictions.map((r) => RESTRICTION_LABELS[r] || r).join(", ")}`
      : "",
    p.calories ? `พลังงาน ${p.calories} kcal สำหรับ ${p.servings || 2} ที่` : "",
    recipeNames.length ? `วัตถุดิบ: ${recipeNames.join(", ")}` : p.ingredients ? `วัตถุดิบ: ${clip(p.ingredients, 300)}` : "",
    p.description ? `รายละเอียด: ${clip(p.description, 600)}` : "",
    p.history ? `ประวัติ: ${clip(p.history, 300)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return {
    key: `product:${p._id}`,
    sourceType: "product",
    sourceId: String(p._id),
    // เมนูที่ปิดขายอยู่ ให้เฉพาะแอดมินค้นเจอ
    visibility: p.isActive === false ? "admin" : "public",
    title: p.nameTh || p.name,
    text,
  };
}

function ingredientDoc(i) {
  const n = i.nutrientsPer100g || i.nutritionPer100G || {};
  const text = [
    `วัตถุดิบ: ${i.nameTh}${i.nameEn ? ` (${i.nameEn})` : ""}`,
    `หมวดหมู่: ${i.categoryTh || i.category || "-"}`,
    `รสยา: ${i.medicinalTaste || "-"} | ธาตุที่เกี่ยวข้อง: ${list(i.elements) || "-"}`,
    `สารอาหารต่อ 100 กรัม: พลังงาน ${n.calories || 0} kcal, โปรตีน ${n.protein || 0} g, คาร์บ ${n.carb ?? n.carbs ?? 0} g, ไขมัน ${n.fat || 0} g, ใยอาหาร ${n.fiber || 0} g, โซเดียม ${n.sodium || 0} mg`,
  ].join("\n");
  return {
    key: `ingredient:${i._id}`,
    sourceType: "ingredient",
    sourceId: String(i._id),
    visibility: i.isActive === false ? "admin" : "public",
    title: i.nameTh,
    text,
  };
}

function elementDocs() {
  return Object.values(ELEMENT_KNOWLEDGE_BASE).map((e) => ({
    key: `element:${e.element}`,
    sourceType: "element",
    sourceId: e.element,
    visibility: "public",
    title: `ธาตุ${e.element} (${e.name})`,
    text: [
      `ธาตุ${e.element} (${e.name}, ${e.en})`,
      `อวัยวะ/ระบบที่เกี่ยวข้อง: ${e.organ}`,
      `ลักษณะ: ${e.characteristics}`,
      `ปัญหาที่พบบ่อย: ${list(e.commonIssues)}`,
      `รสที่ช่วยปรับสมดุล: ${list(e.balanceTastes)}`,
      `รสที่ควรเลี่ยง: ${list(e.avoidTastes)}`,
      `อาหารแนะนำ: ${list(e.recommendedFoods)}`,
      `สมุนไพรแนะนำ: ${list(e.herbs)}`,
      `คำแนะนำตามฤดู: ${e.seasonalAdvice}`,
    ].join("\n"),
  }));
}

function siteDocs() {
  return buildSiteDocs({ shippingFee: SHIPPING_FEE, pointRule: POINT_CALCULATION, plans: SUBSCRIPTION_PLANS }).map(
    (d) => ({ key: d.key, sourceType: "site", sourceId: d.key, visibility: "public", title: d.title, text: d.text }),
  );
}

export async function buildSourceDocs() {
  const [products, ingredients] = await Promise.all([
    Product.find()
      .select("name nameTh nameEn region regionNameTh dominantElement elementSuitability foodRestrictions calories servings ingredients recipe.nameTh recipe.medicinalTaste description history isActive")
      .lean(),
    Ingredient.find().select("nameTh nameEn category categoryTh medicinalTaste elements nutrientsPer100g nutritionPer100G isActive").lean(),
  ]);
  return [...products.map(productDoc), ...ingredients.map(ingredientDoc), ...elementDocs(), ...siteDocs()];
}

function hashDoc(doc, cfg) {
  return crypto
    .createHash("sha1")
    .update(`${cfg.embeddingModel}|${cfg.embeddingDim}|${doc.visibility}|${doc.title}|${doc.text}`)
    .digest("hex");
}

/** ซิงก์ index: ฝังเฉพาะที่เปลี่ยน + ลบเอกสารที่ไม่มีแล้ว */
export async function syncAdvisorIndex({ force = false } = {}) {
  const cfg = getAdvisorConfig();
  const docs = await buildSourceDocs();
  for (const d of docs) d.contentHash = hashDoc(d, cfg);

  const existing = await AdvisorChunk.find().select("key contentHash").lean();
  const existingHash = new Map(existing.map((c) => [c.key, c.contentHash]));
  const changed = force ? docs : docs.filter((d) => existingHash.get(d.key) !== d.contentHash);

  if (changed.length > 0) {
    const vectors = await embedDocuments(
      changed.map((d) => d.text),
      changed.map((d) => d.title),
    );
    await AdvisorChunk.bulkWrite(
      changed.map((d, i) => ({
        updateOne: {
          filter: { key: d.key },
          update: { $set: { ...d, embeddingModel: cfg.embeddingModel, embedding: vectors[i] || [] } },
          upsert: true,
        },
      })),
    );
  }

  const liveKeys = new Set(docs.map((d) => d.key));
  const staleKeys = existing.map((c) => c.key).filter((k) => !liveKeys.has(k));
  if (staleKeys.length > 0) await AdvisorChunk.deleteMany({ key: { $in: staleKeys } });
  if (changed.length > 0 || staleKeys.length > 0) invalidateChunkCache();
  lastSyncAt = Date.now();

  return { total: docs.length, embedded: changed.length, removed: staleKeys.length };
}

// ---- ซิงก์อัตโนมัติแบบ throttle (เรียกตอนมีคำถามเข้ามา) ----
let lastSyncAt = 0;
let syncing = null;

/** รอให้ index พร้อม (ครั้งแรก) แล้วซิงก์เบื้องหลังตามรอบ */
export async function ensureIndexFresh() {
  const cfg = getAdvisorConfig();
  const due = Date.now() - lastSyncAt > cfg.syncIntervalMs;
  const hasAny = await AdvisorChunk.exists({});
  if (!due && hasAny) return;

  if (!syncing) {
    syncing = syncAdvisorIndex()
      .then((r) => {
        if (r.embedded || r.removed) console.log(`🧠 Advisor index synced:`, r);
        return r;
      })
      .catch((err) => {
        lastSyncAt = Date.now(); // ล้มเหลว → รอรอบถัดไปค่อยลองใหม่ (ยกเว้น index ยังว่าง)
        throw err;
      })
      .finally(() => {
        syncing = null;
      });
  }

  // ถ้ายังไม่เคยมี index เลย ต้องรอให้เสร็จก่อนตอบ ไม่งั้นปล่อยให้ซิงก์อยู่เบื้องหลัง
  if (!hasAny) await syncing;
  else syncing.catch((err) => console.error("Advisor index sync failed:", err.message));
}
