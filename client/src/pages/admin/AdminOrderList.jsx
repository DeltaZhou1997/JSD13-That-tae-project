import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast.js";
import { getAuthHeaders } from "../../utils/authHeader.js";
import { formatDate } from "../../utils/dateFormatter.js";

// SVG ไอคอนระดับโปรสำหรับแดชบอร์ดและหน้ารายละเอียดคำสั่งซื้อ
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

function UserIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}

function DocumentTextIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function BoxIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function CheckBadgeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}

function XCircleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
    </svg>
  );
}

function XMarkIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ArrowPathIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

const STATUS_CONFIG = {
  PENDING: { label: "ยังไม่ชำระเงิน", icon: ClockIcon, color: "bg-amber-50 text-amber-800 border-amber-200" },
  PAID: { label: "ชำระเงินแล้ว", icon: CheckCircleIcon, color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  PREPARING: { label: "กำลังเตรียมจัดส่ง", icon: BoxIcon, color: "bg-sky-50 text-sky-800 border-sky-200" },
  SHIPPED: { label: "จัดส่งแล้ว", icon: TruckIcon, color: "bg-blue-50 text-blue-800 border-blue-200" },
  DELIVERED: { label: "จัดส่งสำเร็จ", icon: CheckBadgeIcon, color: "bg-purple-50 text-purple-800 border-purple-200" },
  CANCELLED: { label: "ยกเลิกแล้ว", icon: XCircleIcon, color: "bg-rose-50 text-rose-800 border-rose-200" },
};

// ลำดับขั้นตอนคำสั่งซื้อตามกระบวนการจริง (Lifecycle Flow: 1 -> 2 -> 3 -> 4 -> 5)
const ORDER_FLOW_STEPS = [
  { step: 1, key: "PENDING", label: "ยังไม่ชำระเงิน", icon: ClockIcon, activeColor: "bg-amber-600 text-white border-amber-700", note: "รอลูกค้าชำระเงิน" },
  { step: 2, key: "PAID", label: "ชำระเงินแล้ว", icon: CheckCircleIcon, activeColor: "bg-emerald-700 text-white border-emerald-800", note: "ตรวจสอบยอดเงินแล้ว" },
  { step: 3, key: "PREPARING", label: "กำลังเตรียมจัดส่ง", icon: BoxIcon, activeColor: "bg-sky-700 text-white border-sky-800", note: "ครัวกำลังจัดชุด Cooking Kit" },
  { step: 4, key: "SHIPPED", label: "จัดส่งแล้ว", icon: TruckIcon, activeColor: "bg-blue-700 text-white border-blue-800", note: "ส่งมอบบริษัทขนส่งแล้ว" },
  { step: 5, key: "DELIVERED", label: "จัดส่งสำเร็จ", icon: CheckBadgeIcon, activeColor: "bg-purple-700 text-white border-purple-800", note: "ลูกค้าได้รับอาหารแล้ว" },
];


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
      const res = await fetch(`${apiUrl}/api/v2/orders`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
      const data = await res.json();
      const orderList = Array.isArray(data) ? data : data.orders || data.data || [];
      setOrders(orderList);
    } catch (err) {
      console.warn("⚠️ ไม่สามารถโหลดคำสั่งซื้อจาก API:", err.message);
      setOrders([]);
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
      const res = await fetch(`${apiUrl}/api/v2/orders/${orderId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: newStatus, orderStatus: newStatus }),
      });

      if (res.ok) {
        // อัปเดตหน้าจอตามข้อมูลที่ DB บันทึกจริงเท่านั้น
        const data = await res.json().catch(() => ({}));
        const saved = data.order ? { ...data.order, status: data.order.status || newStatus } : { status: newStatus };
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId || o._id === orderId ? { ...o, ...saved } : o
          )
        );
        if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder._id === orderId)) {
          setSelectedOrder((prev) => ({ ...prev, ...saved }));
        }
        toast?.success?.("อัปเดตสถานะคำสั่งซื้อในฐานข้อมูลเรียบร้อยแล้ว");
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast?.error?.(errJson.message || "ไม่สามารถอัปเดตสถานะในฐานข้อมูลได้");
      }
    } catch (err) {
      toast?.error?.("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
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
    const pending = orders.filter((o) => (o.status || "").toUpperCase() === "PENDING").length;
    const paid = orders.filter((o) => (o.status || "").toUpperCase() === "PAID").length;
    const preparing = orders.filter((o) => (o.status || "").toUpperCase() === "PREPARING").length;
    const delivered = orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;
    const revenue = orders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
    return { total, pending, paid, preparing, delivered, revenue };
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
          สรุปยอดสถิติ 5 กล่อง (รวม ยังไม่ชำระเงิน)
          ────────────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
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
            <div className="stat-card-stagger relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-blue-600/10">
                <ShoppingBagIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-[#7a5c4d]">ออเดอร์ทั้งหมด</span>
                <div className="mt-1 text-2xl font-bold text-[#4c1f08]">{stats.total} รายการ</div>
              </div>
            </div>

            {/* การ์ด 2: ยังไม่ชำระเงิน */}
            <div className="stat-card-stagger relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-amber-600/15">
                <ClockIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-amber-800">ยังไม่ชำระเงิน</span>
                <div className="mt-1 text-2xl font-bold text-amber-900">{stats.pending} รายการ</div>
              </div>
            </div>

            {/* การ์ด 3: ชำระเงินแล้ว */}
            <div className="stat-card-stagger relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-emerald-600/15">
                <CheckCircleIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-emerald-800">ชำระเงินแล้ว</span>
                <div className="mt-1 text-2xl font-bold text-emerald-900">{stats.paid} รายการ</div>
              </div>
            </div>

            {/* การ์ด 4: กำลังเตรียมจัดส่ง */}
            <div className="stat-card-stagger relative overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/50 p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
              <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-sky-600/15">
                <BoxIcon className="h-20 w-20 sm:h-24 sm:w-24" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-medium text-sky-800">กำลังเตรียมจัดส่ง</span>
                <div className="mt-1 text-2xl font-bold text-sky-900">{stats.preparing} รายการ</div>
              </div>
            </div>

            {/* การ์ด 5: ยอดขายรวมออเดอร์ */}
            <div className="stat-card-stagger relative overflow-hidden rounded-2xl border border-[#f1ead7] bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm col-span-2 sm:col-span-1">
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
            { key: "PENDING", label: "ยังไม่ชำระเงิน" },
            { key: "PAID", label: "ชำระเงินแล้ว" },
            { key: "PREPARING", label: "กำลังเตรียม" },
            { key: "SHIPPED", label: "จัดส่งแล้ว" },
            { key: "DELIVERED", label: "จัดส่งสำเร็จ" },
            { key: "CANCELLED", label: "ยกเลิกแล้ว" },
          ].map((tab, tabIdx) => (
            <button
              key={tab.key}
              type="button"
              style={{ animationDelay: `${0.18 + tabIdx * 0.04}s` }}
              onClick={() => {
                setStatusFilter(tab.key);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
              className={`filter-pill-enter rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
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
                <tr className="order-row-enter">
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-full bg-[#fdfbf7] border border-[#f1ead7] flex items-center justify-center text-[#8d593a] mb-3">
                        <ShoppingBagIcon className="w-8 h-8 opacity-40" />
                      </div>
                      <p className="font-bold text-[#4c1f08] text-base mb-1">
                        {orders.length === 0 ? "ยังไม่มีคำสั่งซื้อในฐานข้อมูล" : "ไม่พบคำสั่งซื้อที่ค้นหา"}
                      </p>
                      <p className="text-xs text-[#7a6b63]">
                        {orders.length === 0
                          ? "เมื่อมีลูกค้าทำรายการสั่งซื้อชุด Cooking Kit รายการคำสั่งซื้อจริงจะถูกบันทึกและแสดงที่นี่แบบเรียลไทม์"
                          : "ลองปรับเปลี่ยนคำค้นหา หรือตัวกรองสถานะคำสั่งซื้อ"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => {
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
                    <tr key={`${statusFilter}-${order.orderId || order._id}`} style={{ animationDelay: `${Math.min(idx * 45, 600)}ms` }} className="order-row-enter hover:bg-[#fcfaf7] transition-colors">
                      <td className="px-4 py-3.5 sm:px-5 font-mono font-bold text-[#4c1f08]">
                        {orderCode}
                        <div className="text-[11px] font-normal text-gray-400">
                          {order.createdAt ? formatDate(order.createdAt) : "วันนี้"}
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
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.icon && <statusInfo.icon className="w-3.5 h-3.5" />}
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 sm:px-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#f1ead7] px-2.5 py-1 text-xs font-semibold text-[#4c1f08] hover:bg-[#e4d7be] transition-colors cursor-pointer"
                          >
                            <DocumentTextIcon className="w-3.5 h-3.5 text-[#8d593a]" />
                            <span>ดูรายละเอียด</span>
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
          <div className="relative w-full max-w-lg rounded-3xl border border-[#dfd1c1] bg-[#fdfbf7] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#dfd1c1] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8b5e34]">
                  <DocumentTextIcon className="w-3.5 h-3.5" />
                  <span>รายละเอียดคำสั่งซื้อ</span>
                </span>
                <h3 className="mt-1 text-2xl font-black text-[#4c1f08] font-mono tracking-tight">
                  {selectedOrder.orderId || (selectedOrder._id ? `ORD-${selectedOrder._id.slice(-4)}` : "ORD-N/A")}
                </h3>
                {selectedOrder.createdAt && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <ClockIcon className="w-3.5 h-3.5 text-stone-400" />
                    <span>สั่งซื้อเมื่อ:</span>
                    <span className="font-semibold text-[#4c1f08]">{formatDate(selectedOrder.createdAt, { showTime: true })}</span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer"
                title="ปิด"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs sm:text-sm">
              {/* ข้อมูลลูกค้า & จัดส่ง */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-4 shadow-2xs">
                <h4 className="inline-flex items-center gap-1.5 font-bold text-[#4c1f08] text-xs uppercase tracking-wider mb-2.5">
                  <MapPinIcon className="w-4 h-4 text-[#8d593a]" />
                  <span>ข้อมูลผู้รับและที่อยู่จัดส่ง</span>
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#3b2a1a]">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#4c1f08]">
                    <UserIcon className="w-3.5 h-3.5 text-[#8d593a]" />
                    <span>{selectedOrder.shippingAddress?.fullName || selectedOrder.shippingAddress?.firstName || "ลูกค้าทั่วไป"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#8d593a]" />
                    <span>โทร: {selectedOrder.shippingAddress?.phone || "-"}</span>
                  </span>
                </div>
                <div className="mt-2.5 text-stone-600 text-xs leading-relaxed flex items-start gap-2 bg-[#faf7f2] p-3 rounded-xl border border-[#f1ead7]">
                  <MapPinIcon className="w-4 h-4 text-[#8d593a] shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.shippingAddress?.address || "ไม่มีข้อมูลที่อยู่"}
                    {selectedOrder.shippingAddress?.subdistrict && ` ต.${selectedOrder.shippingAddress.subdistrict}`}
                    {selectedOrder.shippingAddress?.district && ` เขต/อำเภอ ${selectedOrder.shippingAddress.district}`}
                    {selectedOrder.shippingAddress?.province && ` จ.${selectedOrder.shippingAddress.province}`}
                    {selectedOrder.shippingAddress?.postalCode && ` ${selectedOrder.shippingAddress.postalCode}`}
                    {selectedOrder.shippingAddress?.zipcode && ` ${selectedOrder.shippingAddress.zipcode}`}
                  </span>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-4 shadow-2xs">
                <h4 className="inline-flex items-center gap-1.5 font-bold text-[#4c1f08] text-xs uppercase tracking-wider mb-3">
                  <ShoppingBagIcon className="w-4 h-4 text-[#8d593a]" />
                  <span>รายการ Cooking Kit ในคำสั่งซื้อ</span>
                </h4>
                <div className="divide-y divide-[#f1ead7]">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#8d593a] shrink-0" />
                        <div>
                          <span className="font-bold text-[#4c1f08]">
                            {item.productName || item.nameTh || "สินค้า"}
                          </span>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            ฿{Number(item.price || 0).toLocaleString()} × {item.quantity || 1} ชุด
                          </div>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#4c1f08]">
                        ฿{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3.5 border-t border-[#f1ead7] pt-3 flex items-center justify-between font-black text-base text-[#4c1f08]">
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-stone-700">
                    <CurrencyBahtIcon className="w-4 h-4 text-[#8d593a]" />
                    <span>ยอดชำระสุทธิ:</span>
                  </span>
                  <span className="text-xl text-[#8d593a]">฿{(Number(selectedOrder.grandTotal) || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* ปรับเปลี่ยนสถานะออเดอร์ */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#f1ead7]">
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#4c1f08] text-xs uppercase tracking-wider">
                    <ArrowPathIcon className="w-4 h-4 text-[#8d593a]" />
                    <span>อัปเดตสถานะคำสั่งซื้อ</span>
                  </div>
                  {/* แสดงสถานะปัจจุบัน */}
                  {(() => {
                    const currKey = (selectedOrder.status || "PENDING").toUpperCase();
                    const currConfig = STATUS_CONFIG[currKey] || STATUS_CONFIG.PENDING;
                    const CurrIcon = currConfig.icon;
                    return (
                      <div className="inline-flex items-center gap-1.5 text-xs">
                        <span className="text-stone-400 font-medium">สถานะปัจจุบัน:</span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${currConfig.color}`}>
                          {CurrIcon && <CurrIcon className="w-3.5 h-3.5" />}
                          <span>{currConfig.label}</span>
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* ลำดับกระบวนการ 5 ขั้นตอน (1 -> 2 -> 3 -> 4 -> 5) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                    <span>ลำดับขั้นตอนการดำเนินงาน (Order Flow):</span>
                    <span className="text-stone-400 font-normal">คลิกเลือกเพื่ออัปเดต</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {ORDER_FLOW_STEPS.map(({ step, key, label, icon: Icon, activeColor, note }) => {
                      const isCurrent = (selectedOrder.status || "").toUpperCase() === key;
                      const isUpdating = updatingId === (selectedOrder.orderId || selectedOrder._id);
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(selectedOrder.orderId || selectedOrder._id, key)}
                          className={`flex items-center gap-2.5 rounded-xl p-2.5 text-left text-xs font-bold transition-all cursor-pointer border ${
                            isCurrent
                              ? `${activeColor} shadow-md ring-2 ring-offset-1 ring-[#4c1f08]/30 scale-[1.01]`
                              : "bg-[#faf7f2] border-[#e8dfcf] text-stone-700 hover:bg-[#f1ead7] hover:border-[#dfd1c1]"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full text-[11px] font-black shrink-0 grid place-items-center ${
                              isCurrent ? "bg-white/25 text-white" : "bg-stone-200 text-stone-600"
                            }`}
                          >
                            {step}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 truncate">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{label}</span>
                            </div>
                            <div className={`text-[10px] font-normal truncate mt-0.5 ${isCurrent ? "text-white/80" : "text-stone-400"}`}>
                              {note}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* ตัวเลือกพิเศษ / ยกเลิกออเดอร์ */}
                  <div className="mt-3 pt-2.5 border-t border-dashed border-[#f1ead7] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400">
                      กรณีมีปัญหา ร้องขอคืนเงิน หรือลูกค้ายกเลิก:
                    </span>
                    <button
                      type="button"
                      disabled={updatingId === (selectedOrder.orderId || selectedOrder._id)}
                      onClick={() => handleUpdateStatus(selectedOrder.orderId || selectedOrder._id, "CANCELLED")}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                        (selectedOrder.status || "").toUpperCase() === "CANCELLED"
                          ? "bg-rose-700 text-white border-rose-800 shadow-sm ring-2 ring-offset-1 ring-rose-500/30"
                          : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      <XCircleIcon className="w-3.5 h-3.5" />
                      <span>ยกเลิกออเดอร์ (Cancelled)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 border-t border-[#dfd1c1] pt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#4c1f08] px-6 py-2 text-xs font-bold text-white hover:bg-[#6b3215] transition-colors cursor-pointer shadow-xs"
              >
                <span>ปิดหน้าต่าง</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
