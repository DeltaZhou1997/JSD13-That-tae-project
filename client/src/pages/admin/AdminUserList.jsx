import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast.js";
import defaultUsers from "../../mock-data/users.js";

const PRESET_CONDITIONS = [
  { id: "diabetes", label: "เบาหวาน (Low Sugar)" },
  { id: "hypertension", label: "ความดันโลหิตสูง" },
  { id: "gerd", label: "กรดไหลย้อน (GERD)" },
  { id: "low_sodium", label: "จำกัดโซเดียม (ไต/บวมน้ำ)" },
  { id: "lactose_intolerance", label: "แพ้แลคโตสในนม" },
  { id: "gluten_free", label: "แพ้กลูเตน" },
];

export default function AdminUserList() {
  const toast = useToast();
  const [users, setUsers] = useState(defaultUsers);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  // State สำหรับ Modal แก้ไขผู้ใช้
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // State สำหรับ Modal เพิ่มผู้ใช้ใหม่
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "Password123!",
    phone: "",
    role: "customer",
    tierStatus: "Bronze",
    bloodType: "O",
    gender: "female",
    conditions: [],
  });

  // State ยืนยันการลบ
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // โหลดข้อมูลผู้ใช้ทั้งหมดจาก API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/users`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        }
      }
    } catch (err) {
      console.warn("⚠️ เซิร์ฟเวอร์ออฟไลน์ ใช้ mockUsers เริ่มต้น:", err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // กรองรายการผู้ใช้ตามคำค้นหา, Role, Tier
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        search === "" ||
        `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(search.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
        (u.phone && u.phone.includes(search)) ||
        (u.id && u.id.toLowerCase().includes(search.toLowerCase()));

      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchTier = tierFilter === "all" || u.tierStatus === tierFilter;

      return matchSearch && matchRole && matchTier;
    });
  }, [users, search, roleFilter, tierFilter]);

  // เปิด Modal แก้ไขข้อมูลผู้ใช้
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "customer",
      tierStatus: user.tierStatus || "Bronze",
      bloodType: user.bloodType || "O",
      gender: user.gender || "male",
      conditions: Array.isArray(user.conditions) ? [...user.conditions] : [],
    });
  };

  // บันทึกการแก้ไขข้อมูลผู้ใช้
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);

    const userId = editingUser.id || editingUser._id;
    try {
      const res = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "ไม่สามารถบันทึกข้อมูลได้");
      }

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId || u._id === userId ? updated.user || { ...u, ...editFormData } : u))
      );
      toast.success(`อัปเดตข้อมูลคุณ "${editFormData.firstName}" เรียบร้อยแล้ว`);
      setEditingUser(null);
    } catch {
      // Fallback ปรับปรุงใน State หน้าบ้าน
      setUsers((prev) =>
        prev.map((u) => (u.id === userId || u._id === userId ? { ...u, ...editFormData } : u))
      );
      toast.success(`บันทึกการแก้ไขข้อมูลเรียบร้อยแล้ว (Local Sync)`);
      setEditingUser(null);
    } finally {
      setIsSaving(false);
    }
  };

  // สร้างผู้ใช้ใหม่
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "ไม่สามารถสร้างผู้ใช้ใหม่ได้");
      }

      const created = await res.json();
      setUsers((prev) => [created.user, ...prev]);
      toast.success(`เพิ่มสมาชิกคุณ "${newUserData.firstName}" สำเร็จ`);
      setIsAddModalOpen(false);
      setNewUserData({
        firstName: "",
        lastName: "",
        email: "",
        password: "Password123!",
        phone: "",
        role: "customer",
        tierStatus: "Bronze",
        bloodType: "O",
        gender: "female",
        conditions: [],
      });
    } catch {
      // Local fallback
      const mockId = `USR-${String(users.length + 1).padStart(3, "0")}`;
      const fallbackUser = { ...newUserData, id: mockId, _id: mockId, createdAt: new Date().toISOString() };
      setUsers((prev) => [fallbackUser, ...prev]);
      toast.success(`เพิ่มสมาชิกเรียบร้อยแล้ว (Local Sync)`);
      setIsAddModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // ยืนยันการลบผู้ใช้
  const handleConfirmDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "ลบผู้ใช้ไม่สำเร็จ");
      }

      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      toast.success("ลบบัญชีผู้ใช้เรียบร้อยแล้ว");
      setPendingDeleteId(null);
    } catch {
      // Fallback ลบใน state
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      toast.success("ลบบัญชีผู้ใช้เรียบร้อยแล้ว (Local Sync)");
      setPendingDeleteId(null);
    }
  };

  const toggleCondition = (condId, isNew = false) => {
    if (isNew) {
      setNewUserData((prev) => {
        const exists = prev.conditions.includes(condId);
        return {
          ...prev,
          conditions: exists
            ? prev.conditions.filter((c) => c !== condId)
            : [...prev.conditions, condId],
        };
      });
    } else {
      setEditFormData((prev) => {
        const exists = prev.conditions.includes(condId);
        return {
          ...prev,
          conditions: exists
            ? prev.conditions.filter((c) => c !== condId)
            : [...prev.conditions, condId],
        };
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─────────────────────────────────────────────────────────────
          ส่วนหัว (Header & Breadcrumb)
      ────────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8d593a]">
            <Link to="/admin/dashboard" className="hover:underline">
              แผงควบคุมแอดมิน
            </Link>
            <span>/</span>
            <span className="text-[#4c1f08]">จัดการผู้ใช้งานและลูกค้า</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-[#4c1f08] sm:text-3xl">
            จัดการบัญชีผู้ใช้งาน (User Management)
          </h1>
          <p className="mt-1 text-sm text-[#7a5c4d]">
            ตรวจสอบรายชื่อ ปรับเปลี่ยนระดับสมาชิก สิทธิ์การใช้งาน และแก้ไขข้อมูลส่วนตัวลูกค้า
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#4c1f08] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#6b3215] cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มสมาชิกใหม่
          </button>
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-full border border-[#d9cbbd] bg-white p-2.5 text-[#4c1f08] hover:bg-[#f1ead7] transition-colors cursor-pointer"
            title="รีเฟรชข้อมูล"
          >
            <svg className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          เครื่องมือค้นหา & ตัวกรอง (Search & Filter Bar)
      ────────────────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#f1ead7] bg-white p-4 shadow-xs sm:grid-cols-3">
        {/* ช่องค้นหา */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#8d593a]">ค้นหาผู้ใช้</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาด้วยชื่อ, อีเมล, เบอร์โทร หรือ ID..."
              className="w-full rounded-xl border border-[#d9cbbd] bg-[#fdfbf7] p-2.5 pl-9 text-sm text-[#4c1f08] focus:border-[#4c1f08] focus:outline-none"
            />
            <svg className="absolute left-3 top-3 h-4 w-4 text-[#8d593a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* ตัวกรอง Role */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#8d593a]">สิทธิ์การใช้งาน (Role)</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-[#d9cbbd] bg-[#fdfbf7] p-2.5 text-sm text-[#4c1f08] focus:border-[#4c1f08] focus:outline-none cursor-pointer"
          >
            <option value="all">สิทธิ์ทั้งหมด (All Roles)</option>
            <option value="customer">ลูกค้าสมาชิก (Customer)</option>
            <option value="admin">ผู้ดูแลระบบ (Admin)</option>
          </select>
        </div>

        {/* ตัวกรองระดับสมาชิก (Tier) */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#8d593a]">ระดับสมาชิก (Tier)</label>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full rounded-xl border border-[#d9cbbd] bg-[#fdfbf7] p-2.5 text-sm text-[#4c1f08] focus:border-[#4c1f08] focus:outline-none cursor-pointer"
          >
            <option value="all">ระดับทั้งหมด (All Tiers)</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ตารางรายชื่อผู้ใช้ (Users Table)
      ────────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-[#f1ead7] bg-white shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#f1ead7] bg-[#fdfbf7] text-xs font-bold uppercase text-[#8d593a]">
                <th className="p-4">ผู้ใช้งาน</th>
                <th className="p-4">ข้อมูลติดต่อ</th>
                <th className="p-4">สิทธิ์ (Role)</th>
                <th className="p-4">ระดับสมาชิก (Tier)</th>
                <th className="p-4">สุขภาพ/แพ้อาหาร</th>
                <th className="p-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8ede3]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="skeleton-warm h-10 w-10 rounded-full shrink-0" />
                        <div className="space-y-1.5">
                          <div className="skeleton-warm h-4 w-32 rounded" />
                          <div className="skeleton-warm h-3 w-40 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="skeleton-warm h-3.5 w-24 rounded" />
                      <div className="skeleton-warm mt-1.5 h-3 w-36 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="skeleton-warm h-6 w-20 rounded-full" />
                    </td>
                    <td className="p-4">
                      <div className="skeleton-warm h-6 w-16 rounded-full" />
                    </td>
                    <td className="p-4">
                      <div className="skeleton-warm h-5 w-24 rounded-md" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        <div className="skeleton-warm h-7 w-12 rounded-full" />
                        <div className="skeleton-warm h-7 w-12 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#7a5c4d]">
                    ไม่พบข้อมูลผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isAdmin = u.role === "admin";

                  return (
                    <tr key={uid} className="hover:bg-[#fffbf8] transition-colors">
                      {/* ผู้ใช้งาน (รูป/ตัวอักษรแรก + ชื่อ) */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold text-sm ${isAdmin
                              ? "bg-[#4c1f08] text-white"
                              : "bg-[#f1ead7] text-[#4c1f08]"
                              }`}
                          >
                            {u.firstName ? u.firstName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-bold text-[#4c1f08]">
                              {u.firstName} {u.lastName || ""}
                            </div>
                            <div className="text-xs text-[#8d593a]">
                              รหัส: {uid} • {u.gender === "male" ? "ชาย" : u.gender === "female" ? "หญิง" : "-"} (เลือด {u.bloodType || "-"})
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ข้อมูลติดต่อ */}
                      <td className="p-4">
                        <div className="font-medium text-[#4c1f08]">{u.email}</div>
                        <div className="text-xs text-[#7a5c4d]">{u.phone || "-"}</div>
                      </td>

                      {/* สิทธิ์ */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${isAdmin
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-[#eaf4eb] text-emerald-800 border border-emerald-200"
                            }`}
                        >
                          {isAdmin ? "👑 ผู้ดูแลระบบ" : "👤 ลูกค้าสมาชิก"}
                        </span>
                      </td>

                      {/* ระดับสมาชิก (Tier) */}
                      <td className="p-4">
                        {u.tierStatus ? (
                          <span className="inline-flex items-center rounded-full bg-[#f8ede3] px-2.5 py-0.5 text-xs font-semibold text-[#8b5e34]">
                            ★ {u.tierStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                        {u.biaPoints !== undefined && (
                          <div className="text-[11px] text-[#8d593a]">
                            {u.biaPoints.toLocaleString()} พอยท์
                          </div>
                        )}
                      </td>

                      {/* สุขภาพ / แพ้อาหาร */}
                      <td className="p-4">
                        {Array.isArray(u.conditions) && u.conditions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {u.conditions.map((c) => (
                              <span
                                key={c}
                                className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">ไม่มี</span>
                        )}
                      </td>

                      {/* ปุ่มการจัดการ */}
                      <td className="p-4 text-center">
                        {pendingDeleteId === uid ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-xs font-bold text-red-600">
                              ยืนยันลบผู้ใช้นี้?
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(uid)}
                                className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                              >
                                ยืนยัน
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(null)}
                                className="rounded-lg bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 cursor-pointer"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            {/* ปุ่มแก้ไขข้อมูลผู้ใช้ */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(u)}
                              className="rounded-lg bg-[#4c1f08] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#6b3215] cursor-pointer"
                            >
                              แก้ไขข้อมูล
                            </button>
                            {/* ปุ่มลบผู้ใช้ */}
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(uid)}
                              className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200 cursor-pointer"
                              title="ลบผู้ใช้นี้"
                            >
                              ลบ
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Modal 1: แก้ไขข้อมูลผู้ใช้ (Edit User Modal)
      ────────────────────────────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#f1ead7] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1ead7] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#4c1f08]">
                  แก้ไขข้อมูลผู้ใช้: {editingUser.firstName} {editingUser.lastName}
                </h3>
                <p className="text-xs text-[#8d593a]">รหัสผู้ใช้: {editingUser.id || editingUser._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">ชื่อจริง *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">นามสกุล</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">อีเมล *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
              </div>

              {/* ปรับสิทธิ์ (Role) และระดับสมาชิก (Tier) */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl bg-[#fdfbf7] p-3 border border-[#f1ead7]">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">
                    👑 สิทธิ์การใช้งาน (Role)
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] bg-white p-2 text-sm text-[#4c1f08] focus:border-[#4c1f08] focus:outline-none cursor-pointer"
                  >
                    <option value="customer">ลูกค้าสมาชิก (Customer)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">
                    ★ ระดับสมาชิก (Tier Status)
                  </label>
                  <select
                    value={editFormData.tierStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, tierStatus: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] bg-white p-2 text-sm text-[#4c1f08] focus:border-[#4c1f08] focus:outline-none cursor-pointer"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
              </div>

              {/* ข้อมูลสุขภาพ & ร่างกาย */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">กรุ๊ปเลือด</label>
                  <select
                    value={editFormData.bloodType}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodType: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2 text-sm cursor-pointer"
                  >
                    <option value="O">O</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">เพศ</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2 text-sm cursor-pointer"
                  >
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
              </div>

              {/* ข้อจำกัดอาหาร / สุขภาพ */}
              <div>
                <label className="block text-xs font-bold text-[#4c1f08] mb-1.5">
                  ข้อจำกัดอาหารและภาวะสุขภาพ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_CONDITIONS.map((cond) => {
                    const isChecked = editFormData.conditions?.includes(cond.id);
                    return (
                      <label
                        key={cond.id}
                        className={`flex items-center gap-2 rounded-xl border p-2 text-xs cursor-pointer transition-colors ${isChecked
                          ? "border-[#4c1f08] bg-[#f8ede3] text-[#4c1f08] font-bold"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCondition(cond.id, false)}
                          className="rounded text-[#4c1f08]"
                        />
                        {cond.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#f1ead7] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#4c1f08] px-5 py-2 text-sm font-bold text-white hover:bg-[#6b3215] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Modal 2: เพิ่มสมาชิกใหม่ (Add User Modal)
      ────────────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#f1ead7] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1ead7] pb-4">
              <h3 className="text-xl font-bold text-[#4c1f08]">เพิ่มบัญชีผู้ใช้งานใหม่</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">ชื่อจริง *</label>
                  <input
                    type="text"
                    required
                    value={newUserData.firstName}
                    onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                    placeholder="เช่น วรัญญา"
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">นามสกุล</label>
                  <input
                    type="text"
                    value={newUserData.lastName}
                    onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                    placeholder="เช่น จิตเจริญ"
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">อีเมล *</label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">รหัสผ่านเริ่มต้น *</label>
                  <input
                    type="text"
                    required
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="0812345678"
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4c1f08] mb-1">สิทธิ์ (Role)</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm cursor-pointer"
                  >
                    <option value="customer">ลูกค้าสมาชิก (Customer)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#f1ead7] pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#4c1f08] px-5 py-2 text-sm font-bold text-white hover:bg-[#6b3215] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "กำลังสร้าง..." : "สร้างสมาชิกใหม่"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
