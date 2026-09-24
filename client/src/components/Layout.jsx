import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AIAdvisorWidget from './ai/AIAdvisorWidget.jsx'
import useToast from '../hooks/useToast.js'
import useCartSync from '../hooks/useCartSync.js'
import { getStockStatus } from '../utils/stock.js'
import { useProducts } from '../context/ProductsContext.js'
import { useIngredients } from '../context/IngredientsContext.js'
import { useAuth } from '../context/AuthContext.js'
import { SUBSCRIPTION_PLANS } from '../constants/checkout.js'

function Layout({ context }) {
  // ตะกร้าจำสถานะ: guest เก็บในคุกกี้ / ล็อกอินแล้วซิงก์กับ DB (ย้ายตะกร้า guest เข้าบัญชีตอนล็อกอิน)
  const [cartItems, setCartItems, refreshCart] = useCartSync()
  const location = useLocation()
  const toast = useToast()
  const { refreshProducts } = useProducts()
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

  const handleAddToCart = (product, count = 1) => {
    const targetId = product._id || product.id;
    const qtyToAdd = Math.max(1, Number(count) || 1);
    const displayName = product.nameTh || product.name || 'สินค้า';

    // กันเพิ่มเมนูที่วัตถุดิบไม่พอ (ทุกหน้าที่เรียก handleAddToCart)
    const inCart = Number(cartItems.find((item) => (item._id || item.id) === targetId)?.quantity) || 0;
    const stock = getStockStatus(product, inCart + qtyToAdd);
    if (stock.soldOut) {
      toast?.error?.(`${displayName} สินค้าหมด (วัตถุดิบไม่เพียงพอ)`);
      return;
    }
    if (stock.short) {
      toast?.error?.(`${displayName} เหลือทำได้อีก ${Math.max(0, stock.availableKits - inCart)} ชุด`);
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

  const handleUpdateQuantity = (id, delta) => {
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
