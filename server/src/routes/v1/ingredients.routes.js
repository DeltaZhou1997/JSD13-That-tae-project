import { Router } from "express";
import mongoose from "mongoose";
import Ingredient from "../../models/Ingredient.model.js";
import rawIngredients from "../../mockDB/ingredients.js";

export const ingredientsRouter = Router();

// แผนผังชื่อภูมิภาค
const regionNameMap = {
  north: "ภาคเหนือ",
  northeast: "ภาคอีสาน",
  central: "ภาคกลาง",
  south: "ภาคใต้",
  all: "ทุกภูมิภาค (ทั่วไป)",
};

// แปลง rawIngredients เป็น Mutable in-memory store พร้อมใส่ค่าเริ่มต้นของ Stock และ Region
const ingredientsStore = {};
Object.entries(rawIngredients).forEach(([key, item], index) => {
  // กำหนดภูมิภาคกระจายให้สมจริงสำหรับข้อมูลเริ่มต้น
  const defaultRegions = ["north", "northeast", "central", "south", "all"];
  const assignedRegion = item.region || defaultRegions[index % defaultRegions.length];

  ingredientsStore[key] = {
    ...item,
    _id: item._id || key,
    stockQuantity: item.stockQuantity ?? (20 + (index % 15) * 5), // เช่น 20 - 90
    unit: item.unit || (item.category === "vegetable" ? "g" : item.category === "meat" ? "g" : "ชิ้น"),
    region: assignedRegion,
    regionNameTh: item.regionNameTh || regionNameMap[assignedRegion] || "ทั่วไป",
    pricePerUnit: item.pricePerUnit || 15 + (index % 10) * 5,
    nutrientsPer100g: item.nutrientsPer100g || {
      calories: 0,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      protein: 0,
      fat: 0,
      sodium: 0,
    },
  };
});

// 1. GET /api/v1/ingredients - ดึงรายการวัตถุดิบทั้งหมด พร้อม Search & Filter
ingredientsRouter.get("/", async (req, res) => {
  const { category, search, region, element } = req.query;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = { isActive: true };
      if (search) {
        query.$or = [
          { nameTh: { $regex: search, $options: "i" } },
          { nameEn: { $regex: search, $options: "i" } },
        ];
      }
      if (category && category !== "all") query.category = category;
      if (region && region !== "all") query.$or = [{ regions: region }, { region: region }, { region: "all" }];
      if (element && element !== "all") query.elements = element;

      const dbList = await Ingredient.find(query).sort({ nameTh: 1 }).lean();
      if (dbList && dbList.length > 0) {
        return res.status(200).json(dbList);
      }
    }
  } catch (_) {}

  let list = Object.values(ingredientsStore);

  // Filter: ค้นหาตามชื่อ (ไทยหรืออังกฤษ)
  if (search) {
    const q = String(search).trim().toLowerCase();
    list = list.filter(
      (item) =>
        (item.nameTh && item.nameTh.toLowerCase().includes(q)) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
        (item._id && item._id.toLowerCase().includes(q))
    );
  }

  // Filter: หมวดหมู่วัตถุดิบ
  if (category && category !== "all") {
    list = list.filter((item) => item.category === category);
  }

  // Filter: ภูมิภาคแหล่งสต็อก
  if (region && region !== "all") {
    list = list.filter(
      (item) => item.region === region || item.regionNameTh?.includes(region)
    );
  }

  // Filter: ธาตุเจ้าเรือน
  if (element && element !== "all") {
    list = list.filter(
      (item) => Array.isArray(item.elements) && item.elements.includes(element)
    );
  }

  res.json({
    success: true,
    total: list.length,
    basisWeightUnit: "100g",
    data: list,
  });
});

// 2. GET /api/v1/ingredients/:id - ดึงข้อมูลวัตถุดิบรายตัว
ingredientsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { nameTh: id };
      const dbItem = await Ingredient.findOne(query).lean();
      if (dbItem) return res.status(200).json({ success: true, data: dbItem });
    }
  } catch (_) {}

  const item = ingredientsStore[id];
  if (!item) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบวัตถุดิบรหัส "${id}"`,
    });
  }

  res.json({
    success: true,
    data: item,
  });
});

// 3. POST /api/v1/ingredients - เพิ่มวัตถุดิบใหม่เข้าระบบ
ingredientsRouter.post("/", (req, res) => {
  const {
    nameTh,
    nameEn = "",
    category = "vegetable",
    categoryTh,
    medicinalTaste = "รสจืด/มัน",
    elements = ["ดิน"],
    stockQuantity = 50,
    unit = "g",
    region = "all",
    pricePerUnit = 20,
    nutrientsPer100g = {},
  } = req.body;

  if (!nameTh || String(nameTh).trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "กรุณาระบุชื่อวัตถุดิบภาษาไทย (อย่างน้อย 2 ตัวอักษร)",
    });
  }

  // หา ID ถัดไป
  const existingIds = Object.keys(ingredientsStore);
  const maxNum = existingIds.reduce((max, id) => {
    const num = parseInt(id.replace("ing_", ""), 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const newId = `ing_${String(maxNum + 1).padStart(3, "0")}`;

  const categoryMap = {
    meat: "เนื้อสัตว์ & โปรตีน",
    vegetable: "ผัก & พืชสมุนไพร",
    seasoning: "เครื่องปรุง & ซอส",
    grain: "ธัญพืช & ข้าว",
    herb: "สมุนไพรสด",
    other: "วัตถุดิบอื่นๆ",
  };

  const newIngredient = {
    _id: newId,
    id: newId,
    nameTh: nameTh.trim(),
    nameEn: nameEn.trim(),
    category,
    categoryTh: categoryTh || categoryMap[category] || "วัตถุดิบอาหาร",
    medicinalTaste,
    elements: Array.isArray(elements) ? elements : [elements],
    basisWeightG: 100,
    stockQuantity: Math.max(0, Number(stockQuantity) || 0),
    unit: unit || "g",
    region: region || "all",
    regionNameTh: regionNameMap[region] || "ทั่วไป",
    pricePerUnit: Math.max(0, Number(pricePerUnit) || 0),
    nutrientsPer100g: {
      calories: Number(nutrientsPer100g.calories) || 0,
      carbs: Number(nutrientsPer100g.carbs) || 0,
      sugar: Number(nutrientsPer100g.sugar) || 0,
      fiber: Number(nutrientsPer100g.fiber) || 0,
      protein: Number(nutrientsPer100g.protein) || 0,
      fat: Number(nutrientsPer100g.fat) || 0,
      sodium: Number(nutrientsPer100g.sodium) || 0,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ingredientsStore[newId] = newIngredient;

  res.status(201).json({
    success: true,
    message: "เพิ่มวัตถุดิบใหม่เข้าคลังสต็อกสำเร็จ",
    data: newIngredient,
  });
});

// 4. PUT /api/v1/ingredients/:id - แก้ไขข้อมูลวัตถุดิบ สต็อก โภชนาการ และภูมิภาค
ingredientsRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const existing = ingredientsStore[id];

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบวัตถุดิบรหัส "${id}"`,
    });
  }

  const {
    nameTh,
    nameEn,
    category,
    categoryTh,
    medicinalTaste,
    elements,
    stockQuantity,
    unit,
    region,
    pricePerUnit,
    nutrientsPer100g,
    isActive,
  } = req.body;

  if (nameTh !== undefined) existing.nameTh = String(nameTh).trim();
  if (nameEn !== undefined) existing.nameEn = String(nameEn).trim();
  if (category !== undefined) existing.category = category;
  if (categoryTh !== undefined) existing.categoryTh = categoryTh;
  if (medicinalTaste !== undefined) existing.medicinalTaste = medicinalTaste;
  if (elements !== undefined) existing.elements = Array.isArray(elements) ? elements : [elements];
  if (stockQuantity !== undefined) existing.stockQuantity = Math.max(0, Number(stockQuantity) || 0);
  if (unit !== undefined) existing.unit = unit;
  if (region !== undefined) {
    existing.region = region;
    existing.regionNameTh = regionNameMap[region] || "ทั่วไป";
  }
  if (pricePerUnit !== undefined) existing.pricePerUnit = Math.max(0, Number(pricePerUnit) || 0);
  if (isActive !== undefined) existing.isActive = Boolean(isActive);

  if (nutrientsPer100g && typeof nutrientsPer100g === "object") {
    existing.nutrientsPer100g = {
      ...existing.nutrientsPer100g,
      calories: Number(nutrientsPer100g.calories ?? existing.nutrientsPer100g.calories),
      carbs: Number(nutrientsPer100g.carbs ?? existing.nutrientsPer100g.carbs),
      sugar: Number(nutrientsPer100g.sugar ?? existing.nutrientsPer100g.sugar),
      fiber: Number(nutrientsPer100g.fiber ?? existing.nutrientsPer100g.fiber),
      protein: Number(nutrientsPer100g.protein ?? existing.nutrientsPer100g.protein),
      fat: Number(nutrientsPer100g.fat ?? existing.nutrientsPer100g.fat),
      sodium: Number(nutrientsPer100g.sodium ?? existing.nutrientsPer100g.sodium),
    };
  }

  existing.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: "อัปเดตข้อมูลวัตถุดิบและสต็อกสำเร็จ",
    data: existing,
  });
});

// 5. DELETE /api/v1/ingredients/:id - ลบวัตถุดิบออกจากสต็อก
ingredientsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const existing = ingredientsStore[id];

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบวัตถุดิบรหัส "${id}"`,
    });
  }

  delete ingredientsStore[id];

  res.status(200).json({
    success: true,
    message: `ลบวัตถุดิบ "${existing.nameTh}" (${id}) เรียบร้อยแล้ว`,
    data: existing,
  });
});

export default ingredientsRouter;
