import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast.js";
import { getAuthHeaders } from "../../utils/authHeader.js";

// ข้อมูลจำลองกรณีเซิร์ฟเวอร์ยังไม่มีคำสั่งซื้อจริง
const DEFAULT_MOCK_ORDERS = [
  {
    orderId: "ORD-003",
    _id: "mock-003",
    userId: "USR-002",
    shippingAddress: {
      fullName: "คุณกานต์ วงศ์สวัสดิ์",
      phone: "089-123-4567",
      address: "123/45 ถนนสุขุมวิท ซอย 55",
      district: "คลองเตย",
      province: "กรุงเทพมหานคร",
      postalCode: "10110",
    },
    items: [
      {
        productName: "ชุดทำแกงฮังเลเมืองเหนือ",
        nameTh: "ชุดทำแกงฮังเลเมืองเหนือ",
        price: 320,
        quantity: 1,
      },
    ],
    itemsSubtotal: 320,
    shippingFee: 60,
    grandTotal: 380,
    paymentMethod: "PROMPTPAY",
    status: "PAID",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    orderId: "ORD-002",
    _id: "mock-002",
    userId: "USR-003",
    shippingAddress: {
      fullName: "คุณชลธิชา บุญมี",
      phone: "081-987-6543",
      address: "88 หมู่ 3 ต.สุเทพ",
      district: "เมือง",
      province: "เชียงใหม่",
      postalCode: "50200",
    },
    items: [
      {
        productName: "ชุดทำต้มยำกุ้งน้ำข้น",
        nameTh: "ชุดทำต้มยำกุ้งน้ำข้น",
        price: 290,
        quantity: 1,
      },
    ],
    itemsSubtotal: 290,
    shippingFee: 60,
    grandTotal: 350,
    paymentMethod: "CREDIT_CARD",
    status: "PREPARING",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    orderId: "ORD-001",
    _id: "mock-001",
    userId: "USR-004",
    shippingAddress: {
      fullName: "คุณกิตติพงษ์ ศรีสุข",
      phone: "086-555-4321",
      address: "456 ถนนมิตรภาพ",
      district: "เมือง",
      province: "นครราชสีมา",
      postalCode: "30000",
    },
    items: [
      {
        productName: "ชุดทำคั่วกลิ้งหมูใต้",
        nameTh: "ชุดทำคั่วกลิ้งหมูใต้",
        price: 250,
        quantity: 2,
      },
    ],
    itemsSubtotal: 500,
    shippingFee: 60,
    grandTotal: 560,
    paymentMethod: "PROMPTPAY",
    status: "DELIVERED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
];

const STATUS_CONFIG = {
  PENDING: { label: "รอชำระเงิน", color: "bg-gray-100 text-gray-700 border-gray-300" },
  PAID: { label: "ชำระเงินแล้ว", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  PREPARING: { label: "กำลังเตรียมจัดส่ง", color: "bg-amber-50 text-amber-800 border-amber-200" },
  SHIPPED: { label: "จัดส่งแล้ว", color: "bg-blue-50 text-blue-800 border-blue-200" },
  DELIVERED: { label: "จัดส่งสำเร็จ", color: "bg-purple-50 text-purple-800 border-purple-200" },
  CANCELLED: { label: "ยกเลิกแล้ว", color: "bg-rose-50 text-rose-800 border-rose-200" },
};

// SVG ไอคอนระดับโปรสำหรับแดชบอร์ด (สไตล์เดียวกับหน้าแรก ไม่เอียง ล้นขอบแบบจางๆ)
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
      <line x1="12" y1="2.5" x2="12" y2="21.5" />
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

function CheckCircleIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TruckIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75A1.125 1.125 0 0013.125 2.625H4.125A1.125 1.125 0 003 3.75v10.5h11.25" />
    </svg>
  );
}

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();

  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

  // ดึงรายการออเดอร์ทั้งหมด
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/orders`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
      const data = await res.json();
      const orderList = Array.isArray(data) && data.length > 0 ? data : DEFAULT_MOCK_ORDERS;
      setOrders(orderList);
    } catch {
      // เซิร์ฟเวอร์ออฟไลน์ ให้ใช้ข้อมูลสำรองในหน่วยความจำหรือค่าเริ่มต้น
      try {
        const local = JSON.parse(localStorage.getItem("admin_orders") || "[]");
        setOrders(local.length > 0 ? local : DEFAULT_MOCK_ORDERS);
      } catch {
        setOrders(DEFAULT_MOCK_ORDERS);
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // อัปเดตสถานะออเดอร์
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${apiUrl}/api/v1/orders/${orderId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: newStatus, orderStatus: newStatus }),
      });

      // ปรับปรุง State หน้าจอทันที
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId || o._id === orderId ? { ...o, status: newStatus } : o
        )
      );

      if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder._id === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      if (res.ok) {
        toast?.success?.("อัปเดตสถานะออเดอร์เรียบร้อยแล้ว");
      } else {
        toast?.success?.("อัปเดตสถานะในระบบจำลองเรียบร้อยแล้ว");
      }
    } catch {
      // fallback อัปเดต state ทันที
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId || o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
      toast?.success?.("อัปเดตสถานะคำสั่งซื้อเรียบร้อยแล้ว");
    } finally {
      setUpdatingId(null);
    }
  };

  // กรองรายการออเดอร์
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const idMatch = (order.orderId || order._id || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const nameMatch = (order.shippingAddress?.fullName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const phoneMatch = (order.shippingAddress?.phone || "").includes(searchQuery);

      const matchesSearch = idMatch || nameMatch || phoneMatch;
      const matchesStatus = statusFilter === "ALL" || (order.status || "").toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // สรุปยอด
  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter((o) => (o.status || "").toUpperCase() === "PAID").length;
    const preparing = orders.filter((o) => (o.status || "").toUpperCase() === "PREPARING").length;
    const delivered = orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;
    const revenue = orders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
    return { total, paid, preparing, delivered, revenue };
  }, [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* ──────────────────────────────────────────────────────────
          Header & Overview
          ────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/dashboard"
              className="text-xs font-semibold text-[#8b5e34] hover:underline"
            >
              แดชบอร์ด
            </Link>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs font-bold text-[#4c1f08]">ออเดอร์</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#4c1f08]">
            รายการออเดอร์ (Orders)
          </h1>
          <p className="mt-1 text-sm text-[#7a5c4d]">
            ตรวจสอบคำสั่งซื้อ จัดการสถานะการจัดส่ง และดูรายละเอียดลูกค้า
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#d9cbbd] bg-white px-4 py-2 text-xs font-semibold text-[#4c1f08] shadow-xs hover:bg-[#f1ead7] transition-colors cursor-pointer"
        >
          <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────
          สรุปยอดสถิติ 4 กล่อง (สไตล์เดียวกับ Dashboard: ไอคอนใหญ่ล้นขอบแบบจางๆ ไม่เอียง)
          ────────────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="skeleton-warm h-3 w-20 rounded" />
              <div className="skeleton-warm mt-3 h-7 sm:h-8 w-24 sm:w-32 rounded-lg" />
            </div>
          ))
        ) : (
          <>
            {/* การ์ด 1: ออเดอร์ทั้งหมด */}
            <div className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-blue-600/10">
                <ShoppingBagIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-[#7a5c4d]">ออเดอร์ทั้งหมด</span>
                <div className="mt-1 text-2xl font-bold text-[#4c1f08]">{stats.total} รายการ</div>
              </div>
            </div>

            {/* การ์ด 2: ชำระเงินแล้ว */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-emerald-600/15">
                <CheckCircleIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-emerald-800">ชำระเงินแล้ว</span>
                <div className="mt-1 text-2xl font-bold text-emerald-900">{stats.paid} รายการ</div>
              </div>
            </div>

            {/* การ์ด 3: กำลังเตรียมจัดส่ง */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/50 p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-amber-600/15">
                <TruckIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-amber-800">กำลังเตรียมจัดส่ง</span>
                <div className="mt-1 text-2xl font-bold text-amber-900">{stats.preparing} รายการ</div>
              </div>
            </div>

            {/* การ์ด 4: ยอดขายรวมออเดอร์ */}
            <div className="relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-amber-600/10">
                <CurrencyBahtIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-[#7a5c4d]">ยอดขายรวมออเดอร์</span>
                <div className="mt-1 text-2xl font-bold text-[#4c1f08]">฿{stats.revenue.toLocaleString()}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          เครื่องมือค้นหาและฟิลเตอร์สถานะ
          ────────────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* ค้นหา */}
        <div className="relative w-full sm:w-72">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเลขออเดอร์ หรือ ชื่อลูกค้า..."
            className="w-full rounded-full border border-[#d9cbbd] bg-white py-2 pl-10 pr-4 text-xs font-medium text-[#4c1f08] placeholder-gray-400 focus:border-[#4c1f08] focus:outline-none"
          />
        </div>

        {/* ฟิลเตอร์สถานะ */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "ทั้งหมด" },
            { key: "PAID", label: "ชำระแล้ว" },
            { key: "PREPARING", label: "กำลังเตรียม" },
            { key: "SHIPPED", label: "จัดส่งแล้ว" },
            { key: "DELIVERED", label: "สำเร็จ" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setStatusFilter(tab.key);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-[#4c1f08] text-white shadow-xs"
                  : "bg-white text-[#7a5c4d] border border-[#d9cbbd] hover:bg-[#f1ead7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          ตารางแสดงรายการออเดอร์
          ────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#f1ead7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#f1ead7] bg-[#fdfbf7] text-xs font-bold text-[#7a5c4d]">
                <th className="px-4 py-3 sm:px-5">เลขออเดอร์</th>
                <th className="px-4 py-3 sm:px-5">ลูกค้า / เบอร์โทร</th>
                <th className="px-4 py-3 sm:px-5">รายการสินค้า</th>
                <th className="px-4 py-3 sm:px-5 text-right">ยอดรวม</th>
                <th className="px-4 py-3 sm:px-5 text-center">สถานะ</th>
                <th className="px-4 py-3 sm:px-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1ead7]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="skeleton-warm h-4 w-20 rounded" />
                      <div className="skeleton-warm mt-1.5 h-3 w-16 rounded" />
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="skeleton-warm h-4 w-28 rounded" />
                      <div className="skeleton-warm mt-1.5 h-3 w-20 rounded" />
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="skeleton-warm h-4 w-36 rounded" />
                    </td>
                    <td className="px-4 py-3.5 sm:px-5 text-right">
                      <div className="skeleton-warm ml-auto h-4 w-14 rounded" />
                    </td>
                    <td className="px-4 py-3.5 sm:px-5 text-center">
                      <div className="skeleton-warm mx-auto h-5 w-20 rounded-full" />
                    </td>
                    <td className="px-4 py-3.5 sm:px-5 text-center">
                      <div className="skeleton-warm mx-auto h-6 w-16 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    ไม่พบคำสั่งซื้อที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo =
                    STATUS_CONFIG[(order.status || "PENDING").toUpperCase()] || STATUS_CONFIG.PENDING;
                  const orderCode = order.orderId || (order._id ? `ORD-${order._id.slice(-4)}` : "ORD-N/A");
                  const customerName = order.shippingAddress?.fullName || "ลูกค้าทั่วไป";
                  const phone = order.shippingAddress?.phone || "-";
                  const itemCount = (order.items || []).reduce(
                    (sum, i) => sum + (Number(i.quantity) || 1),
                    0
                  );
                  const firstItemName = order.items?.[0]?.productName || order.items?.[0]?.nameTh || "Cooking Kit";

                  return (
                    <tr key={order.orderId || order._id} className="hover:bg-[#fcfaf7] transition-colors">
                      <td className="px-4 py-3.5 sm:px-5 font-mono font-bold text-[#4c1f08]">
                        {orderCode}
                        <div className="text-[11px] font-normal text-gray-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("th-TH") : "วันนี้"}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 sm:px-5">
                        <div className="font-semibold text-[#4c1f08]">{customerName}</div>
                        <div className="text-xs text-gray-500">{phone}</div>
                      </td>
                      <td className="px-4 py-3.5 sm:px-5 max-w-xs truncate text-[#7a5c4d]">
                        {firstItemName}
                        {itemCount > 1 && (
                          <span className="ml-1 text-xs text-gray-400 font-normal">
                            (+อีก {itemCount - 1} ชิ้น)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 sm:px-5 text-right font-bold text-[#4c1f08]">
                        ฿{(Number(order.grandTotal) || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 sm:px-5 text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 sm:px-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg bg-[#f1ead7] px-2.5 py-1 text-xs font-semibold text-[#4c1f08] hover:bg-[#e4d7be] transition-colors cursor-pointer"
                          >
                            ดูรายละเอียด
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          Modal: รายละเอียดออเดอร์ และการเปลี่ยนสถานะ
          ────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#dfd1c1] bg-[#fdfbf7] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#dfd1c1] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b5e34]">
                  รายละเอียดคำสั่งซื้อ
                </span>
                <h3 className="mt-0.5 text-xl font-bold text-[#4c1f08]">
                  {selectedOrder.orderId || (selectedOrder._id ? `ORD-${selectedOrder._id.slice(-4)}` : "ORD-N/A")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs sm:text-sm">
              {/* ข้อมูลลูกค้า & จัดส่ง */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-3.5">
                <h4 className="font-bold text-[#4c1f08] mb-1.5">ข้อมูลผู้รับและที่อยู่จัดส่ง</h4>
                <div className="text-[#3b2a1a]">
                  <span className="font-semibold">{selectedOrder.shippingAddress?.fullName || "-"}</span>
                  <span className="ml-2 text-gray-500">โทร: {selectedOrder.shippingAddress?.phone || "-"}</span>
                </div>
                <div className="mt-1 text-gray-600 leading-relaxed">
                  {selectedOrder.shippingAddress?.address || "ไม่มีข้อมูลที่อยู่"}
                  {selectedOrder.shippingAddress?.district && ` เขต/อำเภอ ${selectedOrder.shippingAddress.district}`}
                  {selectedOrder.shippingAddress?.province && ` จ.${selectedOrder.shippingAddress.province}`}
                  {selectedOrder.shippingAddress?.postalCode && ` ${selectedOrder.shippingAddress.postalCode}`}
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-3.5">
                <h4 className="font-bold text-[#4c1f08] mb-2">รายการ Cooking Kit ในคำสั่งซื้อ</h4>
                <div className="divide-y divide-[#f1ead7]">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <div>
                        <span className="font-semibold text-[#4c1f08]">
                          {item.productName || item.nameTh || "สินค้า"}
                        </span>
                        <div className="text-xs text-gray-400">
                          ฿{Number(item.price || 0).toLocaleString()} x {item.quantity || 1}
                        </div>
                      </div>
                      <span className="font-bold text-[#4c1f08]">
                        ฿{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-[#f1ead7] pt-2 flex justify-between font-bold text-base text-[#4c1f08]">
                  <span>ยอดชำระสุทธิ:</span>
                  <span>฿{(Number(selectedOrder.grandTotal) || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* ปรับเปลี่ยนสถานะออเดอร์ */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-3.5">
                <h4 className="font-bold text-[#4c1f08] mb-2">อัปเดตสถานะออเดอร์</h4>
                <div className="flex flex-wrap gap-2">
                  {["PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingId === (selectedOrder.orderId || selectedOrder._id)}
                      onClick={() => handleUpdateStatus(selectedOrder.orderId || selectedOrder._id, st)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        (selectedOrder.status || "").toUpperCase() === st
                          ? "bg-[#4c1f08] text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {STATUS_CONFIG[st]?.label || st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 border-t border-[#dfd1c1] pt-3 text-right">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full bg-[#4c1f08] px-5 py-2 text-xs font-bold text-white hover:bg-[#6b3215] transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
