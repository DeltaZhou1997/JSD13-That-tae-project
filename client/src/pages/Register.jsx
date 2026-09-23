import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";
import { getApiUrl } from "../utils/authHeader.js";
import defaultAvatar from "../assets/default-avatar.svg";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-0.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" />
  </svg>
);

const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconAlert = () => (
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
const inputBase =
  "w-full bg-white border border-[#e8ddd0] rounded-xl px-3.5 py-2.5 text-sm text-[#3a2012] placeholder-[#b8a898] transition focus:outline-none focus:border-[#8b5e34] focus:ring-2 focus:ring-[#8b5e34]/20";
const labelBase = "block mb-1.5 text-xs font-semibold text-[#5c3820] tracking-wide";
const sectionCard = "bg-[#fdfaf6] rounded-2xl border border-[#f0e8da] p-5";
const sectionTitle = "flex items-center gap-2 text-sm font-bold text-[#4c1f08] mb-4";

function SectionHeader({ icon, label }) {
  return (
    <div className={sectionTitle}>
      <span className="flex items-center justify-center w-6 h-6 rounded-full  text-[#8b5e34]">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function PasswordInput({ name, value, onChange, placeholder, label, required }) {
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

// ─── รายชื่อจังหวัดในประเทศไทย 77 จังหวัด ──────────────────────────────────
const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท",
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง",
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม",
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส",
  "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา",
  "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
  "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน",
  "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง",
  "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย",
  "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี",
  "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย",
  "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์",
  "อุทัยธานี", "อุบลราชธานี",
];

// ─── Main Component ───────────────────────────────────────────────────────────
function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "not_specified",
    bloodType: "O",
    // ที่อยู่จัดส่ง
    street: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const validate = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
    if (!firstName.trim() || !lastName.trim()) return "กรุณากรอกชื่อจริงและนามสกุล";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "กรุณากรอกอีเมลที่ถูกต้อง";
    if (!phone.trim() || !/^0[2-9]\d{7,8}$/.test(phone.trim()))
      return "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0812345678)";
    if (password.length < 6) return "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
    if (password !== confirmPassword) return "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMsg(err); return; }

    setLoading(true);
    setErrorMsg("");

    try {
      const apiUrl = getApiUrl();
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        birthDate: formData.birthDate || undefined,
        gender: formData.gender,
        bloodType: formData.bloodType,
        deliveryAddress: {
          street: formData.street.trim(),
          subdistrict: formData.subdistrict.trim(),
          district: formData.district.trim(),
          province: formData.province,
          postalCode: formData.postalCode.trim(),
        },
        role: "customer",
      };

      const response = await fetch(`${apiUrl}/api/v2/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try { data = await response.json(); }
      catch { data = { message: `เกิดข้อผิดพลาด (HTTP ${response.status})` }; }

      if (response.ok) {
        // Auto-login ทันที
        if (data.user && data.token) {
          login(data.user, data.token);
          if (avatarFile && data.user.id) {
            const uploadData = new FormData();
            uploadData.append("image", avatarFile);
            const uploadResponse = await fetch(`${apiUrl}/api/v2/images/upload`, {
              method: "POST",
              headers: { Authorization: `Bearer ${data.token}` },
              body: uploadData,
            });
            const uploaded = await uploadResponse.json();
            if (uploadResponse.ok && uploaded.url) {
              const avatarUrl = uploaded.url.startsWith("http") ? uploaded.url : `${apiUrl}${uploaded.url}`;
              await fetch(`${apiUrl}/api/v2/users/${data.user.id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${data.token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ avatar: avatarUrl }),
              });
            }
          }
        }
        toast.success(`ยินดีต้อนรับคุณ ${data.user?.firstName || formData.firstName}!`);
        // สมัครสมาชิค → quiz ทำธาตุเจ้าเรือน → landing page พร้อม token
        navigate("/quiz", { state: { fromRegister: true, autoStart: true } });
      } else {
        setErrorMsg(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch {
      setErrorMsg("ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf7ef] to-[#fdfbf7] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3a1f08] tracking-tight">
            สมัครสมาชิก That Tae
          </h1>
          <p className="mt-2 text-sm text-[#7a6557] max-w-sm mx-auto leading-relaxed">
            กรอกข้อมูลเพื่อรับเมนูอาหารและชุด Cooking Kit ที่เหมาะกับสุขภาพของคุณ
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
            <IconAlert />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" noValidate>

          {/* ── ส่วนที่ 1: ข้อมูลส่วนตัว ── */}
          <div className={sectionCard}>
            <SectionHeader icon={<IconUser />} label="ข้อมูลส่วนตัว" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelBase}>
                  ชื่อจริง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="เช่น สมชาย"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="เช่น ใจดี"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={inputBase}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelBase}>
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812345678"
                  maxLength={10}
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* ── ส่วนที่ 2: ข้อมูลสุขภาพ ── */}
          <div className={sectionCard}>
            <SectionHeader icon={<IconHeart />} label="ข้อมูลสุขภาพเบื้องต้น" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className={labelBase}>วันเกิด</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>เพศ</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputBase}
                >
                  <option value="female">หญิง</option>
                  <option value="male">ชาย</option>
                  <option value="other">LGBTQ+ / อื่นๆ</option>
                  <option value="not_specified">ไม่ระบุ</option>
                </select>
              </div>
              <div>
                <label className={labelBase}>หมู่เลือด</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className={inputBase}
                >
                  {["O", "A", "B", "AB", "O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#9e8070] flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" />
              </svg>
              ธาตุเจ้าเรือนของคุณจะถูกคำนวณจากแบบทดสอบสั้นๆ หลังสมัครสมาชิก
            </p>
          </div>

          {/* ── ส่วนที่ 3: ที่อยู่จัดส่ง ── */}
          <div className={sectionCard}>
            <SectionHeader icon={<IconLocation />} label="ที่อยู่จัดส่ง" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className={labelBase}>บ้านเลขที่ / ถนน / ซอย</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="เช่น 123/45 หมู่ 6 ถ.สุขุมวิท"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>ตำบล / แขวง</label>
                <input
                  type="text"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleChange}
                  placeholder="เช่น คลองเตย"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>อำเภอ / เขต</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="เช่น คลองเตย"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>จังหวัด</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={inputBase}
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {THAI_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelBase}>รหัสไปรษณีย์</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="เช่น 10110"
                  maxLength={5}
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* ── รูปโปรไฟล์ (ไม่บังคับ) ── */}
          <div className={sectionCard}>
            <SectionHeader icon={<IconUser />} label="รูปโปรไฟล์ (ไม่บังคับ)" />
            <div className="flex items-center gap-4">
              <img src={avatarPreview} alt="ตัวอย่างรูปโปรไฟล์" className="h-20 w-20 rounded-full border-2 border-[#e8ddd0] bg-[#eadfd4] object-cover" />
              <div className="min-w-0 flex-1">
                <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#f1e4d5] px-4 py-2 text-sm font-bold text-[#4c1f08] transition hover:bg-[#e6d2bc]">
                  เลือกรูปภาพ
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
                </label>
                <p className="mt-2 text-xs text-[#9e8070]">รองรับ JPG, PNG หรือ WebP หากไม่เลือก ระบบจะใช้รูป no-face อัตโนมัติ</p>
              </div>
            </div>
          </div>

          {/* ── ส่วนที่ 4: รหัสผ่าน ── */}
          <div className={sectionCard}>
            <SectionHeader icon={<IconLock />} label="รหัสผ่าน" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                label="รหัสผ่าน"
                required
              />
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                label="ยืนยันรหัสผ่าน"
                required
              />
            </div>
          </div>

          {/* ── ปุ่ม Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4c1f08] text-white py-3.5 rounded-xl text-base font-bold shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังสร้างบัญชี...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span>สมัครสมาชิก</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#7a6557]">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            to="/login"
            className="text-[#4c1f08] font-bold underline underline-offset-2 hover:text-[#8b5e34] transition"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
