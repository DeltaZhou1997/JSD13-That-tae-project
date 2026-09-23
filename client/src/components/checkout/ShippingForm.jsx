import React from "react";
import { THAI_PROVINCES } from "../../constants/thaiProvinces";

const DELIVERY_SCHEDULES = [
  { day: "SUN", date: "12", month: "พ.ย." },
  { day: "SUN", date: "19", month: "พ.ย." },
  { day: "SUN", date: "26", month: "พ.ย." },
];

const ADDRESS_LABELS = ["บ้าน", "ที่ทำงาน", "อื่น ๆ"];

export const NEW_ADDRESS_ID = "new";

const inputClass = (hasError) =>
  `w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-[#2f2119] placeholder-[#b8a898] transition focus:outline-none focus:ring-2 focus:ring-[#8d593a]/30 focus:border-[#8d593a] ${
    hasError ? "border-red-400" : "border-[#e8dfd1]"
  }`;
const labelClass = "block text-xs font-semibold text-[#6f675f] mb-1";

function Field({ label, error, required, className = "", children }) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionTitle({ step, children }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#3d2c2e] text-[11px] font-bold text-white">
        {step}
      </span>
      <h3 className="text-sm font-bold text-[#3d2c2e]">{children}</h3>
    </div>
  );
}

const formatAddress = (a) =>
  [a.address, a.subdistrict && `ต.${a.subdistrict}`, a.district && `อ.${a.district}`, a.province, a.zipcode]
    .filter(Boolean)
    .join(" ");

/**
 * ฟอร์มจัดส่ง — ผู้รับ (ชื่อ/นามสกุลแยกช่อง) + เลือกที่อยู่จากสมุดที่อยู่ หรือกรอกที่อยู่ใหม่ + รอบรับสินค้า
 */
export default function ShippingForm({
  formData,
  onChange,
  onDateChange,
  errors = {},
  addressBook = [],
  selectedAddressId,
  onSelectAddress,
  saveNewAddress,
  onToggleSaveNewAddress,
  newAddressLabel,
  onNewAddressLabelChange,
  loadingAddresses = false,
}) {
  const isNewAddress = selectedAddressId === NEW_ADDRESS_ID || addressBook.length === 0;

  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3d2c2e] text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
            <circle cx="7" cy="17.5" r="1.8" />
            <circle cx="17.5" cy="17.5" r="1.8" />
          </svg>
        </span>
        <h2 className="text-xl font-bold text-[#3d2c2e]">ข้อมูลการจัดส่ง</h2>
      </div>

      {/* 1. ผู้รับ */}
      <SectionTitle step="1">ผู้รับสินค้า</SectionTitle>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="ชื่อ" required error={errors.firstName}>
          <input type="text" name="firstName" value={formData.firstName} onChange={onChange} placeholder="เช่น สมชาย" autoComplete="given-name" className={inputClass(errors.firstName)} />
        </Field>
        <Field label="นามสกุล" required error={errors.lastName}>
          <input type="text" name="lastName" value={formData.lastName} onChange={onChange} placeholder="เช่น ใจดี" autoComplete="family-name" className={inputClass(errors.lastName)} />
        </Field>
        <Field label="เบอร์โทรศัพท์" required error={errors.phone}>
          <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="0812345678" maxLength={10} inputMode="tel" autoComplete="tel" className={inputClass(errors.phone)} />
        </Field>
      </div>

      {/* 2. ที่อยู่ */}
      <div className="mt-6 border-t border-[#e8dfd1] pt-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <SectionTitle step="2">ที่อยู่จัดส่ง</SectionTitle>
          {addressBook.length > 0 && (
            <a href="/profile" className="-mt-3 text-xs font-bold text-[#8d593a] hover:underline">
              จัดการสมุดที่อยู่
            </a>
          )}
        </div>

        {loadingAddresses ? (
          <p className="text-xs text-[#7a6b63]">กำลังโหลดสมุดที่อยู่...</p>
        ) : (
          addressBook.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="เลือกที่อยู่จัดส่ง">
              {addressBook.map((a) => {
                const active = String(selectedAddressId) === String(a._id);
                return (
                  <button
                    key={a._id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelectAddress(String(a._id))}
                    className={`relative cursor-pointer rounded-2xl border-2 p-3.5 text-left transition-all duration-200 active:scale-[.98] ${
                      active
                        ? "border-[#3d2c2e] bg-white shadow-md"
                        : "border-[#e8dfd1] bg-white/60 hover:border-[#c9b6a4] hover:bg-white"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${active ? "border-[#3d2c2e]" : "border-[#c9b6a4]"}`}>
                        {active && <span className="h-2 w-2 rounded-full bg-[#3d2c2e]" />}
                      </span>
                      <span className="text-sm font-bold text-[#3d2c2e]">{a.label || "ที่อยู่"}</span>
                      {a.isDefault && (
                        <span className="rounded-full bg-[#f1e4d5] px-2 py-0.5 text-[10px] font-bold text-[#8d593a]">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 pl-6 text-xs leading-relaxed text-[#6f675f]">{formatAddress(a)}</p>
                    {a.phone && <p className="mt-0.5 pl-6 text-[11px] text-[#9e8f85]">โทร {a.phone}</p>}
                  </button>
                );
              })}

              <button
                type="button"
                role="radio"
                aria-checked={isNewAddress}
                onClick={() => onSelectAddress(NEW_ADDRESS_ID)}
                className={`flex min-h-[84px] cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3.5 text-sm font-bold transition-all duration-200 active:scale-[.98] ${
                  isNewAddress
                    ? "border-[#3d2c2e] bg-white text-[#3d2c2e]"
                    : "border-[#d9cbbd] text-[#8d593a] hover:border-[#8d593a] hover:bg-white/70"
                }`}
              >
                <span className="text-lg leading-none">+</span>
                ใช้ที่อยู่ใหม่
              </button>
            </div>
          )
        )}

        {/* กรอกที่อยู่ใหม่ */}
        {isNewAddress && !loadingAddresses && (
          <div className={`grid grid-cols-1 gap-3.5 sm:grid-cols-2 ${addressBook.length > 0 ? "mt-4 rounded-2xl border border-[#e8dfd1] bg-white/60 p-4" : ""}`}>
            <Field label="บ้านเลขที่ / หมู่บ้าน / ถนน / ซอย" required error={errors.address} className="sm:col-span-2">
              <textarea name="address" rows="2" value={formData.address} onChange={onChange} placeholder="เช่น 123/45 หมู่ 6 ถ.สุขุมวิท" className={inputClass(errors.address)} />
            </Field>
            <Field label="ตำบล / แขวง" required error={errors.subdistrict}>
              <input type="text" name="subdistrict" value={formData.subdistrict} onChange={onChange} placeholder="เช่น คลองเตย" className={inputClass(errors.subdistrict)} />
            </Field>
            <Field label="อำเภอ / เขต" required error={errors.district}>
              <input type="text" name="district" value={formData.district} onChange={onChange} placeholder="เช่น คลองเตย" className={inputClass(errors.district)} />
            </Field>
            <Field label="จังหวัด" required error={errors.province}>
              <select name="province" value={formData.province} onChange={onChange} className={inputClass(errors.province)}>
                <option value="">-- เลือกจังหวัด --</option>
                {THAI_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="รหัสไปรษณีย์" required error={errors.zipcode}>
              <input type="text" name="zipcode" value={formData.zipcode} onChange={onChange} placeholder="เช่น 10110" maxLength={5} inputMode="numeric" className={inputClass(errors.zipcode)} />
            </Field>

            {/* บันทึกลงสมุดที่อยู่ */}
            <div className="sm:col-span-2 rounded-xl bg-[#f7efe6] p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#3d2c2e]">
                <input type="checkbox" checked={saveNewAddress} onChange={(e) => onToggleSaveNewAddress(e.target.checked)} className="h-4 w-4 accent-[#3d2c2e]" />
                บันทึกที่อยู่นี้ลงสมุดที่อยู่
                {addressBook.length === 0 && <span className="text-xs font-normal text-[#8d593a]">(ตั้งเป็นค่าเริ่มต้น)</span>}
              </label>
              {saveNewAddress && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-6">
                  <span className="text-xs text-[#6f675f]">ตั้งชื่อ:</span>
                  {ADDRESS_LABELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => onNewAddressLabelChange(l)}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition ${
                        newAddressLabel === l
                          ? "border-[#3d2c2e] bg-[#3d2c2e] text-white"
                          : "border-[#d9cbbd] bg-white text-[#6f675f] hover:border-[#8d593a]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. รอบรับสินค้า */}
      <div className="mt-6 border-t border-[#e8dfd1] pt-5">
        <SectionTitle step="3">เลือกรอบรับสินค้า (จัดส่งทุกวันอาทิตย์)</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {DELIVERY_SCHEDULES.map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => onDateChange(item.date)}
              className={`cursor-pointer rounded-2xl border p-3 text-center transition-all active:scale-[.97] ${
                formData.deliveryDate === item.date
                  ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
                  : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
              }`}
            >
              <div className="text-[10px] opacity-80">{item.day}</div>
              <div className="text-xl font-bold">{item.date}</div>
              <div className="text-[10px] opacity-80">{item.month}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
