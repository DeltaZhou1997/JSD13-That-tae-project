import mongoose from "mongoose";
import dishes from "../mockDB/dishes.js";
import Product from "../models/Product.model.js";

const DEFAULT_QUANTITY = 20;
const DEFAULT_CALORIES = 350;

export const regionMap = {
  northern: "ภาคเหนือ",
  northeastern: "ภาคอีสาน",
  central: "ภาคกลาง",
  southern: "ภาคใต้",
  fusion: "ไทยฟิวชั่น",
};

const SEED_SHELF_LIFE_DAYS = 90;

function getSeedExpiryInputValue() {
  const date = new Date();
  date.setDate(date.getDate() + SEED_SHELF_LIFE_DAYS);
  return date.toISOString().split("T")[0];
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const match = url.match(/assets\/([^\/]+)\/([^\/]+)$/);
  if (match) {
    return `/assets/${match[1]}/${match[2]}`;
  }
  return url;
}

export function mapDishToProduct(dish) {
  const calories =
    dish.nutritionCache?.perServing?.calories ||
    dish.nutritionCache?.totals?.calories ||
    DEFAULT_CALORIES;

  const ingredientsSummary = Array.isArray(dish.recipe)
    ? dish.recipe.map((r) => `${r.nameTh} (${r.quantity}${r.unit || "g"})`).join(", ")
    : "";

  const rawImages = Array.isArray(dish.imageUrl)
    ? dish.imageUrl
    : [dish.imageUrl].filter(Boolean);
  const normalizedImages = rawImages.map(normalizeImageUrl);
  const primaryImage = normalizedImages[0] || "";

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
    dominantElement: dish.dominantElement || "ดิน",
    elementSuitability: dish.elementSuitability || ["ดิน"],
    date: getSeedExpiryInputValue(),
    tags: [dish.regionNameTh, dish.dominantElement ? `ธาตุ${dish.dominantElement}` : null].filter(Boolean),
    ingredients: ingredientsSummary,
    recipe: dish.recipe || [],
    nutritionCache: dish.nutritionCache || null,
    cookingSteps: dish.cookingSteps || [],
    storageInstruction: dish.storageInstruction || "",
    reheatingInstruction: dish.reheatingInstruction || "",
    imageUrl: primaryImage,
    images: normalizedImages,
  };
}

let memoryProducts = Object.values(dishes).map(mapDishToProduct);

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

function createNextId() {
  return new mongoose.Types.ObjectId().toString();
}

function findMemoryProduct(id) {
  return memoryProducts.find((product) => product._id === id);
}

export async function getAllProducts() {
  if (isDbReady()) return Product.find({ isActive: true }).lean();
  return memoryProducts;
}

export async function getProductById(id) {
  if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
    return Product.findById(id).lean();
  }
  if (isDbReady()) return null;
  return findMemoryProduct(id) || null;
}

export async function createProduct(data) {
  if (isDbReady()) {
    const created = await Product.create(data);
    return created.toObject();
  }
  const newProduct = { ...data, _id: createNextId() };
  memoryProducts = [...memoryProducts, newProduct];
  return newProduct;
}

export async function updateProduct(id, data) {
  if (isDbReady()) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const { _id, ...safeData } = data;
    return Product.findByIdAndUpdate(id, safeData, {
      new: true,
      runValidators: true,
    }).lean();
  }
  const exists = findMemoryProduct(id);
  if (!exists) return null;
  const updated = { ...exists, ...data, _id: id };
  memoryProducts = memoryProducts.map((product) => (product._id === id ? updated : product));
  return updated;
}

export async function deleteProduct(id) {
  if (isDbReady()) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Product.findByIdAndDelete(id).lean();
  }
  const exists = findMemoryProduct(id);
  if (!exists) return null;
  memoryProducts = memoryProducts.filter((product) => product._id !== id);
  return exists;
}

export function resetProducts() {
  memoryProducts = Object.values(dishes).map(mapDishToProduct);
  return memoryProducts;
}
