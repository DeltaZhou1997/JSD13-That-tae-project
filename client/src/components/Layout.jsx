import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout({ context }) {
  const [cartItems, setCartItems] = useState([])

  const handleAddToCart = (product, count = 1) => {
    const targetId = product._id || product.id;
    const qtyToAdd = Math.max(1, Number(count) || 1);
    const displayName = product.nameTh || product.name || 'สินค้า';

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
          name: displayName,
          nameTh: displayName,
          price: Number(product.price) || 0,
          quantity: qtyToAdd,
          imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl || '',
          region: product.regionNameTh || product.region || '',
        },
      ];
    });

    alert(`🎉 เพิ่ม "${displayName}" (${qtyToAdd} ชุด) ลงตะกร้าแล้ว!`);
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
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar cartCount={totalItems} />

      <main className="w-full flex-1 bg-[#fff8f5] pt-20 sm:pt-24">
        <Outlet context={outletContext} />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
