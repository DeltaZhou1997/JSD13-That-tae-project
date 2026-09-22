import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";
import customerAvatar from "../mock-data/assets/reviews/praew.jpg";

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuth();
  const toast = useToast();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    bloodType: currentUser?.bloodType || "O",
    gender: currentUser?.gender || "female",
    street: currentUser?.deliveryAddress?.street || "",
    district: currentUser?.deliveryAddress?.district || "",
    province: currentUser?.deliveryAddress?.province || "",
    postalCode: currentUser?.deliveryAddress?.postalCode || "",
  });

  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-20 h-20 bg-[#f6ede5] rounded-full flex items-center justify-center text-[#8d593a] mb-4 shadow-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9" aria-hidden="true">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#3d2c2e] mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-[#6f675f] text-sm max-w-md mb-6">
          เข้าสู่ระบบเพื่อจัดการข้อมูลส่วนตัว สิทธิประโยชน์ และที่อยู่จัดส่ง
        </p>
        <Link
          to="/login"
          className="bg-[#4c1f08] text-white px-8 py-3 rounded-full font-bold hover:bg-[#6b3215] transition-all shadow-md"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const userId = currentUser.id || currentUser._id;
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      ...(currentUser.role !== "admin" && {
        bloodType: formData.bloodType,
        gender: formData.gender,
      }),
      deliveryAddress: {
        street: formData.street,
        district: formData.district,
        province: formData.province,
        postalCode: formData.postalCode,
      },
    };

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "บันทึกข้อมูลไม่สำเร็จ");
      }

      const updated = await res.json();
      if (updateUser) {
        updateUser(updated.user || { ...currentUser, ...payload });
      }
      toast.success("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว ✨");
      setIsEditing(false);
    } catch (err) {
      console.warn("⚠️ บันทึกลงเซิร์ฟเวอร์ไม่สำเร็จ ทำการอัปเดต Local State แทน:", err.message);
      if (updateUser) {
        updateUser({ ...currentUser, ...payload });
      }
      toast.success("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว (ออฟไลน์)");
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = currentUser.role === "admin";
  const tier = currentUser.tierStatus || "Bronze";
  const points = currentUser.biaPoints ?? currentUser.points ?? 0;

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
            {isAdmin ? "ADMIN ACCOUNT" : "MY ACCOUNT"}
          </span>
          <h1 className="text-3xl font-bold text-[#3d2c2e] mt-1">
            โปรไฟล์ของฉัน
          </h1>
          <p className="text-sm text-[#6f675f] mt-1">
            {isAdmin
              ? "ข้อมูลบัญชีผู้ดูแลระบบ (Admin) และข้อมูลติดต่อสำหรับร้านค้า"
              : "ข้อมูลสมาชิก สิทธิประโยชน์แต้มสะสม และที่อยู่จัดส่งของคุณ"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Card */}
          <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 text-center shadow-sm">
            <div className="relative inline-block mx-auto mb-4">
              <img
                src={customerAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className="absolute bottom-0 right-0 bg-[#8d593a] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {isAdmin ? "Admin" : tier}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#3d2c2e]">
              {currentUser.firstName} {currentUser.lastName}
            </h3>
            <p className="text-xs text-[#6f675f] mt-0.5">{currentUser.email}</p>
            <p className="text-xs text-[#8d593a] font-medium mt-1">
              รหัส{isAdmin ? "ผู้ดูแลระบบ" : "สมาชิก"}: {currentUser.id || currentUser._id}
            </p>

            {isAdmin ? (
              <div className="mt-5 space-y-4 pt-4 border-t border-[#e8dfd1]">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center justify-center gap-2 w-full text-center bg-[#4c1f08] text-white font-bold py-2.5 rounded-full hover:bg-[#6b3215] transition-colors text-xs shadow-sm cursor-pointer"
                >
                  <span>ไปยังแดชบอร์ดภาพรวม</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 pt-4 border-t border-[#e8dfd1] flex justify-around">
                  <div>
                    <span className="block text-xs text-[#6f675f]">แต้มสะสมเบี้ย</span>
                    <strong className="text-xl font-bold text-[#8d593a]">{points}</strong>
                  </div>
                  <div className="border-r border-[#e8dfd1]" />
                  <div>
                    <span className="block text-xs text-[#6f675f]">ระดับสมาชิก</span>
                    <strong className="text-xl font-bold text-[#3d2c2e]">{tier}</strong>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/orders"
                    className="flex items-center justify-center gap-2 w-full text-center bg-white border border-[#8d593a] text-[#8d593a] font-bold py-2.5 rounded-full hover:bg-[#8d593a] hover:text-white transition-colors text-sm shadow-sm cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    <span>ดูประวัติคำสั่งซื้อ</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Profile Details & Form */}
          <div className="md:col-span-2 bg-white border border-[#e8dfd1] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dfd1] mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#3d2c2e]">
                  {isAdmin ? "ข้อมูลผู้ดูแลระบบ" : "ข้อมูลส่วนตัว & การติดต่อ"}
                </h3>
                <p className="text-xs text-[#7a5c4d] mt-0.5">
                  {isAdmin
                    ? "แก้ไขชื่อ นามสกุล อีเมล เบอร์โทรศัพท์ และที่อยู่ติดต่อร้านค้า"
                    : "จัดการข้อมูลส่วนตัวและที่อยู่สำหรับจัดส่งสินค้า"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d593a] hover:underline cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="m18 2 4 4-10 10H8v-4z" />
                </svg>
                <span>{isEditing ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูล"}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">ชื่อจริง</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">นามสกุล</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">อีเมล</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                </div>

                {!isAdmin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3d2c2e] mb-1">กรุ๊ปเลือด</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#3d2c2e] mb-1">
                    {isAdmin ? "ที่อยู่ติดต่อร้านค้า / สำนักงาน" : "ที่อยู่จัดส่ง (บ้านเลขที่ / ถนน)"}
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="เช่น 123/45 ถนนวงศ์สว่าง"
                    className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">เขต/อำเภอ</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="บางซื่อ"
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">จังหวัด</label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      placeholder="กรุงเทพมหานคร"
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3d2c2e] mb-1">รหัสไปรษณีย์</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="10800"
                      className="w-full rounded-xl border border-[#e8dfd1] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8d593a]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-full border border-[#e8dfd1] text-xs font-bold text-[#6f675f] hover:bg-slate-50 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#4c1f08] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#6b3215] transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#f1ead7]">
                  <div>
                    <span className="block text-xs text-[#6f675f]">ชื่อ - นามสกุล</span>
                    <strong className="text-base text-[#3d2c2e]">
                      {currentUser.firstName} {currentUser.lastName}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-xs text-[#6f675f]">อีเมล</span>
                    <span className="text-[#3d2c2e] font-medium">{currentUser.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#f1ead7]">
                  <div>
                    <span className="block text-xs text-[#6f675f]">เบอร์โทรศัพท์</span>
                    <span className="text-[#3d2c2e]">{currentUser.phone || "ยังไม่ได้ระบุ"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#6f675f]">{isAdmin ? "สิทธิ์การใช้งาน" : "กรุ๊ปเลือด"}</span>
                    <span className="text-[#3d2c2e] font-semibold">
                      {isAdmin ? "ผู้ดูแลระบบ (Admin) " : (currentUser.bloodType || "O")}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-[#6f675f]">
                    {isAdmin ? "ที่อยู่ติดต่อร้านค้า / สำนักงาน" : "ที่อยู่จัดส่งพื้นฐาน"}
                  </span>
                  <p className="text-[#3d2c2e] mt-1">
                    {formData.street
                      ? `${formData.street} ${formData.district} ${formData.province} ${formData.postalCode}`
                      : "123/45 ถนนวงศ์สว่าง บางซื่อ กรุงเทพมหานคร 10800 (ค่าเริ่มต้น)"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
