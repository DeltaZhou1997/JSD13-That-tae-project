import { useCallback, useEffect, useMemo, useState } from "react";

import {
  IngredientsContext,
  createInitialIngredients,
  isLowStock,
  normalizeIngredient,
} from "./IngredientsContext.js";
import { createTempObjectId } from "../utils/objectId.js";
import { getAuthHeaders, getApiUrl } from "../utils/authHeader.js";

export default function IngredientsProvider({ children }) {
  const [ingredients, setIngredients] = useState(createInitialIngredients);
  const apiUrl = getApiUrl();

  useEffect(() => {
    let isMounted = true;
    async function loadIngredients() {
      try {
        const res = await fetch(`${apiUrl}/api/v2/ingredients`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json) ? json : json.data || [];
          if (items.length > 0 && isMounted) {
            setIngredients(items.map(normalizeIngredient));
          }
        }
      } catch (err) {
        console.warn("⚠️ เซิร์ฟเวอร์ออฟไลน์ ใช้ mock ingredients เริ่มต้น:", err.message);
      }
    }
    loadIngredients();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

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
    async (id, data) => {
      setIngredients((prev) =>
        prev.map((item) =>
          item._id === id ? normalizeIngredient({ ...item, ...data, _id: id }) : item,
        ),
      );
      try {
        await fetch(`${apiUrl}/api/v2/ingredients/${id}`, {
          method: "PUT",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn("Offline updateIngredient:", err.message);
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
    }),
    [
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
