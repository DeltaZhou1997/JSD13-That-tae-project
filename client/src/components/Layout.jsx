import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout({ context }) {
  const [cartItems, setCartItems] = useState([])

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id)
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    alert(`เพิ่ม ${product.nameTh || product.name || 'สินค้า'} ลงตะกร้าแล้ว!`)
  }

  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === id) {
          const newQuantity = item.quantity + delta
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
        }
        return item
      })
    )
  }

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id))
  }

  const currentCartItems = context?.cartItems ?? cartItems
  const totalItems = currentCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const outletContext = {
    cartItems: currentCartItems,
    handleAddToCart: context?.handleAddToCart ?? handleAddToCart,
    handleUpdateQuantity: context?.handleUpdateQuantity ?? handleUpdateQuantity,
    handleRemoveItem: context?.handleRemoveItem ?? handleRemoveItem,
  }

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
