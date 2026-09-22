import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  CATEGORY_MAP,
  isLowStock,
  useIngredients,
} from "../../context/IngredientsContext.js";
import useToast from "../../hooks/useToast.js";

const PAGE_SIZE = 20;

const inputClass =
  "rounded border border-[#f1ead7] p-2 focus:border-[#4c1f08] focus:outline-none focus:ring-2 focus:ring-[#f1ead7]";

function AdminIngredientList() {
  const { ingredients, lowStockCount, updateStock, deleteIngredient } =
    useIngredients();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients.filter((item) => {
      if (category && item.category !== category) return false;
      if (onlyLowStock && !isLowStock(item)) return false;
      if (!q) return true;
      return (
        (item.nameTh && item.nameTh.toLowerCase().includes(q)) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(q))
      );
    });
  }, [ingredients, search, category, onlyLowStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleConfirmDelete = (item) => {
    deleteIngredient(item._id);
    setPendingDeleteId(null);
    toast.success(`ลบ "${item.nameTh}" ออกจากคลังแล้ว`);
  };

  const handleStockChange = (id, value) => {
    const stock = Number(value);
    if (value === "" || Number.isNaN(stock) || stock < 0) return;
    updateStock(id, Math.floor(stock));
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4c1f08]">คลังวัตถุดิบ (Admin)</h1>
          <p className="mt-1 text-sm text-[#6b3215]">
            ทั้งหมด {ingredients.length} ชนิด
            {lowStockCount > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700">
                ใกล้หมด {lowStockCount} ชนิด
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/recipe-builder"
            className="rounded-lg border border-[#4c1f08] px-4 py-2 font-medium text-[#4c1f08] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f1ead7]"
          >
            ออกแบบสูตรอาหาร
          </Link>
          <Link
            to="/admin/ingredients/new"
            className="rounded-lg bg-[#4c1f08] px-4 py-2 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
          >
            + เพิ่มวัตถุดิบ
          </Link>
        </div>
      </div>

      
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => resetPage(setSearch)(event.target.value)}
          placeholder="ค้นหาชื่อวัตถุดิบ เช่น กระเทียม"
          className={`${inputClass} min-w-[220px] flex-1`}
        />
        <select
          value={category}
          onChange={(event) => resetPage(setCategory)(event.target.value)}
          className={inputClass}
        >
          <option value="">ทุกหมวดหมู่</option>
          {Object.entries(CATEGORY_MAP).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-[#6b3215]">
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={(event) => resetPage(setOnlyLowStock)(event.target.checked)}
          />
          แสดงเฉพาะที่ใกล้หมด
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#f1ead7] bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#f1ead7] bg-[#f1ead7] text-[#4c1f08]">
              <th className="p-3">ชื่อวัตถุดิบ</th>
              <th className="p-3">หมวดหมู่</th>
              <th className="p-3">รสยา</th>
              <th className="p-3">ธาตุ</th>
              <th className="p-3">แคลอรี/100g</th>
              <th className="p-3">สต็อก (กรัม)</th>
              <th className="p-3 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-[#6b3215]">
                  ไม่พบวัตถุดิบที่ตรงกับเงื่อนไข
                </td>
              </tr>
            ) : (
              pageItems.map((item) => {
                const low = isLowStock(item);
                return (
                  <tr
                    key={item._id}
                    className={`border-b border-[#f1ead7] transition-colors ${
                      low ? "bg-red-50 hover:bg-red-100" : "hover:bg-[#fff8f5]"
                    }`}
                  >
                    <td className="p-3 font-medium text-[#4c1f08]">
                      {item.nameTh}
                      {low && (
                        <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 text-xs text-white">
                          ใกล้หมด
                        </span>
                      )}
                      {item.nameEn && (
                        <span className="block text-xs font-normal text-[#6b3215]">
                          {item.nameEn}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#6b3215]">{item.categoryTh}</td>
                    <td className="p-3 text-[#6b3215]">{item.medicinalTaste || "-"}</td>
                    <td className="p-3 text-[#6b3215]">
                      {(item.elements || []).join(", ") || "-"}
                    </td>
                    <td className="p-3 text-[#6b3215]">
                      {item.nutrientsPer100g?.calories ?? 0}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={item.currentStockGrams}
                        onBlur={(event) => handleStockChange(item._id, event.target.value)}
                        className={`w-24 ${inputClass}`}
                      />
                      <span className="block text-xs text-[#6b3215]">
                        เตือนที่ {item.lowStockThresholdGrams}
                      </span>
                    </td>
                    <td className="p-3">
                      {pendingDeleteId === item._id ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm text-red-600">
                            ยืนยันลบ &quot;{item.nameTh}&quot;?
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirmDelete(item)}
                              className="cursor-pointer rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                            >
                              ยืนยันลบ
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="cursor-pointer rounded bg-gray-300 px-3 py-1 text-sm text-gray-800 transition hover:bg-gray-400"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/ingredients/edit/${item._id}`}
                            className="rounded bg-[#4c1f08] px-3 py-1 text-sm text-white transition hover:bg-[#6b3215]"
                          >
                            แก้ไข
                          </Link>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(item._id)}
                            className="cursor-pointer rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6b3215]">
        <span>
          แสดง {pageItems.length} จาก {filtered.length} รายการ
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="cursor-pointer rounded border border-[#f1ead7] px-3 py-1 transition hover:bg-[#f1ead7] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="cursor-pointer rounded border border-[#f1ead7] px-3 py-1 transition hover:bg-[#f1ead7] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminIngredientList;
