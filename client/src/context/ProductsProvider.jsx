import { useCallback, useMemo, useState } from "react";

import {
  ProductsContext,
  createInitialProducts,
} from "./ProductsContext.js";

export default function ProductsProvider({ children }) {
  const [products, setProducts] = useState(createInitialProducts);

  const getProductById = useCallback(
    (id) => products.find((product) => product._id === id),
    [products],
  );

  const createNextId = useCallback(() => {
    const maxNumber = products.reduce((max, product) => {
      const current = Number(String(product._id).replace(/\D/g, ""));
      return Number.isNaN(current) ? max : Math.max(max, current);
    }, 0);
    return `dish_${String(maxNumber + 1).padStart(3, "0")}`;
  }, [products]);

  const addProduct = useCallback(
    (data) => {
      const newProduct = { ...data, _id: createNextId() };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    },
    [createNextId],
  );

  const updateProduct = useCallback((id, data) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === id ? { ...product, ...data, _id: id } : product,
      ),
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((product) => product._id !== id));
  }, []);

  const value = useMemo(
    () => ({
      products,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, getProductById, addProduct, updateProduct, deleteProduct],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
