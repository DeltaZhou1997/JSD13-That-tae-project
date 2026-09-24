// ดึงบริบท (retrieval) ให้ Advisor ตามขอบเขตของ role
// - ค้นเวกเตอร์เฉพาะเอกสารที่ visibility อยู่ใน scope
// - ข้อมูลส่วนตัวใช้ userId จาก token เท่านั้น
// - ส่งออกเฉพาะฟิลด์ที่อนุญาต (whitelist) ไม่ส่งรหัสผ่าน ที่อยู่เต็ม หรือข้อมูลของผู้ใช้คนอื่น
import mongoose from "mongoose";
import { Product } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import { User } from "../../models/User.model.js";
import { Cart } from "../../models/Cart.model.js";
import { Order } from "../../models/Order.model.js";
import { AdvisorChunk } from "../../models/AdvisorChunk.model.js";
import { withAvailability } from "../../utils/stockAvailability.js";
import { REGION_LABELS, RESTRICTION_LABELS } from "./knowledgeBase.js";
import { getAdvisorConfig } from "./config.js";

const ELEMENT_TO_TH = { earth: "ดิน", water: "น้ำ", wind: "ลม", air: "ลม", fire: "ไฟ", ดิน: "ดิน", น้ำ: "น้ำ", ลม: "ลม", ไฟ: "ไฟ" };

export function normalizeElement(value) {
  const key = String(value || "").replace("ธาตุ", "").trim().toLowerCase();
  return ELEMENT_TO_TH[key] || null;
}

// ---------------------------------------------------------------------------
// Vector search
// ---------------------------------------------------------------------------
let chunkCache = { at: 0, rows: [] };
const CHUNK_CACHE_MS = 60 * 1000;

async function loadChunks() {
  if (Date.now() - chunkCache.at < CHUNK_CACHE_MS && chunkCache.rows.length) return chunkCache.rows;
  const rows = await AdvisorChunk.find({ "embedding.0": { $exists: true } })
    .select("key sourceType sourceId visibility title text embedding")
    .lean();
  for (const r of rows) r.norm = Math.hypot(...r.embedding) || 1;
  chunkCache = { at: Date.now(), rows };
  return rows;
}

export function invalidateChunkCache() {
  chunkCache = { at: 0, rows: [] };
}

function cosine(a, b, normB) {
  let dot = 0;
  let na = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
  }
  return dot / ((Math.sqrt(na) || 1) * normB);
}

export async function searchChunks(queryVector, scope) {
  const cfg = getAdvisorConfig();
  if (!queryVector?.length) return [];

  // Atlas Vector Search (ถ้าตั้งชื่อ index ไว้) — filter visibility ใน DB ตั้งแต่ต้น
  if (cfg.vectorIndexName) {
    const hits = await AdvisorChunk.aggregate([
      {
        $vectorSearch: {
          index: cfg.vectorIndexName,
          path: "embedding",
          queryVector,
          numCandidates: cfg.topK * 10,
          limit: cfg.topK,
          filter: { visibility: { $in: scope.visibilities } },
        },
      },
      { $project: { sourceType: 1, sourceId: 1, title: 1, text: 1, score: { $meta: "vectorSearchScore" } } },
    ]);
    // vectorSearchScore ของ cosine อยู่ในช่วง 0..1 = (1 + cos) / 2
    return hits.filter((h) => h.score * 2 - 1 >= cfg.minScore);
  }

  // Fallback: คำนวณ cosine ในหน่วยความจำ (ข้อมูลร้านมีหลักร้อยรายการ)
  const rows = await loadChunks();
  return rows
    .filter((r) => scope.visibilities.includes(r.visibility))
    .map((r) => ({ sourceType: r.sourceType, sourceId: r.sourceId, title: r.title, text: r.text, score: cosine(queryVector, r.embedding, r.norm) }))
    .filter((r) => r.score >= cfg.minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, cfg.topK);
}

// ---------------------------------------------------------------------------
// ข้อมูลสดของเมนู (ราคา / สต็อก) — ไม่เชื่อค่าที่ฝังไว้ในเวกเตอร์
// ---------------------------------------------------------------------------
export async function loadProductCards(ids, scope, userRestrictions = []) {
  const validIds = [...new Set(ids)].filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validIds.length === 0) return [];

  const filter = { _id: { $in: validIds } };
  if (!scope.visibilities.includes("admin")) filter.isActive = true;

  const products = await Product.find(filter)
    .select("name nameTh price region dominantElement elementSuitability foodRestrictions recipe isActive imageUrl")
    .lean();
  const withStock = await withAvailability(products);

  return withStock.map((p) => {
    const restrictions = p.foodRestrictions || [];
    const missingRestrictions = userRestrictions.filter((r) => !restrictions.includes(r));
    return {
      id: String(p._id),
      name: p.nameTh || p.name,
      price: p.price,
      imageUrl: (Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl) || "",
      region: REGION_LABELS[p.region] || p.region,
      dominantElement: p.dominantElement,
      suitableElements: p.elementSuitability || [],
      suitableFor: restrictions.map((r) => RESTRICTION_LABELS[r] || r),
      inStock: p.availability?.inStock !== false && p.availability?.availableKits !== 0,
      // ตรงกับข้อจำกัดอาหารของผู้ใช้ทั้งหมดหรือไม่ (ลูกค้าเท่านั้น)
      fitsUserRestrictions: userRestrictions.length ? missingRestrictions.length === 0 : null,
      // รูปแบบเดียวกับ /api/v2/products เพื่อให้ handleAddToCart ฝั่ง client เช็กสต็อกได้
      availability: { availableKits: p.availability?.availableKits ?? null, inStock: p.availability?.inStock !== false },
      ...(scope.adminInsights ? { isActive: p.isActive !== false } : {}),
    };
  });
}

/** เมนูที่เหมาะกับธาตุ (เสริมผลการค้นหาเมื่อรู้ธาตุของผู้ใช้) */
export async function findProductIdsByElement(element, limit = 6) {
  if (!element) return [];
  const rows = await Product.find({
    isActive: true,
    $or: [{ dominantElement: element }, { elementSuitability: element }],
  })
    .select("_id")
    .limit(limit)
    .lean();
  return rows.map((r) => String(r._id));
}

// ---------------------------------------------------------------------------
// ข้อมูลส่วนตัว (customer) — query ด้วย userId จาก token เท่านั้น
// ---------------------------------------------------------------------------
const ORDER_FIELDS =
  "orderId orderStatus paymentStatus paymentMethod planDetails.planName grandTotal createdAt items.productName items.quantity trackingNumber shippingCarrier shippedAt";

function toOrderSummary(o) {
  return {
    orderId: o.orderId,
    status: o.orderStatus,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    plan: o.planDetails?.planName || null,
    total: o.grandTotal,
    date: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "",
    items: (o.items || []).map((i) => `${i.productName} x${i.quantity}`),
    // เลขพัสดุ (มีเมื่อจัดส่งแล้ว) — ลูกค้าถาม AI ได้ว่า "เลขพัสดุของฉันคืออะไร"
    ...(o.trackingNumber ? { trackingNumber: o.trackingNumber, carrier: o.shippingCarrier || "", shippedAt: o.shippedAt ? new Date(o.shippedAt).toISOString().slice(0, 10) : "" } : {}),
  };
}

/**
 * @param {string} userId จาก token เท่านั้น
 * @param {string} question ใช้หาเลขคำสั่งซื้อที่ผู้ใช้พิมพ์มา (เช่น ORD-1712345678901)
 */
export async function loadPersonalContext(userId, question = "") {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;

  // เลขคำสั่งซื้อที่ถามถึง — ค้นพร้อมเงื่อนไข userId เสมอ จึงดูของคนอื่นไม่ได้
  const askedOrderIds = [...new Set(String(question).toUpperCase().match(/ORD-\d{6,}/g) || [])].slice(0, 3);

  const [user, cart, orders, askedOrders, orderCount] = await Promise.all([
    User.findById(userId)
      .select("firstName lastName email birthDate gender bloodType element bodyElement restrictions points membership.tier addresses.label addresses.district addresses.province addresses.isDefault")
      .lean(),
    Cart.findOne({ userId }).select("items.productId items.name items.quantity items.price").lean(),
    Order.find({ userId }).sort({ createdAt: -1 }).limit(5).select(ORDER_FIELDS).lean(),
    askedOrderIds.length ? Order.find({ userId, orderId: { $in: askedOrderIds } }).select(ORDER_FIELDS).lean() : [],
    Order.countDocuments({ userId }),
  ]);
  if (!user) return null;

  const recent = orders.map(toOrderSummary);
  const recentIds = new Set(recent.map((o) => o.orderId));

  return {
    profile: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : "",
      gender: user.gender,
      bloodType: user.bloodType,
      points: user.points || 0,
      tier: user.membership?.tier || "BRONZE",
      // ที่อยู่ส่งให้ AI แค่เขต/จังหวัด — ดูเต็มที่หน้าโปรไฟล์
      addresses: (user.addresses || []).map((a) => ({ label: a.label, area: `${a.district} ${a.province}`, isDefault: a.isDefault })),
    },
    element: normalizeElement(user.element) || normalizeElement(user.bodyElement),
    restrictions: user.restrictions || [],
    restrictionLabels: (user.restrictions || []).map((r) => RESTRICTION_LABELS[r] || r),
    cart: (cart?.items || []).map((i) => ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
    orderCount,
    recentOrders: recent,
    askedOrders: askedOrders.filter((o) => !recentIds.has(o.orderId)).map(toOrderSummary),
    askedOrderIdsNotFound: askedOrderIds.filter((id) => !recentIds.has(id) && !askedOrders.some((o) => o.orderId === id)),
  };
}

/** ตะกร้าของผู้เยี่ยมชม (เก็บใน cookie ฝั่ง client) — รับเฉพาะ id แล้วดึงชื่อจาก DB เอง */
export async function loadGuestCart(productIds = []) {
  const ids = (Array.isArray(productIds) ? productIds : [])
    .map(String)
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .slice(0, 20);
  if (ids.length === 0) return [];
  const rows = await Product.find({ _id: { $in: ids }, isActive: true }).select("name nameTh").lean();
  return rows.map((p) => ({ productId: String(p._id), name: p.nameTh || p.name }));
}

// ---------------------------------------------------------------------------
// ข้อมูลแอดมิน — สรุปภาพรวม ไม่มีข้อมูลส่วนตัวของลูกค้ารายบุคคล
// ---------------------------------------------------------------------------
export async function loadAdminInsights() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [lowStock, statusCounts, sales30d, topProducts, productCounts, activeProducts] = await Promise.all([
    Ingredient.find({
      isActive: { $ne: false },
      $expr: { $lte: ["$currentStockGrams", "$lowStockThresholdGrams"] },
    })
      .select("nameTh currentStockGrams lowStockThresholdGrams unit regionalStocks")
      .limit(20)
      .lean(),
    Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, paymentStatus: "PAID" } },
      { $group: { _id: null, revenue: { $sum: "$grandTotal" }, orders: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, orderStatus: { $ne: "CANCELLED" } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.productName", quantity: { $sum: "$items.quantity" } } },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]),
    Product.aggregate([{ $group: { _id: "$isActive", count: { $sum: 1 } } }]),
    Product.find({ isActive: true }).select("name nameTh region recipe").lean(),
  ]);

  const soldOut = (await withAvailability(activeProducts))
    .filter((p) => p.availability?.inStock === false || p.availability?.availableKits === 0)
    .map((p) => ({ name: p.nameTh || p.name, missing: p.availability?.missing || [] }));

  return {
    lowStockIngredients: lowStock.map((i) => ({
      name: i.nameTh,
      stock: i.currentStockGrams,
      threshold: i.lowStockThresholdGrams,
      unit: i.unit,
      byRegion: i.regionalStocks,
    })),
    soldOutProducts: soldOut.slice(0, 20),
    orderStatusCounts: Object.fromEntries(statusCounts.map((s) => [s._id || "UNKNOWN", s.count])),
    last30Days: { paidRevenue: sales30d[0]?.revenue || 0, paidOrders: sales30d[0]?.orders || 0 },
    topProductsLast30Days: topProducts.map((t) => ({ name: t._id, quantity: t.quantity })),
    productCounts: {
      active: productCounts.find((c) => c._id !== false)?.count || 0,
      inactive: productCounts.find((c) => c._id === false)?.count || 0,
    },
  };
}
