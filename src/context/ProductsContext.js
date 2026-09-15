import { createContext, useContext } from "react";
import { dishes } from "../mock-data/index.js";

// ค่าตั้งต้นที่ mock data ยังไม่มี แต่ฟอร์มจัดการสินค้าต้องใช้
const DEFAULT_QUANTITY = 20;
const DEFAULT_CALORIES = 350;

// คืนวันที่วันนี้ในรูปแบบ YYYY-MM-DD สำหรับ input type="date"
export function getTodayInputValue() {
  return new Date().toISOString().split("T")[0];
}

export const regionMap = {
  northern: "ภาคเหนือ",
  northeastern: "ภาคอีสาน",
  central: "ภาคกลาง",
  southern: "ภาคใต้",
  fusion: "ไทยฟิวชั่น",
};

/**
 * แปลงข้อมูลเมนูจาก mock-data ให้เป็นรูปแบบเดียวกับที่หน้า Admin ใช้
 * mock-data ยังไม่มี quantity / calories / date / tags จึงเติมค่าจำลองให้ก่อน
 */
export function mapDishToProduct(dish) {
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

export function createInitialProducts() {
  return Object.values(dishes).map(mapDishToProduct);
}

export const ProductsContext = createContext(null);

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts ต้องถูกเรียกภายใน <ProductsProvider> เท่านั้น");
  }
  return context;
}
