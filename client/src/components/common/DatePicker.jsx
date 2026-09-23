import { useState, useRef, useEffect, useMemo } from "react";

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

// แปลง YYYY-MM-DD -> DD/MM/YYYY
function isoToDmy(iso) {
  if (!iso || typeof iso !== "string") return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  if (!y || !m || !d) return "";
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

// แปลง DD/MM/YYYY -> YYYY-MM-DD
function dmyToIso(dmy) {
  if (!dmy || typeof dmy !== "string") return "";
  const cleaned = dmy.replace(/[^\d/]/g, "");
  const parts = cleaned.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  if (!d || !m || !y || y.length < 4) return "";
  const dayNum = parseInt(d, 10);
  const monthNum = parseInt(m, 10);
  const yearNum = parseInt(y, 10);
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1000) return "";
  return `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
}

/**
 * DatePicker component มาตรฐาน DD/MM/YYYY (คริสต์ศักราช ค.ศ.)
 * - แสดงผลในช่องเป็น DD/MM/YYYY เสมอในทุกเบราว์เซอร์
 * - มี Calendar Picker Popup ให้คลิกเลือกวัน เดือน ปี ได้สะดวก
 * - ซิงค์ค่าไปให้ฟอร์มเป็น YYYY-MM-DD (ISO format) ตามมาตรฐาน Database
 */
export default function DatePicker({
  id,
  name,
  value = "",
  onChange,
  min,
  max,
  placeholder = "DD/MM/YYYY",
  className = "",
  disabled = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(() => isoToDmy(value));
  const containerRef = useRef(null);

  // คำนวณเดือนและปีที่แสดงในปฏิทิน
  const initialDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }, [value]);

  const [viewYear, setViewYear] = useState(() => initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => initialDate.getMonth());

  // ซิงค์ inputText เมื่อ value ภายนอกเปลี่ยน
  useEffect(() => {
    setInputText(isoToDmy(value));
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split("-").map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  // ปิดปฏิทินเมื่อคลิกนอก component
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // จัดการการพิมพ์ใน input ด้วย format masking DD/MM/YYYY
  const handleInputChange = (e) => {
    let input = e.target.value.replace(/[^\d]/g, ""); // รับเฉพาะตัวเลข
    if (input.length > 8) input = input.slice(0, 8);

    let formatted = "";
    if (input.length > 0) {
      formatted += input.slice(0, 2);
    }
    if (input.length >= 3) {
      formatted += "/" + input.slice(2, 4);
    }
    if (input.length >= 5) {
      formatted += "/" + input.slice(4, 8);
    }

    setInputText(formatted);

    // หากพิมพ์ครบ 8 ตัวเลข ตรวจสอบความถูกต้องและส่งค่า YYYY-MM-DD กลับ
    if (input.length === 8) {
      const iso = dmyToIso(formatted);
      if (iso) {
        if (min && iso < min) return;
        if (max && iso > max) return;
        onChange?.({ target: { name, value: iso } });
      }
    } else if (input.length === 0) {
      onChange?.({ target: { name, value: "" } });
    }
  };

  const handleInputBlur = () => {
    // เมื่อ blur ถ้าค่าไม่สมบูรณ์ให้คืนกลับตาม value เดิม
    if (inputText && !dmyToIso(inputText)) {
      setInputText(isoToDmy(value));
    }
  };

  // เลือกวันจากปฏิทิน
  const handleSelectDay = (day) => {
    const selectedIso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (min && selectedIso < min) return;
    if (max && selectedIso > max) return;

    setInputText(isoToDmy(selectedIso));
    onChange?.({ target: { name, value: selectedIso } });
    setIsOpen(false);
  };

  // ปุ่มเลือก "วันนี้"
  const handleSelectToday = () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (min && iso < min) return;
    if (max && iso > max) return;
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setInputText(isoToDmy(iso));
    onChange?.({ target: { name, value: iso } });
    setIsOpen(false);
  };

  // ปุ่มล้างค่า
  const handleClear = () => {
    setInputText("");
    onChange?.({ target: { name, value: "" } });
    setIsOpen(false);
  };

  // คำนวณวันในเดือนที่เลือก
  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay(); // 0 = อาทิตย์, 1 = จันทร์ ...
  }, [viewYear, viewMonth]);

  // รายการปีให้เลือก (เช่น 1925 ถึง 2035)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1920;
    const endYear = currentYear + 15;
    const years = [];
    for (let y = endYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          name={name}
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onClick={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${className} pr-10 tracking-wide font-medium cursor-pointer`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8d593a] hover:text-[#4c1f08] transition-colors cursor-pointer rounded-lg hover:bg-stone-100"
          title="เปิดปฏิทินเลือกวันที่ (DD/MM/YYYY)"
          tabIndex={-1}
          aria-label="เลือกวันที่"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* Calendar Dropdown Popup */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-2xl border border-[#e8ded4] bg-white p-3.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          {/* Header เดือน/ปี & ลูกศร */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg text-stone-500 hover:text-[#4c1f08] hover:bg-stone-100 transition-colors"
              title="เดือนก่อนหน้า"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-bold text-[#4c1f08] bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4c1f08] cursor-pointer"
              >
                {THAI_MONTHS.map((mName, idx) => (
                  <option key={mName} value={idx}>
                    {mName}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-bold text-[#4c1f08] bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4c1f08] cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg text-stone-500 hover:text-[#4c1f08] hover:bg-stone-100 transition-colors"
              title="เดือนถัดไป"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* แถบหัววันในสัปดาห์ */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((wd, i) => (
              <span
                key={wd}
                className={`text-[11px] font-bold ${
                  i === 0 ? "text-rose-500" : i === 6 ? "text-amber-600" : "text-stone-400"
                }`}
              >
                {wd}
              </span>
            ))}
          </div>

          {/* ตารางวันในเดือน */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* ช่องว่างวันก่อนวันที่ 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span key={`empty-${i}`} className="h-7 w-7" />
            ))}

            {/* วันที่ 1 ถึงวันสุดท้ายของเดือน */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateIso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = value === dateIso;
              const isToday = dateIso === todayStr;
              const isDisabled = (min && dateIso < min) || (max && dateIso > max);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !isDisabled && handleSelectDay(day)}
                  disabled={isDisabled}
                  className={`h-7 w-7 text-xs font-semibold rounded-lg flex items-center justify-center transition-all mx-auto ${
                    isSelected
                      ? "bg-[#4c1f08] text-white shadow-sm font-bold"
                      : isToday
                      ? "border border-[#8d593a] text-[#4c1f08] bg-[#f8ede3] font-bold hover:bg-[#f1ead7]"
                      : isDisabled
                      ? "text-stone-300 cursor-not-allowed"
                      : "text-stone-700 hover:bg-[#f1ead7] hover:text-[#4c1f08]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer ปุ่มลัด วันนี้ / ล้างค่า */}
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-stone-400 hover:text-stone-600 transition-colors font-medium px-1.5 py-0.5"
            >
              ล้างค่า
            </button>
            <span className="text-[10px] text-[#8d593a] font-semibold bg-[#f8ede3] px-2 py-0.5 rounded-full border border-[#e8ded4]">
              DD/MM/YYYY (ค.ศ.)
            </span>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[#4c1f08] font-bold hover:underline px-1.5 py-0.5"
            >
              วันนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
