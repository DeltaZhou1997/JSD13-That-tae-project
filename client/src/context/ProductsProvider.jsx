import { useCallback, useEffect, useMemo, useState } from "react";

import { ProductsContext } from "./ProductsContext.js";
import { createTempObjectId } from "../utils/objectId.js";
import { getAuthHeaders, getApiUrl } from "../utils/authHeader.js";
import { resolveImageField } from "../utils/imageUrl.js";

// ชี้ URL รูปจาก GridFS ไปที่ API server ปัจจุบัน (รูปที่อัปตอนรันในเครื่องจะได้ไม่หายบนเว็บจริง)
const normalizeProductImage = (product) => ({
  ...product,
  imageUrl: resolveImageField(product.imageUrl),
});

export default function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = getApiUrl();

  // โหลดสินค้าจาก DB (silent = รีเฟรชเบื้องหลัง ไม่แสดงสถานะกำลังโหลด)
  const refreshProducts = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/v2/products`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.products || data.data || [];
          // Always sync with DB — even if empty (never fall back to mock data)
          setProducts(items.map(normalizeProductImage));
        }
      } catch (err) {
        console.warn("⚠️ ไม่สามารถโหลดสินค้าจากเซิร์ฟเวอร์:", err.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [apiUrl],
  );

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

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
        const res = await fetch(`${apiUrl}/api/v2/products`, {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        const serverProduct = json?.product && normalizeProductImage(json.product);

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
        await fetch(`${apiUrl}/api/v2/products/${id}`, {
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
        await fetch(`${apiUrl}/api/v2/products/${id}`, {
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
      loading,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
    }),
    [products, loading, getProductById, addProduct, updateProduct, deleteProduct, refreshProducts],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
