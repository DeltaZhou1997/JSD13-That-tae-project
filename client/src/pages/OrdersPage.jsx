import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const userId = currentUser?.id || currentUser?._id || "USR-001";

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/v1/orders/user/${userId}`);
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลรายการคำสั่งซื้อได้");
        const data = await res.json();
        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        console.warn("⚠️ เซิร์ฟเวอร์ออฟไลน์ ดึงข้อมูลจากคำสั่งซื้อสำรอง:", err.message);
        if (isMounted) {
          // ดึงจาก localStorage ถ้ามี
          try {
            const savedOrders = JSON.parse(localStorage.getItem("recent_orders") || "[]");
            setOrders(savedOrders);
          } catch {
            setOrders([]);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser, userId, apiUrl]);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-20 h-20 bg-[#f6ede5] rounded-full flex items-center justify-center text-[#8d593a] mb-4 shadow-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#3d2c2e] mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-[#6f675f] text-sm max-w-md mb-6">
          เข้าสู่ระบบเพื่อดูประวัติคำสั่งซื้อและสถานะการจัดส่งชุดวัตถุดิบ Cooking Kit
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

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
            ORDER HISTORY
          </span>
          <h1 className="text-3xl font-bold text-[#3d2c2e] mt-1 flex items-center gap-2">
            <span>รายการคำสั่งซื้อของฉัน</span>
          </h1>
          <p className="text-sm text-[#6f675f] mt-1">
            ติดตามสถานะและตรวจสอบประวัติการสั่งซื้อชุดอาหาร Cooking Kit ทั้งหมดของคุณ
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#8d593a] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-[#8d593a] font-medium">กำลังโหลดรายการคำสั่งซื้อ...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8d593a] mx-auto mb-4 shadow-sm border border-[#e8dfd1]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9" aria-hidden="true">
                <rect width="16" height="20" x="4" y="2" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <line x1="8" x2="16" y1="10" y2="10" />
                <line x1="8" x2="12" y1="14" y2="14" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#3d2c2e] mb-2">ยังไม่มีประวัติคำสั่งซื้อ</h3>
            <p className="text-sm text-[#6f675f] max-w-md mx-auto mb-6">
              คุณยังไม่เคยสั่งซื้อชุด Cooking Kit กับเรา เลือกลองทำเมนู 4 ภาคเพื่อสุขภาพได้เลยตอนนี้!
            </p>
            <Link
              to="/menus"
              className="inline-block bg-[#4c1f08] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#6b3215] transition-colors shadow-md text-sm cursor-pointer"
            >
              เลือกดูเมนูอาหาร
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => {
              const orderId = order.orderId || order.id || `ORD-${order._id?.slice(-6) || idx + 1}`;
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "เมื่อเร็วๆ นี้";

              const items = order.items || [];
              const totalAmount = order.grandTotal || order.total || order.pricing?.grandTotal || 0;
              const points = order.earnedPoints || order.pricing?.earnedPoints || 0;

              return (
                <div
                  key={orderId + idx}
                  className="bg-white border border-[#e8dfd1] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Card Header */}
                  <div className="bg-[#fcf8f2] px-6 py-4 border-b border-[#e8dfd1] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#3d2c2e] text-base">{orderId}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {order.status === "PAID" ? "ชำระเงินแล้ว" : order.status || "สำเร็จ"}
                        </span>
                      </div>
                      <span className="text-xs text-[#6f675f]">สั่งซื้อเมื่อ {orderDate}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#6f675f] block">ยอดชำระสุทธิ</span>
                      <span className="text-lg font-bold text-[#8d593a]">
                        ฿{totalAmount.toLocaleString()} THB
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 divide-y divide-[#f1ead7]">
                    {items.map((item, itemIdx) => (
                      <div key={itemIdx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-[#f6ede5] flex items-center justify-center text-[#8d593a] shrink-0 border border-[#e8dfd1] overflow-hidden">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.productName || item.name} className="w-full h-full object-cover" />
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                                <path d="M12 2v3M8 3.5v2M16 3.5v2M3 11h18c0 4.97-4.03 9-9 9s-9-4.03-9-9z" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-[#2f2119] truncate">
                              {item.productName || item.name || item.nameTh || "Cooking Kit เมนูพิเศษ"}
                            </h4>
                            <span className="text-xs text-[#6f675f]">
                              จำนวน {item.quantity || 1} ชุด × ฿{(item.price || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <span className="font-bold text-sm text-[#3d2c2e] shrink-0">
                          ฿{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="bg-[#faf6ef] px-6 py-3 border-t border-[#e8dfd1] flex items-center justify-between text-xs text-[#6f675f]">
                    <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-600" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>ได้รับแต้มสะสม:</span>
                      <span className="font-bold">+{points} แต้ม</span>
                    </div>
                    <span>จัดส่งถึง: {order.shippingAddress?.recipientName || order.shippingAddress?.fullName || currentUser?.firstName || "คุณ"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
