import { useMemo, useState } from "react";

const collator = new Intl.Collator("th", { numeric: true, sensitivity: "base" });

function compare(a, b) {
  const emptyA = a === null || a === undefined || a === "";
  const emptyB = b === null || b === undefined || b === "";
  if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1; // ค่าว่างไว้ท้ายเสมอ
  if (typeof a === "number" && typeof b === "number") return a - b;
  return collator.compare(String(a), String(b));
}

/**
 * เรียงข้อมูลตารางตามคอลัมน์ — กดหัวคอลัมน์วน: น้อย→มาก → มาก→น้อย → ลำดับเดิม
 * @param {Array} items
 * @param {Record<string, (item) => string|number>} getters ค่าที่ใช้เรียงของแต่ละคอลัมน์
 */
export default function useTableSort(items, getters) {
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const sorted = useMemo(() => {
    const get = sort.key && getters[sort.key];
    if (!get) return items;
    const factor = sort.dir === "asc" ? 1 : -1;
    // sort แบบคงลำดับเดิมเมื่อค่าเท่ากัน
    return items
      .map((item, index) => ({ item, index, value: get(item) }))
      .sort((x, y) => {
        const bothPresent = ![x.value, y.value].some((v) => v === null || v === undefined || v === "");
        const c = compare(x.value, y.value);
        return (bothPresent ? c * factor : c) || x.index - y.index;
      })
      .map((x) => x.item);
    // getters เป็น object ที่สร้างใหม่ทุก render — ใช้ key เป็นตัวกำหนดแทน
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, sort.key, sort.dir]);

  const toggleSort = (key) =>
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" };
    });

  // ตั้งค่าการเรียงโดยตรง (เช่น จาก dropdown) — key = null คือกลับลำดับเดิม
  const setSortBy = (key, dir = "asc") => setSort({ key: key || null, dir });

  return { sorted, sortKey: sort.key, sortDir: sort.dir, toggleSort, setSortBy };
}
