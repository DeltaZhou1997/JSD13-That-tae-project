import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";
import { getApiUrl } from "../utils/authHeader.js";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "2000-01-01",
    gender: "not_specified",
    bloodType: "O",
    element: "ดิน",
    // ข้อมูลที่อยู่จัดส่ง
    street: "",
    district: "",
    province: "",
    postalCode: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("กรุณากรอกชื่อจริงและนามสกุล");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMsg("กรุณากรอกอีเมล");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const apiUrl = getApiUrl();
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || "0800000000",
        birthDate: formData.birthDate || "2000-01-01",
        gender: formData.gender,
        bloodType: formData.bloodType,
        element: formData.element,
        bodyElement: formData.element,
        deliveryAddress: {
          street: formData.street.trim(),
          district: formData.district.trim(),
          province: formData.province.trim(),
          postalCode: formData.postalCode.trim(),
        },
        role: "customer",
      };

      const response = await fetch(`${apiUrl}/api/v2/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { message: `เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง (HTTP ${response.status})` };
      }

      if (response.ok) {
        if (data.user && data.token) {
          login(data.user, data.token);
        }
        toast.success(
          `ยินดีต้อนรับคุณ ${data.user?.firstName || formData.firstName}! สมัครสมาชิกสำเร็จเรียบร้อย ✨`
        );
        // ไปหน้าโปรไฟล์ผู้ใช้ทันที เพื่อให้อัปโหลดรูปโปรไฟล์และจัดการข้อมูลส่วนตัว
        navigate("/profile");
      } else {
        setErrorMsg(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setErrorMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-[#f1ead7]">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-amber-100/70 text-[#8d593a] text-xs font-bold rounded-full mb-2">
          สมาชิกใหม่ (v2 API & Database)
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4c1f08]">
          สมัครสมาชิก That-tae
        </h2>
        <p className="text-sm text-[#7a6b63] mt-1">
          กรอกข้อมูลตามศาสตร์การแพทย์แผนไทยและระบบจัดส่งเพื่อรับสิทธิประโยชน์สูงสุด
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl mb-5 text-sm font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        {/* หมวดที่ 1: ข้อมูลส่วนตัวพื้นฐาน */}
        <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#f1ead7]/80">
          <h3 className="text-sm font-bold text-[#4c1f08] mb-3 flex items-center gap-2">
            <span>👤</span> ข้อมูลส่วนตัว (ตามโมเดลระบบ)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                ชื่อจริง <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="เช่น สมชาย"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08] focus:ring-1 focus:ring-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="เช่น ใจดี"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08] focus:ring-1 focus:ring-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08] focus:ring-1 focus:ring-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="0812345678"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08] focus:ring-1 focus:ring-[#4c1f08]"
              />
            </div>
          </div>
        </div>

        {/* หมวดที่ 2: สุขภาพและธาตุเจ้าเรือน */}
        <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#f1ead7]/80">
          <h3 className="text-sm font-bold text-[#4c1f08] mb-3 flex items-center gap-2">
            <span>🌿</span> ข้อมูลธาตุเจ้าเรือน & ชีวอนามัย
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                วันเดือนปีเกิด
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                เพศ
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              >
                <option value="female">หญิง</option>
                <option value="male">ชาย</option>
                <option value="other">LGBTQ+ / อื่นๆ</option>
                <option value="not_specified">ไม่ระบุ</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                หมู่เลือด
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              >
                <option value="O">O</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                ธาตุเจ้าเรือน
              </label>
              <select
                name="element"
                value={formData.element}
                onChange={handleChange}
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              >
                <option value="ดิน">ธาตุดิน (ปฐวี)</option>
                <option value="น้ำ">ธาตุน้ำ (อาโป)</option>
                <option value="ลม">ธาตุลม (วาโย)</option>
                <option value="ไฟ">ธาตุไฟ (เตโช)</option>
              </select>
            </div>
          </div>
        </div>

        {/* หมวดที่ 3: ที่อยู่จัดส่งเริ่มต้น (Delivery Address) */}
        <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#f1ead7]/80">
          <h3 className="text-sm font-bold text-[#4c1f08] mb-3 flex items-center gap-2">
            <span>📍</span> ที่อยู่จัดส่งชุด Cooking Kit เริ่มต้น
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                บ้านเลขที่ / ถนน / ซอย
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="เช่น 123/45 หมู่ 6 ถ.สุขุมวิท"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                อำเภอ / เขต
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="เช่น คลองเตย"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                จังหวัด
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="เช่น กรุงเทพมหานคร"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                รหัสไปรษณีย์
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="เช่น 10110"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
          </div>
        </div>

        {/* หมวดที่ 4: ความปลอดภัยและรหัสผ่าน */}
        <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#f1ead7]/80">
          <h3 className="text-sm font-bold text-[#4c1f08] mb-3 flex items-center gap-2">
            <span>🔒</span> ความปลอดภัยและรหัสผ่าน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#4c1f08]">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className="w-full bg-white border border-[#f1ead7] p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4c1f08]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4c1f08] text-white p-3.5 rounded-xl font-bold shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] cursor-pointer disabled:opacity-50 text-base flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>กำลังลงทะเบียนสมาชิก...</span>
            </>
          ) : (
            <span>สมัครสมาชิกและไปยังหน้าโปรไฟล์ 🚀</span>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-[#4c1f08]">
        มีบัญชีอยู่แล้ว?{" "}
        <Link
          to="/login"
          className="text-[#4c1f08] font-bold underline transition duration-200 hover:text-[#6b3215]"
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}

export default Register;
