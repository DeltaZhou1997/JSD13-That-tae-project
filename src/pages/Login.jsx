import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../mock-data/index" //เดี๋ยวลอง mock user ก่อน
import { useAuth } from "../context/AuthContext.js";

function Login() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const navigate = useNavigate(); //hook ไปหน้า ตามเงื่อนไข
    const { login } = useAuth();
    // ลองใช้ user จาก users.js
    const handleLogin = (event) => {
        event.preventDefault();
        const isUser = users.find(user => user.email === email);

        if (!isUser) {
          alert("ไม่พบบัญชีผู้ใช้นี้ในระบบ");
          return;
        }

        login(isUser);
        alert(`ยินดีต้อนรับ ${isUser.firstName} (${isUser.role}) จ้า`);

        if (isUser.role === "admin") {
          navigate("/admin/products");
        } else {
          navigate("/");
        }
    };
    return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-[#4c1f08] mb-5">เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">อีเมล</label>
          <input 
            type="email" 
            required
            value={email} 
            onChange={event => setEmail(event.target.value)}
            placeholder="  example@email.com"
            className="w-full border p-2 rounded focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#4c1f08]">รหัสผ่าน</label>
          <input 
            type="password" 
            required 
            value={pwd} 
            onChange={event => setPwd(event.target.value)} 
            placeholder="  **********"
            className="w-full border p-2 rounded focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]"
          />
        </div>
        <button type="submit" className="w-full bg-[#4c1f08] text-white p-2 rounded font-medium shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]">
          เข้าสู่ระบบ
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-[#4c1f08]">
        ยังไม่มีบัญชี? <Link to="/register" className="text-[#4c1f08] font-bold transition duration-200 hover:-translate-y-0.5 hover:text-[#6b3215]">สมัครสมาชิก</Link>
      </p>
    </div>
  );
}

export default Login;
