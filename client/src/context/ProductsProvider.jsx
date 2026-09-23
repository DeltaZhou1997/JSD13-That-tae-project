import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ProductsContext,
  createInitialProducts,
} from "./ProductsContext.js";
import { createTempObjectId } from "../utils/objectId.js";
import { getAuthHeaders } from "../utils/authHeader.js";

export default function ProductsProvider({ children }) {
  const [products, setProducts] = useState(createInitialProducts);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const res = await fetch(`${apiUrl}/api/v1/products`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.products || [];
          if (items.length > 0 && isMounted) {
            setProducts(items);
          }
        }
      } catch (err) {
        console.warn("⚠️ เซิร์ฟเวอร์ออฟไลน์ ใช้ mock products เริ่มต้น:", err.message);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const getProductById = useCallback(
    (id) => products.find((product) => product._id === id || product.id === id),
    [products],
  );

  const addProduct = useCallback(
    async (data) => {
      const tempId = createTempObjectId();
      const newProduct = { ...data, _id: tempId };
      setProducts((prev) => [...prev, newProduct]);
      try {
        const res = await fetch(`${apiUrl}/api/v1/products`, {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        const serverProduct = json?.product;

        if (res.ok && serverProduct?._id && serverProduct._id !== tempId) {
          setProducts((prev) =>
            prev.map((product) => (product._id === tempId ? serverProduct : product)),
          );
          return serverProduct;
        }
      } catch (err) {
        console.warn("Offline addProduct:", err.message);
      }
      return newProduct;
    },
    [apiUrl],
  );

  const updateProduct = useCallback(
    async (id, data) => {
      setProducts((prev) =>
        prev.map((product) =>
          (product._id || product.id) === id
            ? { ...product, ...data, _id: id }
            : product,
        ),
      );
      try {
        await fetch(`${apiUrl}/api/v1/products/${id}`, {
          method: "PUT",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn("Offline updateProduct:", err.message);
      }
    },
    [apiUrl],
  );

  const deleteProduct = useCallback(
    async (id) => {
      setProducts((prev) =>
        prev.filter((product) => (product._id || product.id) !== id),
      );
      try {
        await fetch(`${apiUrl}/api/v1/products/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
      } catch (err) {
        console.warn("Offline deleteProduct:", err.message);
      }
    },
    [apiUrl],
  );

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
