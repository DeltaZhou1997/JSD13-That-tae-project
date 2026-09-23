// ส่วนประกอบฟอร์มข้อมูลผู้ใช้ที่ใช้ร่วมกัน ระหว่างหน้าสมัครสมาชิก (Register.jsx)
// และกล่องเพิ่มสมาชิกของแอดมิน (AddUserModal.jsx) ให้หน้าตาและเงื่อนไขตรงกันเสมอ
import { useState } from "react";
import DatePicker from "./DatePicker.jsx";
import { todayIso } from "../../utils/dateFormatter.js";
import { THAI_PROVINCES } from "../../constants/thaiProvinces.js";
import { BLOOD_TYPES, GENDER_OPTIONS } from "../../utils/userForm.js";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
export const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-0.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" />
  </svg>
);

export const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconEye = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4.5 h-4.5">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const inputBase =
  "w-full bg-white border border-[#e8ddd0] rounded-xl px-3.5 py-2.5 text-sm text-[#3a2012] placeholder-[#b8a898] transition focus:outline-none focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20";
export const labelBase = "block mb-1.5 text-xs font-semibold text-[#5c3820] tracking-wide";
export const sectionCard = "bg-[#fdfaf6] rounded-2xl border border-[#f0e8da] p-5";
const sectionTitle = "flex items-center gap-2 text-sm font-bold text-[#4c1f08] mb-4";

export function SectionHeader({ icon, label }) {
  return (
    <div className={sectionTitle}>
      <span className="flex items-center justify-center w-6 h-6 rounded-full  text-[#8b5e34]">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

export function PasswordInput({ name, value, onChange, placeholder, label, required }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className={labelBase}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${inputBase} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e8070] hover:text-[#4c1f08] transition cursor-pointer"
          tabIndex={-1}
          aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        >
          <IconEye open={show} />
        </button>
      </div>
    </div>
  );
}

/**
 * ช่องกรอกข้อมูลผู้ใช้ทั้งหมด (ข้อมูลส่วนตัว / สุขภาพ / ที่อยู่ / รูปโปรไฟล์ / รหัสผ่าน)
 * extraSection: ใส่ส่วนเพิ่มเติมก่อนรหัสผ่าน (เช่น สิทธิ์และระดับสมาชิกของแอดมิน)
 */
export function UserFormFields({ formData, onChange, avatarPreview, onAvatarChange, extraSection = null }) {
  return (
    <>
      {/* ── ส่วนที่ 1: ข้อมูลส่วนตัว ── */}
      <div className={sectionCard}>
        <SectionHeader icon={<IconUser />} label="ข้อมูลส่วนตัว" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelBase}>
              ชื่อจริง <span className="text-red-500">*</span>
            </label>
            <input type="text" name="firstName" required value={formData.firstName} onChange={onChange} placeholder="เช่น สมชาย" className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input type="text" name="lastName" required value={formData.lastName} onChange={onChange} placeholder="เช่น ใจดี" className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input type="email" name="email" required value={formData.email} onChange={onChange} placeholder="example@email.com" className={inputBase} autoComplete="email" />
          </div>
          <div>
            <label className={labelBase}>
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input type="tel" name="phone" required value={formData.phone} onChange={onChange} placeholder="0812345678" maxLength={10} className={inputBase} />
          </div>
        </div>
      </div>

      {/* ── ส่วนที่ 2: ข้อมูลสุขภาพ ── */}
      <div className={sectionCard}>
        <SectionHeader icon={<IconHeart />} label="ข้อมูลสุขภาพเบื้องต้น" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className={labelBase}>วันเกิด</label>
            <DatePicker name="birthDate" value={formData.birthDate} onChange={onChange} max={todayIso()} className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>เพศ</label>
            <select name="gender" value={formData.gender} onChange={onChange} className={inputBase}>
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelBase}>หมู่เลือด</label>
            <select name="bloodType" value={formData.bloodType} onChange={onChange} className={inputBase}>
              {BLOOD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#9e8070] flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" />
          </svg>
          ธาตุเจ้าเรือนจะถูกคำนวณจากแบบทดสอบสั้นๆ หลังสมัครสมาชิก
        </p>
      </div>

      {/* ── ส่วนที่ 3: ที่อยู่จัดส่ง ── */}
      <div className={sectionCard}>
        <SectionHeader icon={<IconLocation />} label="ที่อยู่จัดส่ง" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className={labelBase}>บ้านเลขที่ / ถนน / ซอย</label>
            <input type="text" name="street" value={formData.street} onChange={onChange} placeholder="เช่น 123/45 หมู่ 6 ถ.สุขุมวิท" className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>ตำบล / แขวง</label>
            <input type="text" name="subdistrict" value={formData.subdistrict} onChange={onChange} placeholder="เช่น คลองเตย" className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>อำเภอ / เขต</label>
            <input type="text" name="district" value={formData.district} onChange={onChange} placeholder="เช่น คลองเตย" className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>จังหวัด</label>
            <select name="province" value={formData.province} onChange={onChange} className={inputBase}>
              <option value="">-- เลือกจังหวัด --</option>
              {THAI_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelBase}>รหัสไปรษณีย์</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={onChange} placeholder="เช่น 10110" maxLength={5} inputMode="numeric" pattern="[0-9]{5}" className={inputBase} />
          </div>
        </div>
      </div>

      {/* ── รูปโปรไฟล์ (ไม่บังคับ) ── */}
      <div className={sectionCard}>
        <SectionHeader icon={<IconUser />} label="รูปโปรไฟล์ (ไม่บังคับ)" />
        <div className="flex items-center gap-4">
          <img src={avatarPreview} alt="ตัวอย่างรูปโปรไฟล์" className="h-20 w-20 rounded-full border-2 border-[#e8ddd0] bg-[#eadfd4] object-cover" />
          <div className="min-w-0 flex-1">
            <label className="inline-flex cursor-pointer items-center rounded-full bg-[#f1e4d5] px-4 py-2 text-sm font-bold text-[#4c1f08] transition hover:bg-[#e6d2bc]">
              เลือกรูปภาพ
              <input type="file" accept="image/*" onChange={onAvatarChange} className="sr-only" />
            </label>
            <p className="mt-2 text-xs text-[#9e8070]">รองรับ JPG, PNG หรือ WebP หากไม่เลือก ระบบจะใช้รูป no-face อัตโนมัติ</p>
          </div>
        </div>
      </div>

      {extraSection}

      {/* ── ส่วนที่ 4: รหัสผ่าน ── */}
      <div className={sectionCard}>
        <SectionHeader icon={<IconLock />} label="รหัสผ่าน" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <PasswordInput name="password" value={formData.password} onChange={onChange} placeholder="อย่างน้อย 6 ตัวอักษร" label="รหัสผ่าน" required />
          <PasswordInput name="confirmPassword" value={formData.confirmPassword} onChange={onChange} placeholder="กรอกรหัสผ่านอีกครั้ง" label="ยืนยันรหัสผ่าน" required />
        </div>
      </div>
    </>
  );
}
