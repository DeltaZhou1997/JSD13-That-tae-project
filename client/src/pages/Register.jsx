import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    const [firstName, ...rest] = formData.name.trim().split(/\s+/);
    const lastName = rest.join(" ") || "สมาชิกใหม่";
    const phone =
      formData.phone?.trim() ||
      "08" + Math.floor(10000000 + Math.random() * 90000000);

    setLoading(true);
    setErrorMsg("");

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
      const response = await fetch(`${apiUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName || formData.name,
          lastName,
          email: formData.email.trim(),
          password: formData.password,
          phone,
          role: "customer",
        }),
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
          "สมัครสมาชิกสำเร็จ! กรุณาทำแบบทดสอบเพื่อค้นหาธาตุเจ้าเรือนของคุณ ✨"
        );
        navigate("/element-quiz", { state: { autoStart: true, fromRegister: true } });
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
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-2xl shadow-md border border-[#f1ead7]">
      <h2 className="text-2xl font-bold text-center text-[#4c1f08] mb-5">
        สมัครสมาชิก
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">
            ชื่อ-นามสกุล
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="สมชาย ใจดี"
            className="w-full border border-[#f1ead7] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">อีเมล</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full border border-[#f1ead7] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">
            เบอร์โทรศัพท์ (ถ้ามี)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0812345678"
            className="w-full border border-[#f1ead7] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">
            รหัสผ่าน
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="อย่างน้อย 6 ตัวอักษร"
            className="w-full border border-[#f1ead7] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">
            ยืนยันรหัสผ่าน
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            className="w-full border border-[#f1ead7] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4c1f08] text-white p-3 rounded-xl font-bold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] cursor-pointer disabled:opacity-50"
        >
          {loading ? "กำลังลงทะเบียน..." : "สมัครสมาชิก"}
        </button>
      </form>
      <p className="text-center mt-5 text-sm text-[#4c1f08]">
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
