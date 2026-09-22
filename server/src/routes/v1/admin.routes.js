import { Router } from "express";
import { calculateRecipeMetrics } from "../../utils/recipeCalculator.js";
import { getAllIngredients, getIngredientById } from "../../data/ingredients.js";

export const adminRouter = Router();

adminRouter.get("/ingredients", (req, res) => {
  const list = getAllIngredients();
  res.json({ success: true, total: list.length, data: list });
});

adminRouter.post("/calculate-recipe", (req, res) => {
  const { items, servings } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "ต้องระบุ items อย่างน้อย 1 รายการ",
    });
  }

  const resolved = items.map((item) => {
    if (item?.nutrientsPer100g || item?.ingredient) return item;
    const found = getIngredientById(item?.ingredientId || item?._id);
    return found ? { ...found, quantity: item.quantity } : item;
  });

  const metrics = calculateRecipeMetrics(resolved, servings);
  res.json({ success: true, data: metrics });
});

export default adminRouter;
