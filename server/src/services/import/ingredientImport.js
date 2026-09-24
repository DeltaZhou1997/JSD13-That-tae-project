// ตรวจ + เตรียมข้อมูลวัตถุดิบจาก ingredients.csv (ยังไม่บันทึก)
import { Ingredient } from "../../models/Ingredient.model.js";
import { csvToRecords } from "../../utils/csv.js";
import { findSimilarNames, normalizeName } from "../../utils/nameSimilarity.js";
import { normalizeTastes, analyzeTastes, parseElements } from "../../utils/medicinalTaste.js";
import { CATEGORY_TH, resolveCategory, resolveUnit, toNumber } from "./importMaps.js";

export const INGREDIENT_COLUMNS = [
  { key: "nameTh", required: true, example: "กระเทียมไทย", note: "ชื่อภาษาไทย" },
  { key: "nameEn", required: false, example: "Thai garlic", note: "ไม่ใส่ = ใช้ชื่อไทย" },
  { key: "category", required: true, example: "vegetable", note: "รหัสหรือชื่อไทย เช่น ผัก & พืชสมุนไพร / herb_spice / เครื่องปรุงรส" },
  { key: "medicinalTaste", required: true, example: "เผ็ดร้อน/ขม", note: "คั่นด้วย / — ระบบคำนวณธาตุให้เอง" },
  { key: "element", required: false, example: "", note: "ใช้เฉพาะเมื่อรสยาให้ธาตุเสมอกัน (ดิน/น้ำ/ลม/ไฟ)" },
  { key: "unit", required: false, example: "g", note: "g / kg / ml / l / piece (ไม่ใส่ = g)" },
  { key: "gramsPerPiece", required: false, example: "", note: "จำเป็นเมื่อ unit = piece" },
  { key: "calories", required: false, example: "149", note: "ต่อ 100 g" },
  { key: "carbs", required: false, example: "33", note: "g ต่อ 100 g" },
  { key: "sugar", required: false, example: "1", note: "g ต่อ 100 g" },
  { key: "fiber", required: false, example: "2.1", note: "g ต่อ 100 g" },
  { key: "protein", required: false, example: "6.4", note: "g ต่อ 100 g" },
  { key: "fat", required: false, example: "0.5", note: "g ต่อ 100 g" },
  { key: "sodium", required: false, example: "17", note: "mg ต่อ 100 g" },
  { key: "stock_north", required: false, example: "50000", note: "สต็อกภาคเหนือ (หน่วยตาม unit)" },
  { key: "stock_northeast", required: false, example: "50000", note: "สต็อกภาคอีสาน" },
  { key: "stock_central", required: false, example: "0", note: "สต็อกภาคกลาง (ไทยฟิวชั่น/ขนมหวานใช้ภาคนี้)" },
  { key: "stock_south", required: false, example: "0", note: "สต็อกภาคใต้" },
  { key: "lowStockThreshold", required: false, example: "", note: "ไม่ใส่ = 10% ของสต็อกรวม" },
];

const NUTRIENTS = ["calories", "carbs", "sugar", "fiber", "protein", "fat", "sodium"];
const REGIONS = ["north", "northeast", "central", "south"];

/**
 * @param {Record<string, Buffer>} files ไฟล์ใน zip
 * @returns {Promise<{ rows, fileErrors, fileWarnings }>}
 */
export async function previewIngredients(files) {
  const csvName = Object.keys(files).find((n) => /(^|\/)ingredients\.csv$/i.test(n));
  if (!csvName) return { rows: [], fileErrors: ["ไม่พบไฟล์ ingredients.csv ใน zip"], fileWarnings: [] };

  const { headers, records } = csvToRecords(files[csvName].toString("utf8"));
  const fileErrors = [];
  const fileWarnings = [];
  for (const col of INGREDIENT_COLUMNS.filter((c) => c.required)) {
    if (!headers.includes(col.key.toLowerCase())) fileErrors.push(`ingredients.csv ไม่มีคอลัมน์ "${col.key}"`);
  }
  if (fileErrors.length) return { rows: [], fileErrors, fileWarnings };
  if (records.length === 0) return { rows: [], fileErrors: ["ingredients.csv ไม่มีข้อมูล"], fileWarnings };
  if (records.length > 500) return { rows: [], fileErrors: [`นำเข้าได้ครั้งละไม่เกิน 500 แถว (มี ${records.length} แถว)`], fileWarnings };

  const existing = (await Ingredient.find().select("nameTh nameEn isActive").lean()).map((i) => ({
    id: String(i._id),
    name: i.nameTh,
    nameEn: i.nameEn,
    inactive: i.isActive === false,
  }));
  const seenInFile = new Map(); // ชื่อ (normalize) → แถวแรก

  const rows = [];
  for (const [index, { line, data: r }] of records.entries()) {
    const errors = [];
    const warnings = [];
    const nameTh = r.nameth || "";
    if (!nameTh) errors.push("ไม่มีชื่อวัตถุดิบ (nameTh)");

    const category = resolveCategory(r.category);
    if (!category) errors.push(`หมวดหมู่ "${r.category}" ไม่ถูกต้อง`);

    const unit = resolveUnit(r.unit);
    if (!unit) errors.push(`หน่วย "${r.unit}" ไม่ถูกต้อง (ใช้ g / kg / ml / l / piece)`);
    const gramsPerPiece = toNumber(r.gramsperpiece);
    if (unit === "piece" && !(gramsPerPiece > 0)) errors.push("หน่วย piece ต้องระบุ gramsPerPiece (กรัมต่อชิ้น)");

    // รสยา → ธาตุ (สูตรเดียวกับฟอร์มแอดมิน)
    const tastes = normalizeTastes(r.medicinaltaste);
    if (tastes.length === 0) errors.push(`รสยา "${r.medicinaltaste}" ไม่ตรงกับรสยาใดเลย`);
    const analysis = analyzeTastes(tastes);
    let element = analysis.element;
    if (analysis.status === "conflict") {
      const hint = parseElements(r.element).find((e) => analysis.tied.includes(e));
      element = hint || analysis.tied[0];
      warnings.push(
        hint
          ? `รสยาให้ธาตุ${analysis.tied.join("/")}เท่ากัน — ใช้ธาตุ${element}ตามคอลัมน์ element`
          : `รสยาให้ธาตุ${analysis.tied.join("/")}เท่ากัน — เลือกธาตุ${element}ให้ (ระบุคอลัมน์ element เพื่อกำหนดเอง)`,
      );
    }

    const nutrients = {};
    for (const k of NUTRIENTS) {
      const v = toNumber(r[k]);
      if (Number.isNaN(v) || v < 0) errors.push(`${k} ต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป`);
      nutrients[k] = v > 0 ? v : 0;
    }
    nutrients.carb = nutrients.carbs;

    const regionalStocks = {};
    for (const reg of REGIONS) {
      const v = toNumber(r[`stock_${reg}`]);
      if (Number.isNaN(v) || v < 0) errors.push(`stock_${reg} ต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป`);
      regionalStocks[reg] = v > 0 ? v : 0;
    }
    const total = REGIONS.reduce((s, reg) => s + regionalStocks[reg], 0);
    if (total === 0) warnings.push("ไม่มีสต็อกในภาคใดเลย — เมนูที่ใช้วัตถุดิบนี้จะขึ้นสินค้าหมด");
    const threshold = toNumber(r.lowstockthreshold);
    if (Number.isNaN(threshold)) errors.push("lowStockThreshold ต้องเป็นตัวเลข");

    const data = {
      nameTh,
      nameEn: r.nameen || nameTh,
      category: category || "other",
      categoryTh: CATEGORY_TH[category] || "อื่น ๆ",
      medicinalTaste: tastes.join("/"),
      elements: [element || "ดิน"],
      basisWeightG: 100,
      ...(unit === "piece" ? { gramsPerPiece } : {}),
      unit: unit || "g",
      nutrientsPer100g: nutrients,
      nutritionPer100G: nutrients,
      regionalStocks,
      currentStockGrams: total,
      stockQuantity: total,
      lowStockThresholdGrams: threshold > 0 ? threshold : Math.round(total * 0.1),
      isActive: true,
    };

    // ชื่อซ้ำ / ใกล้เคียง
    let similar = [];
    if (nameTh) {
      similar = findSimilarNames(nameTh, existing).map((m) => ({
        ...m,
        source: "db",
        inactive: existing.find((e) => e.id === m.id)?.inactive || false,
      }));
      const key = normalizeName(nameTh);
      if (seenInFile.has(key)) errors.push(`ชื่อซ้ำกับแถวที่ ${seenInFile.get(key)} ในไฟล์เดียวกัน`);
      else seenInFile.set(key, line);
    }

    if (!errors.length) {
      try {
        await new Ingredient(data).validate();
      } catch (err) {
        errors.push(...Object.values(err.errors || {}).map((e) => e.message));
        if (!err.errors) errors.push(err.message);
      }
    }

    rows.push(
      finalizeRow({
        index,
        line,
        name: nameTh || `(แถว ${line})`,
        errors,
        warnings,
        data,
        similar,
        display: {
          nameEn: data.nameEn,
          category: data.categoryTh,
          taste: data.medicinalTaste,
          element: data.elements[0],
          unit: data.unit,
          calories: nutrients.calories,
          regionalStocks,
        },
      }),
    );
  }
  return { rows, fileErrors, fileWarnings };
}

/** กำหนดสถานะ + การกระทำเริ่มต้นของแถว (ใช้ร่วมกับสินค้า) */
export function finalizeRow(row) {
  const exact = row.similar.find((m) => m.exact);
  if (row.similar.length) {
    row.warnings.push(
      exact ? `ชื่อซ้ำกับ "${exact.name}" ที่มีอยู่แล้ว` : `ชื่อใกล้เคียงกับ ${row.similar.map((m) => `"${m.name}"`).join(", ")}`,
    );
  }
  row.status = row.errors.length ? "error" : row.warnings.length ? "warning" : "ok";
  // ซ้ำตรงตัว → ค่าเริ่มต้น "ข้าม" / ใกล้เคียง → "เพิ่มใหม่" (แอดมินเปลี่ยนได้ในหน้า Preview)
  row.defaultAction = row.status === "error" ? "skip" : exact ? "skip" : "create";
  row.defaultTargetId = row.similar[0]?.id || null;
  return row;
}
