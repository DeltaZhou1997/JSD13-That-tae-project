// In-memory store สำหรับ Mock API — จำลองพฤติกรรมของ ProductsProvider.jsx ฝั่ง frontend
// แต่รันเป็น Node process แยกต่างหาก เพื่อให้ยิง HTTP จริงได้ก่อนจะต่อ MongoDB ใน Phase 2
import dishes from "../../src/mock-data/dishes.js";

// ค่าตั้งต้นที่ mock data ยังไม่มี แต่ ProductForm ต้องใช้ (เหมือนใน ProductsContext.js)
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

// แปลงข้อมูลเมนูจาก mock-data ให้เป็นรูปแบบเดียวกับที่หน้า Admin ใช้
// (ก็อปมาจาก src/context/ProductsContext.js เพราะไฟล์นั้น import "react" ใช้ฝั่ง server ตรงๆ ไม่ได้)
function mapDishToProduct(dish) {
  return {
    _id: dish._id,
    name: dish.nameTh || "",
    region: dish.region || "northern",
    regionNameTh: dish.regionNameTh || regionMap[dish.region] || "",
    description: dish.description || "",
    history: dish.history || "",
    price: dish.price ?? 0,
    quantity: dish.servings ? dish.servings * 10 : DEFAULT_QUANTITY,
    calories: DEFAULT_CALORIES,
    date: getTodayInputValue(),
    tags: [dish.regionNameTh].filter(Boolean),
    ingredients: "",
    cookingSteps: "",
    imageUrl: Array.isArray(dish.imageUrl) ? dish.imageUrl[0] : dish.imageUrl || "",
  };
}

// state ในหน่วยความจำ — รีสตาร์ท server แล้วกลับเป็นค่าตั้งต้นจาก mock-data เหมือนฝั่ง frontend
let products = Object.values(dishes).map(mapDishToProduct);

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((product) => product._id === id);
}

// สร้าง _id ใหม่ต่อจากเลขสูงสุดที่มีอยู่ เช่น dish_031 (ตรรกะเดียวกับ ProductsProvider.jsx)
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
