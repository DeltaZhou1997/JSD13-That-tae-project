/**
 * ปุ่มหัวคอลัมน์สำหรับเรียงข้อมูล (ใช้คู่กับ hooks/useTableSort.js)
 * กดวน: น้อย→มาก (▲) → มาก→น้อย (▼) → ลำดับเดิม
 */
export default function SortHeader({ label, sortKey, activeKey, dir, onSort, align = "left", className = "" }) {
  const active = activeKey === sortKey;
  const title = !active ? `เรียงตาม${label} (น้อย → มาก)` : dir === "asc" ? `เรียงตาม${label} (มาก → น้อย)` : "ยกเลิกการเรียง";

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      title={title}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`group inline-flex items-center gap-1 rounded-md px-1 -mx-1 py-0.5 font-semibold transition-colors hover:bg-[#e6dac6] cursor-pointer ${
        align === "right" ? "flex-row-reverse" : ""
      } ${align === "center" ? "justify-center" : ""} ${className}`}
    >
      <span>{label}</span>
      <span className="flex flex-col leading-none" aria-hidden="true">
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 ${active && dir === "asc" ? "text-[#4c1f08]" : "text-[#4c1f08]/25 group-hover:text-[#4c1f08]/50"}`}>
          <path d="M5 0L10 6H0z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 10 6" className={`mt-0.5 h-1.5 w-2.5 ${active && dir === "desc" ? "text-[#4c1f08]" : "text-[#4c1f08]/25 group-hover:text-[#4c1f08]/50"}`}>
          <path d="M5 6L10 0H0z" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
}
