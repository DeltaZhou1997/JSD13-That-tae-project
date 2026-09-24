import { useEffect, useMemo, useRef, useState } from "react";

const idOf = (ing) => ing?._id || ing?.id || "";
const normalize = (s) => String(s || "").toLowerCase().replace(/\s+/g, "");

// สต็อกที่ใช้แสดง: ถ้าระบุภาค ใช้สต็อกของภาคนั้น (เมนูตัดสต็อกจากภาคของเมนู) ไม่งั้นใช้สต็อกรวม
const stockOf = (ing, stockRegion) =>
  Number(stockRegion ? ing.regionalStocks?.[stockRegion] ?? 0 : ing.stockQuantity ?? ing.currentStockGrams ?? 0);

const formatIngredientOption = (ing, stockRegion, stockRegionLabel) =>
  stockRegion
    ? `${ing.nameTh} — คงเหลือ${stockRegionLabel ? ` (${stockRegionLabel})` : ""} ${stockOf(ing, stockRegion).toLocaleString()} ${ing.unit || "g"}`
    : `${ing.nameTh} (${ing.regionNameTh || "ทั่วไป"}) — คงเหลือ ${stockOf(ing).toLocaleString()} ${ing.unit || "g"}`;

// ไฮไลต์ส่วนที่ตรงกับคำค้น (เทียบแบบไม่สนตัวพิมพ์เล็ก-ใหญ่)
function Highlight({ text, query }) {
  const q = String(query || "").trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-200/80 px-0.5 text-[#4c1f08]">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/**
 * ช่องเลือกวัตถุดิบแบบพิมพ์ค้นหาได้ (combobox)
 * - พิมพ์ค้นหาจากชื่อไทย / ชื่ออังกฤษ / หมวด / ภาค
 * - ↑ ↓ เลื่อน, Enter เลือก, Esc ปิด
 * - stockRegion (north/northeast/central/south): แสดงเฉพาะวัตถุดิบที่มีสต็อกในภาคนั้น (อาหารภาคไหนใช้วัตถุดิบภาคนั้น)
 */
export default function IngredientCombobox({
  ingredients = [],
  value,
  onChange,
  loading = false,
  stockRegion = "",
  stockRegionLabel = "",
  placeholder = "พิมพ์ชื่อวัตถุดิบเพื่อค้นหา...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);


  // เฉพาะวัตถุดิบที่มีสต็อกในภาคของเมนู
  const sorted = useMemo(
    () => (stockRegion ? ingredients.filter((ing) => stockOf(ing, stockRegion) > 0) : ingredients),
    [ingredients, stockRegion],
  );

  // ตัวที่เลือกอยู่ต้องอยู่ในภาคนี้ด้วย (เปลี่ยนภาคแล้วตัวเดิมไม่มี → ล้างการเลือก)
  const selected = useMemo(() => sorted.find((i) => idOf(i) === value) || null, [sorted, value]);
  useEffect(() => {
    if (value && !selected && !loading) onChange(sorted[0] ? idOf(sorted[0]) : "");
  }, [value, selected, sorted, loading, onChange]);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return sorted;
    return sorted.filter((ing) =>
      [ing.nameTh, ing.nameEn, ing.categoryTh, ing.regionNameTh].some((field) => normalize(field).includes(q)),
    );
  }, [sorted, query]);

  // ปิดเมื่อคลิกนอกกล่อง
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // เลื่อนรายการให้เห็นตัวที่ไฮไลต์อยู่
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setQuery("");
    const idx = sorted.findIndex((i) => idOf(i) === value);
    setActive(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  const choose = (ing) => {
    if (!ing) return;
    onChange(idOf(ing));
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      openList();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-lg border border-[#d9cbbd] bg-[#faf7f2] p-2 text-xs text-[#7a5c4d]">กำลังโหลดวัตถุดิบ...</div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a08b7d]" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={open ? query : selected ? formatIngredientOption(selected, stockRegion, stockRegionLabel) : ""}
          placeholder={selected && open ? formatIngredientOption(selected, stockRegion, stockRegionLabel) : placeholder}
          onFocus={openList}
          onClick={() => !open && openList()}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-[#d9cbbd] bg-white py-2 pl-8 pr-8 text-xs text-[#4c1f08] placeholder:text-[#a08b7d] focus:border-[#4c1f08] focus:outline-none focus:ring-2 focus:ring-[#f1ead7]"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a5c4d] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#d9cbbd] bg-white py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2.5 text-xs text-[#7a5c4d]">
              {query
                ? `ไม่พบวัตถุดิบที่ตรงกับ "${query}"${stockRegionLabel ? ` ใน${stockRegionLabel}` : ""}`
                : `ยังไม่มีวัตถุดิบที่มีสต็อกใน${stockRegionLabel || "ภาคนี้"}`}
            </li>
          ) : (
            results.map((ing, idx) => {
              const isActive = idx === active;
              const isSelected = idOf(ing) === value;
              const stock = stockOf(ing, stockRegion);
              const outOfStock = stock <= 0;
              return (
                <li
                  key={idOf(ing)}
                  data-index={idx}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // กัน input blur ก่อนเลือก
                    choose(ing);
                  }}
                  className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-xs ${
                    isActive ? "bg-[#f6ede5]" : ""
                  } ${isSelected ? "font-bold text-[#4c1f08]" : "text-[#3b2a1a]"}`}
                >
                  <span className="min-w-0 truncate">
                    <Highlight text={ing.nameTh} query={query} />
                    {ing.nameEn && ing.nameEn !== ing.nameTh && (
                      <span className="ml-1 text-[10px] text-[#a08b7d]">
                        <Highlight text={ing.nameEn} query={query} />
                      </span>
                    )}
                    {!stockRegion && <span className="ml-1 text-[10px] text-[#7a5c4d]">({ing.regionNameTh || "ทั่วไป"})</span>}
                  </span>
                  <span className={`shrink-0 text-[10px] ${outOfStock ? "font-bold text-red-600" : "text-[#7a5c4d]"}`}>
                    {outOfStock ? "หมด" : `${stock.toLocaleString()} ${ing.unit || "g"}`}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
