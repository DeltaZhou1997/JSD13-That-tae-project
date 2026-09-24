import { useCallback, useEffect, useMemo, useState } from "react";

import {
  IngredientsContext,
  isLowStock,
  normalizeIngredient,
} from "./IngredientsContext.js";
import { createTempObjectId } from "../utils/objectId.js";
import { getAuthHeaders, getApiUrl } from "../utils/authHeader.js";

export default function IngredientsProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const apiUrl = getApiUrl();

  // โหลดวัตถุดิบจาก DB (เรียกซ้ำได้ทุกครั้งที่เปลี่ยนหน้า)
  const refreshIngredients = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v2/ingredients`);
      if (res.ok) {
        const json = await res.json();
        const items = Array.isArray(json) ? json : json.data || [];
        // ซิงก์กับ DB เสมอ แม้ว่างเปล่า
        setIngredients(items.map(normalizeIngredient));
      }
    } catch (err) {
      console.warn("⚠️ ไม่สามารถโหลดวัตถุดิบจากเซิร์ฟเวอร์:", err.message);
    }
  }, [apiUrl]);

  useEffect(() => {
    refreshIngredients();
  }, [refreshIngredients]);

  const getIngredientById = useCallback(
    (id) => ingredients.find((item) => item._id === id),
    [ingredients],
  );

  const addIngredient = useCallback(
    async (data) => {
      const created = normalizeIngredient({ ...data, _id: createTempObjectId() });
      setIngredients((prev) => [...prev, created]);
      try {
        const res = await fetch(`${apiUrl}/api/v2/ingredients`, {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (res.ok && json?.data?._id && json.data._id !== created._id) {
          setIngredients((prev) =>
            prev.map((item) =>
              item._id === created._id ? normalizeIngredient(json.data) : item,
            ),
          );
          return normalizeIngredient(json.data);
        }
      } catch (err) {
        console.warn("Offline addIngredient:", err.message);
      }
      return created;
    },
    [apiUrl],
  );

  const updateIngredient = useCallback(
    // คืนผลจาก Server: { ok, message, unitChange } — ถ้าบันทึกไม่สำเร็จจะคืนค่าเดิมบนหน้าจอ
    async (id, data) => {
      let previousItem = null;
      setIngredients((prev) =>
        prev.map((item) => {
          if (item._id !== id) return item;
          previousItem = item;
          return normalizeIngredient({ ...item, ...data, _id: id });
        }),
      );
      const rollback = () => {
        if (previousItem) {
          setIngredients((prev) => prev.map((item) => (item._id === id ? previousItem : item)));
        }
      };
      try {
        const res = await fetch(`${apiUrl}/api/v2/ingredients/${id}`, {
          method: "PUT",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          rollback();
          return { ok: false, message: json.message || `บันทึกไม่สำเร็จ (HTTP ${res.status})` };
        }
        if (json.data) {
          setIngredients((prev) =>
            prev.map((item) => (item._id === id ? normalizeIngredient(json.data) : item)),
          );
        }
        return { ok: true, message: json.message, unitChange: json.unitChange || null };
      } catch (err) {
        rollback();
        return { ok: false, message: `เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: ${err.message}` };
      }
    },
    [apiUrl],
  );

  const updateStock = useCallback(
    async (id, currentStockGrams) => {
      const stock = Number(currentStockGrams);
      setIngredients((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, currentStockGrams: stock } : item,
        ),
      );
      try {
        await fetch(`${apiUrl}/api/v2/ingredients/${id}/stock`, {
          method: "PATCH",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ currentStockGrams: stock }),
        });
      } catch (err) {
        console.warn("Offline updateStock:", err.message);
      }
    },
    [apiUrl],
  );

  const deleteIngredient = useCallback(
    async (id) => {
      setIngredients((prev) => prev.filter((item) => item._id !== id));
      try {
        await fetch(`${apiUrl}/api/v2/ingredients/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
      } catch (err) {
        console.warn("Offline deleteIngredient:", err.message);
      }
    },
    [apiUrl],
  );

  const lowStockCount = useMemo(
    () => ingredients.filter(isLowStock).length,
    [ingredients],
  );

  const value = useMemo(
    () => ({
      ingredients,
      lowStockCount,
      getIngredientById,
      addIngredient,
      updateIngredient,
      updateStock,
      deleteIngredient,
      refreshIngredients,
    }),
    [
      refreshIngredients,
      ingredients,
      lowStockCount,
      getIngredientById,
      addIngredient,
      updateIngredient,
      updateStock,
      deleteIngredient,
    ],
  );

  return (
    <IngredientsContext.Provider value={value}>
      {children}
    </IngredientsContext.Provider>
  );
}
