import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo_brown_choc.png";
import customerAvatar from "../mock-data/assets/reviews/praew.jpg";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";

function BasketIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9h18l-1.4 9H4.4L3 9Z" />
      <path d="m8 9 4-5 4 5M8 13v2m4-2v2m4-2v2" />
    </svg>
  );
}

function AdminToolsIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function PackageIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}


function ProfileMenuIcon({ type }) {
  const paths = {
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),
    orders: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

function DashboardGridIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function LeafIngredientIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9a9 9 0 0 1-9 9zm0 0v-9m0 0a4.5 4.5 0 0 1 4.5-4.5M12 12a4.5 4.5 0 0 0-4.5-4.5" />
    </svg>
  );
}

function ClipboardListIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function UsersGroupIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
  );
}

const navigationByRole = {
  guest: [
    { label: "หน้าแรก", to: "/" },
    { label: "เมนูอาหาร", to: "/menus" },
    { label: "ทดสอบธาตุ", to: "/element-quiz" },
    { label: "สุ่มเมนู", to: "/menu-randomizer" },
  ],
  customer: [
    { label: "หน้าแรก", to: "/" },
    { label: "เมนูอาหาร", to: "/menus" },
    { label: "ทดสอบธาตุ", to: "/element-quiz" },
    { label: "สุ่มเมนู", to: "/menu-randomizer" },
  ],
  admin: [
    { label: "แดชบอร์ด", to: "/admin/dashboard", icon: DashboardGridIcon },
    { label: "ออเดอร์", to: "/admin/orders", icon: ClipboardListIcon },
    { label: "สินค้า", to: "/admin/products", icon: PackageIcon },
    // =========================================================================
    // [มาร์กจุดเชื่อมต่อ: เมนูวัตถุดิบ - รอเพื่อนร่วมทีมพัฒนาหน้าเสร็จ]
    // TODO: เมื่อเพื่อนทำหน้าเสร็จแล้ว ให้ลบ isPending: true ออก เพื่อให้ลิงก์ไป /admin/ingredients ได้ทันที
    // =========================================================================
    { label: "วัตถุดิบ", to: "/admin/ingredients", icon: LeafIngredientIcon, isPending: true },
    { label: "ผู้ใช้", to: "/admin/users", icon: UsersGroupIcon },
  ],
};

function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

const ADMIN_MENU_LINKS = [
  { to: "/admin/products", label: "จัดการรายการสินค้า", shortLabel: "สินค้า", icon: PackageIcon },
  { to: "/admin/products/new", label: "เพิ่มสินค้าใหม่", shortLabel: "เพิ่มสินค้า", icon: PlusIcon },
  { to: "/admin/ingredients", label: "คลังวัตถุดิบ", shortLabel: "วัตถุดิบ", icon: PackageIcon },
  { to: "/admin/recipe-builder", label: "ออกแบบสูตรอาหาร", shortLabel: "ออกแบบสูตร", icon: AdminToolsIcon },
];

export default function Navbar({ cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { currentUser, logout } = useAuth();
  const currentRole = currentUser?.role || "guest";
  const isAdmin = currentRole === "admin" || location.pathname.startsWith("/admin");

  const links = navigationByRole[currentRole] ?? navigationByRole.guest;

  const displayName =
    currentUser?.firstName || (currentRole === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก");
  const displayRole =
    currentRole === "admin"
      ? "ผู้ดูแลระบบ (Admin)"
      : currentUser?.tierStatus
        ? `สมาชิก ${currentUser.tierStatus}`
        : "ลูกค้าสมาชิก";

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    if (toast?.success) toast.success("ออกจากระบบเรียบร้อยแล้ว");
    navigate("/");
  };

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5">
      <nav
        className="mx-auto w-full max-w-[1200px] rounded-[2rem] border border-white/50
         bg-[#f4ebd9]/90 p-1.5 shadow-[0_12px_32px_rgba(61,44,46,0.15)] 
         backdrop-blur-[12px] lg:flex lg:items-center lg:justify-between lg:rounded-[64px] lg:px-6 lg:py-2"
        aria-label="เมนูหลัก"
      >
        {/* Logo & Mobile Actions */}
        <div className="flex w-full items-center justify-between px-2 lg:w-auto lg:px-0">
          <Link
            to={currentRole === "admin" ? "/admin/dashboard" : "/"}
            aria-label={currentRole === "admin" ? "แดชบอร์ดผู้ดูแลระบบ" : "หน้าหลัก"}
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
            className="inline-flex shrink-0 items-center transition-transform hover:scale-105"
          >
            <img
              src={logo}
              alt="ธาตุแท้ That Tae"
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          {/* Mobile Right Icons (Cart & Hamburger) */}
          <div className="flex items-center gap-2 lg:hidden">
            {!isAdmin && (
              <Link
                to="/cart"
                aria-label={`ตะกร้า มีสินค้า ${cartCount} รายการ`}
                className="relative grid h-10 w-10 place-items-center rounded-full text-[#4c1f08] transition-colors hover:bg-[#8d593a]/15"
              >
                <BasketIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#8b5e34] px-1 text-[10px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#4c1f08] text-white shadow-sm cursor-pointer hover:bg-[#6b3215] transition-colors"
              aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? (
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links พร้อมไอคอน */}
        <div className="hidden items-center justify-center gap-1 lg:flex">
          {links.map((link) => {
            const Icon = link.icon;

            if (link.isPending) {
              return (
                /* =========================================================================
                   [มาร์กจุดเชื่อมต่อ: เมนูวัตถุดิบ Navbar - รอเพื่อนพัฒนาเสร็จ]
                   TODO: เมื่อเพื่อนทำหน้าเสร็จแล้ว ให้เปลี่ยนเป็น <Link to="/admin/ingredients">
                   ========================================================================= */
                <button
                  key={link.to}
                  type="button"
                  onClick={() => {
                    /* TODO: navigate(link.to); เมื่อเพื่อนทำหน้าเสร็จ */
                    alert("เมนูวัตถุดิบ: อยู่ระหว่างการพัฒนาโดยเพื่อนในทีม (รอเชื่อมต่อไปยังหน้า /admin/ingredients)");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-[#3b2a1a] hover:bg-[#8d593a]/15 hover:text-[#201a1a] cursor-pointer transition-colors"
                  title="รอเชื่อมต่อกับหน้าจัดการวัตถุดิบของเพื่อนร่วมทีม"
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-[#3d7a36]" />}
                  <span>{link.label}</span>
                </button>
              );
            }

            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${isActive
                    ? "bg-[#8b5e34] text-white shadow-sm"
                    : "text-[#3b2a1a] hover:bg-[#8d593a]/15 hover:text-[#201a1a]"
                  }`}
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-[#8b5e34]"
                      }`}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Actions (Cart & Profile/Login) */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Cart Icon (เฉพาะลูกค้า ไม่แสดงสำหรับ Admin และหน้าจัดการ/Dashboard) */}
          {!isAdmin && (
            <Link
              to="/cart"
              aria-label={`ตะกร้า มีสินค้า ${cartCount} รายการ`}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#4c1f08] transition-colors duration-200 hover:bg-[#8d593a]/15 cursor-pointer"
            >
              <BasketIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#f4ebd9] bg-[#8b5e34] px-1 text-xs font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile Dropdown or Login Button */}
          {currentUser ? (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#4c1f08] py-1 pl-1.5 pr-3.5 font-bold text-white shadow-sm cursor-pointer hover:bg-[#6b3215] transition-colors"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                {currentRole === "admin" ? (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-[#f1ead7]">
                    <AdminToolsIcon className="h-4 w-4 text-white" />
                  </span>
                ) : (
                  <img
                    src={customerAvatar}
                    alt=""
                    className="h-8 w-8 rounded-full border border-white/70 object-cover"
                  />
                )}
                <div className="flex flex-col text-left">
                  <span className="text-sm leading-tight font-bold">{displayName}</span>
                  <span className="text-[10px] font-normal text-[#e7d8cb] leading-none">{displayRole}</span>
                </div>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m5.25 7.5 4.75 4.75 4.75-4.75" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              <div
                className={`absolute right-0 top-[calc(100%+8px)] w-60 origin-top-right overflow-hidden rounded-2xl border border-[#dfd1c1] bg-[#fdfbf7] p-2 text-[#3d2c2e] shadow-xl transition-all duration-200 z-50 ${isProfileOpen
                    ? "opacity-100 scale-100 pointer-events-auto visible"
                    : "opacity-0 scale-95 pointer-events-none invisible"
                  }`}
                role="menu"
              >
                {currentRole === "customer" ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#f1dec9]"
                    >
                      <ProfileMenuIcon type="profile" />
                      โปรไฟล์ของฉัน
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#f1dec9]"
                    >
                      <ProfileMenuIcon type="orders" />
                      รายการคำสั่งซื้อของฉัน
                    </Link>
                  </>
                ) : (
                  /* แอดมิน: มีเฉพาะ โปรไฟล์ของฉัน ตามที่กำหนด */
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#f1dec9]"
                  >
                    <ProfileMenuIcon type="profile" />
                    โปรไฟล์ของฉัน
                  </Link>
                )}

                <div className="my-1 border-t border-[#dfd1c1]/60" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#9b3f32] transition-colors hover:bg-[#f8e4df] cursor-pointer text-left"
                >
                  <ProfileMenuIcon type="logout" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-full bg-[#4c1f08] px-5 py-2 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-[#6b3215]"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        {/* Mobile Dropdown Navigation */}
        <div
          className={`transition-all duration-300 lg:hidden ${isOpen
              ? "max-h-[85vh] opacity-100 py-3 border-t border-[#dfd1c1] mt-2 overflow-y-auto pointer-events-auto"
              : "max-h-0 opacity-0 py-0 pointer-events-none overflow-hidden invisible"
            }`}
        >
          <div className="flex flex-col gap-1 px-1">
            {links.map((link) => {
              const Icon = link.icon;

              if (link.isPending) {
                return (
                  /* =========================================================================
                     [มาร์กจุดเชื่อมต่อ: เมนูวัตถุดิบใน Mobile Menu - รอเพื่อนพัฒนาเสร็จ]
                     TODO: เมื่อเพื่อนทำหน้าเสร็จ ให้เปลี่ยนเป็น <Link to="/admin/ingredients">
                     ========================================================================= */
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      /* TODO: navigate(link.to); เมื่อเพื่อนทำหน้าเสร็จ */
                      alert("เมนูวัตถุดิบ: อยู่ระหว่างการพัฒนาโดยเพื่อนในทีม (รอเชื่อมต่อไปยังหน้า /admin/ingredients)");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-base font-semibold text-[#3b2a1a] hover:bg-[#8d593a]/15 text-left cursor-pointer"
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0 text-[#3d7a36]" />}
                    <span>{link.label}</span>
                  </button>
                );
              }

              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    setIsOpen(false);
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-base font-semibold transition-colors ${isActive
                      ? "bg-[#8b5e34] text-white"
                      : "text-[#3b2a1a] hover:bg-[#8d593a]/15"
                    }`}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="my-2 h-px bg-[#dfd1c1]" />

            {currentUser ? (
              <div className="space-y-2 pt-1">
                {/* Profile Card รวมปุ่มโปรไฟล์และออกจากระบบไว้ด้วยกันในแถวเดียว ไม่ต้องมีปุ่มแยกด้านล่าง */}
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#4c1f08] p-2.5 sm:p-3 text-white shadow-sm">
                  <Link
                    to="/profile"
                    onClick={() => {
                      setIsOpen(false);
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    }}
                    className="flex flex-1 items-center gap-2.5 min-w-0 pr-1 transition-opacity hover:opacity-95 group"
                    title="ไปที่โปรไฟล์ของฉัน"
                  >
                    {currentRole === "admin" ? (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 text-[#f1ead7] group-hover:bg-white/30 transition-colors">
                        <AdminToolsIcon className="h-5 w-5 text-white" />
                      </span>
                    ) : (
                      <img
                        src={customerAvatar}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full border border-white/70 object-cover"
                      />
                    )}
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm leading-tight font-bold truncate">{displayName}</strong>
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white group-hover:bg-white/30 transition-colors">
                          โปรไฟล์ของฉัน &rarr;
                        </span>
                      </div>
                      <span className="block text-[11px] text-[#e7d8cb] truncate">{displayRole}</span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500/80 transition-colors cursor-pointer shrink-0"
                  >
                    ออกจากระบบ
                  </button>
                </div>

                {currentRole === "customer" && (
                  <Link
                    to="/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/80 p-2.5 text-xs font-bold text-[#3d2c2e] hover:bg-white shadow-xs"
                  >
                    <ProfileMenuIcon type="orders" />
                    รายการคำสั่งซื้อของฉัน
                  </Link>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-[#4c1f08] py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#6b3215]"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
