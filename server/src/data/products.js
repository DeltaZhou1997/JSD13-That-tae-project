import dishes from "../mockDB/dishes.js";

const DEFAULT_QUANTITY = 20;
const DEFAULT_CALORIES = 350;

export const regionMap = {
  northern: "ภาคเหนือ",
  northeastern: "ภาคอีสาน",
  central: "ภาคกลาง",
  southern: "ภาคใต้",
  fusion: "ไทยฟิวชั่น",
};

function getTodayInputValue() {
  return new Date().toISOString().split("T")[0];
}

function mapDishToProduct(dish) {
  const calories =
    dish.nutritionCache?.perServing?.calories ||
    dish.nutritionCache?.totals?.calories ||
    DEFAULT_CALORIES;

  const ingredientsSummary = Array.isArray(dish.recipe)
    ? dish.recipe.map((r) => `${r.nameTh} (${r.quantity}${r.unit || "g"})`).join(", ")
    : "";

  return {
    _id: dish._id,
    name: dish.nameTh || "",
    region: dish.region || "northern",
    regionNameTh: dish.regionNameTh || regionMap[dish.region] || "",
    description: dish.description || "",
    history: dish.history || "",
    price: dish.price ?? 0,
    quantity: dish.servings ? dish.servings * 10 : DEFAULT_QUANTITY,
    calories,
    servings: dish.servings || 2,
    date: getTodayInputValue(),
    tags: [dish.regionNameTh].filter(Boolean),
    ingredients: ingredientsSummary,
    recipe: dish.recipe || [],
    nutritionCache: dish.nutritionCache || null,
    cookingSteps: dish.cookingSteps || [],
    storageInstruction: dish.storageInstruction || "",
    reheatingInstruction: dish.reheatingInstruction || "",
    imageUrl: Array.isArray(dish.imageUrl) ? dish.imageUrl[0] : dish.imageUrl || "",
    images: Array.isArray(dish.imageUrl) ? dish.imageUrl : [dish.imageUrl].filter(Boolean),
  };
}

let products = Object.values(dishes).map(mapDishToProduct);

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((product) => product._id === id);
}

function createNextId() {
  const maxNumber = products.reduce((max, product) => {
    const current = Number(String(product._id).replace(/\D/g, ""));
    return Number.isNaN(current) ? max : Math.max(max, current);
  }, 0);
  return `dish_${String(maxNumber + 1).padStart(3, "0")}`;
}

export function createProduct(data) {
  const newProduct = { ...data, _id: createNextId() };
  products = [...products, newProduct];
  return newProduct;
}

export function updateProduct(id, data) {
  const exists = getProductById(id);
  if (!exists) return null;
  const updated = { ...exists, ...data, _id: id };
  products = products.map((product) => (product._id === id ? updated : product));
  return updated;
}

export function deleteProduct(id) {
  const exists = getProductById(id);
  if (!exists) return null;
  products = products.filter((product) => product._id !== id);
  return exists;
}

export function resetProducts() {
  products = Object.values(dishes).map(mapDishToProduct);
  return products;
}
