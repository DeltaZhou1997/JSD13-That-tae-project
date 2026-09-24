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

  // เพิ่ม/แก้ไขเมนู — คืน { ok, message, product } ให้หน้าฟอร์มแจ้งผลตามจริง (ไม่บันทึก = ย้อนหน้าจอกลับ)
  const addProduct = useCallback(
    async (data) => {
      const tempId = createTempObjectId();
      setProducts((prev) => [...prev, { ...data, _id: tempId }]);
      try {
        const res = await fetch(`${apiUrl}/api/v2/products`, {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        const serverProduct = json?.product && normalizeProductImage(json.product);
        if (res.ok && serverProduct?._id) {
          setProducts((prev) => prev.map((p) => (p._id === tempId ? serverProduct : p)));
          return { ok: true, product: serverProduct };
        }
        setProducts((prev) => prev.filter((p) => p._id !== tempId));
        return { ok: false, status: res.status, message: json?.message || `บันทึกไม่สำเร็จ (${res.status})` };
      } catch (err) {
        setProducts((prev) => prev.filter((p) => p._id !== tempId));
        return { ok: false, message: `เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: ${err.message}` };
      }
    },
    [apiUrl],
  );

  const updateProduct = useCallback(
    async (id, data) => {
      let previous = null;
      setProducts((prev) =>
        prev.map((product) => {
          if ((product._id || product.id) !== id) return product;
          previous = product;
          return { ...product, ...data, _id: id };
        }),
      );
      const rollback = () =>
        previous && setProducts((prev) => prev.map((p) => ((p._id || p.id) === id ? previous : p)));
      try {
        const res = await fetch(`${apiUrl}/api/v2/products/${id}`, {
          method: "PUT",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          const serverProduct = json?.product && normalizeProductImage(json.product);
          if (serverProduct) setProducts((prev) => prev.map((p) => ((p._id || p.id) === id ? serverProduct : p)));
          return { ok: true, product: serverProduct };
        }
        rollback();
        return { ok: false, status: res.status, message: json?.message || `บันทึกไม่สำเร็จ (${res.status})` };
      } catch (err) {
        rollback();
        return { ok: false, message: `เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: ${err.message}` };
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
