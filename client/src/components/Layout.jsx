import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="w-full flex-1 bg-[#fff8f5] pt-20 sm:pt-24">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © 2026 THATTAE Food. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout
