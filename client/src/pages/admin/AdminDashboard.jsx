import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { useProducts } from "../../context/ProductsContext.js";
import defaultUsers from "../../mock-data/users.js";

// ข้อมูลออเดอร์ตัวอย่าง
const DEFAULT_ORDERS = [
  {
    orderId: "ORD-001",
    customerName: "คุณกานต์",
    dishName: "แกงฮังเลเมืองเหนือ",
    price: 320,
    status: "ชำระเงินแล้ว",
  },
  {
    orderId: "ORD-002",
    customerName: "คุณชลธิชา",
    dishName: "ต้มยำกุ้งน้ำข้น",
    price: 290,
    status: "กำลังเตรียมจัดส่ง",
  },
  {
    orderId: "ORD-003",
    customerName: "คุณกิตติพงษ์",
    dishName: "คั่วกลิ้งหมูใต้",
    price: 250,
    status: "จัดส่งสำเร็จ",
  },
];

// SVG ไอคอนสำหรับสื่อสารความหมายในแดชบอร์ด
function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function BoxIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IngredientLeafIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9a9 9 0 0 1-9 9zm0 0v-9m0 0a4.5 4.5 0 0 1 4.5-4.5M12 12a4.5 4.5 0 0 0-4.5-4.5" />
    </svg>
  );
}

function UsersIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UserCircleIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClipboardListIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function EditPencilIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function CogIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products } = useProducts();

  const [usersList, setUsersList] = useState(defaultUsers);
  const [ordersList] = useState(DEFAULT_ORDERS);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // ดึงข้อมูลผู้ใช้จาก API
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/users`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsersList(data);
        }
      }
    } catch {
      // เซิร์ฟเวอร์ออฟไลน์ ใช้ mockUsers เริ่มต้น
    }
  }, [apiUrl]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* ส่วนหัวหน้าเว็บ */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4c1f08]">
            แดชบอร์ดผู้ดูแลระบบ
          </h1>
          <p className="mt-1 text-sm text-[#7a5c4d]">
            ยินดีต้อนรับคุณ {currentUser?.firstName || "แอดมิน"} — ภาพรวมสินค้าและสมาชิกในระบบ
          </p>
        </div>

        {/* ปุ่มสร้างเมนูใหม่ (Primary Action) */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/products/new")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4c1f08] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6b3215] cursor-pointer shadow-sm transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>+ เพิ่มเมนูใหม่</span>
          </button>
        </div>
      </div>

      {/* สรุปตัวเลข 4 กล่องพร้อมไอคอน SVG สื่อสารความหมาย */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* กล่อง 1: สินค้าทั้งหมด */}
        <div className="rounded-xl border border-[#f1ead7] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#7a5c4d]">สินค้าทั้งหมด</span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8ede3] text-[#8b5e34]">
              <BoxIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-[#4c1f08]">
            {products.length} <span className="text-sm font-normal text-gray-500">รายการ</span>
          </div>
          <Link
            to="/admin/products"
            className="group mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#8b5e34] hover:underline"
          >
            <span>ดูรายการสินค้า</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* กล่อง 2: วัตถุดิบในสต็อก */}
        <div className="rounded-xl border border-[#f1ead7] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#7a5c4d]">วัตถุดิบในสต็อก</span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef6ec] text-[#3d7a36]">
              <IngredientLeafIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-[#4c1f08]">
            15 <span className="text-sm font-normal text-gray-500">รายการ</span>
          </div>
          {/* =========================================================================
              [มาร์กจุดเชื่อมต่อ: ลิงก์ดูวัตถุดิบ - รอเพื่อนพัฒนาเสร็จ]
              TODO: เมื่อเพื่อนทำหน้าเสร็จแล้ว ให้เปลี่ยนปุ่มนี้เป็น:
              <Link to="/admin/ingredients" className="...">จัดการสต็อกวัตถุดิบ &rarr;</Link>
             ========================================================================= */}
          <button
            type="button"
            onClick={() => {
              /* TODO: navigate("/admin/ingredients"); */
              alert("ปุ่มจัดการวัตถุดิบ: อยู่ระหว่างการพัฒนาโดยเพื่อนในทีม (รอเชื่อมต่อไปยังหน้า /admin/ingredients)");
            }}
            className="group mt-3 inline-flex items-center gap-1 text-left text-xs font-medium text-[#8b5e34] hover:underline cursor-pointer"
          >
            <span>จัดการวัตถุดิบ</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* กล่อง 3: ผู้ใช้งานทั้งหมด */}
        <div className="rounded-xl border border-[#f1ead7] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#7a5c4d]">ผู้ใช้งานทั้งหมด</span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f4effc] text-[#7c3aed]">
              <UsersIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-[#4c1f08]">
            {usersList.length} <span className="text-sm font-normal text-gray-500">คน</span>
          </div>
          <Link
            to="/admin/users"
            className="group mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#8b5e34] hover:underline"
          >
            <span>ดูรายชื่อสมาชิก</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* กล่อง 4: คำสั่งซื้อทั้งหมด */}
        <div className="rounded-xl border border-[#f1ead7] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#7a5c4d]">คำสั่งซื้อทั้งหมด</span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#ebf4fc] text-[#2563eb]">
              <ClipboardListIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-[#4c1f08]">
            {ordersList.length} <span className="text-sm font-normal text-gray-500">รายการ</span>
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-700 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            สถานะปกติ
          </span>
        </div>
      </div>

      {/* ตารางสินค้าในระบบ */}
      <div className="mb-6 rounded-xl border border-[#f1ead7] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#f8ede3] text-[#8b5e34]">
              <BoxIcon className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-[#4c1f08]">รายการสินค้าล่าสุด</h2>
          </div>
          <Link
            to="/admin/products"
            className="group inline-flex items-center gap-1 text-xs font-medium text-[#8b5e34] hover:underline"
          >
            <span>ดูทั้งหมด ({products.length})</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#f1ead7] text-xs text-[#7a5c4d]">
                <th className="py-2">รูปภาพ</th>
                <th className="py-2">ชื่อเมนู</th>
                <th className="py-2">ภูมิภาค</th>
                <th className="py-2">ราคา</th>
                <th className="py-2">สต็อก</th>
                <th className="py-2 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8ede3]">
              {products.slice(0, 5).map((p) => {
                const pid = p._id || p.id;
                const img = Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl;

                return (
                  <tr key={pid} className="hover:bg-[#fffbf8]">
                    <td className="py-2.5">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-[#f1ead7]"
                        />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#f1ead7] text-[#7a5c4d]">
                          <BoxIcon className="h-5 w-5 opacity-60" />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 font-medium text-[#4c1f08]">{p.name}</td>
                    <td className="py-2.5 text-[#7a5c4d]">{p.regionNameTh || p.region}</td>
                    <td className="py-2.5 font-medium">{Number(p.price || 0).toLocaleString()} ฿</td>
                    <td className="py-2.5 text-[#7a5c4d]">{p.quantity} ชุด</td>
                    <td className="py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/products/edit/${pid}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1ead7] px-2.5 py-1 text-xs font-medium text-[#4c1f08] hover:bg-[#d9cbbd] cursor-pointer transition-colors"
                      >
                        <EditPencilIcon className="h-3.5 w-3.5" />
                        <span>แก้ไข</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ตารางสมาชิกในระบบ */}
      <div className="rounded-xl border border-[#f1ead7] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#f4effc] text-[#7c3aed]">
              <UsersIcon className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-[#4c1f08]">ผู้ใช้งานล่าสุด</h2>
          </div>
          <Link
            to="/admin/users"
            className="group inline-flex items-center gap-1 text-xs font-medium text-[#8b5e34] hover:underline"
          >
            <span>ดูสมาชิกทั้งหมด ({usersList.length})</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#f1ead7] text-xs text-[#7a5c4d]">
                <th className="py-2">ชื่อ - นามสกุล</th>
                <th className="py-2">อีเมล</th>
                <th className="py-2">เบอร์โทร</th>
                <th className="py-2">บทบาท</th>
                <th className="py-2 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8ede3]">
              {usersList.slice(0, 4).map((u) => {
                const uid = u.id || u._id;
                const isAdmin = u.role === "admin";

                return (
                  <tr key={uid} className="hover:bg-[#fffbf8]">
                    <td className="py-2.5 font-medium text-[#4c1f08]">
                      {u.firstName} {u.lastName || ""}
                    </td>
                    <td className="py-2.5 text-[#7a5c4d]">{u.email}</td>
                    <td className="py-2.5 text-[#7a5c4d]">{u.phone || "-"}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          isAdmin ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isAdmin ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => navigate("/admin/users")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1ead7] px-2.5 py-1 text-xs font-medium text-[#4c1f08] hover:bg-[#d9cbbd] cursor-pointer transition-colors"
                      >
                        <CogIcon className="h-3.5 w-3.5" />
                        <span>จัดการ</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
