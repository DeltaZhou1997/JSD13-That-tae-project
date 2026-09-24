// ตรวจ + เตรียมข้อมูลเมนูจาก products.csv + recipes.csv + images/ (ยังไม่บันทึก)
// คำนวณค่าให้เหมือนฟอร์มแอดมิน (ProductForm.jsx): ธาตุเด่น/ธาตุที่เหมาะ, แคลอรี, จำนวนชุดที่ทำได้, แท็กอัตโนมัติ
import path from "path";
import { Product, PRODUCT_TO_INGREDIENT_REGION } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import { csvToRecords } from "../../utils/csv.js";
import { convertQty } from "../../utils/units.js";
import { computeAvailability } from "../../utils/stockAvailability.js";
import { findSimilarNames, normalizeName, nameSimilarity } from "../../utils/nameSimilarity.js";
import {
  resolveRegion,
  regionLabel,
  resolveRestriction,
  restrictionLabel,
  resolveUnit,
  splitMulti,
  toNumber,
} from "./importMaps.js";
import { finalizeRow } from "./ingredientImport.js";

export const PRODUCT_COLUMNS = [
  { key: "code", required: true, example: "LAAB01", note: "รหัสอ้างอิงเมนู ใช้ผูกกับ recipes.csv (ห้ามซ้ำในไฟล์)" },
  { key: "nameTh", required: true, example: "ลาบเหนือหมู", note: "ชื่อเมนูภาษาไทย" },
  { key: "nameEn", required: false, example: "Northern Larb Moo", note: "" },
  { key: "region", required: true, example: "ภาคเหนือ", note: "ภาคเหนือ / ภาคอีสาน / ภาคกลาง / ภาคใต้ / ไทยฟิวชั่น (ขนมหวานใช้ ไทยฟิวชั่น)" },
  { key: "price", required: true, example: "221", note: "ราคาขาย (บาท)" },
  { key: "description", required: true, example: "ลาบคั่วสูตรล้านนา หอมมะแขว่น", note: "รายละเอียดเมนู" },
  { key: "images", required: true, example: "laab-moo.png", note: "ชื่อไฟล์ในโฟลเดอร์ images/ หลายรูปคั่นด้วย |" },
  { key: "history", required: false, example: "", note: "ประวัติ/ภูมิปัญญา" },
  { key: "tags", required: false, example: "อาหารเหนือ|เผ็ด", note: "คั่นด้วย | (ระบบเติมธาตุ/ภาค/ข้อจำกัดให้เอง)" },
  { key: "foodRestrictions", required: false, example: "low_sodium|halal", note: "รหัสหรือชื่อไทย เช่น โซเดียมต่ำ|ไม่มีอาหารทะเล|ฮาลาล" },
  { key: "servings", required: false, example: "2", note: "จำนวนที่ (ไม่ใส่ = 2)" },
  { key: "cookingSteps", required: false, example: "คั่วข้าวให้หอม|ลวกหมูสับ|คลุกเครื่องลาบ", note: "ขึ้นบรรทัดใหม่ในช่อง หรือคั่นด้วย |" },
  { key: "storageInstruction", required: false, example: "", note: "" },
  { key: "reheatingInstruction", required: false, example: "", note: "" },
  { key: "date", required: false, example: "", note: "วันเริ่มขาย YYYY-MM-DD (ไม่ใส่ = วันนี้)" },
];

export const RECIPE_COLUMNS = [
  { key: "code", required: true, example: "LAAB01", note: "รหัสเมนูใน products.csv" },
  { key: "ingredient", required: true, example: "หมู", note: "ชื่อวัตถุดิบตามคลัง (ต้องมีอยู่แล้ว)" },
  { key: "quantity", required: true, example: "300", note: "ปริมาณต่อ 1 ชุด" },
  { key: "unit", required: false, example: "g", note: "g / kg / ml / l / piece (ไม่ใส่ = หน่วยสต็อกของวัตถุดิบ)" },
];

const IMAGE_EXT = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const GRAMS_PER_UNIT = { g: 1, kg: 1000, ml: 1, l: 1000 };
const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ"];

const findCsv = (files, name) => Object.keys(files).find((n) => new RegExp(`(^|/)${name}\\.csv$`, "i").test(n));

/** รูปใน zip: key = ชื่อไฟล์ (ตัวเล็ก) → { name, buffer, contentType } */
function collectImages(files) {
  const images = new Map();
  for (const [name, buffer] of Object.entries(files)) {
    if (name.startsWith("__MACOSX/") || path.basename(name).startsWith(".")) continue;
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXT[ext]) continue;
    images.set(path.basename(name).toLowerCase(), { name: path.basename(name), buffer, contentType: IMAGE_EXT[ext], size: buffer.length });
  }
  return images;
}

/**
 * @param {Record<string, Buffer>} files
 */
export async function previewProducts(files) {
  const fileErrors = [];
  const fileWarnings = [];
  const productsCsv = findCsv(files, "products");
  const recipesCsv = findCsv(files, "recipes");
  if (!productsCsv) fileErrors.push("ไม่พบไฟล์ products.csv ใน zip");
  if (!recipesCsv) fileErrors.push("ไม่พบไฟล์ recipes.csv ใน zip");
  if (fileErrors.length) return { rows: [], images: new Map(), fileErrors, fileWarnings };

  const products = csvToRecords(files[productsCsv].toString("utf8"));
  const recipes = csvToRecords(files[recipesCsv].toString("utf8"));
  for (const col of PRODUCT_COLUMNS.filter((c) => c.required)) {
    if (!products.headers.includes(col.key.toLowerCase())) fileErrors.push(`products.csv ไม่มีคอลัมน์ "${col.key}"`);
  }
  for (const col of RECIPE_COLUMNS.filter((c) => c.required)) {
    if (!recipes.headers.includes(col.key.toLowerCase())) fileErrors.push(`recipes.csv ไม่มีคอลัมน์ "${col.key}"`);
  }
  if (products.records.length === 0) fileErrors.push("products.csv ไม่มีข้อมูล");
  if (products.records.length > 500) fileErrors.push(`นำเข้าได้ครั้งละไม่เกิน 500 เมนู (มี ${products.records.length} แถว)`);
  const images = collectImages(files);
  if (images.size > 300) fileErrors.push(`รูปภาพเกิน 300 ไฟล์ (มี ${images.size} ไฟล์)`);
  if (fileErrors.length) return { rows: [], images, fileErrors, fileWarnings };

  // วัตถุดิบในคลัง (ใช้ผูกสูตร + คำนวณ)
  const ingredients = await Ingredient.find({ isActive: { $ne: false } }).lean();
  const ingByName = new Map(ingredients.map((i) => [normalizeName(i.nameTh), i]));
  const lookup = { byId: new Map(ingredients.map((i) => [String(i._id), i])), byName: new Map(ingredients.map((i) => [i.nameTh, i])) };
  const matchIngredient = (name) => {
    const exact = ingByName.get(normalizeName(name));
    if (exact) return { ing: exact, fuzzy: false };
    let best = null;
    for (const ing of ingredients) {
      const score = nameSimilarity(name, ing.nameTh);
      if (score >= 0.9 && (!best || score > best.score)) best = { ing, score };
    }
    return best ? { ing: best.ing, fuzzy: true } : null;
  };

  // สูตรจัดกลุ่มตามรหัสเมนู
  const recipeByCode = new Map();
  for (const { line, data } of recipes.records) {
    const code = normalizeName(data.code);
    if (!code) continue;
    if (!recipeByCode.has(code)) recipeByCode.set(code, []);
    recipeByCode.get(code).push({ line, ...data });
  }
  const productCodes = new Set(products.records.map((r) => normalizeName(r.data.code)));
  const orphanCodes = [...recipeByCode.keys()].filter((c) => !productCodes.has(c));
  if (orphanCodes.length) fileWarnings.push(`recipes.csv มีรหัสเมนูที่ไม่อยู่ใน products.csv: ${orphanCodes.join(", ")}`);

  const existing = (await Product.find().select("name nameTh nameEn isActive").lean()).map((p) => ({
    id: String(p._id),
    name: p.nameTh || p.name,
    nameEn: p.nameEn,
    inactive: p.isActive === false,
  }));
  const seenCodes = new Map();
  const seenNames = new Map();
  const usedImages = new Set();
  const today = new Date().toISOString().slice(0, 10);

  const rows = [];
  for (const [index, { line, data: r }] of products.records.entries()) {
    const errors = [];
    const warnings = [];
    const nameTh = r.nameth || "";
    const code = normalizeName(r.code);

    if (!code) errors.push("ไม่มีรหัสเมนู (code)");
    else if (seenCodes.has(code)) errors.push(`รหัส "${r.code}" ซ้ำกับแถวที่ ${seenCodes.get(code)}`);
    else seenCodes.set(code, line);

    if (!nameTh) errors.push("ไม่มีชื่อเมนู (nameTh)");
    else if (nameTh.length < 3) errors.push("ชื่อเมนูต้องยาวอย่างน้อย 3 ตัวอักษร");
    if (!r.description) errors.push("ไม่มีรายละเอียดเมนู (description)");

    const region = resolveRegion(r.region);
    if (!region) errors.push(`ภูมิภาค "${r.region}" ไม่ถูกต้อง`);
    const stockRegion = PRODUCT_TO_INGREDIENT_REGION[region] || "central";

    const price = toNumber(r.price);
    if (!(price > 0)) errors.push("ราคาต้องเป็นตัวเลขมากกว่า 0");
    const servings = toNumber(r.servings);
    if (Number.isNaN(servings) || (servings !== null && servings <= 0)) errors.push("servings ต้องเป็นตัวเลขมากกว่า 0");

    // รูปภาพ
    const imageNames = splitMulti(r.images, { newlineOnly: true }).map((n) => path.basename(n));
    const rowImages = [];
    if (imageNames.length === 0) errors.push("ต้องมีรูปเมนูอย่างน้อย 1 รูป (คอลัมน์ images)");
    for (const name of imageNames) {
      const img = images.get(name.toLowerCase());
      if (!img) errors.push(`ไม่พบรูป "${name}" ในโฟลเดอร์ images/`);
      else if (img.size > MAX_IMAGE_BYTES) errors.push(`รูป "${name}" ใหญ่เกิน 5MB`);
      else {
        rowImages.push(img.name);
        usedImages.add(img.name.toLowerCase());
      }
    }

    // ข้อจำกัดอาหาร
    const foodRestrictions = [];
    for (const v of splitMulti(r.foodrestrictions)) {
      const id = resolveRestriction(v);
      if (id) foodRestrictions.push(id);
      else warnings.push(`ไม่รู้จักข้อจำกัดอาหาร "${v}" — ข้าม`);
    }

    // สูตร
    const recipeRows = recipeByCode.get(code) || [];
    if (code && recipeRows.length === 0) errors.push("ไม่มีวัตถุดิบใน recipes.csv สำหรับรหัสนี้");
    const recipe = [];
    const seenIng = new Set();
    for (const rr of recipeRows) {
      const where = `recipes.csv บรรทัด ${rr.line}`;
      const qty = toNumber(rr.quantity);
      if (!(qty > 0)) {
        errors.push(`${where}: ปริมาณ "${rr.quantity}" ต้องมากกว่า 0`);
        continue;
      }
      const match = matchIngredient(rr.ingredient);
      if (!match) {
        errors.push(`${where}: ไม่พบวัตถุดิบ "${rr.ingredient}" ในคลัง (เพิ่มวัตถุดิบก่อน)`);
        continue;
      }
      const ing = match.ing;
      if (match.fuzzy) warnings.push(`${where}: "${rr.ingredient}" จับคู่กับวัตถุดิบ "${ing.nameTh}"`);
      if (seenIng.has(String(ing._id))) {
        errors.push(`${where}: วัตถุดิบ "${ing.nameTh}" ซ้ำในสูตรเดียวกัน`);
        continue;
      }
      seenIng.add(String(ing._id));

      const unit = rr.unit ? resolveUnit(rr.unit) : ing.unit || "g";
      if (!unit) {
        errors.push(`${where}: หน่วย "${rr.unit}" ไม่ถูกต้อง`);
        continue;
      }
      if (convertQty(qty, unit, ing.unit || "g", ing.gramsPerPiece) === null) {
        errors.push(`${where}: แปลงหน่วย ${unit} เป็นหน่วยสต็อก ${ing.unit} ของ "${ing.nameTh}" ไม่ได้`);
        continue;
      }
      if (!(Number(ing.regionalStocks?.[stockRegion]) > 0)) {
        warnings.push(`"${ing.nameTh}" ไม่มีสต็อกใน${regionLabel(region) || "ภาคนี้"} — เมนูจะขึ้นสินค้าหมด`);
      }
      const n = ing.nutrientsPer100g || {};
      recipe.push({
        ingredient: ing._id,
        ingredientId: String(ing._id),
        nameTh: ing.nameTh,
        nameEn: ing.nameEn,
        quantity: qty,
        unit,
        gramsPerPiece: ing.gramsPerPiece || undefined,
        medicinalTaste: ing.medicinalTaste || "",
        category: ing.category || "",
        categoryTh: ing.categoryTh || "",
        elements: ing.elements || [],
        nutrientsPer100g: {
          calories: n.calories || 0,
          protein: n.protein || 0,
          carbs: n.carbs ?? n.carb ?? 0,
          fat: n.fat || 0,
          sodium: n.sodium || 0,
          sugar: n.sugar || 0,
          fiber: n.fiber || 0,
        },
      });
    }

    // ---- ค่าที่คำนวณให้ (สูตรเดียวกับ ProductForm.jsx) ----
    let calories = 0;
    const scores = { ดิน: 0, น้ำ: 0, ลม: 0, ไฟ: 0 };
    for (const item of recipe) {
      const grams = item.unit === "piece" ? item.quantity * (Number(item.gramsPerPiece) || 0) : item.quantity * (GRAMS_PER_UNIT[item.unit] || 1);
      calories += (item.nutrientsPer100g.calories || 0) * (grams / 100);
      const els = (item.elements || []).filter((e) => ELEMENTS.includes(e));
      els.forEach((e) => {
        scores[e] += item.quantity / els.length;
      });
    }
    const ranked = ELEMENTS.map((e) => [e, scores[e]]).sort((a, b) => b[1] - a[1]);
    const dominantElement = ranked[0][1] > 0 ? ranked[0][0] : "ดิน";
    const elementSuitability = ranked.filter(([, s]) => s > 0).map(([e]) => e);
    const availability = computeAvailability({ region, recipe }, lookup);
    const availableKits = availability.availableKits ?? 0;

    const tags = [
      ...new Set([
        ...splitMulti(r.tags),
        `ธาตุ${dominantElement}`,
        regionLabel(region),
        ...foodRestrictions.map(restrictionLabel),
      ]),
    ].filter(Boolean);

    const data = {
      name: nameTh,
      nameTh,
      nameEn: r.nameen || "",
      description: r.description || "",
      history: r.history || "",
      price: price > 0 ? price : 0,
      quantity: availableKits,
      stock: availableKits,
      region: region || "central",
      regionNameTh: regionLabel(region),
      dominantElement,
      elementSuitability: elementSuitability.length ? elementSuitability : [dominantElement],
      calories: Math.round(calories),
      servings: servings > 0 ? servings : 2,
      date: /^\d{4}-\d{2}-\d{2}$/.test(r.date || "") ? r.date : today,
      tags,
      foodRestrictions,
      ingredients: recipe.map((i) => `${i.nameTh} ${i.quantity} ${i.unit}`).join("\n"),
      recipe,
      cookingSteps: splitMulti(r.cookingsteps, { newlineOnly: true }),
      storageInstruction: r.storageinstruction || "",
      reheatingInstruction: r.reheatinginstruction || "",
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
      if (seenNames.has(key)) errors.push(`ชื่อเมนูซ้ำกับแถวที่ ${seenNames.get(key)} ในไฟล์เดียวกัน`);
      else seenNames.set(key, line);
    }

    if (!errors.length) {
      try {
        // imageUrl ชั่วคราวให้ผ่าน validator (ของจริงได้ตอนอัปโหลดเข้า GridFS)
        await new Product({ ...data, imageUrl: "pending" }).validate();
      } catch (err) {
        errors.push(...Object.values(err.errors || {}).map((e) => e.message));
        if (!err.errors) errors.push(err.message);
      }
    }

    rows.push(
      finalizeRow({
        index,
        line,
        code: r.code,
        name: nameTh || `(แถว ${line})`,
        errors,
        warnings,
        data,
        images: rowImages,
        similar,
        display: {
          nameEn: data.nameEn,
          region: data.regionNameTh,
          price: data.price,
          dominantElement,
          calories: data.calories,
          availableKits,
          missing: availability.missing || [],
          recipeCount: recipe.length,
          recipe: recipe.map((i) => `${i.nameTh} ${i.quantity} ${i.unit}`),
          steps: data.cookingSteps.length,
        },
      }),
    );
  }

  const unused = [...images.values()].filter((img) => !usedImages.has(img.name.toLowerCase())).map((img) => img.name);
  if (unused.length) fileWarnings.push(`มีรูปที่ไม่ได้ใช้ ${unused.length} ไฟล์: ${unused.slice(0, 5).join(", ")}${unused.length > 5 ? " …" : ""}`);

  return { rows, images, fileErrors, fileWarnings };
}
