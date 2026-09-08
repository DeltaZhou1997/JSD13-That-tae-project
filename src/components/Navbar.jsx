import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

import logo from "../assets/logo_brown_choc.png";

const links = [
  { label: "หน้าแรก", to: "/" },
  { label: "เกี่ยวกับเรา", to: "/about" },
  { label: "เมนูอาหาร", to: "/menus" },
  { label: "บทความ", to: "/articles" },
  { label: "ติดต่อ", to: "/contacts" },
  { label: "เข้าสู่ระบบ", to: "/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const timelineRef = useRef(null);
  const location = useLocation();

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
    }, headerRef);

    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (isOpen) timelineRef.current?.play();
    else timelineRef.current?.reverse();
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[100] px-3 pt-9 sm:px-5 sm:pt-4"
    >
      <nav
        className="mx-auto w-full max-w-[1200px] rounded-[3rem] border border-white/40
         bg-[#f1ead7]/75 p-1.5
        shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-[8px] 
        backdrop-saturate-[70%] 
        lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center 
        lg:gap-4 lg:rounded-[64px]"
        aria-label="เมนูหลัก"
      >
        <div className="flex w-full items-center justify-between px-1 lg:w-auto lg:px-0">
          <Link
            to="/"
            aria-label="หน้าหลัก"
            className="ml-1 inline-flex shrink-0 items-center"
          >
            <img src={logo} alt="ธาตุแท้" className="h-20 w-auto md:h-18" />
          </Link>

          <button
            type="button"
            className="my-0.75 mr-0.3 grid h-18 w-18 place-items-center rounded-full bg-[#3d2c2e] text-white shadow-[0_8px_20px_rgba(61,44,46,.22)] lg:hidden"
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

        <div className="hidden min-w-0 items-center justify-center gap-1 whitespace-nowrap lg:flex lg:gap-2">
          {links.slice(0, -1).map((link) => (
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

        <Link
          to={links.at(-1)?.to || "/login"}
          className="mr-1 hidden whitespace-nowrap rounded-full bg-[#4c1f08] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] lg:inline-flex md:text-xl"
        >
          {links.at(-1)?.label || "เข้าสู่ระบบ"}
        </Link>

        <div
          ref={dropdownRef}
          id="mobile-navigation"
          className={`max-h-[calc(100svh-88px)] h-0 overflow-x-hidden overflow-y-auto opacity-0 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div className="px-2 pb-2 pt-4">
            <div className="grid gap-1">
              {links.slice(0, -1).map((link, index) => (
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

            <Link
              data-mobile-menu-item
              to="/login"
              className="flex items-center gap-3 rounded-full bg-[#3d2c2e] p-4 text-white shadow-[0_10px_25px_rgba(61,44,46,.18)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12 text-xl">
                👋
              </span>
              <span>
                <strong className="block">สวัสดี</strong>
                <span className="mt-0.5 block text-sm text-[#e7d8cb]">
                  กรุณาเข้าสู่ระบบ
                </span>
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}