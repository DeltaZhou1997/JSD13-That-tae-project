import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useOutletContext } from "react-router-dom";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import { useProducts } from "../../context/ProductsContext.js";
import { formatMissing, getStockStatus } from "../../utils/stock.js";

export default function CartItem({
  item,
  index,
  zone,
  coexistingCount = 0,
  boxHasSpace = false,
  onUpdateQuantity,
  onRemove,
  isSubItem = false,
  onToggleZone = null,
  onMoveOne = null,
  onMoveAll = null,
  onAddExtra = null,
  isDraggable = false,
  onDragStart = null,
  onDragEnter = null,
  onDragEnd = null,
  onDropItem = null,
  isDeleting = false,
  onDeleteConfirmed = null,
}) {
  const itemId = item._id || item.id;
  const displayName = item.nameTh || item.name || "Cooking Kit เมนูพิเศษ";
  const unitPrice = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;

  // สต็อก: เทียบกับจำนวน "รวม" ของเมนูนี้ในตะกร้า (กล่องแพ็กเกจ + A La Carte)
  const { products = [] } = useProducts() || {};
  const { cartItems = [] } = useOutletContext() || {};
  const product = products.find((p) => String(p._id || p.id) === String(itemId));
  const totalQtyInCart = Number(cartItems.find((c) => String(c._id || c.id) === String(itemId))?.quantity) || quantity;
  const stock = getStockStatus(product, totalQtyInCart);
  const canIncrease = !stock.soldOut && (stock.availableKits === null || totalQtyInCart < stock.availableKits);

  const [isOver, setIsOver] = useState(false);
  const rowRef = useRef(null);
  const qtyRef = useRef(null);

  // GSAP Smooth Mount Animation
  useEffect(() => {
    if (rowRef.current) {
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsOver(true);
    if (onDragEnter) onDragEnter(zone, index);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    if (onDropItem) onDropItem(zone, index);
  };

  const handleIncrease = () => {
    if (qtyRef.current) {
      gsap.fromTo(
        qtyRef.current,
        { scale: 1.45, color: "#8d593a" },
        { scale: 1, color: "#3d2c2e", duration: 0.3, ease: "back.out(2)" }
      );
    }
    onUpdateQuantity(itemId, 1, zone);
  };

  const handleDecrease = () => {
    if (qtyRef.current) {
      gsap.fromTo(
        qtyRef.current,
        { scale: 0.7, color: "#8d593a" },
        { scale: 1, color: "#3d2c2e", duration: 0.3, ease: "back.out(2)" }
      );
    }
    onUpdateQuantity(itemId, -1, zone);
  };

  // GSAP Exit Animation ONLY when isDeleting is true (after confirmation)
  useEffect(() => {
    if (isDeleting && rowRef.current) {
      gsap.to(rowRef.current, {
        opacity: 0,
        x: -35,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          if (onDeleteConfirmed) {
            onDeleteConfirmed(itemId, zone);
          }
        },
      });
    }
  }, [isDeleting, itemId, zone, onDeleteConfirmed]);

  const handleRemove = () => {
    onRemove(itemId, zone);
  };

  return (
    <div
      ref={rowRef}
      draggable={isDraggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, item, zone, index) : undefined}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-wrap sm:flex-nowrap items-center justify-between border-b border-[#f1ead7] py-3.5 last:border-0 gap-x-3 gap-y-2 transition-all duration-200 overflow-hidden ${
        stock.soldOut ? "bg-stone-50 px-2.5 rounded-2xl" : ""
      } ${
        isDraggable
          ? "cursor-grab active:cursor-grabbing hover:bg-[#faf6ef]/70 px-2.5 rounded-2xl"
          : ""
      } ${
        isOver
          ? "bg-[#f5ece0] border-t-2 border-t-[#8d593a] shadow-xs translate-y-0.5"
          : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Grip Handle Indicator */}
        {isDraggable && (
          <div
            className="text-stone-300 hover:text-[#8d593a] shrink-0 select-none p-1 rounded-md transition-colors"
            title="ลากเพื่อสลับลำดับ หรือย้ายระหว่างกล่อง"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="9" cy="5" r="1.2" />
              <circle cx="9" cy="12" r="1.2" />
              <circle cx="9" cy="19" r="1.2" />
              <circle cx="15" cy="5" r="1.2" />
              <circle cx="15" cy="12" r="1.2" />
              <circle cx="15" cy="19" r="1.2" />
            </svg>
          </div>
        )}

        {/* Thumbnail Image */}
        <div className={`relative w-12 h-12 rounded-xl bg-[#f6ede5] flex items-center justify-center shrink-0 border border-[#e8dfd1] overflow-hidden shadow-2xs ${stock.soldOut ? "grayscale opacity-60" : ""}`}>
          {item.imageUrl ? (
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt={displayName}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#8d593a]">
              <path d="M12 2v3M8 3.5v2M16 3.5v2M3 11h18c0 4.97-4.03 9-9 9s-9-4.03-9-9z" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1 select-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className={`text-sm font-bold truncate ${stock.soldOut ? "text-stone-400 line-through decoration-stone-300" : "text-[#3d2c2e]"}`}>{displayName}</h4>

            {/* ป้ายแสดงเมื่อเมนูนี้มีอยู่ในอีกโซนหนึ่งด้วย */}
            {coexistingCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 border shadow-2xs ${
                zone === 'box'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {zone === 'box' ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-amber-700">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>สั่งเสริม A La Carte อยู่ {coexistingCount} ชุด</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-emerald-700">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    <span>รวมในแพ็กเกจแล้ว {coexistingCount} ชุด</span>
                  </>
                )}
              </span>
            )}
          </div>
          <p className={`text-xs font-medium mt-0.5 ${stock.soldOut ? "text-stone-400" : "text-[#8d593a]"}`}>
            ฿{unitPrice.toLocaleString()} บาท / ชุด
          </p>

          {/* แจ้งสต็อกไม่พอ */}
          {stock.soldOut && (
            <div className="mt-1.5 flex max-w-full flex-wrap items-center gap-1.5">
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-red-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3 w-3" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 8v4.5M12 16h.01" />
                </svg>
                สินค้าไม่เพียงพอจำหน่าย
              </span>
              {stock.missing.length > 0 && (
                <span className="min-w-0 truncate text-[10px] sm:text-[11px] text-stone-500" title={stock.missing.join(", ")}>
                  {formatMissing(stock.missing)}
                </span>
              )}
            </div>
          )}
          {!stock.short && !stock.soldOut && stock.availableKits !== null && (
            <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-stone-500">
              คงเหลือพร้อมขาย {stock.availableKits} ชุด
            </p>
          )}
          {stock.short && (
            <p className="mt-1.5 inline-flex max-w-full items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-amber-800">
              <span className="truncate" title={stock.limitedBy ? `วัตถุดิบที่จำกัด: ${stock.limitedBy}` : undefined}>
                เหลือทำได้ {stock.availableKits} ชุด{stock.limitedBy ? ` · ${stock.limitedBy}ใกล้หมด` : ""}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 shrink-0 ml-auto">
        {/* สำหรับโซนกล่องแพ็กเกจ: ปุ่มสั่งเมนูนี้เพิ่มเป็น A La Carte ทันที */}
        {zone === 'box' && onAddExtra && (
          <button
            type="button"
            onClick={() => onAddExtra(itemId)}
            className="p-1.5 px-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 transition active:scale-95 cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs group"
            title="สั่งเมนูนี้เพิ่มอีก 1 ชุดแบบ A La Carte (คิดราคาแยกตามจริง โดยไม่กระทบจำนวนในกล่อง)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-90 transition-transform">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden md:inline">+ สั่งเพิ่ม A La Carte</span>
            <span className="md:hidden">+ เสริม</span>
          </button>
        )}

        {/* ปุ่มสลับ/ย้ายโซน */}
        {zone === 'box' && onMoveOne && (
          <button
            type="button"
            onClick={() => onMoveOne(itemId, 'box')}
            className="p-1.5 px-2 rounded-xl border border-[#e8dfd1] text-stone-600 hover:text-[#8d593a] hover:bg-[#f6ede5] transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
            title={quantity > 1 ? "ย้ายเมนูนี้ 1 ชุดออกไปเป็น A La Carte เพื่อเปิดช่องว่างในกล่อง" : "ย้ายออกไปเป็น A La Carte"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            </svg>
            <span className="hidden sm:inline">{quantity > 1 ? "ย้ายออก 1 ชุด" : "ย้ายออก"}</span>
          </button>
        )}

        {zone === 'extra' && onMoveOne && (
          <button
            type="button"
            disabled={!boxHasSpace}
            onClick={() => onMoveOne(itemId, 'extra')}
            className={`p-1.5 px-2.5 rounded-xl border transition flex items-center gap-1 text-[11px] font-semibold shadow-2xs ${
              boxHasSpace
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 hover:scale-105 active:scale-95 cursor-pointer'
                : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
            }`}
            title={boxHasSpace ? (quantity > 1 ? "ย้าย 1 ชุดเข้ากล่องแพ็กเกจ" : "ย้ายเข้ากล่องแพ็กเกจ") : "กล่องแพ็กเกจเต็มแล้ว (ครบตามโควตา)"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <span>{quantity > 1 ? "ย้ายเข้ากล่อง 1 ชุด" : "ย้ายเข้ากล่อง"}</span>
          </button>
        )}

        {/* Fallback ปุ่ม Toggle เดิมหากไม่มี onMoveOne */}
        {!onMoveOne && onToggleZone && (
          <button
            type="button"
            onClick={() => onToggleZone(itemId)}
            className="p-1.5 rounded-lg border border-[#e8dfd1] text-stone-600 hover:text-[#8d593a] hover:bg-[#f6ede5] transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
            title={isSubItem ? "ย้ายไปเป็น A La Carte" : "ย้ายเข้ากล่องแพ็กเกจ"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <span className="hidden sm:inline">
              {isSubItem ? "ย้ายออก" : "ย้ายเข้ากล่อง"}
            </span>
          </button>
        )}

        {/* Counter */}
        <div className="flex items-center rounded-lg border border-[#dfd1c1] bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={handleDecrease}
            className="px-2.5 py-1 text-slate-600 transition hover:bg-[#f6ede5] active:scale-90 disabled:opacity-40 cursor-pointer text-xs font-semibold select-none"
            aria-label="ลดจำนวน"
          >
            -
          </button>
          <span ref={qtyRef} className="w-6 text-center text-xs font-bold text-[#3d2c2e] select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={!canIncrease}
            title={canIncrease ? undefined : "วัตถุดิบไม่พอสำหรับเพิ่มจำนวน"}
            className="px-2.5 py-1 text-slate-600 transition hover:bg-[#f6ede5] active:scale-90 cursor-pointer text-xs font-semibold select-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100"
            aria-label="เพิ่มจำนวน"
          >
            +
          </button>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={handleRemove}
          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition active:scale-90 cursor-pointer"
          title="ลบรายการนี้"
          aria-label="ลบรายการ"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}