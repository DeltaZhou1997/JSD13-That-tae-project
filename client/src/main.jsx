import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installNoStoreFetch } from './utils/noStoreFetch.js'

// ทุก GET ไปที่ API ข้าม cache ของเบราว์เซอร์ — ข้อมูลตรงกับ MongoDB เสมอ
installNoStoreFetch()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
