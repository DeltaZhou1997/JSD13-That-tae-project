import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

import logo from "../assets/logo_brown_choc.png";
import customerAvatar from "../mock-data/assets/reviews/praew.jpg";
import { useAuth } from "../context/AuthContext.js";

function BasketIcon({ className = "h-10 w-10" }) {
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

function ProfileMenuIcon({ type }) {
  const paths = {
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    orders: <><path d="M6 3h12v18H6z" /><path d="M9 7h6M9 11h6M9 15h4" /></>,
    edit: <><path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20Z" /><path d="m13.8 7 3.2 3.2" /></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

// เปลี่ยนค่านี้เป็น "guest", "customer" หรือ "admin" เพื่อดู Navbar แต่ละแบบ
const NAV_PREVIEW_ROLE = "customer";

const navigationByRole = {
  guest: {
    links: [
      { label: "หน้าแรก", to: "/" },
      { label: "เมนูอาหาร", to: "/menus" },
      { label: "บทความ", to: "/articles" },
      { label: "ติดต่อ", to: "/contacts" },
      { label: "เกี่ยวกับเรา", to: "/about" },
    ],
    action: { label: "เข้าสู่ระบบ", to: "/login", icon: "👋" },
    mobileTitle: "สวัสดี",
    mobileDetail: "กรุณาเข้าสู่ระบบ",
  },
  customer: {
    links: [
      { label: "หน้าแรก", to: "/" },
      { label: "เมนูอาหาร", to: "/menus" },
      { label: "บทความ", to: "/articles" },
      { label: "ติดต่อ", to: "/contacts" },
      { label: "เกี่ยวกับเรา", to: "/about" },
    ],
    action: { label: "ตะกร้า", to: "/cart", badge: 2 },
    profile: { name: "ณัฐชา", to: "/profile", avatar: customerAvatar },
    mobileTitle: "บัญชีลูกค้า",
    mobileDetail: "ดูตะกร้าและคำสั่งซื้อ",
  },
  admin: {
    links: [
      { label: "แดชบอร์ด", to: "/admin" },
      { label: "จัดการเมนู", to: "/admin/menus" },
      { label: "คำสั่งซื้อ", to: "/admin/orders" },
      { label: "ผู้ใช้งาน", to: "/admin/users" },
      { label: "รีวิว", to: "/admin/reviews" },
    ],
    action: { label: "แอดมิน", to: "/admin/profile", icon: "🛠️" },
    mobileTitle: "ผู้ดูแลระบบ",
    mobileDetail: "จัดการข้อมูลเว็บไซต์",
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const timelineRef = useRef(null);
  const profileTimelineRef = useRef(null);
  const location = useLocation();
  const navigation =
    navigationByRole[NAV_PREVIEW_ROLE] ?? navigationByRole.guest;
  const { links, action } = navigation;

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = reduceMotion ? 0.01 : 0.42;

      timelineRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.inOut" } })
        .to(
          "[data-menu-line='top']",
          { y: 6, rotation: 45, duration: duration * 0.8 },
          0,
        )
        .to(
          "[data-menu-line='middle']",
          { scaleX: 0, autoAlpha: 0, duration: duration * 0.5 },
          0,
        )
        .to(
          "[data-menu-line='bottom']",
          { y: -6, rotation: -45, duration: duration * 0.8 },
          0,
        )
        .fromTo(
          dropdownRef.current,
          { height: 0, autoAlpha: 0, y: -10 },
          { height: "auto", autoAlpha: 1, y: 0, duration },
          0,
        )
        .fromTo(
          "[data-mobile-menu-item]",
          { autoAlpha: 0, x: -18 },
          {
            autoAlpha: 1,
            x: 0,
            stagger: reduceMotion ? 0 : 0.055,
            duration: duration * 0.75,
            ease: "power2.out",
          },
          duration * 0.38,
        );

      profileTimelineRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          profileDropdownRef.current,
          { autoAlpha: 0, y: -10, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: reduceMotion ? 0.01 : 0.25 },
        )
        .fromTo(
          "[data-profile-menu-item]",
          { autoAlpha: 0, x: 10 },
          { autoAlpha: 1, x: 0, stagger: reduceMotion ? 0 : 0.04, duration: reduceMotion ? 0.01 : 0.18 },
          reduceMotion ? 0 : 0.06,
        );
    }, headerRef);

    return () => {
      timelineRef.current = null;
      profileTimelineRef.current = null;
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (isOpen) timelineRef.current?.play();
    else timelineRef.current?.reverse();
  }, [isOpen]);

  useEffect(() => {
    if (isProfileOpen) profileTimelineRef.current?.play();
    else profileTimelineRef.current?.reverse();
  }, [isProfileOpen]);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeProfileMenu);
    return () => document.removeEventListener("pointerdown", closeProfileMenu);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[100] px-3 pt-4 sm:px-5"
    >
      <nav
        className="mx-auto w-full max-w-[1200px] rounded-[2rem] border border-white/40
         bg-[#f1ead7]/75 p-1
        shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-[8px] 
        backdrop-saturate-[70%] 
        lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center 
        lg:gap-4 lg:rounded-[64px] lg:p-1.5"
        aria-label="เมนูหลัก"
      >
        <div className="flex w-full items-center justify-between px-1 lg:w-auto lg:px-0">
          <Link
            to="/"
            aria-label="หน้าหลัก"
            className="ml-1 inline-flex shrink-0 items-center"
          >
            <img
              src={logo}
              alt="ธาตุแท้"
              className="h-14 w-auto sm:h-16 lg:h-18"
            />
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            {NAV_PREVIEW_ROLE === "customer" && (
              <Link
                to={action.to}
                aria-label={`ตะกร้า มีสินค้า ${action.badge} รายการ`}
                className="relative mr-1 grid h-10 w-10 place-items-center rounded-full text-[#4c1f08] transition-colors hover:bg-[#8d593a]/15 sm:h-11 sm:w-11"
              >
                <BasketIcon className="h-8 w-8" />
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#f1ead7] bg-[#c89465] px-1 text-[10px] font-bold text-white">
                  {action.badge}
                </span>
              </Link>
            )}

            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full bg-[#3d2c2e] text-white shadow-[0_8px_20px_rgba(61,44,46,.22)] sm:h-14 sm:w-14"
              aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen((current) => !current)}
            >
              <span className="flex w-5 flex-col gap-1">
                <span
                  data-menu-line="top"
                  className="block h-0.5 w-5 origin-center rounded-full bg-current"
                />
                <span
                  data-menu-line="middle"
                  className="block h-0.5 w-5 origin-center rounded-full bg-current"
                />
                <span
                  data-menu-line="bottom"
                  className="block h-0.5 w-5 origin-center rounded-full bg-current"
                />
              </span>
            </button>
          </div>
        </div>

        <div className="hidden min-w-0 items-center justify-center gap-1 whitespace-nowrap lg:flex lg:gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-2 py-1 text-xl font-bold text-[#201a1a]
              opacity-75 transition-[opacity,background-color,transform]
              duration-500 ease-out
               hover:bg-[#8d593a]/24 hover:opacity-100
              lg:px-4 lg:text-xl"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {NAV_PREVIEW_ROLE === "customer" ? (
          <div className="mr-1 hidden items-center gap-2 lg:flex">
            <Link
              to={action.to}
              aria-label={`ตะกร้า มีสินค้า ${action.badge} รายการ`}
              className="relative grid h-13 w-13 shrink-0 place-items-center rounded-full text-[#4c1f08] transition-colors duration-200 hover:bg-[#8d593a]/15"
            >
              <BasketIcon />
              <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-[#f1ead7] bg-[#c89465] px-1 text-xs font-bold text-white">
                {action.badge}
              </span>
            </Link>

            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="inline-flex h-13 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#4c1f08] py-1.5 pl-1.5 pr-4 font-bold text-white shadow-sm cursor-pointer hover:bg-[#6b3215]"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                aria-controls="customer-profile-menu"
              >
                <img
                  src={navigation.profile.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white/70 object-cover"
                />
                <span className="text-lg">{navigation.profile.name}</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m5.25 7.5 4.75 4.75 4.75-4.75" />
                </svg>
              </button>

              <div
                ref={profileDropdownRef}
                id="customer-profile-menu"
                role="menu"
                aria-hidden={!isProfileOpen}
                className={`invisible absolute right-0 top-[calc(100%+4px)] w-64 origin-top-right overflow-hidden rounded-4xl border border-[#dfd1c1] bg-[#fdfbf7] p-2 text-[#3d2c2e] opacity-0 shadow-[0_18px_45px_rgba(61,44,46,0.2)] ${isProfileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <Link
                  data-profile-menu-item
                  to="/profile"
                  role="menuitem"
                  tabIndex={isProfileOpen ? 0 : -1}
                  className="flex items-center gap-3 rounded-full px-4 py-3 font-medium transition-colors hover:bg-[#f1dec9]"
                >
                  <ProfileMenuIcon type="profile" />
                  โปรไฟล์ของฉัน
                </Link>
                <Link
                  data-profile-menu-item
                  to="/orders"
                  role="menuitem"
                  tabIndex={isProfileOpen ? 0 : -1}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors hover:bg-[#f1dec9]"
                >
                  <ProfileMenuIcon type="orders" />
                  รายการคำสั่งซื้อของฉัน
                </Link>
                <Link
                  data-profile-menu-item
                  to="/profile/edit"
                  role="menuitem"
                  tabIndex={isProfileOpen ? 0 : -1}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors hover:bg-[#f1dec9]"
                >
                  <ProfileMenuIcon type="edit" />
                  แก้ไขข้อมูลส่วนตัว
                </Link>

                <Link
                  data-profile-menu-item
                  to="/login"
                  role="menuitem"
                  tabIndex={isProfileOpen ? 0 : -1}
                  className="flex items-center gap-3 rounded-b-3xl rounded-t-lg px-4 py-3 font-bold text-[#9b3f32] transition-colors hover:bg-[#f8e4df]"
                >
                  <ProfileMenuIcon type="logout" />
                  ออกจากระบบ
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <Link
            to={action.to}
            className="mr-1 hidden whitespace-nowrap rounded-full bg-[#4c1f08] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] lg:inline-flex md:text-xl"
          >
            {action.label}
          </Link>
        )}

        <div
          ref={dropdownRef}
          id="mobile-navigation"
          className={`max-h-[calc(100svh-76px)] h-0 overflow-x-hidden overflow-y-auto opacity-0 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div className="px-2 pb-2 pt-4">
            <div className="grid gap-1">
              {links.map((link) => (
                <Link
                  data-mobile-menu-item
                  key={link.to}
                  to={link.to}
                  className="group flex items-center rounded-xl px-3 py-3 text-[#3d2c2e] transition-colors hover:bg-[#8d593a]/10"
                >
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-[#3d2c2e]/12" />

            {NAV_PREVIEW_ROLE === "customer" ? (
              <div data-mobile-menu-item>
                <Link
                  to={navigation.profile.to}
                  className="flex min-w-0 items-center gap-3 rounded-full bg-[#3d2c2e] p-2 pr-4 text-white shadow-[0_10px_25px_rgba(61,44,46,.18)]"
                >
                  <img
                    src={navigation.profile.avatar}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-white/70 object-cover"
                  />
                  <span className="min-w-0">
                    <strong className="block truncate">{navigation.profile.name}</strong>
                    <span className="block truncate text-sm text-[#e7d8cb]">
                      บัญชีของฉัน
                    </span>
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                data-mobile-menu-item
                to={action.to}
                className="flex items-center gap-3 rounded-full bg-[#3d2c2e] p-4 text-white shadow-[0_10px_25px_rgba(61,44,46,.18)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12 text-xl">
                  {action.icon}
                </span>
                <span>
                  <strong className="block">{navigation.mobileTitle}</strong>
                  <span className="mt-0.5 block text-sm text-[#e7d8cb]">
                    {navigation.mobileDetail}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
