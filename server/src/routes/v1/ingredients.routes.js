import { Router } from "express";
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getLowStockIngredients,
  INGREDIENT_CATEGORIES,
} from "../../data/ingredients.js";
import { validateIngredient } from "../../../validation/validateIngredient.js";

export const ingredientsRouter = Router();

// GET /api/v1/ingredients - ดึงรายการวัตถุดิบทั้งหมด พร้อมค่าสารอาหารหลักต่อ 100 กรัม
ingredientsRouter.get("/", (req, res) => {
  const { category, search, lowStock } = req.query;
  let list = getAllIngredients();

  if (category) {
    list = list.filter((item) => item.category === category);
  }

  if (search) {
    const q = String(search).trim().toLowerCase();
    list = list.filter(
      (item) =>
        (item.nameTh && item.nameTh.toLowerCase().includes(q)) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(q))
    );
  }

  if (lowStock === "true") {
    list = list.filter(
      (item) => Number(item.currentStockGrams) <= Number(item.lowStockThresholdGrams)
    );
  }

  res.json({
    success: true,
    total: list.length,
    basisWeightUnit: "100g",
    data: list,
  });
});

ingredientsRouter.get("/categories", (req, res) => {
  res.json({
    success: true,
    data: Object.entries(INGREDIENT_CATEGORIES).map(([value, labelTh]) => ({
      value,
      labelTh,
    })),
  });
});

ingredientsRouter.get("/low-stock", (req, res) => {
  const list = getLowStockIngredients();
  res.json({ success: true, total: list.length, data: list });
});

// GET /api/v1/ingredients/:id - ดึงข้อมูลวัตถุดิบรายตัว
ingredientsRouter.get("/:id", (req, res) => {
  const item = getIngredientById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Ingredient ${req.params.id} not found`,
    });
  }

  res.json({
    success: true,
    data: item,
  });
});

ingredientsRouter.post("/", (req, res) => {
  const { isValid, errors } = validateIngredient(req.body);
  if (!isValid) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ถูกต้อง", errors });
  }
  const created = createIngredient(req.body);
  res.status(201).json({
    success: true,
    data: created,
    message: "เพิ่มวัตถุดิบใหม่สำเร็จ",
  });
});

ingredientsRouter.put("/:id", (req, res) => {
  const existing = getIngredientById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Ingredient ${req.params.id} not found`,
    });
  }
  const { isValid, errors } = validateIngredient(req.body);
  if (!isValid) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ถูกต้อง", errors });
  }
  const updated = updateIngredient(req.params.id, req.body);
  res.json({ success: true, data: updated, message: "แก้ไขข้อมูลวัตถุดิบสำเร็จ" });
});

ingredientsRouter.patch("/:id/stock", (req, res) => {
  const existing = getIngredientById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Ingredient ${req.params.id} not found`,
    });
  }

  const { currentStockGrams, lowStockThresholdGrams } = req.body;
  const patch = {};
  if (currentStockGrams !== undefined) patch.currentStockGrams = Number(currentStockGrams);
  if (lowStockThresholdGrams !== undefined) {
    patch.lowStockThresholdGrams = Number(lowStockThresholdGrams);
  }

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({
      success: false,
      message: "ต้องระบุ currentStockGrams หรือ lowStockThresholdGrams อย่างน้อยหนึ่งค่า",
    });
  }

  const { isValid, errors } = validateIngredient(patch, { partial: true });
  if (!isValid) {
    return res.status(400).json({ success: false, message: "ข้อมูลไม่ถูกต้อง", errors });
  }

  const updated = updateIngredient(req.params.id, patch);
  res.json({ success: true, data: updated, message: "อัปเดตสต็อกวัตถุดิบสำเร็จ" });
});

ingredientsRouter.delete("/:id", (req, res) => {
  const deleted = deleteIngredient(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Ingredient ${req.params.id} not found`,
    });
  }
  res.json({ success: true, data: deleted, message: "ลบวัตถุดิบสำเร็จ" });
});

export default ingredientsRouter;
