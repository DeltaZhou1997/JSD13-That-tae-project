import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const redirectPath = location.state?.from;

  const handleLogin = async (event) => { // จัดการ การเข้าระบบ และเทียบรหัสสผ่าน
    event.preventDefault();

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
      const response = await fetch(`${apiUrl}/api/v2/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: pwd,
          }),
        });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { message: `เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง (HTTP ${response.status})` };
      }

      if (response.ok) {
        login(data.user, data.token);
        toast.success(
          `ยินดีต้อนรับคุณ ${data.user.firstName} (${data.user.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"})`,
        );
        
        // หากผู้ใช้เดิมตั้งใจไปหน้าที่ต้องล็อกอิน ให้นำทางกลับไปหน้านั้น หรือไปตาม Role
        const destination = redirectPath || (data.user.role === "admin" ? "/admin/dashboard" : "/");
        navigate(destination, { replace: true });
      } else {
        toast.error(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-2xl shadow-md border border-[#f1ead7]">
      <h2 className="text-2xl font-bold text-center text-[#4c1f08] mb-5">
        เข้าสู่ระบบ
      </h2>

      {redirectPath && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อในหน้าที่ต้องการ</span>
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">
            อีเมล
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@email.com"
            className="w-full border border-[#d9cbbd] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">
            รหัสผ่าน
          </label>
          <input
            type="password"
            required
            value={pwd}
            onChange={(event) => setPwd(event.target.value)}
            placeholder="**********"
            className="w-full border border-[#d9cbbd] p-2.5 rounded-xl focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#4c1f08] text-white p-2.5 rounded-xl font-medium shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] cursor-pointer"
        >
          เข้าสู่ระบบ
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-[#4c1f08]">
        ยังไม่มีบัญชี?{" "}
        <Link
          to="/register"
          className="text-[#4c1f08] font-bold underline transition duration-200 hover:text-[#6b3215]"
        >
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

export default Login;
