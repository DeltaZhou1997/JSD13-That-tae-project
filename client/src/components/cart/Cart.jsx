import { useState, useMemo, useRef, useEffect } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext.js';
import useToast from '../../hooks/useToast.js';
import CartItem from './CartItem.jsx';
import { SHIPPING_FEE, SUBSCRIPTION_PLANS } from "../../constants/checkout";
import PlanSelector from '../checkout/PlanSelector.jsx';
import { useProducts } from '../../context/ProductsContext.js';
import { getStockStatus } from '../../utils/stock.js';

function DeleteModal({ onCancel, onConfirm, targetInfo }) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (backdropRef.current && modalRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.5)" }
      );
    }
  }, []);

  const handleClose = (callback) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    if (backdropRef.current && modalRef.current) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(modalRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 15,
        duration: 0.2,
        ease: "power2.in",
        onComplete: callback,
      });
    } else {
      callback();
    }
  };

  const isSplit = Boolean(targetInfo?.isSplit);
  const isBox = targetInfo?.zone === 'box';

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-[#e8dfd1] text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-[#3d2c2e] mb-2">
          {isSplit
            ? isBox
              ? `นำออกจากกล่องแพ็กเกจ?`
              : `นำออกจากเมนูเสริม A La Carte?`
            : "แน่ใจหรือไม่ที่จะลบสินค้า?"}
        </h3>
        <p className="text-xs text-[#6f675f] mb-6">
          {isSplit
            ? isBox
              ? `ระบบจะนำ "${targetInfo?.name || 'เมนูนี้'}" ออกจากกล่องแพ็กเกจ (รายการที่สั่งใน A La Carte จะยังคงอยู่ตามปกติ)`
              : `ระบบจะนำ "${targetInfo?.name || 'เมนูนี้'}" ออกจากรายการสั่งเสริม (รายการในกล่องแพ็กเกจจะยังคงอยู่ตามปกติ)`
            : `การลบรายการนี้จะนำ "${targetInfo?.name || 'สินค้า'}" ออกจากตะกร้าของคุณ`}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleClose(onCancel)}
            className="flex-1 rounded-full border border-[#dfd1c1] py-2.5 text-xs font-semibold text-[#6f675f] hover:bg-[#f6ede5] transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => handleClose(onConfirm)}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-xs transition cursor-pointer"
          >
            {isSplit ? "ยืนยันนำออก" : "ยืนยันการลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const context = useOutletContext() || {};
  const {
    cartItems = [],
    handleUpdateQuantity = () => {},
    handleRemoveItem = () => {},
    handleAddToCart = () => {},
    selectedPlan = null,
    setSelectedPlan = () => {},
  } = context;

  const { products = [] } = useProducts();

  // รายการที่วัตถุดิบไม่พอ (หมด หรือจำนวนในตะกร้าเกินที่ทำได้) → ห้ามไปชำระเงิน
  const stockIssues = useMemo(
    () =>
      cartItems
        .map((item) => {
          const id = String(item._id || item.id);
          const product = products.find((p) => String(p._id || p.id) === id);
          return { id, ...getStockStatus(product, Number(item.quantity) || 1) };
        })
        .filter((st) => st.soldOut || st.short),
    [cartItems, products],
  );
  const soldOutIds = stockIssues.filter((st) => st.soldOut).map((st) => st.id);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  // State จำนวนที่จัดสรรให้เป็น A La Carte ของแต่ละเมนู { [itemId]: number }
  const [extraQtyMap, setExtraQtyMap] = useState({});

  // Dragging State สำหรับตรวจจับและ Reorder ได้อย่างลื่นไหล
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragOverBoxZone, setIsDragOverBoxZone] = useState(false);
  const [isDragOverExtraZone, setIsDragOverExtraZone] = useState(false);

  // ---------------------------------------------------------------------------
  // จัดสรรเมนูระหว่าง "กล่องแพ็กเกจ" vs "โซน A La Carte" แบบ Hybrid ยืดหยุ่น
  // ---------------------------------------------------------------------------
  const requiredKits = selectedPlan ? selectedPlan.kitsPerWeek : 0;

  const { boxItems, extraItems, boxKitsCount, extraKitsCount } = useMemo(() => {
    if (!selectedPlan) {
      return {
        boxItems: [],
        extraItems: cartItems,
        boxKitsCount: 0,
        extraKitsCount: cartItems.reduce(
          (sum, i) => sum + (Number(i.quantity) || 1),
          0
        ),
      };
    }

    const box = [];
    const extra = [];
    let currentBoxCount = 0;

    cartItems.forEach((item) => {
      const id = item._id || item.id;
      const totalQty = Number(item.quantity) || 1;
      const explicitExtra = Math.min(totalQty, Math.max(0, extraQtyMap[id] || 0));
      const forBox = totalQty - explicitExtra;

      // จัดสรรส่วนที่ต้องการให้อยู่ในกล่อง
      if (forBox > 0) {
        const spaceLeft = requiredKits - currentBoxCount;
        if (spaceLeft <= 0) {
          // หากกล่องเต็มแล้ว ส่วนนี้จะไหลไปเป็น A La Carte
          extra.push({ ...item, quantity: forBox, isExtra: true });
        } else if (forBox <= spaceLeft) {
          box.push({ ...item, quantity: forBox, isBox: true });
          currentBoxCount += forBox;
        } else {
          box.push({ ...item, quantity: spaceLeft, isBox: true });
          extra.push({ ...item, quantity: forBox - spaceLeft, isExtra: true });
          currentBoxCount += spaceLeft;
        }
      }

      // จัดสรรส่วนที่ตั้งใจให้เป็น A La Carte
      if (explicitExtra > 0) {
        const existing = extra.find((e) => (e._id || e.id) === id);
        if (existing) {
          existing.quantity += explicitExtra;
        } else {
          extra.push({ ...item, quantity: explicitExtra, isExtra: true });
        }
      }
    });

    return {
      boxItems: box,
      extraItems: extra,
      boxKitsCount: currentBoxCount,
      extraKitsCount: extra.reduce(
        (sum, i) => sum + (Number(i.quantity) || 1),
        0
      ),
    };
  }, [cartItems, selectedPlan, requiredKits, extraQtyMap]);

  // ฟังก์ชันหาจำนวนที่รายการนี้มีอยู่ในอีกโซนหนึ่ง (Coexisting count)
  const getCoexistingCount = (itemId, currentZone) => {
    if (currentZone === "box") {
      const extraItem = extraItems.find((i) => (i._id || i.id) === itemId);
      return extraItem ? Number(extraItem.quantity) || 0 : 0;
    } else {
      const boxItem = boxItems.find((i) => (i._id || i.id) === itemId);
      return boxItem ? Number(boxItem.quantity) || 0 : 0;
    }
  };

  const kitsDifference = selectedPlan ? boxKitsCount - requiredKits : 0;
  const isBoxFull = selectedPlan && boxKitsCount === requiredKits;

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  // สั่งเมนูนี้เพิ่มอีก 1 ชุดเป็น A La Carte ทันที
  const handleAddExtra = (itemId) => {
    const item = cartItems.find((i) => (i._id || i.id) === itemId);
    const displayName = item?.nameTh || item?.name || "เมนูนี้";

    setExtraQtyMap((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    handleUpdateQuantity(itemId, 1);
    toast.success(`เพิ่ม "${displayName}" (+1 ชุด) เป็นเมนูเสริม A La Carte แล้ว ✨`);
  };

  // ย้าย 1 ชุดข้ามโซน
  const handleMoveOne = (itemId, fromZone) => {
    const item = cartItems.find((i) => (i._id || i.id) === itemId);
    const displayName = item?.nameTh || item?.name || "เมนูนี้";

    if (fromZone === "box") {
      setExtraQtyMap((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
      toast.info(`ย้าย "${displayName}" 1 ชุดไปเป็น A La Carte แล้ว (กล่องมีที่ว่างเพิ่ม 1 ช่อง)`);
    } else if (fromZone === "extra") {
      if (boxKitsCount < requiredKits) {
        setExtraQtyMap((prev) => ({
          ...prev,
          [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
        }));
        toast.info(`ย้าย "${displayName}" 1 ชุดเข้าสู่กล่องแพ็กเกจแล้ว ✨`);
      } else {
        toast.warning("กล่องแพ็กเกจเต็มแล้ว กรุณาย้ายเมนูอื่นออกก่อน หรือเลือกแพ็กเกจขนาดใหญ่ขึ้น");
      }
    }
  };

  // ย้ายทั้งหมดข้ามโซน
  const handleMoveAll = (itemId, fromZone) => {
    const item = cartItems.find((i) => (i._id || i.id) === itemId);
    const displayName = item?.nameTh || item?.name || "เมนูนี้";

    if (fromZone === "box") {
      const boxItem = boxItems.find((i) => (i._id || i.id) === itemId);
      const moveCount = boxItem ? boxItem.quantity : 1;
      setExtraQtyMap((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + moveCount,
      }));
      toast.info(`ย้าย "${displayName}" ทั้งหมดออกไปเป็นเมนูเสริม A La Carte`);
    } else if (fromZone === "extra") {
      setExtraQtyMap((prev) => ({
        ...prev,
        [itemId]: 0,
      }));
      toast.info(`ย้าย "${displayName}" เข้าสู่กล่องแพ็กเกจแล้ว`);
    }
  };

  // สลับโซนทั้งรายการ (ปุ่มเดิม)
  const handleToggleZone = (itemId) => {
    const isCurrentlyExtra = Boolean(extraQtyMap[itemId]);
    if (isCurrentlyExtra) {
      handleMoveAll(itemId, "extra");
    } else {
      handleMoveAll(itemId, "box");
    }
  };

  // ปรับจำนวน (+/-) แยกตามโซน
  const onUpdateQuantity = (itemId, delta, zone) => {
    const item = cartItems.find((i) => (i._id || i.id) === itemId);
    if (!item) return;

    const displayName = item.nameTh || item.name || "เมนู";

    if (zone === "extra") {
      const currentExtra = extraItems.find((i) => (i._id || i.id) === itemId)?.quantity || 1;
      if (delta === -1 && currentExtra === 1) {
        const coexistingInBox = getCoexistingCount(itemId, "extra");
        setItemToDelete({
          id: itemId,
          zone: "extra",
          name: displayName,
          isSplit: coexistingInBox > 0,
          quantity: 1,
        });
      } else if (delta === 1) {
        setExtraQtyMap((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1,
        }));
        handleUpdateQuantity(itemId, 1);
      } else if (delta === -1) {
        setExtraQtyMap((prev) => ({
          ...prev,
          [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
        }));
        handleUpdateQuantity(itemId, -1);
      }
    } else if (zone === "box") {
      const currentBox = boxItems.find((i) => (i._id || i.id) === itemId)?.quantity || 1;
      if (delta === 1) {
        if (boxKitsCount >= requiredKits) {
          // กล่องเต็มแล้ว ออโต้เพิ่มเป็น A La Carte
          setExtraQtyMap((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
          }));
          handleUpdateQuantity(itemId, 1);
          toast.info(
            `กล่องครบ ${requiredKits} เมนูแล้ว — ระบบได้เพิ่ม "${displayName}" (+1 ชุด) เป็นเมนูเสริม A La Carte ให้คุณแล้ว ✨`
          );
        } else {
          handleUpdateQuantity(itemId, 1);
        }
      } else if (delta === -1) {
        if (currentBox === 1) {
          const coexistingInExtra = getCoexistingCount(itemId, "box");
          setItemToDelete({
            id: itemId,
            zone: "box",
            name: displayName,
            isSplit: coexistingInExtra > 0,
            quantity: 1,
          });
        } else {
          handleUpdateQuantity(itemId, -1);
        }
      }
    } else {
      if (item.quantity === 1 && delta === -1) {
        setItemToDelete({
          id: itemId,
          zone: "alacarte",
          name: displayName,
          isSplit: false,
          quantity: 1,
        });
      } else {
        handleUpdateQuantity(itemId, delta);
      }
    }
  };

  const onRequestRemove = (itemId, zone) => {
    const item = cartItems.find((i) => (i._id || i.id) === itemId);
    const displayName = item?.nameTh || item?.name || "เมนู";
    const coexisting = getCoexistingCount(itemId, zone);

    const targetList = zone === "box" ? boxItems : extraItems;
    const targetItem = targetList.find((i) => (i._id || i.id) === itemId);
    const zoneQty = targetItem ? targetItem.quantity : 1;

    setItemToDelete({
      id: itemId,
      zone,
      name: displayName,
      isSplit: coexisting > 0,
      quantity: zoneQty,
    });
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { id, zone, isSplit, quantity: zoneQty } = itemToDelete;
    const targetId = id;
    setItemToDelete(null);

    if (isSplit) {
      if (zone === "box") {
        for (let i = 0; i < zoneQty; i++) {
          handleUpdateQuantity(targetId, -1);
        }
        toast.info(`นำ "${itemToDelete.name}" ออกจากกล่องแพ็กเกจแล้ว (รายการใน A La Carte ยังคงอยู่)`);
      } else if (zone === "extra") {
        setExtraQtyMap((prev) => {
          const next = { ...prev };
          delete next[targetId];
          return next;
        });
        for (let i = 0; i < zoneQty; i++) {
          handleUpdateQuantity(targetId, -1);
        }
        toast.info(`นำ "${itemToDelete.name}" ออกจาก A La Carte แล้ว (รายการในกล่องแพ็กเกจยังคงอยู่)`);
      }
    } else {
      setDeletingItemId(targetId);
    }
  };

  const handleFinalizeDelete = (targetId) => {
    handleRemoveItem(targetId);
    setExtraQtyMap((prev) => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    setDeletingItemId((current) => (current === targetId ? null : current));
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  // ---------------------------------------------------------------------------
  // Drag & Drop Reorder Handlers
  // ---------------------------------------------------------------------------
  const handleDragStart = (e, item, sourceZone, sourceIndex) => {
    setDraggedItem({ item, sourceZone, sourceIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item._id || item.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragOverBoxZone(false);
    setIsDragOverExtraZone(false);
  };

  const handleDropOnItem = (targetZone, targetIndex) => {
    if (!draggedItem) return;
    const { item, sourceZone } = draggedItem;
    const movingId = item._id || item.id;

    if (sourceZone !== targetZone) {
      if (targetZone === "box") {
        setExtraQtyMap((prev) => ({
          ...prev,
          [movingId]: 0,
        }));
      } else {
        setExtraQtyMap((prev) => ({
          ...prev,
          [movingId]: item.quantity || 1,
        }));
      }
    }

    const currentList = [...cartItems];
    const fromIdx = currentList.findIndex((i) => (i._id || i.id) === movingId);
    const targetGroup = targetZone === "box" ? boxItems : extraItems;
    const targetItem = targetGroup[targetIndex];
    if (targetItem && fromIdx !== -1) {
      const toIdx = currentList.findIndex((i) => (i._id || i.id) === (targetItem._id || targetItem.id));
      if (toIdx !== -1 && fromIdx !== toIdx) {
        const [removed] = currentList.splice(fromIdx, 1);
        currentList.splice(toIdx, 0, removed);
        if (context.setCartItems) {
          context.setCartItems(currentList);
        }
      }
    }

    setDraggedItem(null);
  };

  const handleDropOnZone = (targetZone) => {
    if (!draggedItem) return;
    const { item, sourceZone } = draggedItem;
    const movingId = item._id || item.id;

    if (sourceZone !== targetZone) {
      if (targetZone === "box") {
        setExtraQtyMap((prev) => ({
          ...prev,
          [movingId]: 0,
        }));
      } else {
        setExtraQtyMap((prev) => ({
          ...prev,
          [movingId]: item.quantity || 1,
        }));
      }
    }
    setDraggedItem(null);
  };

  // ---------------------------------------------------------------------------
  // ฟังก์ชันสุ่มเติมเมนูให้เต็มกล่อง
  // ---------------------------------------------------------------------------
  const handleAutoFillBox = () => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบหรือสมัครสมาชิก เพื่อให้ระบบจัดเซ็ตเมนูตามธาตุเจ้าเรือนของคุณ");
      navigate("/login");
      return;
    }

    if (!selectedPlan || kitsDifference >= 0) return;
    const needed = Math.abs(kitsDifference);

    const userElement = currentUser.element || currentUser.dominantElement || "ดิน";
    const existingIds = new Set(cartItems.map((i) => i._id || i.id || i.productId));
    // สุ่มเฉพาะเมนูที่วัตถุดิบยังพอ
    const unselectedProducts = products.filter((p) => !existingIds.has(p._id || p.id) && !getStockStatus(p).soldOut);

    const matchedElementDishes = unselectedProducts.filter((p) => {
      const isDominant = p.dominantElement === userElement;
      const isSuitable = Array.isArray(p.elementSuitability) && p.elementSuitability.includes(userElement);
      const isTagged = Array.isArray(p.tags) && p.tags.some((t) => String(t).includes(userElement));
      return isDominant || isSuitable || isTagged;
    });

    const shuffledMatched = [...matchedElementDishes].sort(() => 0.5 - Math.random());
    let dishesToAdd = shuffledMatched.slice(0, needed);

    if (dishesToAdd.length < needed) {
      const addedIds = new Set(dishesToAdd.map((d) => d._id || d.id));
      const remainingNeeded = needed - dishesToAdd.length;
      const fallbackDishes = unselectedProducts
        .filter((p) => !addedIds.has(p._id || p.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingNeeded);

      dishesToAdd = [...dishesToAdd, ...fallbackDishes];
    }

    dishesToAdd.forEach((dish) => {
      handleAddToCart(dish, 1);
    });
  };

  // ---------------------------------------------------------------------------
  // คำนวณราคาแบบ Hybrid และคำนวณส่วนลดเปรียบเทียบ
  // ---------------------------------------------------------------------------
  const extraSubtotal = extraItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const subtotal = selectedPlan
    ? selectedPlan.price + extraSubtotal
    : cartItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );

  const shippingFee = cartItems.length > 0 ? (selectedPlan ? 0 : SHIPPING_FEE) : 0;
  const total = subtotal + shippingFee;
  const qualifiesForReward = subtotal >= 1499;

  // มูลค่าแท้จริงของเมนูในกล่องแพ็กเกจ หากสั่งแบบแยกจานปกติ
  const normalBoxValue = useMemo(() => {
    if (!selectedPlan) return 0;
    return boxItems.reduce((sum, item) => {
      const p = Number(item.price) > 0 ? Number(item.price) : 189;
      const q = Number(item.quantity) || 1;
      return sum + p * q;
    }, 0);
  }, [boxItems, selectedPlan]);

  // สิทธิประโยชน์และความคุ้มค่าเมื่อเลือก Subscription Plan
  const foodSavings = selectedPlan ? Math.max(0, normalBoxValue - selectedPlan.price) : 0;
  const shippingSavings = selectedPlan && cartItems.length > 0 ? SHIPPING_FEE : 0;
  const totalSavings = foodSavings + shippingSavings;
  const regularTotal = normalBoxValue + extraSubtotal + (cartItems.length > 0 ? SHIPPING_FEE : 0);
  const savingsPercent = regularTotal > 0 ? Math.round((totalSavings / regularTotal) * 100) : 0;

  // แนะนำ Upsell Plan สำหรับลูกค้าที่สั่งแบบ A La Carte
  const totalKitsCount = cartItems.reduce((s, i) => s + (Number(i.quantity) || 1), 0);
  const recommendedUpsellPlan = useMemo(() => {
    if (selectedPlan || totalKitsCount === 0) return null;
    if (totalKitsCount >= 9) return SUBSCRIPTION_PLANS.XL;
    if (totalKitsCount >= 7) return SUBSCRIPTION_PLANS.L;
    if (totalKitsCount >= 5) return SUBSCRIPTION_PLANS.M;
    return SUBSCRIPTION_PLANS.S;
  }, [selectedPlan, totalKitsCount]);

  // GSAP Total Price Ticker Pulse
  const totalPriceRef = useRef(null);
  useEffect(() => {
    if (totalPriceRef.current) {
      gsap.fromTo(
        totalPriceRef.current,
        { scale: 1.15, color: "#10b981" },
        { scale: 1, color: "#8d593a", duration: 0.35, ease: "back.out(1.5)" }
      );
    }
  }, [total]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-[#2f2119]">
      {/* 1. Header หัวข้อหลัก */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#e8dfd1] pb-4">
        <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-[#3d2c2e]">
          <div className="w-11 h-11 rounded-2xl bg-[#f6ede5] flex items-center justify-center text-[#8d593a] border border-[#e8dfd1] shadow-2xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span>ตะกร้าสินค้าของคุณ</span>
        </h2>

        {selectedPlan && (
          <span className="text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-[#f6ede5] text-[#8d593a] border border-[#e8dfd1] flex items-center gap-2 shadow-2xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            โหมดจัดกล่อง {selectedPlan.name} ({selectedPlan.kitsPerWeek} เมนู)
          </span>
        )}
      </div>

      {/* 2. เลย์เอาต์หลัก 2 คอลัมน์ (Desktop: เมื่อมีสินค้า คอลัมน์ซ้ายสินค้า col-span-7/8, ขวา Sidebar col-span-5/4 / เมื่อไม่มีสินค้า คอลัมน์ซ้ายขยายเต็มจอ col-span-12) */}
      <div className={`grid grid-cols-1 ${cartItems.length > 0 ? "lg:grid-cols-12 gap-8" : "gap-6"} items-start`}>

        {/* =================================================================== */}
        {/* คอลัมน์ซ้าย: รูปแบบการสั่งซื้อ, รายการสินค้า, กล่องแพ็กเกจ */}
        {/* =================================================================== */}
        <div className={`${cartItems.length > 0 ? "lg:col-span-7 xl:col-span-8" : "w-full col-span-12"} space-y-6`}>
          {/* เลือกรูปแบบการสั่งซื้อ (A La Carte หรือ Subscription Plan) */}
          <PlanSelector selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />

          {/* Progress Bar ความคืบหน้าของกล่องแพ็กเกจ */}
          {selectedPlan && (
            <div className="rounded-3xl border border-[#e8dfd1] bg-[#fcf8f2] p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#3d2c2e] flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8d593a]">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  กล่องแพ็กเกจ {selectedPlan.name}
                </span>
                <span className="text-xs font-bold text-[#8d593a] bg-white px-3 py-1 rounded-full">
                  บรรจุ {boxKitsCount} / {requiredKits} เมนู
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-[#f1ead7] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isBoxFull ? "bg-emerald-500" : "bg-[#8d593a]"
                  }`}
                  style={{ width: `${Math.min(100, (boxKitsCount / requiredKits) * 100)}%` }}
                />
              </div>

              {kitsDifference < 0 && (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#e8dfd1]">
                  <span className="text-xs text-amber-800 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-600">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    ขาดอีก <strong>{Math.abs(kitsDifference)}</strong> เมนู จะเต็มกล่องพอดี
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillBox}
                    className="py-1.5 px-3.5 bg-[#8d593a] hover:bg-[#73472c] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                    </svg>
                    {currentUser ? (
                      <span>สุ่มเติมอีก {Math.abs(kitsDifference)} เมนู (ธาตุ{currentUser.element || currentUser.dominantElement || "ของคุณ"})</span>
                    ) : (
                      <span>เข้าสู่ระบบเพื่อสุ่มเติมเมนูตามธาตุ</span>
                    )}
                  </button>
                </div>
              )}

              {isBoxFull && (
                <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5 border-t border-[#e8dfd1]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  กล่องของคุณจัดครบ {requiredKits} เมนูเรียบร้อยแล้ว!
                </div>
              )}
            </div>
          )}



          {/* Items Rendering */}
          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-[#e8dfd1] bg-white p-12 text-center shadow-xs">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f6ede5] flex items-center justify-center text-[#8d593a]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </div>
              <p className="mb-4 text-base text-[#6f675f]">ยังไม่มีสินค้าในตะกร้า</p>
              <Link
                to="/menus"
                className="inline-block rounded-full bg-[#4c1f08] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#6b3215]"
              >
                เลือกดูเมนูอาหาร
              </Link>
            </div>
          ) : selectedPlan ? (
            <div className="space-y-6">
              {/* โซนที่ 1: กล่องแพ็กเกจ (Subscription Kit Box) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverBoxZone(true);
                }}
                onDragLeave={() => setIsDragOverBoxZone(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverBoxZone(false);
                  handleDropOnZone("box");
                }}
                className={`rounded-3xl border-2 transition-all duration-200 p-5 shadow-xs bg-white ${
                  isDragOverBoxZone
                    ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-100 scale-[1.01]"
                    : "border-[#8d593a]/30"
                }`}
              >
                <div className="flex justify-between items-center border-b border-[#f1ead7] pb-3.5 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f6ede5] flex items-center justify-center text-[#8d593a] border border-[#e8dfd1]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#3d2c2e] text-base flex items-center gap-2">
                        กล่อง Cooking Kit ประจำสัปดาห์ ({selectedPlan.name})
                      </h3>
                      <p className="text-xs text-[#6f675f]">
                        โควตากล่อง {selectedPlan.kitsPerWeek} เมนู (ลากเพื่อสลับลำดับ หรือย้ายเมนูข้ามกล่องได้)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#8d593a]">฿{selectedPlan.price}</span>
                    <span className="text-[10px] text-[#6f675f] block">/ สัปดาห์</span>
                  </div>
                </div>

                {/* รายการเมนูในกล่อง */}
                <div className="divide-y divide-[#f8f4ed]">
                  {boxItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#8d593a] border border-dashed border-[#e8dfd1] rounded-2xl bg-[#fcfaf7]">
                      ยังไม่มีเมนูในกล่อง (ลากเมนูจากด้านล่างมาปล่อยที่นี่ หรือกดสุ่มเติมเมนูด้านบน)
                    </div>
                  ) : (
                    boxItems.map((item, idx) => (
                      <CartItem
                        key={`box-${item._id || item.id}`}
                        item={item}
                        index={idx}
                        zone="box"
                        isSubItem={true}
                        coexistingCount={getCoexistingCount(item._id || item.id, "box")}
                        boxHasSpace={boxKitsCount < requiredKits}
                        isDraggable={true}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDropItem={handleDropOnItem}
                        onAddExtra={handleAddExtra}
                        onMoveOne={handleMoveOne}
                        onMoveAll={handleMoveAll}
                        onToggleZone={handleToggleZone}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRequestRemove}
                        isDeleting={deletingItemId === (item._id || item.id)}
                        onDeleteConfirmed={handleFinalizeDelete}
                      />
                    ))
                  )}

                  {/* ช่องว่างจำลอง */}
                  {kitsDifference < 0 && (
                    <div className="py-3 px-3 text-center border-2 border-dashed border-[#e8dfd1] rounded-2xl my-2 bg-[#fcfaf7] flex items-center justify-center gap-2 select-none">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8d593a]">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      <span className="text-xs text-[#8d593a] font-medium">
                        ว่างอีก {Math.abs(kitsDifference)} ช่อง (ลากเมนูจากด้านล่างมาวาง หรือกดสุ่มเติมด้านบน)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* โซนที่ 2: เมนูเสริม A La Carte */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverExtraZone(true);
                }}
                onDragLeave={() => setIsDragOverExtraZone(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverExtraZone(false);
                  handleDropOnZone("extra");
                }}
                className={`rounded-3xl border-2 transition-all duration-200 p-5 shadow-xs bg-white ${
                  isDragOverExtraZone
                    ? "border-amber-500 bg-amber-50/30 ring-4 ring-amber-100 scale-[1.01]"
                    : "border-[#e8dfd1]"
                }`}
              >
                <div className="flex justify-between items-center border-b border-[#f1ead7] pb-3.5 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f6ede5] flex items-center justify-center text-[#8d593a] border border-[#e8dfd1]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#3d2c2e] text-base">เมนูเสริม A La Carte (สั่งแยกรายชุด)</h3>
                        {extraKitsCount > 0 && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            {extraKitsCount} ชุด
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6f675f]">
                        เมนูที่สั่งเพิ่มพิเศษ หรือย้ายออกมาจากแพ็กเกจ (คิดราคาตามจริงรายชุด • สามารถรวมเมนูเดียวกับในกล่องได้)
                      </p>
                    </div>
                  </div>

                  {extraSubtotal > 0 && (
                    <div className="text-right">
                      <span className="text-base font-bold text-[#8d593a]">
                        +฿{extraSubtotal.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#6f675f] block">รวมค่าเมนูเสริม</span>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-[#f8f4ed]">
                  {extraItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-400 border border-dashed border-[#e8dfd1] rounded-2xl bg-[#faf7f2]">
                      ไม่มีเมนูเสริม (หากมีเมนูเกินจากกล่อง หรือสั่งเสริมแยกชุด จะมาแสดงที่นี่)
                    </div>
                  ) : (
                    extraItems.map((item, idx) => (
                      <CartItem
                        key={`extra-${item._id || item.id}`}
                        item={item}
                        index={idx}
                        zone="extra"
                        isSubItem={false}
                        coexistingCount={getCoexistingCount(item._id || item.id, "extra")}
                        boxHasSpace={boxKitsCount < requiredKits}
                        isDraggable={true}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDropItem={handleDropOnItem}
                        onMoveOne={handleMoveOne}
                        onMoveAll={handleMoveAll}
                        onToggleZone={handleToggleZone}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRequestRemove}
                        isDeleting={deletingItemId === (item._id || item.id)}
                        onDeleteConfirmed={handleFinalizeDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* โหมด A La Carte ปกติ */
            <div className="overflow-hidden rounded-3xl border border-[#e8dfd1] bg-white shadow-xs">
              <div className="divide-y divide-[#f1ead7] p-2 sm:p-4">
                {cartItems.map((item, idx) => (
                  <CartItem
                    key={item._id || item.id}
                    item={item}
                    index={idx}
                    zone="alacarte"
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRequestRemove}
                    isDeleting={deletingItemId === (item._id || item.id)}
                    onDeleteConfirmed={handleFinalizeDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* คอลัมน์ขวา: สรุปยอดสั่งซื้อแบบ Sticky Sidebar (col-span-5 หรือ 4) */}
        {/* =================================================================== */}
        {cartItems.length > 0 && (
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">

            {/* Rewards Banner (วางไว้เหนือสรุปยอดในฝั่ง Sidebar) */}
            {!isAdmin && (
              <div className="overflow-hidden rounded-3xl border border-[#e8dfd1] bg-white p-4 shadow-xs">
                {qualifiesForReward ? (
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="16 12 12 8 8 12" />
                      <line x1="12" y1="16" x2="12" y2="8" />
                    </svg>
                    <span>ยอดสั่งซื้อครบ 1,499 บาทแล้ว! รับสิทธิพิเศษแต้มสะสมเรียบร้อย</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#6f675f]">
                      <span>ซื้อเพิ่มอีก <strong>{(1499 - subtotal).toLocaleString()}</strong> บาท เพื่อรับแต้มพิเศษ</span>
                      <span className="font-bold text-[#8d593a]">{Math.min(100, Math.round((subtotal / 1499) * 100))}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f1ead7] overflow-hidden">
                      <div
                        className="h-full bg-[#8d593a] transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, (subtotal / 1499) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* กล่องสรุปยอดสั่งซื้อหลัก (Sticky Summary Box) */}
            <div className="rounded-3xl bg-white border border-[#e8dfd1] p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#3d2c2e] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#8d593a]">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <span>สรุปยอดคำสั่งซื้อ</span>
                </span>
              </h3>

              {/* แถบสรุปความคุ้มค่าแบบกระชับ (Compact Savings Banner) */}
              {selectedPlan && totalSavings > 0 && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200/80 p-3 flex items-center justify-between text-emerald-900">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight">
                        แพ็กเกจนี้ประหยัด ฿{totalSavings.toLocaleString()} (-{savingsPercent}%)
                      </span>
                      <span className="text-[10px] text-emerald-700 block">
                        {foodSavings > 0 ? `ลดค่าอาหาร ฿${foodSavings.toLocaleString()} + ` : ''}ส่งฟรี ฿120
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    สุดคุ้ม
                  </span>
                </div>
              )}

              <div className="space-y-3 text-xs text-[#6f675f]">
                {selectedPlan ? (
                  <>
                    {/* ราคาปกติขีดฆ่า หากสั่งแยกจาน */}
                    {totalSavings > 0 && (
                      <div className="flex justify-between items-baseline text-stone-400">
                        <span>ราคาปกติสั่งแยกจาน</span>
                        <span className="line-through font-semibold text-xs">
                          ฿{regularTotal.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline">
                      <span>ค่าแพ็กเกจ {selectedPlan.name} ({selectedPlan.kitsPerWeek} ชุด)</span>
                      <span className="font-bold text-sm text-[#2f2119]">
                        ฿{selectedPlan.price.toLocaleString()}
                      </span>
                    </div>

                    {extraSubtotal > 0 && (
                      <div className="flex justify-between items-baseline text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                        <span>ค่าเมนูเสริม A La Carte ({extraKitsCount} ชุด)</span>
                        <span className="font-bold text-sm">
                          +฿{extraSubtotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between items-baseline">
                    <span>ค่าสินค้า ({cartItems.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} ชุด)</span>
                    <span className="font-bold text-sm text-[#2f2119]">
                      ฿{subtotal.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span>ค่าจัดส่ง (ควบคุมอุณหภูมิ)</span>
                  <span className="font-semibold text-[#2f2119]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        ฟรีค่าจัดส่ง
                      </span>
                    ) : (
                      `฿${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="my-3 border-t border-[#f1ead7]"></div>

                <div className="flex justify-between items-baseline text-[#3d2c2e]">
                  <span className="font-bold text-sm sm:text-base">ยอดรวมทั้งสิ้น</span>
                  <div className="text-right">
                    <span ref={totalPriceRef} className="text-2xl font-black text-[#8d593a] inline-block">
                      ฿{total.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-medium">THB (รวมภาษีแล้ว)</span>
                  </div>
                </div>
              </div>

              {/* แนะนำ Upsell ใน Sidebar หากเลือกเป็น A La Carte */}
              {!selectedPlan && recommendedUpsellPlan && (
                <div className="mt-4 rounded-2xl bg-[#fcf8f2] border border-[#e8dfd1] p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#8d593a]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8d593a]">
                      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7Z" />
                    </svg>
                    <span>แนะนำความคุ้มค่า: แพ็กเกจ {recommendedUpsellPlan.name}</span>
                  </div>
                  <p className="text-[#6f675f] text-[11px] leading-relaxed">
                    เปลี่ยนเป็นแพ็กเกจ <strong>{recommendedUpsellPlan.name}</strong> ({recommendedUpsellPlan.kitsPerWeek} เมนู) เพียง ฿{recommendedUpsellPlan.price} พร้อมส่งฟรีแช่เย็นทันที!
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(recommendedUpsellPlan)}
                    className="w-full py-2 px-3 bg-[#8d593a] hover:bg-[#73472c] text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>เปลี่ยนเป็นแพ็กเกจ {recommendedUpsellPlan.name} เลย</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}

              {/* ปุ่มชำระเงิน หรือข้อความเตือนเมื่อเลือกไม่ครบ */}
              <div className="mt-6">
                {isAdmin ? (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-center text-xs font-semibold text-amber-900">
                    บัญชีผู้ดูแลระบบ (Admin) สำหรับจัดการระบบหลังบ้าน ไม่มีสิทธิ์สั่งซื้อสินค้า
                  </div>
                ) : selectedPlan && kitsDifference < 0 ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="block w-full rounded-full bg-stone-200 py-3.5 text-center text-xs font-bold text-stone-500 cursor-not-allowed leading-snug"
                    >
                      กรุณาเลือกเมนูในกล่องให้ครบ {requiredKits} ชุดก่อนไปชำระเงิน
                    </button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(null)}
                        className="text-[11px] text-[#8d593a] underline hover:text-[#6b3215] cursor-pointer font-semibold"
                      >
                        หรือเปลี่ยนกลับเป็นสั่งซื้อรายชุด (A La Carte)
                      </button>
                    </div>
                  </div>
                ) : stockIssues.length > 0 ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="block w-full rounded-full bg-stone-200 px-4 py-3.5 text-center text-xs font-bold leading-snug text-stone-500 cursor-not-allowed"
                    >
                      มีสินค้าไม่เพียงพอจำหน่าย {stockIssues.length} รายการ — ปรับตะกร้าก่อนชำระเงิน
                    </button>
                    {soldOutIds.length > 0 && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => soldOutIds.forEach((id) => handleRemoveItem(id))}
                          className="text-[11px] font-semibold text-[#8d593a] underline hover:text-[#6b3215] cursor-pointer"
                        >
                          ลบสินค้าที่หมดออกจากตะกร้า ({soldOutIds.length} รายการ)
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/checkout"
                    className="block w-full rounded-full bg-[#4c1f08] py-4 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ดำเนินการชำระเงิน</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Pop-up Modal ยืนยันการลบสินค้า พร้อม GSAP Animation */}
      {itemToDelete && (
        <DeleteModal
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          targetInfo={itemToDelete}
        />
      )}
    </div>
  );
}