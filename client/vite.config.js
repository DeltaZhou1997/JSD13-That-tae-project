import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // รองรับ SPA routing: เมื่อ refresh หน้าใดก็ตาม (เช่น /menus) ให้คืน index.html เสมอ
    historyApiFallback: true,
  },
})
