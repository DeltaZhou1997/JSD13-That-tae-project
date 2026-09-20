import { Router } from "express";
import ingredients from "../../mockDB/ingredients.js";

export const ingredientsRouter = Router();

// GET /api/v1/ingredients - ดึงรายการวัตถุดิบทั้งหมด พร้อมค่าสารอาหารหลักต่อ 100 กรัม
ingredientsRouter.get("/", (req, res) => {
  const { category } = req.query;
  let list = Object.values(ingredients);

  if (category) {
    list = list.filter((item) => item.category === category);
  }

  res.json({
    success: true,
    total: list.length,
    basisWeightUnit: "100g",
    data: list,
  });
});

// GET /api/v1/ingredients/:id - ดึงข้อมูลวัตถุดิบรายตัว
ingredientsRouter.get("/:id", (req, res) => {
  const item = ingredients[req.params.id];
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

export default ingredientsRouter;
