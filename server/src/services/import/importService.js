// จัดการรอบนำเข้า (session) — preview → commit (พร้อม progress + rollback)
import crypto from "crypto";
import mongoose from "mongoose";
import { Ingredient } from "../../models/Ingredient.model.js";
import { Product } from "../../models/Product.model.js";
import { readZip, createZip } from "../../utils/zip.js";
import { toCsv } from "../../utils/csv.js";
import { getGridFSBucket } from "../../utils/gridfs.js";
import { logAudit, diffFields } from "../../utils/audit.js";
import { previewIngredients, INGREDIENT_COLUMNS } from "./ingredientImport.js";
import { previewProducts, PRODUCT_COLUMNS, RECIPE_COLUMNS } from "./productImport.js";

const SESSION_TTL_MS = 30 * 60 * 1000;
const sessions = new Map();

// ล้าง session หมดอายุทุก 5 นาที
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) if (now - s.createdAt > SESSION_TTL_MS && s.status.state !== "running") sessions.delete(id);
}, 5 * 60 * 1000).unref?.();

export const IMPORT_TYPES = ["ingredients", "products"];

/** อัปโหลด zip → ตรวจทุกแถว → เก็บผลใน session (ยังไม่เขียน DB) */
export async function createPreview(type, zipBuffer, actor) {
  let files;
  try {
    files = readZip(zipBuffer);
  } catch (err) {
    return { error: `อ่านไฟล์ zip ไม่ได้: ${err.message}` };
  }
  // กัน path แปลก (zip-slip) — ใช้แค่ชื่อไฟล์ ไม่เขียนลงดิสก์อยู่แล้ว แต่ตัดทิ้งให้ชัด
  for (const name of Object.keys(files)) {
    if (name.includes("..") || name.startsWith("/")) delete files[name];
  }

  const result = type === "ingredients" ? { ...(await previewIngredients(files)), images: new Map() } : await previewProducts(files);

  // จำกัดจำนวน session ค้างต่อแอดมิน
  const mine = [...sessions.values()].filter((s) => s.actor?.id === actor?.id).sort((a, b) => a.createdAt - b.createdAt);
  while (mine.length >= 3) sessions.delete(mine.shift().id);

  const id = crypto.randomUUID();
  const session = {
    id,
    type,
    actor,
    createdAt: Date.now(),
    rows: result.rows,
    images: result.images,
    fileErrors: result.fileErrors,
    fileWarnings: result.fileWarnings,
    status: { state: result.fileErrors.length ? "invalid" : "ready", done: 0, total: 0, result: null, error: null },
  };
  sessions.set(id, session);
  return { session: toPreviewResponse(session) };
}

function summarize(rows) {
  return {
    total: rows.length,
    ok: rows.filter((r) => r.status === "ok").length,
    warning: rows.filter((r) => r.status === "warning").length,
    error: rows.filter((r) => r.status === "error").length,
    duplicate: rows.filter((r) => r.similar.length > 0).length,
  };
}

export function toPreviewResponse(s) {
  return {
    importId: s.id,
    type: s.type,
    expiresAt: new Date(s.createdAt + SESSION_TTL_MS).toISOString(),
    fileErrors: s.fileErrors,
    fileWarnings: s.fileWarnings,
    summary: summarize(s.rows),
    rows: s.rows.map((r) => ({
      index: r.index,
      line: r.line,
      code: r.code,
      name: r.name,
      status: r.status,
      errors: r.errors,
      warnings: r.warnings,
      similar: r.similar,
      defaultAction: r.defaultAction,
      defaultTargetId: r.defaultTargetId,
      images: r.images || [],
      display: r.display,
    })),
  };
}

export function getSession(id, actor) {
  const s = sessions.get(id);
  if (!s) return null;
  if (actor && s.actor?.id !== actor.id) return null; // ดูได้เฉพาะแอดมินที่อัปโหลด
  return s;
}

export function deleteSession(id, actor) {
  const s = getSession(id, actor);
  if (!s || s.status.state === "running") return false;
  sessions.delete(id);
  return true;
}

export function statusOf(s) {
  return { importId: s.id, ...s.status };
}

// ---------------------------------------------------------------------------
// Commit
// ---------------------------------------------------------------------------
async function uploadImage(img) {
  const bucket = getGridFSBucket();
  const stream = bucket.openUploadStream(`${Date.now()}-${img.name.replace(/\s+/g, "_")}`, {
    contentType: img.contentType,
    metadata: { originalName: img.name, uploadedAt: new Date(), source: "zip-import" },
  });
  await new Promise((resolve, reject) => {
    stream.once("finish", resolve);
    stream.once("error", reject);
    stream.end(img.buffer);
  });
  return stream.id;
}

/**
 * นำเข้าแถวที่เลือก (ทำงานเบื้องหลัง — ดูความคืบหน้าที่ statusOf)
 * @param {object} s session
 * @param {Record<number, { action: "create"|"update"|"skip", targetId?: string }>} choices
 */
export function startCommit(s, choices = {}) {
  if (s.status.state === "running") return { error: "กำลังนำเข้าอยู่" };
  if (s.status.state === "done") return { error: "นำเข้ารอบนี้เสร็จไปแล้ว" };
  if (s.status.state === "invalid") return { error: "ไฟล์มีข้อผิดพลาด แก้ไขแล้วอัปโหลดใหม่" };

  const plan = [];
  const skipped = [];
  for (const row of s.rows) {
    const choice = choices[row.index] || { action: row.defaultAction, targetId: row.defaultTargetId };
    if (row.status === "error") {
      skipped.push({ line: row.line, name: row.name, reason: "ข้อมูลไม่ถูกต้อง" });
      continue;
    }
    if (choice.action === "skip") {
      skipped.push({ line: row.line, name: row.name, reason: "เลือกข้าม" });
      continue;
    }
    if (choice.action === "update") {
      const target = row.similar.find((m) => m.id === choice.targetId);
      if (!target) {
        skipped.push({ line: row.line, name: row.name, reason: "ไม่ได้เลือกรายการที่จะอัปเดต" });
        continue;
      }
      plan.push({ row, action: "update", targetId: target.id });
    } else plan.push({ row, action: "create" });
  }

  s.status = { state: "running", done: 0, total: plan.length, result: null, error: null };
  runCommit(s, plan, skipped).catch((err) => {
    console.error("Import commit failed:", err);
  });
  return { ok: true };
}

async function runCommit(s, plan, skipped) {
  const Model = s.type === "ingredients" ? Ingredient : Product;
  const entity = s.type === "ingredients" ? "ingredient" : "product";
  const created = [];
  const updated = []; // { id, before }
  const uploadedFiles = [];
  const audits = [];

  try {
    for (const { row, action, targetId } of plan) {
      const data = { ...row.data };

      if (s.type === "products") {
        const ids = [];
        for (const name of row.images) {
          const img = s.images.get(name.toLowerCase());
          if (!img) throw new Error(`ไม่พบรูป ${name}`);
          const id = await uploadImage(img);
          uploadedFiles.push(id);
          ids.push(id);
        }
        data.imageId = ids[0];
        data.imageUrl = `/api/v2/images/${ids[0]}`;
        data.images = ids.map((id) => `/api/v2/images/${id}`);
      }

      if (action === "create") {
        const doc = await new Model({ ...data, createdBy: s.actor, updatedBy: s.actor }).save();
        created.push(doc._id);
        audits.push({ action: "create", doc });
      } else {
        const before = await Model.findById(targetId).lean();
        if (!before) throw new Error(`ไม่พบรายการที่จะอัปเดต (${row.name})`);
        updated.push({ id: before._id, before });
        const doc = await Model.findByIdAndUpdate(targetId, { ...data, updatedBy: s.actor }, { new: true, runValidators: true });
        audits.push({ action: "update", doc, changes: diffFields(before, doc, Object.keys(data)) });
      }
      s.status.done += 1;
    }
  } catch (err) {
    // ย้อนกลับทั้งหมดของรอบนี้
    await Model.deleteMany({ _id: { $in: created } }).catch(() => {});
    for (const u of updated) await Model.replaceOne({ _id: u.id }, u.before).catch(() => {});
    if (uploadedFiles.length) {
      const bucket = getGridFSBucket();
      for (const id of uploadedFiles) await bucket.delete(new mongoose.Types.ObjectId(id)).catch(() => {});
    }
    s.status = {
      ...s.status,
      state: "failed",
      error: `นำเข้าไม่สำเร็จ ย้อนกลับข้อมูลรอบนี้ทั้งหมดแล้ว: ${err.message}`,
    };
    return;
  }

  // บันทึกประวัติหลังนำเข้าสำเร็จทั้งรอบ (logAudit จะสั่งอัปเดตข้อมูล AI ให้ด้วย)
  for (const a of audits) await logAudit({ action: a.action, entity, doc: a.doc, actor: s.actor, changes: a.changes || [] });

  s.status = {
    ...s.status,
    state: "done",
    result: {
      created: created.length,
      updated: updated.length,
      skipped: skipped.length,
      skippedRows: skipped,
    },
  };
  s.images = new Map(); // คืนหน่วยความจำ
}

// ---------------------------------------------------------------------------
// ไฟล์ตัวอย่าง
// ---------------------------------------------------------------------------
// PNG 1×1 สีน้ำตาล (ตัวอย่างรูป — แทนด้วยรูปจริงของเมนู)
const SAMPLE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNg2O8RDwADYgFhZEdcfQAAAABJRU5ErkJggg==",
  "base64",
);

const README_INGREDIENTS = `วิธีเตรียมไฟล์นำเข้าวัตถุดิบ
============================
1. แก้ไข ingredients.csv ด้วย Excel หรือ Google Sheets (1 แถว = 1 วัตถุดิบ)
2. บันทึกเป็น CSV UTF-8 (Excel: บันทึกเป็น > CSV UTF-8 (Comma delimited))
3. บีบอัดไฟล์ ingredients.csv เป็น .zip แล้วอัปโหลดในหน้าคลังวัตถุดิบ

คอลัมน์ (* = บังคับ)
${INGREDIENT_COLUMNS.map((c) => `- ${c.key}${c.required ? " *" : ""}: ${c.note}`).join("\n")}

ระบบคำนวณให้เอง: ธาตุ (จากรสยา), ยอดสต็อกรวม, ภูมิภาค
`;

const README_PRODUCTS = `วิธีเตรียมไฟล์นำเข้าเมนู
========================
โครงสร้าง zip:
  products.csv   (1 แถว = 1 เมนู)
  recipes.csv    (1 แถว = วัตถุดิบ 1 รายการในสูตร ผูกกับเมนูด้วย code)
  images/        (รูปเมนู .jpg .png .webp ไม่เกิน 5MB ต่อรูป)

- วัตถุดิบใน recipes.csv ต้องมีอยู่ในคลังแล้ว (นำเข้าวัตถุดิบก่อนถ้ายังไม่มี)
- เมนูใช้สต็อกวัตถุดิบของภาคตัวเอง (ไทยฟิวชั่น/ขนมหวาน ใช้ภาคกลาง)
- บันทึก CSV เป็น UTF-8 แล้วบีบอัดทั้ง 2 ไฟล์ + โฟลเดอร์ images เป็น .zip

products.csv (* = บังคับ)
${PRODUCT_COLUMNS.map((c) => `- ${c.key}${c.required ? " *" : ""}: ${c.note}`).join("\n")}

recipes.csv (* = บังคับ)
${RECIPE_COLUMNS.map((c) => `- ${c.key}${c.required ? " *" : ""}: ${c.note}`).join("\n")}

ระบบคำนวณให้เอง: ธาตุเด่น/ธาตุที่เหมาะ, แคลอรี, จำนวนชุดที่ทำได้จากสต็อก, แท็กธาตุ/ภาค/ข้อจำกัดอาหาร
`;

export function buildTemplate(type) {
  if (type === "ingredients") {
    const header = INGREDIENT_COLUMNS.map((c) => c.key);
    const rows = [
      header,
      INGREDIENT_COLUMNS.map((c) => c.example),
      ["ตะไคร้", "Lemongrass", "herb_spice", "เผ็ดร้อน/หอมเย็น", "", "g", "", "99", "25", "0", "0", "1.8", "0.5", "6", "0", "0", "50000", "0", ""],
    ];
    return createZip([
      { name: "ingredients.csv", data: toCsv(rows) },
      { name: "README.txt", data: README_INGREDIENTS },
    ]);
  }
  const products = [PRODUCT_COLUMNS.map((c) => c.key), PRODUCT_COLUMNS.map((c) => c.example)];
  const recipes = [
    RECIPE_COLUMNS.map((c) => c.key),
    ["LAAB01", "หมู", "300", "g"],
    ["LAAB01", "มะแขว่น", "5", "g"],
    ["LAAB01", "ต้นหอม", "20", "g"],
  ];
  return createZip([
    { name: "products.csv", data: toCsv(products) },
    { name: "recipes.csv", data: toCsv(recipes) },
    { name: "images/laab-moo.png", data: SAMPLE_PNG },
    { name: "README.txt", data: README_PRODUCTS },
  ]);
}

export function columnsOf(type) {
  return type === "ingredients"
    ? { "ingredients.csv": INGREDIENT_COLUMNS }
    : { "products.csv": PRODUCT_COLUMNS, "recipes.csv": RECIPE_COLUMNS };
}
