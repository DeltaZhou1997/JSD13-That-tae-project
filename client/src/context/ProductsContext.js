import { createContext, useContext } from "react";

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

export const ProductsContext = createContext(null);

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts ต้องถูกเรียกภายใน <ProductsProvider> เท่านั้น");
  }
  return context;
}
