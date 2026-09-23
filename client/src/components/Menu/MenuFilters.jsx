import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext.js'
import { getUserElement, ELEMENT_EN_TO_TH } from '../../utils/quizHelpers.js'
import {
  POPULAR_FOOD_RESTRICTIONS,
  RESTRICTION_CATEGORIES,
} from '../../constants/foodRestrictions.js'

const regionOptions = [
  {
    value: 'northern',
    th: 'ภาคเหนือ',
    en: 'Northern',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  {
    value: 'northeastern',
    th: 'ภาคอีสาน',
    en: 'Northeastern',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    value: 'central',
    th: 'ภาคกลาง',
    en: 'Central',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2a10 10 0 0 0-10 10c0 5.25 10 10 10 10s10-4.75 10-10a10 10 0 0 0-10-10z" />
      </svg>
    ),
  },
  {
    value: 'southern',
    th: 'ภาคใต้',
    en: 'Southern',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M2 12c4-4 8-4 12 0s8 4 12 0" />
        <path d="M2 18c4-4 8-4 12 0s8 4 12 0" />
      </svg>
    ),
  },
  {
    value: 'fusion',
    th: 'ไทยฟิวชั่น',
    en: 'Fusion',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
      </svg>
    ),
  },
]

// กำหนด 4 ธาตุหลักอย่างชัดเจน (ป้องกันการซ้ำซ้อน)
const FOUR_ELEMENTS = ['ดิน', 'น้ำ', 'ลม', 'ไฟ']

const elementDetails = {
  'ดิน': {
    value: 'ดิน',
    th: 'ธาตุดิน',
    en: 'Earth',
    flavorTh: 'ฝาด • หวาน • มัน • เค็ม',
    flavorEn: 'Astringent • Sweet • Oily • Salty',
    iconIdle: 'text-[#8d593a] dark:text-[#dcb37b]',
    iconActive: 'text-white',
    textActive: 'text-white font-bold',
    idleStyle: 'bg-white dark:bg-[#483421] border border-[#d4c5b0] dark:border-[#523a24] text-[#3d2c2e] dark:text-[#f0e6d8] hover:border-[#8d593a]',
    activeStyle: 'bg-[#8d593a] border border-[#8d593a] text-white shadow-sm ring-1 ring-[#8d593a]/30 font-bold',
    svg: (cls = 'w-4 h-4') => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  'น้ำ': {
    value: 'น้ำ',
    th: 'ธาตุน้ำ',
    en: 'Water',
    flavorTh: 'เปรี้ยว • ขม',
    flavorEn: 'Sour • Bitter',
    iconIdle: 'text-[#2563eb] dark:text-[#60a5fa]',
    iconActive: 'text-white',
    textActive: 'text-white font-bold',
    idleStyle: 'bg-white dark:bg-[#483421] border border-[#d4c5b0] dark:border-[#523a24] text-[#3d2c2e] dark:text-[#f0e6d8] hover:border-[#2563eb]',
    activeStyle: 'bg-[#2563eb] border border-[#2563eb] text-white shadow-sm ring-1 ring-[#2563eb]/30 font-bold',
    svg: (cls = 'w-4 h-4') => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  'ลม': {
    value: 'ลม',
    th: 'ธาตุลม',
    en: 'Wind',
    flavorTh: 'เผ็ดร้อน • หอมระเหย',
    flavorEn: 'Spicy Hot • Aromatic',
    iconIdle: 'text-[#059669] dark:text-[#34d399]',
    iconActive: 'text-white',
    textActive: 'text-white font-bold',
    idleStyle: 'bg-white dark:bg-[#483421] border border-[#d4c5b0] dark:border-[#523a24] text-[#3d2c2e] dark:text-[#f0e6d8] hover:border-[#059669]',
    activeStyle: 'bg-[#059669] border border-[#059669] text-white shadow-sm ring-1 ring-[#059669]/30 font-bold',
    svg: (cls = 'w-4 h-4') => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
  },
  'ไฟ': {
    value: 'ไฟ',
    th: 'ธาตุไฟ',
    en: 'Fire',
    flavorTh: 'ขม • เย็น • จืด',
    flavorEn: 'Bitter • Cooling • Bland',
    iconIdle: 'text-[#dc2626] dark:text-[#f87171]',
    iconActive: 'text-white',
    textActive: 'text-white font-bold',
    idleStyle: 'bg-white dark:bg-[#483421] border border-[#d4c5b0] dark:border-[#523a24] text-[#3d2c2e] dark:text-[#f0e6d8] hover:border-[#dc2626]',
    activeStyle: 'bg-[#dc2626] border border-[#dc2626] text-white shadow-sm ring-1 ring-[#dc2626]/30 font-bold',
    svg: (cls = 'w-4 h-4') => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
}

// ฟังก์ชันช่วยเหลือสำหรับดึงข้อมูลธาตุ
const getElementInfo = (el) => {
  if (!el) return null
  const thKey = ELEMENT_EN_TO_TH[el] || el
  return elementDetails[thKey] || null
}

export default function MenuFilters({ filters, setFilters }) {
  const { language } = useApp() || { language: 'th' }
  const { currentUser } = useAuth()
  const infoBoxRef = useRef(null)
  const buttonsRef = useRef({})
  const regionBtnsRef = useRef({})
  const hasAutoSelectedRef = useRef(false)

  // ดึงหรือคำนวณธาตุประจำตัวของผู้ใช้ที่เข้าสู่ระบบ
  const userElement = useMemo(() => getUserElement(currentUser), [currentUser])

  // อาเรย์ของธาตุที่กำลังเลือกอยู่
  const selectedElements = useMemo(() => {
    if (Array.isArray(filters.element)) return filters.element
    if (filters.element) return [filters.element]
    return []
  }, [filters.element])

  // เมื่อล็อกอินอยู่ ให้เลือกธาตุของตัวเองแบบ auto ทันทีหากยังไม่ได้เลือก
  useEffect(() => {
    if (currentUser && userElement && !hasAutoSelectedRef.current) {
      hasAutoSelectedRef.current = true
      if (selectedElements.length === 0) {
        setFilters((prev) => ({
          ...prev,
          element: [userElement],
        }))
      }
    }
  }, [currentUser, userElement, selectedElements.length, setFilters])

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  // กดเลือก/ยกเลิกภูมิภาค พร้อมแอนิเมชันเด้งสปริงแบบเป็นธรรมชาติ
  const toggleFilter = (type, value) => {
    const target = regionBtnsRef.current[value]
    if (target) {
      gsap.timeline()
        .to(target, { scale: 0.90, duration: 0.08, ease: 'power1.in' })
        .to(target, { scale: 1.07, duration: 0.16, ease: 'back.out(3)' })
        .to(target, { scale: 1, duration: 0.12, ease: 'power1.out' })
    }

    setFilters((prev) => {
      const isSelected = prev[type].includes(value)
      return {
        ...prev,
        [type]: isSelected
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      }
    })
  }

  // สามารถเลือกได้หลายธาตุในเวลาเดียวกัน (Multi-select) พร้อมแอนิเมชันยืดหยุ่น Tactile Bounce
  const toggleElement = (elValue) => {
    const targetBtn = buttonsRef.current[elValue]
    if (targetBtn) {
      gsap.timeline()
        .to(targetBtn, { scale: 0.91, duration: 0.08, ease: 'power1.in' })
        .to(targetBtn, { scale: 1.05, duration: 0.16, ease: 'back.out(3)' })
        .to(targetBtn, { scale: 1, duration: 0.12, ease: 'power1.out' })
    }

    setFilters((prev) => {
      const currentList = Array.isArray(prev.element)
        ? prev.element
        : prev.element
          ? [prev.element]
          : []
      const exists = currentList.includes(elValue)
      const nextList = exists
        ? currentList.filter((item) => item !== elValue)
        : [...currentList, elValue]
      return {
        ...prev,
        element: nextList,
      }
    })
  }

  // แอนิเมชันให้กล่องคำอธิบายธาตุสไลด์และขยายนุ่มนวลเมื่อมีการเปลี่ยนธาตุ
  useEffect(() => {
    if (infoBoxRef.current) {
      gsap.fromTo(
        infoBoxRef.current,
        { opacity: 0, y: -6, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.8)' }
      )
    }
  }, [selectedElements])

  const selectedRestrictions = useMemo(() => {
    return Array.isArray(filters.restrictions) ? filters.restrictions : []
  }, [filters.restrictions])

  const toggleRestriction = (restrictionId) => {
    setFilters((prev) => {
      const current = Array.isArray(prev.restrictions) ? prev.restrictions : []
      const exists = current.includes(restrictionId)
      return {
        ...prev,
        restrictions: exists
          ? current.filter((id) => id !== restrictionId)
          : [...current, restrictionId],
      }
    })
  }

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.region && filters.region.length > 0) ||
    selectedElements.length > 0 ||
    selectedRestrictions.length > 0
  )

  const handleClearAll = () => {
    setFilters({ search: '', region: [], health: [], element: [], restrictions: [] })
  }

  const regionChipClass = (active) =>
    `rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer flex items-center gap-1 select-none group active:scale-90 ${
      active
        ? 'border-[#8b5e34] bg-[#8b5e34] text-white shadow-xs ring-2 ring-[#8b5e34]/25 scale-[1.03]'
        : 'border-[#d4c5b0] hover:border-[#8b5e34] hover:bg-[#8b5e34]/10 hover:scale-[1.02] text-[#3b2a1a] dark:text-[#f0e6d8] dark:border-[#6b4e33]'
    }`

  // ตรวจสอบว่าธาตุที่เลือกตรงกับธาตุของผู้ใช้หรือไม่
  const isViewingOnlyUserElement =
    Boolean(userElement) &&
    selectedElements.length === 1 &&
    selectedElements.includes(userElement)

  const isViewingOtherElements =
    Boolean(userElement) &&
    selectedElements.length > 0 &&
    !selectedElements.includes(userElement)

  const isViewingMixedElements =
    Boolean(userElement) &&
    selectedElements.length > 1 &&
    selectedElements.includes(userElement)

  return (
    <aside className="relative z-10 h-fit self-start bg-[#faf7f2] dark:bg-[#3b2a1a] rounded-2xl p-3 sm:p-3.5 border border-[#d4c5b0] dark:border-[#523a24] shadow-xs lg:sticky lg:top-28 xl:top-32 transition-all">
      {/* ===================================================================== */}
      {/* 1. Header: กะทัดรัด สบายตา ไม่กินความสูงหน้าจอ                        */}
      {/* ===================================================================== */}
      <div className="mb-2.5 pb-2 border-b border-[#e8dfd1] dark:border-[#523a24] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5.5 h-5.5 rounded-md bg-[#f6ede5] dark:bg-[#483421] flex items-center justify-center text-[#8d593a] dark:text-[#dcb37b] border border-[#e8dfd1] dark:border-[#6b4e33] shrink-0 transition-transform duration-200 hover:rotate-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-[#3d2c2e] dark:text-[#f0e6d8] truncate">
            {language === 'th' ? 'ค้นหาและตัวกรอง' : 'Search & Filters'}
          </h2>
        </div>

        {/* ปุ่มล้างทั้งหมด: โผล่และหดอย่างลื่นไหล ไม่กระตุก */}
        <div
          className={`transition-all duration-300 ease-out flex items-center ${
            hasActiveFilters
              ? 'opacity-100 scale-100 max-w-[120px]'
              : 'opacity-0 scale-75 max-w-0 pointer-events-none overflow-hidden'
          }`}
        >
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[10px] font-bold text-[#8b5e34] hover:text-[#523a24] dark:text-[#dcb37b] flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-90 cursor-pointer bg-[#f6ede5] hover:bg-[#ebdccf] dark:bg-[#483421] px-2 py-0.5 rounded-full border border-[#dfd1c1] dark:border-[#6b4e33] shrink-0 group shadow-2xs"
            title="ล้างการตั้งค่าตัวกรองทั้งหมด"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            <span>{language === 'th' ? 'ล้างทั้งหมด' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. Search Input: กะทัดรัด พร้อมแอนิเมชันปุ่มล้างโผล่/หด               */}
      {/* ===================================================================== */}
      <div className="mb-2.5">
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[#8b5e34]/70 dark:text-[#dcb37b]/70 pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={language === 'th' ? 'ค้นหาชื่อเมนู, วัตถุดิบ...' : 'Search menu, ingredients...'}
            className="w-full pl-7.5 pr-7 py-1.5 rounded-lg border border-[#d4c5b0] bg-white dark:bg-[#523a24] dark:border-[#755535] text-xs text-[#3d2c2e] dark:text-[#f0e6d8] placeholder:text-[#a29584] focus:outline-none focus:ring-2 focus:ring-[#8b5e34]/30 focus:border-[#8b5e34] transition-all duration-200 shadow-2xs"
          />
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
            className={`absolute right-2 p-0.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-600 transition-all duration-200 cursor-pointer ${
              filters.search
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-50 -rotate-90 pointer-events-none'
            }`}
            title="ล้างข้อความค้นหา"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. ธาตุเจ้าเรือนของผู้รับประทาน (Body Element Filters)                 */}
      {/* ===================================================================== */}
      <div className="mb-2.5">
        {/* บรรทัดหัวข้อ + จำนวนที่เลือก / ล้าง */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#8b5e34] shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="text-xs font-bold text-[#3d2c2e] dark:text-[#dcb37b] truncate">
              {language === 'th' ? 'ธาตุเจ้าเรือน' : 'Body Elements'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
            <span className="text-[#7a6b63] dark:text-[#c4b5a5] transition-all duration-200">
              {selectedElements.length > 0
                ? `${selectedElements.length} ธาตุ`
                : (language === 'th' ? 'เลือกหลายธาตุได้' : 'Multi-select')}
            </span>
            <div className={`transition-all duration-200 ${
              selectedElements.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none w-0'
            }`}>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, element: [] }))}
                className="font-bold text-[#8b5e34] dark:text-[#dcb37b] hover:text-[#5c371f] cursor-pointer transition-all duration-200 hover:rotate-90 hover:scale-125 active:scale-75 inline-block"
                title="ล้างธาตุที่เลือก"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* 2x2 Interactive Compact Element Buttons: โลโก้ซ้าย ตัวหนังสือขวา Fill สีธาตุและ Text ขาวเมื่อเลือก */}
        <div className="grid grid-cols-2 gap-1.5">
          {FOUR_ELEMENTS.map((elKey) => {
            const item = elementDetails[elKey]
            const isSelected = selectedElements.includes(item.value)

            return (
              <button
                key={item.value}
                ref={(el) => (buttonsRef.current[item.value] = el)}
                type="button"
                onClick={() => toggleElement(item.value)}
                className={`relative rounded-xl px-2.5 py-2 border transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer flex items-center justify-between group hover:scale-[1.02] active:scale-95 ${
                  isSelected ? item.activeStyle : item.idleStyle
                }`}
              >
                {/* โลโก้ธาตุไว้ซ้าย ตัวหนังสือไว้ขวา */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`shrink-0 transition-all duration-300 ease-out transform ${
                      isSelected
                        ? 'text-white scale-110 -rotate-6'
                        : `${item.iconIdle} scale-100 rotate-0 group-hover:scale-110 group-hover:rotate-3`
                    }`}
                  >
                    {item.svg('w-4 h-4')}
                  </div>
                  <span
                    className={`text-xs font-semibold truncate transition-colors duration-200 ${
                      isSelected ? 'text-white font-bold' : 'text-[#3d2c2e] dark:text-[#f0e6d8]'
                    }`}
                  >
                    {language === 'th' ? item.th : item.en}
                  </span>
                </div>

                {/* เครื่องหมายถูกสีขาว เมื่อเลือก ป๊อปเข้าออกนุ่มนวล */}
                <div className="shrink-0 ml-1">
                  <div
                    className={`transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) transform ${
                      isSelected
                        ? 'opacity-100 scale-100 translate-x-0'
                        : 'opacity-0 scale-0 -translate-x-1.5 pointer-events-none w-0'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0 text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* =================================================================== */}
        {/* Dynamic Compact Advisory Boxes: ขยาย/หดสไลด์นุ่มนวล                 */}
        {/* =================================================================== */}

        {/* กรณีที่ 1: เลือกดูธาตุอื่นที่ไม่ตรงกับธาตุเจ้าเรือนของตัวเอง (เตือนสั้นกระชับ) */}
        {isViewingOtherElements && (
          <div
            ref={infoBoxRef}
            className="mt-2 rounded-lg px-2.5 py-2 bg-amber-50/95 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 shadow-2xs text-[10px] leading-tight transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-start gap-1.5 text-amber-900 dark:text-amber-200 min-w-0">
                <span className="shrink-0 text-amber-600 dark:text-amber-400 font-bold mt-0.5">⚠️</span>
                <p className="text-[10px] leading-snug">
                  คุณคือ <strong>ธาตุ{userElement}</strong> อาหารธาตุนี้อาจไม่เหมาะกับสมดุลหลัก ทานบ่อยอาจทำให้เสียสมดุลได้
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, element: [userElement] }))}
                className="shrink-0 text-[9px] font-bold text-amber-900 dark:text-amber-200 hover:underline cursor-pointer whitespace-nowrap bg-amber-200/80 hover:bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded transition-all duration-200 hover:scale-105 active:scale-90"
              >
                ดูธาตุ{userElement}
              </button>
            </div>
          </div>
        )}

        {/* กรณีที่ 2: เลือกเฉพาะธาตุประจำตัวของตัวเอง (ตรงจุด) */}
        {isViewingOnlyUserElement && (
          <div
            ref={infoBoxRef}
            className="mt-2 rounded-lg px-2.5 py-1.5 bg-emerald-50/95 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-2xs text-[10px] flex items-start gap-1.5 text-emerald-900 dark:text-emerald-200 transition-all duration-300"
          >
            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
            <p className="leading-tight">
              <strong>ตรงตามธาตุ{userElement}:</strong> เมนูรส{getElementInfo(userElement)?.flavorTh} ปรุงเพื่อเสริมสมดุลสุขภาพคุณ
            </p>
          </div>
        )}

        {/* กรณีที่ 3: เลือกดูหลายธาตุร่วมกัน */}
        {isViewingMixedElements && (
          <div
            ref={infoBoxRef}
            className="mt-2 rounded-lg px-2.5 py-1.5 bg-stone-100 dark:bg-[#483421] border border-stone-200 dark:border-[#6b4e33] shadow-2xs text-[10px] text-[#3d2c2e] dark:text-[#f0e6d8] flex items-center justify-between gap-1 transition-all duration-300"
          >
            <span className="truncate">เลือก {selectedElements.length} ธาตุ (รวมธาตุ{userElement}แล้ว)</span>
            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold shrink-0">สมดุล</span>
          </div>
        )}

        {/* เมื่อยังไม่มีการเลือกธาตุใดๆ */}
        {selectedElements.length === 0 && currentUser && userElement && (
          <div className="mt-1.5 px-2 py-1 rounded-md bg-[#f6ede5]/70 dark:bg-[#483421]/70 border border-dashed border-[#e4d8c8] dark:border-[#6b4e33] flex items-center justify-between gap-1 text-[9.5px] text-[#8d593a] dark:text-[#dcb37b] transition-all duration-300">
            <span className="truncate">ธาตุของคุณ: <strong>ธาตุ{userElement}</strong></span>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, element: [userElement] }))}
              className="shrink-0 px-1.5 py-0.5 rounded bg-[#8d593a] text-white font-bold hover:bg-[#72451f] cursor-pointer transition-all duration-200 hover:scale-105 active:scale-90"
            >
              เลือก
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. ภูมิภาค (Region Filters): สบายตา กะทัดรัด พร้อมสปริงเด้ง            */}
      {/* ===================================================================== */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#8b5e34] shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs font-bold text-[#3d2c2e] dark:text-[#dcb37b]">
              {language === 'th' ? 'ภูมิภาค' : 'Region'}
            </span>
          </div>

          <div className={`transition-all duration-200 ${
            filters.region && filters.region.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none w-0'
          }`}>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, region: [] }))}
              className="text-[10px] font-semibold text-[#8b5e34] hover:text-[#5c371f] dark:text-[#dcb37b] cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90 flex items-center gap-0.5 group"
            >
              <span>{language === 'th' ? 'ล้าง' : 'Clear'}</span>
              <span className="transition-transform duration-200 group-hover:rotate-90">✕</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {regionOptions.map((item) => (
            <button
              key={item.value}
              ref={(el) => (regionBtnsRef.current[item.value] = el)}
              type="button"
              onClick={() => toggleFilter('region', item.value)}
              className={regionChipClass(filters.region.includes(item.value))}
            >
              <span className="transition-transform duration-200 group-hover:scale-115">
                {item.svg}
              </span>
              <span>{item[language]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. ข้อจำกัดทางอาหาร & สุขภาพ (Food Restrictions & Allergies)          */}
      {/* ===================================================================== */}
      <div className="pt-2 border-t border-[#d4c5b0]/60 dark:border-[#6b4e33]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-[#8d593a]"><path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8l7.2-7.2A2 2 0 0 1 12 2.8h6.2a2 2 0 0 1 2 2V11a2 2 0 0 1-.6 1.4Z"/><circle cx="16.5" cy="7.5" r="1"/></svg>
            <span className="text-xs font-bold text-[#3d2c2e] dark:text-[#dcb37b]">
              {language === 'th' ? 'โรค & ข้อจำกัดอาหาร' : 'Dietary & Restrictions'}
            </span>
          </div>

          <div className={`transition-all duration-200 ${
            selectedRestrictions.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none w-0'
          }`}>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, restrictions: [] }))}
              className="text-[10px] font-semibold text-[#8b5e34] hover:text-[#5c371f] dark:text-[#dcb37b] cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90 flex items-center gap-0.5 group"
            >
              <span>{language === 'th' ? 'ล้าง' : 'Clear'}</span>
              <span className="transition-transform duration-200 group-hover:rotate-90">✕</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 mt-1">
          {Object.entries(RESTRICTION_CATEGORIES).map(([catKey, catInfo]) => {
            const items = POPULAR_FOOD_RESTRICTIONS.filter((r) => r.category === catKey);
            return (
              <div key={catKey}>
                <span className="text-[10px] font-semibold text-[#7a6b63] dark:text-[#a89685] block mb-1">
                  {catInfo.label}
                </span>
                <div className="flex flex-wrap gap-1">
                  {items.map((r) => {
                    const isSelected = selectedRestrictions.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleRestriction(r.id)}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 select-none ${
                          isSelected
                            ? 'bg-[#8b5e34] text-white shadow-xs ring-1 ring-[#8b5e34]/30 scale-[1.02]'
                            : 'border border-[#d4c5b0] hover:border-[#8b5e34] text-[#3d2c2e] dark:text-[#f0e6d8] dark:border-[#6b4e33] bg-white dark:bg-[#483421]'
                        }`}
                      >
                        <span>{isSelected ? '✓' : ''}</span>
                        <span>{r.shortLabel || r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  )
}
