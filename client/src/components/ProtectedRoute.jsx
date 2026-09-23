import React from "react";
import { Navigate, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import LoadingThai from "./LoadingThai.jsx";

/**
 * ProtectedRoute Component
 * ป้องกันการเข้าถึงหน้าเว็บที่ไม่ได้รับอนุญาต:
 * 1. ตรวจสอบการ Login (Token + currentUser)
 * 2. ตรวจสอบ Role (เช่น เฉพาะ 'admin')
 * 3. มี Loading Spinner ขณะตรวจสอบ Token จริงกับเซิร์ฟเวอร์
 */
export default function ProtectedRoute({ allowedRoles, requireAuth = true, children }) {
  const { currentUser, token, isLoading } = useAuth();
  const location = useLocation();

  // 1. ระหว่างที่ AuthProvider กำลังยืนยันความถูกต้องของ JWT Token กับเซิร์ฟเวอร์
  if (isLoading) {
    return <LoadingThai label="กำลังตรวจสอบสิทธิ์การเข้าใช้งาน..." className="min-h-[70vh]" />;
  }

  // 2. กรณีต้องเข้าสู่ระบบ แต่ผู้ใช้ยังไม่ได้เข้าสู่ระบบ (ไม่มี Token หรือ User)
  if (requireAuth && (!currentUser || !token)) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // 3. กรณีมีการจำกัด Role (เช่น สำหรับ Admin เท่านั้น) แต่ Role ของผู้ใช้ปัจจุบันไม่ตรงกับที่ระบุ
  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = currentUser?.role || "customer";
    const hasPermission = allowedRoles.includes(currentRole);

    if (!hasPermission) {
      return (
        <div className="min-h-[75vh] flex items-center justify-center p-4 bg-stone-50/50">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Warning Shield Icon */}
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-600 shadow-sm">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              403 Forbidden
            </div>

            <h2 className="text-xl font-bold text-stone-900 mb-2">ปฏิเสธการเข้าถึง (Access Denied)</h2>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              ขออภัย หน้านี้สงวนสิทธิ์เฉพาะ <span className="font-semibold text-rose-700">ผู้ดูแลระบบ (Admin)</span> เท่านั้น
              บัญชีปัจจุบันของคุณคือ <span className="font-medium text-stone-900">"{currentUser?.email}"</span> (สถานะ: {currentRole === "customer" ? "สมาชิกทั่วไป" : currentRole}) ไม่สามารถเข้าใช้งานส่วนนี้ได้
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                กลับสู่หน้าหลัก
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl font-medium text-sm transition-all active:scale-95"
              >
                ดูโปรไฟล์ของคุณ
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // 4. สิทธิ์ถูกต้อง อนุญาตให้เข้าถึง Component ย่อย
  return children ? children : <Outlet />;
}
