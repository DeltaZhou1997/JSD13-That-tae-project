// client/src/components/ai/AIAdvisorWidget.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PlanNudge from "./PlanNudge.jsx";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext.js";
import { useProducts } from "../../context/ProductsContext.js";
import { getUserElement } from "../../utils/quizHelpers.js";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import { askAdvisor } from "../../utils/advisorApi.js";
import {
  queryThatTaeAI,
  AI_QUICK_QUESTIONS,
  ADMIN_QUICK_QUESTIONS,
} from "../../utils/aiAdvisorEngine.js";

const nowTime = () =>
  new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

// แสดง **ตัวหนา** แบบง่าย (React escape ข้อความให้อยู่แล้ว)
function RichText({ text }) {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function ProductChip({ product, onAdd, canAdd }) {
  const soldOut = product.inStock === false;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#eadfce] bg-[#fffdf9] p-1.5">
      {product.imageUrl ? (
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt=""
          className="h-9 w-9 shrink-0 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-9 w-9 shrink-0 rounded-lg bg-[#f3e9dc]" />
      )}
      <Link to={`/menus/${product.id}`} className="min-w-0 flex-1 hover:underline">
        <p className="truncate text-[11px] font-bold text-[#3b2a20]">{product.name}</p>
        <p className="truncate text-[10px] text-stone-500">
          {product.price} ฿ · {product.region} · ธาตุ{product.dominantElement}
          {soldOut && <span className="ml-1 font-bold text-red-600">สินค้าหมด</span>}
        </p>
      </Link>
      {canAdd && !soldOut && (
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="shrink-0 rounded-lg bg-[#8d593a] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#73472c] cursor-pointer"
          title="เพิ่มลงตะกร้า"
        >
          + ตะกร้า
        </button>
      )}
    </div>
  );
}

export default function AIAdvisorWidget({ cartItems = [], onAddToCart, onAddSet, selectedPlan, onSelectPlan }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { products } = useProducts();

  const isAdmin = currentUser?.role === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);

  const userElement = useMemo(() => getUserElement(currentUser), [currentUser]);
  const quickQuestions = isAdmin ? ADMIN_QUICK_QUESTIONS : AI_QUICK_QUESTIONS;
  const displayName = currentUser?.firstName || currentUser?.name;

  // Initial welcome message (เริ่มใหม่เมื่อเปลี่ยนผู้ใช้ — กันประวัติแชทข้ามบัญชี)
  useEffect(() => {
    let greeting;
    if (isAdmin) {
      greeting = `สวัสดีครับคุณ${displayName || "แอดมิน"} 🛠️\nผมช่วยสรุปสต็อก เมนูที่หมด และภาพรวมคำสั่งซื้อ พร้อมแนะนำหน้าที่ต้องไปจัดการได้ครับ (การแก้ไขข้อมูลทำในหน้าแอดมินเท่านั้น)`;
    } else if (userElement) {
      greeting = `สวัสดีครับคุณ${displayName || "ผู้รักสุขภาพ"}! ✨\nผมตรวจพบว่าคุณมีธาตุเจ้าเรือนคือ **ธาตุ${userElement}** ให้ผมช่วยจัดเซตอาหาร สุ่มเมนู หรือเช็กคำสั่งซื้อได้เลยครับ`;
    } else {
      greeting = `สวัสดีครับ! ยินดีต้อนรับสู่ **ธาตุแท้ That-Tae** 🌿\nผมช่วยแนะนำเมนูตามธาตุเจ้าเรือน จัดเซตอาหารตามไซส์ สุ่มเมนู และพาไปหน้าต่าง ๆ ในเว็บได้ครับ`;
    }
    setMessages([{ id: 1, sender: "ai", text: greeting, time: nowTime() }]);
  }, [userElement, currentUser?.id, currentUser?._id, isAdmin, displayName]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // แอนิเมชันตอนเปิด: หน้าต่างเด้งขึ้นจากปุ่ม แล้วส่วนหัว/ข้อความ/ช่องพิมพ์ค่อย ๆ ไล่โผล่
  useEffect(() => {
    const el = chatWindowRef.current;
    if (!isOpen || !el) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          el,
          { opacity: 0, y: 24, scale: 0.92, filter: "blur(6px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" },
        )
        .from(el.querySelectorAll("[data-anim]"), { opacity: 0, y: 10, duration: 0.35, stagger: 0.06, ease: "power2.out" }, "-=0.25");
    }, el);
    return () => ctx.revert();
  }, [isOpen]);

  // ปิดแบบนุ่มนวล: ย่อกลับลงไปที่ปุ่มก่อนค่อยถอดออก
  const closingRef = useRef(false);
  const closeChat = (after) => {
    const el = chatWindowRef.current;
    if (!el || closingRef.current) {
      setIsOpen(false);
      after?.();
      return;
    }
    closingRef.current = true;
    gsap.to(el, {
      opacity: 0,
      y: 18,
      scale: 0.94,
      filter: "blur(4px)",
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        closingRef.current = false;
        setIsOpen(false);
        after?.();
      },
    });
  };

  const pushAi = (msg) =>
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), sender: "ai", time: nowTime(), ...msg }]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    // ประวัติที่ส่งให้ server (ไม่รวมข้อความต้อนรับ)
    const history = messages
      .slice(1)
      .slice(-6)
      .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", text: m.text }));

    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text, time: nowTime() }]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const res = await askAdvisor({
        message: text,
        history,
        // guest เท่านั้น: server ไม่มีข้อมูลธาตุ/ตะกร้าของ guest (ผู้ใช้ที่ล็อกอิน server ดึงจาก DB เอง)
        guestElement: currentUser ? undefined : userElement,
        guestCartProductIds: currentUser
          ? []
          : cartItems.map((i) => i.productId || i._id || i.id).filter(Boolean),
      });
      pushAi({
        text: res.reply,
        highlightElement: res.highlightElement,
        products: res.products || [],
        action: res.action || { type: "none" },
      });
    } catch (err) {
      if (err.status === 429 || err.status === 422) {
        pushAi({ text: err.message });
      } else {
        // AI/Server ไม่พร้อม → ใช้ตัวตอบออฟไลน์เดิม (ไม่มีแอดมินโหมด)
        const fallback = isAdmin
          ? { reply: "ตอนนี้ AI Advisor ไม่พร้อมใช้งาน ลองดูข้อมูลได้ที่หน้าแดชบอร์ดแอดมินครับ" }
          : queryThatTaeAI({ question: text, userElement, cartItems, allProducts: products || [] });
        pushAi({ text: `${fallback.reply}\n\n(โหมดออฟไลน์ — AI ไม่พร้อมใช้งานชั่วคราว)`, offline: true });
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleNavigate = (path) => {
    closeChat(() => navigate(path));
  };

  return (
    <aside
      aria-label="That-Tae AI Advisor"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[99] flex flex-col items-end select-none pointer-events-auto"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Chat Window Dialog (ลอยขึ้นมาเมื่อกดปุ่ม)                     */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{ transformOrigin: "bottom right" }}
          className="mb-3.5 w-[92vw] sm:w-[380px] max-h-[78vh] h-[560px] bg-white rounded-3xl border border-[#e8dfd1] shadow-2xl flex flex-col overflow-hidden text-[#2f2119] transition-all"
        >
          {/* Header */}
          <style>{`
            @keyframes advisorMsgIn { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
            .advisor-msg-in { animation: advisorMsgIn .32s cubic-bezier(.2,.8,.2,1) both; }
            @media (prefers-reduced-motion: reduce) { .advisor-msg-in { animation: none; } }
          `}</style>
          <div data-anim className="p-4 bg-gradient-to-r from-[#4a3228] to-[#6e432a] text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 text-amber-300 shadow-inner">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 animate-pulse">
                    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                  </svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#4a3228] rounded-full"></span>
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-sm tracking-tight truncate">
                  That-Tae Advisor{isAdmin ? " · Admin" : ""}
                </h3>
                <p className="text-[11px] text-stone-300 truncate">
                  {isAdmin
                    ? "ผู้ช่วยสรุปข้อมูลร้าน (อ่านอย่างเดียว)"
                    : userElement
                      ? `วิเคราะห์ตามธาตุ${userElement}`
                      : "ผู้ช่วยโภชนาการแพทย์แผนไทย"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => closeChat()}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="ย่อหน้าต่าง"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Quick Context Pill (แจ้งเตือนสถานะธาตุ) */}
          {!isAdmin &&
            (userElement ? (
              <div className="px-3.5 py-1.5 bg-[#fbf6ee] border-b border-[#ebdccf] flex items-center justify-between text-[11px] text-[#785b4b] shrink-0">
                <span className="truncate">
                  ธาตุเจ้าเรือนของคุณ: <strong>ธาตุ{userElement}</strong>
                </span>
                <Link to="/element-quiz" className="text-[10px] font-bold text-[#8d593a] hover:underline">
                  ดูผลวิเคราะห์ &rarr;
                </Link>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
                <span>ยังไม่ได้ตรวจธาตุเจ้าเรือน</span>
                <Link to="/element-quiz" className="text-[10px] font-bold text-amber-800 underline">
                  ตรวจเลย &rarr;
                </Link>
              </div>
            ))}

          {/* Message List */}
          <div data-anim className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fdfbf7] text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`advisor-msg-in flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed ${m.sender === "user"
                    ? "bg-[#8d593a] text-white rounded-br-xs"
                    : "bg-white border border-[#e8dfd1] text-[#33221b] rounded-bl-xs"
                    }`}
                >
                  <div className="whitespace-pre-line break-words">
                    <RichText text={m.text} />
                  </div>

                  {/* จัดเซตตามไซส์ */}
                  {m.action?.type === "build_set" && m.action.plan && (
                    <div className="mt-2 rounded-xl bg-[#fbf6ee] px-2.5 py-1.5 text-[11px] text-[#6b4e3d]">
                      <strong>{m.action.plan.name}</strong> · {m.action.plan.kitsPerWeek} เมนู · {m.action.plan.price} ฿/สัปดาห์
                      {!m.action.complete && (
                        <p className="mt-0.5 text-amber-700">
                          ตอนนี้มีเมนูพร้อมขายที่ตรงเงื่อนไขเพียง {m.products?.length || 0} เมนู
                        </p>
                      )}
                    </div>
                  )}

                  {m.products?.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {m.products.map((p) => (
                        <ProductChip key={p.id} product={p} onAdd={onAddToCart} canAdd={!isAdmin && Boolean(onAddToCart)} />
                      ))}
                    </div>
                  )}

                  {m.action?.type === "build_set" && !isAdmin && onAddSet && m.products?.some((p) => p.inStock !== false) && (
                    <button
                      type="button"
                      onClick={() => onAddSet(m.products, m.action.plan?.id)}
                      className="mt-2 w-full rounded-xl bg-[#4a3228] py-2 text-[11px] font-bold text-white hover:bg-[#3b271f] cursor-pointer"
                    >
                      เพิ่มทั้งเซตลงตะกร้า + เลือก {m.action.plan?.name}
                    </button>
                  )}

                  {m.action?.type === "navigate" && m.action.path && (
                    <button
                      type="button"
                      onClick={() => handleNavigate(m.action.path)}
                      className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#8d593a] px-3 py-1 text-[11px] font-bold text-[#8d593a] hover:bg-[#8d593a] hover:text-white cursor-pointer"
                    >
                      ไปที่{m.action.label} &rarr;
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-stone-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e8dfd1] rounded-2xl w-fit text-stone-400">
                <span className="w-1.5 h-1.5 bg-[#8d593a] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#8d593a] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#8d593a] rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Tag Carousel */}
          <div data-anim className="px-3 py-2 bg-[#f8f3eb] border-t border-[#ede3d6] flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={isTyping}
                onClick={() => handleSend(q)}
                className="shrink-0 text-[10px] bg-white hover:bg-[#ede1d3] disabled:opacity-50 text-[#6b4e3d] border border-[#dfd2c4] rounded-full px-2.5 py-1 font-medium transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            data-anim
            className="p-2.5 bg-white border-t border-[#e8dfd1] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              maxLength={500}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isAdmin ? "ถามเรื่องสต็อก คำสั่งซื้อ เมนู..." : "ถามอาการ จัดเซต สุ่มเมนู เช็กออเดอร์..."}
              className="flex-1 bg-[#FAF7F2] border border-[#d8c8b8] rounded-xl px-3 py-2 text-xs text-[#2f2119] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8d593a]/30 focus:border-[#8d593a]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-[#8d593a] hover:bg-[#73472c] disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* คำแนะนำแพ็กเกจ (หน้าเมนู เมื่อมีของในตะกร้า และหน้าต่างแชทปิดอยู่) */}
      {!isOpen && !isAdmin && location.pathname.startsWith("/menus") && (
        <PlanNudge
          cartItems={cartItems}
          selectedPlan={selectedPlan}
          onSelectPlan={onSelectPlan}
          onGoCart={() => navigate("/cart")}
          onBrowse={() => (location.pathname === "/menus" ? window.scrollTo({ top: 0, behavior: "smooth" }) : navigate("/menus"))}
        />
      )}

      {/* 2. Floating Action Button (FAB) AI Advisor                    */}
      {/* ------------------------------------------------------------- */}
      <button
        type="button"
        onClick={() => (isOpen ? closeChat() : setIsOpen(true))}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full
        bg-gradient-to-r from-[#4a3228] to-[#754a32] hover:from-[#3b271f] hover:to-[#613c28]
        text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5
        active:scale-95 border-white/25 cursor-pointer"
        title="เปิด AI Advisor ผู้ช่วยแนะนำสุขภาพตามธาตุ"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-6 h-6 rounded-full text-amber-300 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-start text-left leading-none pr-1">
          <span className="text-sm font-extrabold tracking-tight flex items-center gap-1 text-white">
            <span>That-Tae Advisor</span>
          </span>
        </div>
      </button>
    </aside>
  );
}
