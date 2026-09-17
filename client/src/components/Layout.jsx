import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'


function Layout({ context }) {
  const totalItems = context.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar cartCount={totalItems} />

      <main className="w-full flex-1 bg-[#fff8f5] pt-20 sm:pt-24">
        <Outlet context={context}/>
      </main>

      <Footer />

    </div>
  )
}

export default Layout
