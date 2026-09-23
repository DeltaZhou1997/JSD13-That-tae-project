import { Router } from "express";
import { Ingredient } from "../../models/Ingredient.model.js";
import { verifyToken, requireAdmin } from "./users.routes.js";

const router = Router();

// =========================================================================
// 1. GET /api/v2/ingredients — ดึงรายการวัตถุดิบทั้งหมด (Search & Filters)
// สิทธิ์: ทุกคนเข้าถึงได้ (ใช้ประกอบสูตรใน Frontend & เช็กสารอาหาร)
// =========================================================================
router.get("/", async (req, res, next) => {
  try {
    const { category, region, element, search } = req.query;
    const query = { isActive: true };

    // ค้นหาตามชื่อไทย หรือ อังกฤษ
    if (search) {
      query.$or = [
        { nameTh: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
      ];
    }

    // กรองหมวดหมู่วัตถุดิบ
    if (category && category !== "all") {
      query.category = category;
    }

    // กรองภูมิภาค (รองรับวัตถุดิบ 1 ชิ้นที่มีหลายภูมิภาค เช่น ข่า ตะไคร้)
    if (region && region !== "all") {
      query.$or = [
        { regions: region },
        { region: region },
        { region: "all" },
      ];
    }

    // กรองตามธาตุเจ้าเรือนของวัตถุดิบ
    if (element && element !== "all") {
      query.elements = element;
    }

    const ingredients = await Ingredient.find(query).sort({ nameTh: 1 }).lean();

    return res.status(200).json({
      success: true,
      total: ingredients.length,
      basisWeightUnit: "100g",
      data: ingredients,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 2. GET /api/v2/ingredients/:id — ดึงข้อมูลวัตถุดิบรายตัว
// สิทธิ์: ทุกคนเข้าถึงได้
// =========================================================================
router.get("/:id", async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id).lean();
    if (!ingredient || !ingredient.isActive) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลวัตถุดิบนี้ในระบบ" });
    }
    return res.status(200).json({ success: true, data: ingredient });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 3. POST /api/v2/ingredients — สร้าง/เพิ่มวัตถุดิบใหม่เข้าคลัง
// สิทธิ์: Admin เท่านั้น (verifyToken + requireAdmin)
// =========================================================================
router.post("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { nameTh, category } = req.body;
    const unit = req.body.unit || "g";
    req.body.unit = unit;
    if (!nameTh || !category) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อมูลที่จำเป็น (ชื่อภาษาไทย และ หมวดหมู่)",
      });
    }

    if (!req.body.nameEn) req.body.nameEn = nameTh;
    if (!req.body.medicinalTaste) req.body.medicinalTaste = "จืด";
    if (!req.body.elements || !req.body.elements.length) req.body.elements = ["ดิน"];

    // รูปภาพไม่บังคับ (optional)
    if (!req.body.imageUrl) req.body.imageUrl = "";
    if (!req.body.imageId) req.body.imageId = null;

    // ซิงค์สารอาหารให้ครบทั้ง 7 ชนิดตามโมเดล
    const n = req.body.nutrientsPer100g || req.body.nutritionPer100G || {};
    const c = n.carb !== undefined ? n.carb : n.carbs !== undefined ? n.carbs : 0;
    const completeNutrients = {
      calories: Number(n.calories || 0),
      carb: Number(c),
      carbs: Number(c),
      sugar: Number(n.sugar || 0),
      fiber: Number(n.fiber || 0),
      protein: Number(n.protein || 0),
      fat: Number(n.fat || 0),
      sodium: Number(n.sodium || 0),
    };
    req.body.nutrientsPer100g = completeNutrients;
    req.body.nutritionPer100G = completeNutrients;

    const newIngredient = new Ingredient(req.body);
    const saved = await newIngredient.save();

    return res.status(201).json({
      success: true,
      message: `เพิ่มวัตถุดิบ "${saved.nameTh}" เข้าสู่คลังสำเร็จ`,
      data: saved,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 4. PUT /api/v2/ingredients/:id — แก้ไขข้อมูลวัตถุดิบ / ปรับสต็อก
// สิทธิ์: Admin เท่านั้น
// =========================================================================
router.put("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    if (req.body.nutrientsPer100g || req.body.nutritionPer100G) {
      const n = req.body.nutrientsPer100g || req.body.nutritionPer100G || {};
      const c = n.carb !== undefined ? n.carb : n.carbs !== undefined ? n.carbs : 0;
      const completeNutrients = {
        calories: Number(n.calories || 0),
        carb: Number(c),
        carbs: Number(c),
        sugar: Number(n.sugar || 0),
        fiber: Number(n.fiber || 0),
        protein: Number(n.protein || 0),
        fat: Number(n.fat || 0),
        sodium: Number(n.sodium || 0),
      };
      req.body.nutrientsPer100g = completeNutrients;
      req.body.nutritionPer100G = completeNutrients;
    }

    // Sync stock fields: currentStockGrams ↔ stockQuantity
    if (req.body.currentStockGrams !== undefined) {
      req.body.stockQuantity = Number(req.body.currentStockGrams) || 0;
    } else if (req.body.stockQuantity !== undefined) {
      req.body.currentStockGrams = Number(req.body.stockQuantity) || 0;
    }

    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "ไม่พบวัตถุดิบเพื่อทำการแก้ไข" });
    }

    return res.status(200).json({
      success: true,
      message: `แก้ไขข้อมูลวัตถุดิบ "${updated.nameTh}" สำเร็จ`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 5. PATCH /api/v2/ingredients/:id/stock — เพิ่ม/ลด สต็อกวัตถุดิบแบบด่วน
// สิทธิ์: Admin เท่านั้น
// =========================================================================
router.patch("/:id/stock", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { delta, stockQuantity } = req.body;
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ success: false, message: "ไม่พบวัตถุดิบ" });
    }

    if (typeof stockQuantity === "number") {
      ingredient.stockQuantity = Math.max(0, stockQuantity);
    } else if (typeof delta === "number") {
      ingredient.stockQuantity = Math.max(0, ingredient.stockQuantity + delta);
    }

    await ingredient.save();

    return res.status(200).json({
      success: true,
      message: `ปรับสต็อก "${ingredient.nameTh}" คงเหลือ ${ingredient.stockQuantity} ${ingredient.unit}`,
      data: ingredient,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 6. DELETE /api/v2/ingredients/:id — ลบวัตถุดิบ (Soft Delete)
// สิทธิ์: Admin เท่านั้น
// =========================================================================
router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ success: false, message: "ไม่พบวัตถุดิบเพื่อทำการลบ" });
    }

    return res.status(200).json({
      success: true,
      message: `ลบวัตถุดิบ "${deleted.nameTh}" ออกจากระบบเรียบร้อยแล้ว`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
