import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="w-full flex-1 bg-[#fff8f5] pt-20 sm:pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
