import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { useProducts } from "../../context/ProductsContext.js";
import defaultUsers from "../../mock-data/users.js";

// ข้อมูลออเดอร์ตัวอย่างสำหรับ E-commerce Dashboard
const DEFAULT_ORDERS = [
  {
    orderId: "ORD-003",
    customerName: "คุณกานต์ วงศ์สวัสดิ์",
    dishName: "แกงฮังเลเมืองเหนือ",
    price: 320,
    status: "ชำระเงินแล้ว",
    statusType: "paid",
    date: "วันนี้, 09:42",
  },
  {
    orderId: "ORD-002",
    customerName: "คุณชลธิชา บุญมี",
    dishName: "ต้มยำกุ้งน้ำข้น",
    price: 290,
    status: "กำลังเตรียมจัดส่ง",
    statusType: "processing",
    date: "วันนี้, 08:15",
  },
  {
    orderId: "ORD-001",
    customerName: "คุณกิตติพงษ์ ศรีสุข",
    dishName: "คั่วกลิ้งหมูใต้",
    price: 250,
    status: "จัดส่งสำเร็จ",
    statusType: "completed",
    date: "เมื่อวาน, 16:30",
  },
];

// SVG ไอคอนระดับโปรสำหรับแดชบอร์ด
function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function TrendingUpIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5 7.5-7.5M21 8.25V4.5h-3.75" />
    </svg>
  );
}

function CurrencyBahtIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* เส้นผ่ากลางแนวตั้งของสัญลักษณ์ ฿ */}
      <line x1="12" y1="2.5" x2="12" y2="21.5" />
      {/* ตัวอักษร B: ก้านตรงด้านซ้ายและส่วนโค้งบน-ล่าง */}
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7m0 0h7a3.5 3.5 0 0 1 0 7H7V5z" />
    </svg>
  );
}

function ShoppingBagIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function BoxIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products } = useProducts();

  const [usersList, setUsersList] = useState(defaultUsers);
  const [ordersList, setOrdersList] = useState(DEFAULT_ORDERS);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // ดึงข้อมูลผู้ใช้งานและคำสั่งซื้อจริงพร้อม Skeleton Loading
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, ordersRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/v1/users`),
        fetch(`${apiUrl}/api/v1/orders`),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const data = await usersRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsersList(data);
        }
      }

      if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
        const data = await ordersRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((o) => ({
            orderId: o.orderId || o._id?.slice(-5) || "ORD",
            customerName: o.shippingAddress?.fullName || o.customerName || "ลูกค้าทั่วไป",
            dishName: o.items?.[0]?.productName || o.dishName || "ชุดทำอาหาร",
            price: o.grandTotal || o.itemsSubtotal || o.price || 0,
            status: o.status === "PAID" ? "ชำระเงินแล้ว" : o.status === "PREPARING" ? "กำลังเตรียมจัดส่ง" : "จัดส่งสำเร็จ",
            statusType: o.status === "PAID" ? "paid" : o.status === "PREPARING" ? "processing" : "completed",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("th-TH") : "วันนี้",
          }));
          setOrdersList(mapped);
        }
      }
    } catch {
      // เซิร์ฟเวอร์ออฟไลน์ ใช้ mock เริ่มต้น
    } finally {
      setTimeout(() => setLoading(false), 250);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // คำนวณตัวเลขสถิติธุรกิจสำหรับ E-commerce Dashboard
  const metrics = useMemo(() => {
    const totalRevenue = ordersList.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const totalStock = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    const customerCount = usersList.filter((u) => u.role !== "admin").length;

    return {
      totalRevenue,
      totalOrders: ordersList.length,
      totalProducts: products.length,
      totalStock,
      customerCount,
      totalUsers: usersList.length,
    };
  }, [ordersList, products, usersList]);

  // สรุปยอดตามสถานะคำสั่งซื้อ
  const statusBadge = (type) => {
    switch (type) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
      {/* ──────────────────────────────────────────────────────────
          1. Header ร้านค้า (E-commerce Store Overview)
          ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f1ead7] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4c1f08]">
              ยินดีต้อนรับ ผู้ดูแลระบบ, {currentUser?.firstName || "แอดมิน"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* วันที่ปัจจุบัน */}
          <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[#4c1f08] bg-white/70 border border-[#f1ead7]">
            <CalendarIcon className="h-4 w-4 text-[#8b5e34]" />
            <span>{new Date().toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}</span>
          </div>

          {/* ปุ่มสร้างเมนูใหม่ (Action สำคัญของแอดมิน) */}
          <button
            type="button"
            onClick={() => navigate("/admin/products/new")}
            className="inline-flex items-center gap-2 rounded-full bg-[#4c1f08] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#6b3215] cursor-pointer transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>เพิ่มเมนูใหม่</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. KPI สถิติธุรกิจหลัก 4 ตัว (Clean E-commerce Metrics)
          ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-3.5 sm:p-5 shadow-xs"
            >
              <div className="skeleton-warm h-3 w-16 sm:w-20 rounded" />
              <div className="skeleton-warm mt-3 h-7 sm:h-8 w-24 sm:w-32 rounded-lg" />
              <div className="skeleton-warm mt-3 h-3 w-28 sm:w-36 rounded" />
            </div>
          ))
        ) : (
          <>
            {/* Metric 1: ยอดขายรวม */}
            <div className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-3.5 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 sm:-right-3 sm:-bottom-4 select-none text-amber-600/10">
                <CurrencyBahtIcon className="h-20 w-20 sm:h-28 sm:w-28" />
              </div>
              <div className="relative z-10">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7a5c4d]">
                  ยอดขายรวม
                </span>
                <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-[#4c1f08]">
                  ฿{metrics.totalRevenue.toLocaleString()}
                </div>
                <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
                  <span className="inline-flex items-center gap-0.5 font-bold">
                    <TrendingUpIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    +14.5%
                  </span>
                  <span className="text-gray-400 font-normal">จาก 3 คำสั่งซื้อ</span>
                </div>
              </div>
            </div>

            {/* Metric 2: คำสั่งซื้อ */}
            <div className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-3.5 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 sm:-right-3 sm:-bottom-4 select-none text-blue-600/10">
                <ShoppingBagIcon className="h-20 w-20 sm:h-28 sm:w-28" />
              </div>
              <div className="relative z-10">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7a5c4d]">
                  คำสั่งซื้อทั้งหมด
                </span>
                <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-[#4c1f08]">
                  {metrics.totalOrders} <span className="text-xs sm:text-base font-normal text-gray-500">ออเดอร์</span>
                </div>
                <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-[#7a5c4d]">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>ชำระ 2</span>
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                    <span>ส่ง 1</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 3: เมนู Cooking Kit ในร้าน */}
            <div className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-3.5 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 sm:-right-3 sm:-bottom-4 select-none text-[#8b5e34]/10">
                <BoxIcon className="h-20 w-20 sm:h-28 sm:w-28" />
              </div>
              <div className="relative z-10">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7a5c4d]">
                  เมนูอาหาร
                </span>
                <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-[#4c1f08]">
                  {metrics.totalProducts} <span className="text-xs sm:text-base font-normal text-gray-500">เมนู</span>
                </div>
                <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#7a5c4d] truncate">
                  สต็อกพร้อมส่ง <span className="font-semibold text-[#4c1f08]">{metrics.totalStock}</span> ชุด
                </div>
              </div>
            </div>

            {/* Metric 4: สมาชิกและลูกค้า */}
            <div className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-3.5 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 sm:-right-3 sm:-bottom-4 select-none text-purple-600/10">
                <UsersIcon className="h-20 w-20 sm:h-28 sm:w-28" />
              </div>
              <div className="relative z-10">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7a5c4d]">
                  สมาชิก
                </span>
                <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight text-[#4c1f08]">
                  {metrics.totalUsers} <span className="text-xs sm:text-base font-normal text-gray-500">ราย</span>
                </div>
                <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#7a5c4d] truncate">
                  ลูกค้าทั่วไป <span className="font-semibold text-[#4c1f08]">{metrics.customerCount}</span> คน
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          3. สองคอลัมน์หลัก: คำสั่งซื้อล่าสุด (65%) + สถานะสต็อกและเมนูเด่น (35%)
          ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* คอลัมน์ซ้าย (2 ส่วน): คำสั่งซื้อล่าสุด — ข้อมูลสำคัญอันดับ 1 ของ E-commerce */}
        <div className="lg:col-span-2 rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-[#4c1f08]">
                คำสั่งซื้อล่าสุด (Recent Orders)
              </h2>
              <p className="text-xs text-[#7a5c4d]">
                รายการคำสั่งซื้อของลูกค้าที่เข้ามาในระบบ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {ordersList.length} รายการ
              </span>
              <Link
                to="/admin/orders"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
                className="text-xs font-bold text-[#8b5e34] hover:text-[#4c1f08] hover:underline"
              >
                ดูทั้งหมด &rarr;
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[480px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#f1ead7] text-xs text-[#7a5c4d]">
                  <th className="py-2.5">รหัสออเดอร์</th>
                  <th className="py-2.5">ลูกค้า</th>
                  <th className="py-2.5">เมนูอาหาร</th>
                  <th className="py-2.5">ยอดรวม</th>
                  <th className="py-2.5">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8ede3]">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3">
                        <div className="skeleton-warm h-4 w-16 rounded" />
                        <div className="skeleton-warm mt-1.5 h-3 w-20 rounded" />
                      </td>
                      <td className="py-3">
                        <div className="skeleton-warm h-4 w-28 rounded" />
                      </td>
                      <td className="py-3">
                        <div className="skeleton-warm h-4 w-32 rounded" />
                      </td>
                      <td className="py-3">
                        <div className="skeleton-warm h-4 w-14 rounded" />
                      </td>
                      <td className="py-3">
                        <div className="skeleton-warm h-5 w-20 rounded-full" />
                      </td>
                    </tr>
                  ))
                ) : (
                  ordersList.map((order) => (
                    <tr key={order.orderId} className="hover:bg-[#fffbf8] transition-colors">
                      <td className="py-3 font-semibold text-[#8b5e34]">
                        #{order.orderId}
                        <div className="text-[11px] font-normal text-gray-400">{order.date}</div>
                      </td>
                      <td className="py-3 font-medium text-[#4c1f08]">
                        {order.customerName}
                      </td>
                      <td className="py-3 text-[#7a5c4d]">
                        {order.dishName}
                      </td>
                      <td className="py-3 font-semibold text-[#4c1f08]">
                        ฿{Number(order.price).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge(order.statusType)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* คอลัมน์ขวา (1 ส่วน): สรุปสถานะสต็อก & ภูมิภาคยอดนิยม */}
        <div className="rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-base text-[#4c1f08] mb-1">
              สถานะสต็อก & ธาตุเด่น
            </h2>
            <p className="text-xs text-[#7a5c4d] mb-4">
              ความพร้อมของชุดทำอาหารในร้าน
            </p>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="skeleton-warm h-3 w-32 rounded" />
                  <div className="skeleton-warm h-3 w-16 rounded" />
                </div>
                <div className="skeleton-warm h-2 w-full rounded-full" />
                <div className="flex justify-between pt-1">
                  <div className="skeleton-warm h-3 w-28 rounded" />
                  <div className="skeleton-warm h-3 w-14 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="skeleton-warm h-3 w-24 rounded" />
                  <div className="skeleton-warm h-3 w-12 rounded" />
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7a5c4d]">Cooking Kits พร้อมจำหน่าย</span>
                  <span className="font-bold text-emerald-700">{products.length} เมนู (100%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "100%" }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#7a5c4d]">สต็อกชุดทำอาหารรวม</span>
                  <span className="font-bold text-[#4c1f08]">{metrics.totalStock} ชุด</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7a5c4d]">วัตถุดิบสดในคลังสต็อก</span>
                  <span className="font-semibold text-[#8b5e34]">15 รายการ</span>
                </div>
              </div>
            )}

            {/* ไฮไลต์ธาตุและภูมิภาค */}
            <div className="mt-5 pt-4 border-t border-[#f1ead7]">
              <div className="text-xs font-bold text-[#4c1f08] mb-2">
                เมนูยอดนิยมตามภูมิภาค
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-[#fffbf8] border border-[#f1ead7] p-2">
                  <span className="text-gray-500 text-[11px] block">ภาคเหนือ</span>
                  <span className="font-semibold text-[#4c1f08]">แกงฮังเล</span>
                </div>
                <div className="rounded-xl bg-[#fffbf8] border border-[#f1ead7] p-2">
                  <span className="text-gray-500 text-[11px] block">ภาคกลาง</span>
                  <span className="font-semibold text-[#4c1f08]">ต้มยำกุ้ง</span>
                </div>
                <div className="rounded-xl bg-[#fffbf8] border border-[#f1ead7] p-2">
                  <span className="text-gray-500 text-[11px] block">ภาคใต้</span>
                  <span className="font-semibold text-[#4c1f08]">คั่วกลิ้งหมู</span>
                </div>
                <div className="rounded-xl bg-[#fffbf8] border border-[#f1ead7] p-2">
                  <span className="text-gray-500 text-[11px] block">ภาคอีสาน</span>
                  <span className="font-semibold text-[#4c1f08]">น้ำยาป่า</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 text-center border-t border-[#f1ead7]">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#8b5e34] hover:underline"
            >
              <span>เปิดดูคลังสินค้าทั้งหมด</span>
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. ส่วนล่าง: รายการสินค้า Cooking Kit ในร้าน
          ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f8ede3] text-[#8b5e34]">
              <BoxIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-bold text-base text-[#4c1f08]">
                เมนู Cooking Kit ในระบบ
              </h2>
              <p className="text-xs text-[#7a5c4d]">
                แสดง {Math.min(products.length, 5)} จากทั้งหมด {products.length} รายการ
              </p>
            </div>
          </div>

          <Link
            to="/admin/products"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-1 rounded-lg border border-[#d9cbbd] px-3 py-1.5 text-xs font-semibold text-[#4c1f08] hover:bg-[#f8ede3] transition-colors"
          >
            <span>จัดการสินค้าทั้งหมด</span>
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[560px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#f1ead7] text-xs text-[#7a5c4d]">
                <th className="py-2.5">ภาพอาหาร</th>
                <th className="py-2.5">ชื่อเมนู</th>
                <th className="py-2.5">ภูมิภาค / ธาตุเด่น</th>
                <th className="py-2.5">ราคา</th>
                <th className="py-2.5">คงเหลือพร้อมจำหน่าย</th>
                <th className="py-2.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8ede3]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-2.5">
                      <div className="skeleton-warm h-11 w-11 rounded-xl" />
                    </td>
                    <td className="py-2.5">
                      <div className="skeleton-warm h-4 w-32 rounded" />
                      <div className="skeleton-warm mt-1.5 h-3 w-20 rounded" />
                    </td>
                    <td className="py-2.5">
                      <div className="skeleton-warm h-5 w-16 rounded-md" />
                    </td>
                    <td className="py-2.5">
                      <div className="skeleton-warm h-4 w-14 rounded" />
                    </td>
                    <td className="py-2.5">
                      <div className="skeleton-warm h-4 w-16 rounded" />
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="skeleton-warm mx-auto h-7 w-16 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : (
                products.slice(0, 5).map((p) => {
                const pid = p._id || p.id;
                const img = Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl;

                return (
                  <tr key={pid} className="hover:bg-[#fffbf8] transition-colors">
                    <td className="py-2.5">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          className="h-11 w-11 rounded-xl object-cover border border-[#f1ead7]"
                        />
                      ) : (
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f1ead7] text-[#7a5c4d]">
                          <BoxIcon className="h-5 w-5 opacity-50" />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 font-bold text-[#4c1f08]">
                      {p.name}
                      {p.nameEn && <div className="text-[11px] font-normal text-gray-400">{p.nameEn}</div>}
                    </td>
                    <td className="py-2.5 text-[#7a5c4d]">
                      <span className="rounded-md bg-[#f8ede3] px-2 py-0.5 text-xs text-[#8b5e34] font-medium">
                        {p.regionNameTh || p.region || "ไทย"}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-[#4c1f08]">
                      ฿{Number(p.price || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${p.quantity <= 5 ? "text-amber-700" : "text-emerald-700"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.quantity <= 5 ? "bg-amber-500" : "bg-emerald-500"}`} />
                        {p.quantity} ชุด
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/products/edit/${pid}`)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#f1ead7] px-2.5 py-1 text-xs font-medium text-[#4c1f08] hover:bg-[#d9cbbd] cursor-pointer transition-colors"
                      >
                        <EditPencilIcon className="h-3 w-3" />
                        <span>แก้ไข</span>
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
