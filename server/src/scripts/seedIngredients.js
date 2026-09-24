// Seed วัตถุดิบทั้งหมดจาก data-source/nutrients.xlsx → MongoDB (collection "ingredients")
//
// ใช้:
//   npm run seed:ingredients                 # dry-run: แสดงสรุป ไม่แตะฐานข้อมูล
//   npm run seed:ingredients -- --yes        # สำรองวัตถุดิบเดิม → ลบ → seed ใหม่ → ผูกสูตรเมนูเดิมใหม่
//   npm run seed:ingredients -- --file=path/to/nutrients.xlsx
//
// หลักการ
// - อาหารภาคไหนใช้วัตถุดิบภาคนั้น: สต็อกใส่เฉพาะภาคที่วัตถุดิบอยู่ในชีตของภาคนั้น (ภาคอื่น = 0)
// - ธาตุคำนวณจากรสยาด้วยสูตรเดียวกับฟอร์มแอดมิน (ถ้าเสมอกัน ใช้คอลัมน์ "ธาตุของคนที่ควรกิน" ตัดสิน)
// - ไม่ใส่ราคาวัตถุดิบ (ราคากำหนดที่เมนูอาหาร)
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { readXlsx } from "../utils/xlsxReader.js";
import {
  INGREDIENT_SPEC,
  SHEET_CATEGORY_FALLBACK,
  SHEET_TO_REGION,
  STOCK_PER_REGION,
  RECIPE_NAME_ALIASES,
} from "../data/ingredientSeedSpec.js";
import { SYSTEM_ACTOR } from "../utils/audit.js";

if (typeof process.loadEnvFile === "function" && fs.existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch (_) {}
}

const { Ingredient } = await import("../models/Ingredient.model.js");
const { Product } = await import("../models/Product.model.js");

const args = process.argv.slice(2);
const APPLY = args.includes("--yes");
const FILE = args.find((a) => a.startsWith("--file="))?.slice(7) || path.resolve("..", "data-source", "nutrients.xlsx");

// ชื่อหมวดภาษาไทย (ตรงกับ CATEGORY_MAP ใน client/src/context/IngredientsContext.js)
const CATEGORY_TH = {
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

// ---------------------------------------------------------------------------
// รสยา → ธาตุ (ต้องตรงกับ analyzeMedicinalTastes ใน client/src/utils/recipeCalculator.js)
// ---------------------------------------------------------------------------
const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ"];
const TASTE_KEYWORDS = [
  ["เผ็ดร้อน", "ลม"],
  ["หอมเย็น", "ลม"],
  ["เมาเบื่อ", "น้ำ"],
  ["เปรี้ยว", "น้ำ"],
  ["สุขุม", "ลม"],
  ["หวาน", "ดิน"],
  ["ฝาด", "ดิน"],
  ["เค็ม", "ดิน"],
  ["เผ็ด", "ลม"],
  ["มัน", "ดิน"],
  ["ขม", "น้ำ"],
  ["จืด", "ไฟ"],
  ["เย็น", "ไฟ"],
];
// รสมาตรฐาน 10 รส (ตัวเลือกในฟอร์มแอดมิน) — เรียงคำยาวก่อน
const CANONICAL_TASTES = ["เผ็ดร้อน", "หอมเย็น", "เมาเบื่อ", "เปรี้ยว", "หวาน", "ฝาด", "เค็ม", "มัน", "ขม", "จืด"];

/** "รสมัน/ รสเค็ม / หวาน" → ["รสมัน","รสเค็ม","รสหวาน"] */
function normalizeTastes(raw) {
  const text = String(raw || "").replace(/\(.*?\)/g, "");
  const out = [];
  for (let token of text.split(/[/,\s]+/)) {
    token = token.replace(/^รส/, "").trim();
    if (!token) continue;
    let found = false;
    for (const t of CANONICAL_TASTES) {
      if (token.includes(t)) {
        out.push(`รส${t}`);
        token = token.replace(t, "");
        found = true;
      }
    }
    if (!found && token.includes("เผ็ด")) out.push("รสเผ็ดร้อน");
  }
  return [...new Set(out)];
}

function analyzeTastes(tastes) {
  const counts = Object.fromEntries(ELEMENTS.map((e) => [e, 0]));
  for (const t of tastes) {
    const el = TASTE_KEYWORDS.find(([k]) => t.replace(/^รส/, "").includes(k))?.[1];
    if (el) counts[el] += 1;
  }
  const max = Math.max(...Object.values(counts));
  if (max === 0) return { status: "unknown", element: null, tied: [] };
  const top = ELEMENTS.filter((e) => counts[e] === max);
  return top.length > 1 ? { status: "conflict", element: null, tied: top } : { status: "ok", element: top[0], tied: [] };
}

/** ธาตุในคอลัมน์ "ธาตุของคนที่ควรกิน" ตามลำดับที่เขียน เช่น "ธาตุลม, ธาตุไฟ (ต้องสุก)" → ["ลม","ไฟ"] */
function sheetElements(raw) {
  const text = String(raw || "");
  if (text.includes("ทุกธาตุ")) return [...ELEMENTS];
  return [...text.matchAll(/ธาตุ\s*(ดิน|น้ำ|ลม|ไฟ)/g)].map((m) => m[1]);
}

// ---------------------------------------------------------------------------
// อ่านชีต
// ---------------------------------------------------------------------------
const baseName = (name) => name.split(/\s*[(/]/)[0].trim();
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

function readRows(file) {
  const sheets = readXlsx(file);
  const rows = [];
  for (const [sheet, data] of Object.entries(sheets)) {
    const region = SHEET_TO_REGION[sheet];
    if (!region) {
      console.warn(`⚠️ ข้ามชีต "${sheet}" (ไม่รู้ว่าเป็นภาคไหน — เพิ่มใน SHEET_TO_REGION)`);
      continue;
    }
    const header = data.findIndex((r) => String(r[1] || "").includes("วัตถุดิบ") && String(r[2] || "").includes("kcal"));
    if (header < 0) {
      console.warn(`⚠️ ข้ามชีต "${sheet}" (ไม่พบหัวตาราง)`);
      continue;
    }
    let category = null;
    for (const r of data.slice(header + 1)) {
      if (r[0]) category = String(r[0]).trim();
      if (!r[1]) continue;
      rows.push({
        sheet,
        region,
        sheetCategory: category,
        name: String(r[1]).replace(/\s+/g, " ").trim(),
        // ใส่ทั้ง carb และ carbs — hook ของ model อ่าน carb ก่อน (default 0) ถ้าไม่ใส่จะทับ carbs เป็น 0
        nutrients: {
          calories: num(r[2]),
          carb: num(r[3]),
          carbs: num(r[3]),
          sugar: num(r[4]),
          fiber: num(r[5]),
          protein: num(r[6]),
          fat: num(r[7]),
          sodium: num(r[8]),
        },
        taste: r[9],
        elementsText: r[10],
      });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// รวมชื่อซ้ำ + สร้างเอกสาร Ingredient
// ---------------------------------------------------------------------------
function buildDocs(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = baseName(row.name);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const docs = [];
  const report = { conflicts: [], missingSpec: [], merged: [] };

  for (const [key, group] of groups) {
    const variants = [...new Set(group.map((r) => r.name))];
    const nameTh = variants.length > 1 ? key : variants[0];
    if (variants.length > 1) report.merged.push({ nameTh, variants });

    const first = group[0];
    const spec = INGREDIENT_SPEC[nameTh];
    if (!spec) report.missingSpec.push(nameTh);

    const category = spec?.cat || SHEET_CATEGORY_FALLBACK[first.sheetCategory] || "other";
    const unit = spec?.unit || "g";

    // รสยา: รวมจากทุกแถวของวัตถุดิบนี้ (ตามลำดับที่พบ)
    const tastes = [...new Set(group.flatMap((r) => normalizeTastes(r.taste)))];
    const analysis = analyzeTastes(tastes);
    let element = analysis.element;
    if (analysis.status === "conflict") {
      const hint = sheetElements(first.elementsText).find((e) => analysis.tied.includes(e));
      element = hint || analysis.tied[0];
      report.conflicts.push({ nameTh, tastes: tastes.join("/"), tied: analysis.tied, chosen: element, sheet: first.elementsText });
    }
    if (!element) element = sheetElements(first.elementsText)[0] || "ดิน";

    // สต็อกเฉพาะภาคที่วัตถุดิบอยู่ในชีตของภาคนั้น
    const perRegion = unit === "piece" ? STOCK_PER_REGION.piece : spec?.tier === "spice" ? STOCK_PER_REGION.spice : STOCK_PER_REGION.default;
    const regions = [...new Set(group.map((r) => r.region))];
    const regionalStocks = { north: 0, northeast: 0, central: 0, south: 0 };
    for (const reg of regions) regionalStocks[reg] = perRegion;
    const total = perRegion * regions.length;

    docs.push({
      nameTh,
      nameEn: spec?.en || nameTh,
      category,
      categoryTh: CATEGORY_TH[category],
      medicinalTaste: tastes.join("/") || "รสจืด",
      elements: [element],
      basisWeightG: 100,
      ...(unit === "piece" && spec?.gpp ? { gramsPerPiece: spec.gpp } : {}),
      nutrientsPer100g: first.nutrients,
      nutritionPer100G: first.nutrients,
      unit,
      regionalStocks,
      currentStockGrams: total,
      stockQuantity: total,
      lowStockThresholdGrams: Math.round(total * 0.1),
      isActive: true,
      // meta สำหรับรายงาน (ไม่บันทึก)
      _sheets: [...new Set(group.map((r) => r.sheet))],
      _variants: variants,
    });
  }
  return { docs, report };
}

// ---------------------------------------------------------------------------
// ผูกสูตรเมนูเดิมกับวัตถุดิบใหม่ (ตามชื่อ)
// ---------------------------------------------------------------------------
function makeMatcher(ingredients) {
  const byName = new Map(ingredients.map((i) => [i.nameTh, i]));
  const byVariant = new Map();
  for (const i of ingredients) for (const v of i._variants || []) byVariant.set(v, i);
  return (recipeName) => {
    const name = String(recipeName || "").trim();
    if (!name) return null;
    const alias = RECIPE_NAME_ALIASES[name];
    return (
      byName.get(name) ||
      byVariant.get(name) ||
      (alias && byName.get(alias)) ||
      byName.get(baseName(name)) ||
      ingredients.find((i) => i.nameTh.startsWith(name)) ||
      null
    );
  };
}

async function relinkProducts(ingredients) {
  const match = makeMatcher(ingredients);
  const products = await Product.find().select("nameTh name recipe").lean();
  const result = [];
  for (const p of products) {
    const missing = [];
    const recipe = (p.recipe || []).map((r) => {
      const ing = match(r.nameTh);
      if (!ing) {
        missing.push(r.nameTh);
        return r;
      }
      return {
        ...r,
        ingredient: ing._id,
        ingredientId: String(ing._id),
        medicinalTaste: ing.medicinalTaste,
        category: ing.category,
        categoryTh: ing.categoryTh,
        elements: ing.elements,
        gramsPerPiece: ing.gramsPerPiece,
        nutrientsPer100g: ing.nutrientsPer100g,
      };
    });
    if (APPLY) await Product.updateOne({ _id: p._id }, { $set: { recipe } });
    result.push({ product: p.nameTh || p.name, linked: recipe.length - missing.length, total: recipe.length, missing });
  }
  return result;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  if (!fs.existsSync(FILE)) throw new Error(`ไม่พบไฟล์ ${FILE}`);
  console.log(`📄 อ่าน ${FILE}`);
  const rows = readRows(FILE);
  const { docs, report } = buildDocs(rows);

  // ---------- สรุป ----------
  const count = (fn) => docs.reduce((acc, d) => ((acc[fn(d)] = (acc[fn(d)] || 0) + 1), acc), {});
  const regionCount = { north: 0, northeast: 0, central: 0, south: 0 };
  for (const d of docs) for (const [k, v] of Object.entries(d.regionalStocks)) if (v > 0) regionCount[k] += 1;

  console.log(`\n📊 ${rows.length} แถวในชีต → ${docs.length} วัตถุดิบ (รวมชื่อซ้ำ ${report.merged.length} กลุ่ม)`);
  console.log("   หมวด:", count((d) => d.category));
  console.log("   หน่วย:", count((d) => d.unit));
  console.log("   ธาตุ:", count((d) => d.elements[0]));
  console.log("   จำนวนวัตถุดิบที่มีสต็อกในแต่ละภาค:", regionCount);
  if (report.merged.length) {
    console.log("\n🔗 รวมชื่อซ้ำ:");
    for (const m of report.merged) console.log(`   ${m.nameTh}  ←  ${m.variants.join(" | ")}`);
  }
  if (report.conflicts.length) {
    console.log(`\n⚖️  รสยาให้ธาตุเสมอกัน ${report.conflicts.length} ตัว (ตัดสินด้วยคอลัมน์ธาตุในชีต):`);
    for (const c of report.conflicts) console.log(`   ${c.nameTh}: ${c.tastes} → เสมอ ${c.tied.join("/")} → ใช้ธาตุ${c.chosen}  (ชีต: ${c.sheet})`);
  }
  if (report.missingSpec.length) {
    console.log(`\n⚠️  ไม่มีใน INGREDIENT_SPEC ${report.missingSpec.length} ตัว (ใช้ชื่อไทยเป็นชื่ออังกฤษ / หมวดจากชีต):`);
    console.log("   " + report.missingSpec.join(", "));
  }

  // ตรวจทุกเอกสารกับ schema ก่อน — ถ้าไม่ผ่านจะหยุดโดยไม่ลบข้อมูลเดิม
  const invalid = [];
  for (const { _sheets, _variants, ...d } of docs) {
    try {
      await new Ingredient(d).validate();
    } catch (err) {
      invalid.push(`${d.nameTh}: ${err.message}`);
    }
  }
  if (invalid.length) {
    throw new Error(`ข้อมูล ${invalid.length} รายการไม่ผ่าน schema (ยังไม่ได้แก้ไขฐานข้อมูล):\n   ${invalid.join("\n   ")}`);
  }
  console.log(`\n✔️  ตรวจ schema ผ่านครบ ${docs.length} รายการ`);

  await connectDB();
  const existing = await Ingredient.find().lean();
  console.log(`\n🗄️  วัตถุดิบเดิมใน DB: ${existing.length} รายการ`);

  if (!APPLY) {
    // ทดลองผูกสูตรกับข้อมูลใหม่ (ยังไม่บันทึก) — ใช้ id ชั่วคราว
    const preview = docs.map((d) => ({ ...d, _id: new mongoose.Types.ObjectId() }));
    const links = await relinkProducts(preview);
    console.log("\n🍲 ผลการผูกสูตรเมนูเดิม (จำลอง):");
    for (const l of links) console.log(`   ${l.product}: ผูกได้ ${l.linked}/${l.total}${l.missing.length ? ` — ไม่พบ: ${l.missing.join(", ")}` : ""}`);
    console.log("\n🧪 DRY-RUN — ยังไม่ได้แก้ไขฐานข้อมูล  รันจริง: npm run seed:ingredients -- --yes");
    return;
  }

  // ---------- รันจริง ----------
  const backupDir = path.resolve("backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `ingredients-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(existing, null, 2));
  console.log(`💾 สำรองวัตถุดิบเดิมไว้ที่ ${backupFile}`);

  await Ingredient.deleteMany({});
  // ใช้ create (ผ่าน pre-validate hook ของ model: sync สต็อกรวม/ภูมิภาค/สารอาหาร)
  const seedActor = SYSTEM_ACTOR("seedIngredients script");
  const inserted = await Ingredient.create(
    docs.map(({ _sheets, _variants, ...d }) => ({ ...d, createdBy: seedActor, updatedBy: seedActor })),
  );
  console.log(`✅ Seed วัตถุดิบ ${inserted.length} รายการ`);

  const insertedWithVariants = inserted.map((doc) => {
    const obj = doc.toObject();
    obj._variants = docs.find((d) => d.nameTh === obj.nameTh)?._variants || [];
    return obj;
  });
  const links = await relinkProducts(insertedWithVariants);
  console.log("\n🍲 ผูกสูตรเมนูเดิมกับวัตถุดิบใหม่:");
  for (const l of links) console.log(`   ${l.product}: ผูกได้ ${l.linked}/${l.total}${l.missing.length ? ` — ไม่พบ: ${l.missing.join(", ")} (แก้ในหน้าแอดมิน)` : ""}`);
  console.log("\n🎉 เสร็จแล้ว — AI Advisor จะซิงก์ข้อมูลวัตถุดิบใหม่เองในรอบถัดไป");
}

try {
  await main();
} catch (err) {
  console.error("❌ Seed วัตถุดิบล้มเหลว:", err.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
