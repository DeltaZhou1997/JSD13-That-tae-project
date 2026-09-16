import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../mock-data/index";

function Register(){
    // เก็บค่าทุกช่องไว้ใน object เดียว เพื่อใช้ handleChange ร่วมกันได้
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // พอผู้ใช้เริ่มแก้ ให้ล้างข้อความเตือนเดิมทิ้ง
        setErrorMsg("");
    };

    const handleRegister = (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }

        const emailExists = users.some(user => user.email === formData.email);
        if (emailExists) {
            setErrorMsg("อีเมลนี้มีผู้ใช้งานในระบบแล้ว");
            return;
        }

        // ชื่อ-นามสกุล ในฟอร์มเป็นช่องเดียว แยกเป็น firstName/lastName ให้ตรงกับ shape ของ users.js
        const [firstName, ...rest] = formData.name.trim().split(/\s+/);
        const now = new Date().toISOString();
 
        users.push({
            id: `USR-${String(users.length + 1).padStart(3, "0")}`,
            firstName: firstName || formData.name,
            lastName: rest.join(" "),
            email: formData.email,
            phone: "",
            birthDate: "",
            gender: "",
            bloodType: "",
            tierStatus: "Bronze",
            role: "customer",
            biaPoints: 0,
            isSubscribed: false,
            conditions: [],
            lastActiveAt: now,
            createdAt: now,
            updatedAt: now,
        });

        alert("สมัครสมาชิกสำเร็จ!");
        navigate("/login");
    };

return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-[#f1ead7]">
        <h2 className="text-2xl font-bold text-center text-[#4c1f08] mb-5">สมัครสมาชิก</h2>
        
        {errorMsg && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {errorMsg}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
            <div>
            <label className="block mb-1 font-medium text-[#4c1f08]">ชื่อ-นามสกุล</label>
            <input 
                type="text" 
                name="name"
                required 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="สมชาย ใจดี"
                className="w-full border p-2 rounded focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]" 
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
                className="w-full border p-2 rounded focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]" 
            />
            </div>
            <div>
            <label className="block mb-1 font-medium text-[#4c1f08]">รหัสผ่าน</label>
            <input 
                type="password" 
                name="password"
                required 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="**********"
                className="w-full border p-2 rounded focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]" 
            />
            </div>
            <div>
            <label className="block mb-1 font-medium text-[#4c1f08]">ยืนยันรหัสผ่าน</label>
            <input 
                type="password" 
                name="confirmPassword"
                required 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="**********"
                className="w-full border p-2 rounded focus:outline-none focus:border-[#4c1f08] focus:ring-2 focus:ring-[#f1ead7]" 
            />
            </div>
            <button 
            type="submit" 
            className="w-full bg-[#4c1f08] text-white p-2 rounded font-medium shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
            >
            สมัครสมาชิก
            </button>
        </form>
        <p className="text-center mt-4 text-sm text-[#4c1f08]">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-[#4c1f08] font-bold transition duration-200 hover:text-[#6b3215]">เข้าสู่ระบบ</Link>
        </p>
        </div>
    );
}

export default Register;
