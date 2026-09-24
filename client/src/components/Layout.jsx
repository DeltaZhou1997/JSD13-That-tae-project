import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AIAdvisorWidget from './ai/AIAdvisorWidget.jsx'
import useToast from '../hooks/useToast.js'
import useCartSync from '../hooks/useCartSync.js'
import { getStockStatus } from '../utils/stock.js'
import { fetchLiveProduct } from '../utils/liveStock.js'
import { useProducts } from '../context/ProductsContext.js'
import { useIngredients } from '../context/IngredientsContext.js'
import { useAuth } from '../context/AuthContext.js'
import { SUBSCRIPTION_PLANS } from '../constants/checkout.js'

function Layout({ context }) {
  // ตะกร้าจำสถานะ: guest เก็บในคุกกี้ / ล็อกอินแล้วซิงก์กับ DB (ย้ายตะกร้า guest เข้าบัญชีตอนล็อกอิน)
  const [cartItems, setCartItems, refreshCart] = useCartSync()
  const location = useLocation()
  const toast = useToast()
  const { refreshProducts, products } = useProducts()
  const { refreshIngredients } = useIngredients()
  const { refreshUser, isAuthenticated } = useAuth()

  // เปลี่ยนหน้า/แท็บ (ทั้งลูกค้าและแอดมิน) → ดึงข้อมูลล่าสุดจาก MongoDB ใหม่ทุกครั้ง
  // (ครั้งแรกข้าม เพราะ Provider แต่ละตัวโหลดตอนเปิดเว็บอยู่แล้ว)
  const firstRouteRef = useRef(true)
  useEffect(() => {
    if (firstRouteRef.current) {
      firstRouteRef.current = false
      return
    }
    refreshProducts?.({ silent: true })
    refreshIngredients?.()
    refreshCart?.()
    if (isAuthenticated) refreshUser?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const [selectedPlan, setSelectedPlan] = useState(null)

  // เลื่อนกลับขึ้นด้านบนสุดแบบ Smooth ทุกครั้งที่เปลี่ยนหน้า/เปลี่ยนแท็บ
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [location.pathname, location.search])

  // ตรวจสต็อกกับ DB ทุกครั้งก่อนเพิ่ม (สต็อกวัตถุดิบอาจลดลงหลังเปิดหน้าไว้) — ต่อไม่ได้ใช้ข้อมูลเดิม
  const checkLiveStock = async (product, wantTotal) => {
    const id = product._id || product.id;
    const live = await fetchLiveProduct(id);
    if (live?.removed) return { ok: false, message: `${product.nameTh || product.name} ปิดการขายแล้ว`, available: 0 };
    const stock = getStockStatus(live || product, wantTotal);
    if (live) refreshProducts?.({ silent: true }); // ให้ตัวเลขคงเหลือบนหน้าจอตรงกับ DB
    return { ok: !stock.soldOut && !stock.short, stock, available: stock.availableKits };
  };

  const handleAddToCart = async (product, count = 1) => {
    const targetId = product._id || product.id;
    const qtyToAdd = Math.max(1, Number(count) || 1);
    const displayName = product.nameTh || product.name || 'สินค้า';

    // กันเพิ่มเมนูที่วัตถุดิบไม่พอ (ทุกหน้าที่เรียก handleAddToCart) — เช็กกับ DB
    const inCart = Number(cartItems.find((item) => (item._id || item.id) === targetId)?.quantity) || 0;
    const check = await checkLiveStock(product, inCart + qtyToAdd);
    if (!check.ok) {
      if (check.message) toast?.error?.(check.message);
      else if (check.stock?.soldOut) toast?.error?.(`${displayName} สินค้าหมด`);
      else toast?.error?.(`${displayName} เหลือขายได้อีก ${Math.max(0, (check.available ?? 0) - inCart)} ชุด (ในตะกร้ามี ${inCart} ชุด)`);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => (item._id || item.id) === targetId);
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === targetId
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [
        ...prevItems,
        {
          _id: targetId,
          id: targetId,
          productId: targetId,
          name: displayName,
          nameTh: displayName,
          price: Number(product.price) || 0,
          quantity: qtyToAdd,
          imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl || '',
          region: product.regionNameTh || product.region || '',
        },
      ];
    });

    if (toast?.success) {
      toast.success(`เพิ่ม "${displayName}" (${qtyToAdd} ชุด) ลงตะกร้าแล้ว`);
    }
  };

  // AI Advisor จัดเซต: เพิ่มหลายเมนูในครั้งเดียว (ข้ามเมนูที่หมด) + เลือกแพ็กเกจตามไซส์ แจ้งเตือนครั้งเดียว
  const handleAddSetToCart = (products = [], planId) => {
    const addable = products.filter((p) => !getStockStatus(p, 1).soldOut);
    if (addable.length === 0) {
      toast?.error?.('เมนูในเซตนี้สินค้าหมดทั้งหมด');
      return;
    }
    setCartItems((prevItems) => {
      const next = [...prevItems];
      for (const product of addable) {
        const targetId = product._id || product.id;
        const idx = next.findIndex((item) => (item._id || item.id) === targetId);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          const displayName = product.nameTh || product.name || 'สินค้า';
          next.push({
            _id: targetId,
            id: targetId,
            productId: targetId,
            name: displayName,
            nameTh: displayName,
            price: Number(product.price) || 0,
            quantity: 1,
            imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl || '',
            region: product.regionNameTh || product.region || '',
          });
        }
      }
      return next;
    });
    const plan = SUBSCRIPTION_PLANS[planId];
    if (plan) setSelectedPlan(plan);
    toast?.success?.(`เพิ่ม ${addable.length} เมนูลงตะกร้าแล้ว${plan ? ` (แพ็กเกจ ${plan.name})` : ''}`);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateQuantity = async (id, delta) => {
    // กด + → เช็กกับ DB ว่ายังขายได้อีกไหม
    if (delta > 0) {
      const item = cartItems.find((i) => (i._id || i.id) === id);
      const product = products?.find((p) => (p._id || p.id) === id) || item;
      if (item && product) {
        const want = (Number(item.quantity) || 0) + delta;
        const check = await checkLiveStock(product, want);
        if (!check.ok) {
          const name = item.nameTh || item.name || 'เมนูนี้';
          toast?.error?.(
            check.message ||
              (check.stock?.soldOut ? `${name} สินค้าหมดแล้ว` : `${name} ขายได้สูงสุด ${check.available ?? 0} ชุด`),
          );
          return;
        }
      }
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if ((item._id || item.id) === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== id)
    );
  };

  const currentCartItems = context?.cartItems ?? cartItems;
  const totalItems = currentCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const outletContext = {
    cartItems: currentCartItems,
    handleAddToCart: context?.handleAddToCart ?? handleAddToCart,
    handleUpdateQuantity: context?.handleUpdateQuantity ?? handleUpdateQuantity,
    handleRemoveItem: context?.handleRemoveItem ?? handleRemoveItem,
    handleClearCart: context?.handleClearCart ?? handleClearCart,
    selectedPlan,
    setSelectedPlan,
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar cartCount={totalItems} />

      <main className="w-full flex-1 bg-[#fff8f5] pt-20 sm:pt-24">
        <Outlet context={outletContext} />
      </main>

      {/* 🌟 That-Tae RAG AI Health & Nutrition Advisor */}
      <AIAdvisorWidget
        cartItems={currentCartItems}
        onAddToCart={context?.handleAddToCart ?? handleAddToCart}
        onAddSet={handleAddSetToCart}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
      />

      <Footer />
    </div>
  )
}

export default Layout
