import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useProducts } from '../context/ProductsContext.js';
import { dishes } from '../mock-data/index.js';

const CATEGORY_LABELS = {
  meat: 'เนื้อสัตว์ & โปรตีน',
  poultry: 'สัตว์ปีก',
  seafood: 'อาหารทะเล',
  protein: 'โปรตีนถั่วเหลือง',
  dairy_egg: 'ไข่และผลิตภัณฑ์นม',
  vegetable: 'ผัก & สมุนไพร',
  herb_spice: 'พริก & เครื่องเทศ',
  carb: 'แป้ง & เส้น',
  coconut: 'กะทิ',
  seasoning: 'เครื่องปรุง & ซอส',
  dessert: 'ของหวาน',
  other: 'วัตถุดิบ',
};

const getCategoryBadge = (category, categoryTh) => {
  const cat = (category || '').toLowerCase();
  const th = categoryTh || CATEGORY_LABELS[category] || '';
  
  if (cat.includes('meat') || cat.includes('poultry') || th.includes('เนื้อ') || th.includes('ไก่') || th.includes('หมู') || th.includes('เป็ด')) {
    return {
      label: th || 'เนื้อสัตว์ & โปรตีน',
      className: 'bg-rose-50 text-rose-700 border-rose-200/80',
    };
  }
  if (cat.includes('sea') || cat.includes('fish') || th.includes('ทะเล') || th.includes('ปลา') || th.includes('กุ้ง') || th.includes('หมึก')) {
    return {
      label: th || 'อาหารทะเล',
      className: 'bg-sky-50 text-sky-700 border-sky-200/80',
    };
  }
  if (cat.includes('veg') || th.includes('ผัก')) {
    return {
      label: th || 'ผัก & สมุนไพร',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    };
  }
  if (cat.includes('herb') || cat.includes('spice') || th.includes('พริก') || th.includes('เครื่องเทศ') || th.includes('สมุนไพร')) {
    return {
      label: th || 'พริก & เครื่องเทศ',
      className: 'bg-orange-50 text-orange-800 border-orange-200/80',
    };
  }
  if (cat.includes('season') || th.includes('เครื่องปรุง') || th.includes('ซอส')) {
    return {
      label: th || 'เครื่องปรุง & ซอส',
      className: 'bg-purple-50 text-purple-700 border-purple-200/80',
    };
  }
  if (cat.includes('dairy') || cat.includes('egg') || th.includes('ไข่') || th.includes('นม') || th.includes('กะทิ') || cat.includes('coconut')) {
    return {
      label: th || 'ไข่/นม/กะทิ',
      className: 'bg-amber-50 text-amber-800 border-amber-200/80',
    };
  }
  if (cat.includes('carb') || th.includes('แป้ง') || th.includes('เส้น')) {
    return {
      label: th || 'แป้ง & เส้น',
      className: 'bg-stone-100 text-stone-700 border-stone-300/80',
    };
  }
  return {
    label: th || 'วัตถุดิบ',
    className: 'bg-stone-100 text-stone-700 border-stone-200',
  };
};

const getElementPill = (element) => {
  const el = String(element || '').trim();
  if (el.includes('ดิน') || el.toLowerCase().includes('earth')) {
    return {
      label: 'ดิน',
      className: 'bg-amber-100 text-amber-900 border-amber-300',
    };
  }
  if (el.includes('น้ำ') || el.toLowerCase().includes('water')) {
    return {
      label: 'น้ำ',
      className: 'bg-sky-100 text-sky-900 border-sky-300',
    };
  }
  if (el.includes('ลม') || el.toLowerCase().includes('wind') || el.toLowerCase().includes('air')) {
    return {
      label: 'ลม',
      className: 'bg-teal-100 text-teal-900 border-teal-300',
    };
  }
  if (el.includes('ไฟ') || el.toLowerCase().includes('fire')) {
    return {
      label: 'ไฟ',
      className: 'bg-rose-100 text-rose-900 border-rose-300',
    };
  }
  return {
    label: el,
    className: 'bg-stone-100 text-stone-700 border-stone-300',
  };
};

const ELEMENT_BADGES = {
  ดิน: {
    badge: 'bg-amber-50 text-amber-900 border-amber-200/80',
    dot: 'bg-amber-600',
    name: 'ธาตุดิน',
  },
  น้ำ: {
    badge: 'bg-sky-50 text-sky-800 border-sky-200/80',
    dot: 'bg-sky-600',
    name: 'ธาตุน้ำ',
  },
  ลม: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dot: 'bg-emerald-600',
    name: 'ธาตุลม',
  },
  ไฟ: {
    badge: 'bg-rose-50 text-rose-800 border-rose-200/80',
    dot: 'bg-rose-600',
    name: 'ธาตุไฟ',
  },
};

export default function MenuDetail() {
  const { id } = useParams();
  const { language } = useApp() || { language: 'th' };
  const { handleAddToCart } = useOutletContext() || {};
  const { getProductById } = useProducts();
  const [menu, setMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' as default | 'cards'


  const cleanUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('file://')) {
      const match = url.match(/assets\/([^/]+)\/([^/]+)$/);
      return match ? `/assets/${match[1]}/${match[2]}` : url;
    }
    return url;
  };

  useEffect(() => {
    const foundDish = dishes[id] || (getProductById ? getProductById(id) : null);
    if (foundDish) {
      setMenu(foundDish);
      const rawImgs = Array.isArray(foundDish.imageUrl)
        ? foundDish.imageUrl
        : [foundDish.imageUrl].filter(Boolean);
      const cleaned = (rawImgs.length > 0 ? rawImgs : (foundDish.images || [])).map(cleanUrl);
      setSelectedImage(cleaned[0] || '');
    }
  }, [id, getProductById]);

  if (!menu) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <svg className="w-8 h-8 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-stone-800">ไม่พบเมนูนี้ (404)</h1>
        <p className="mt-2 text-stone-500">เมนูที่คุณกำลังค้นหาอาจถูกย้ายหรือไม่มีอยู่ในระบบ</p>
        <Link
          to="/menus"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8b5e34] text-white font-medium shadow-sm hover:bg-[#724a26] transition"
        >
          ← กลับไปหน้าร้านค้า
        </Link>
      </main>
    );
  }

  const title = language === 'th' ? menu.nameTh : menu.nameEn || menu.nameTh;
  const regionName = language === 'th' ? menu.regionNameTh : menu.region;
  const rawImages = Array.isArray(menu.imageUrl)
    ? menu.imageUrl
    : [menu.imageUrl].filter(Boolean);
  const images = (rawImages.length > 0 ? rawImages : (menu.images || [])).map(cleanUrl);

  const recipe = Array.isArray(menu.recipe) ? menu.recipe : [];
  const nutrition = menu.nutritionCache || null;
  const perServing = nutrition?.perServing || null;
  const dominantElement = menu.dominantElement || 'ดิน';
  const elementStyle = ELEMENT_BADGES[dominantElement] || ELEMENT_BADGES['ดิน'];

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium">
          <Link to="/" className="hover:text-stone-800 transition">หน้าแรก</Link>
          <span className="text-stone-400">/</span>
          <Link to="/menus" className="hover:text-stone-800 transition">เมนูอาหาร</Link>
          <span className="text-stone-400">/</span>
          <span className="text-stone-600">{regionName}</span>
          <span className="text-stone-400">/</span>
          <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{title}</span>
        </nav>

        {/* Hero Section: Product Showcase */}
        <section className="bg-white rounded-3xl border border-[#ebe4dc] p-6 sm:p-8 lg:p-10 shadow-xs grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          
          {/* Left: Image Showcase */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50 shadow-xs">
              <img
                src={cleanUrl(selectedImage) || images[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"}
                alt={title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = (images && images[1]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";
                }}
                className="h-[320px] sm:h-[400px] w-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-white/95 backdrop-blur-xs text-stone-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-stone-200">
                  {regionName}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-xs ${elementStyle.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${elementStyle.dot}`}></span>
                  {elementStyle.name}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, index) => {
                  const isSelected = cleanUrl(selectedImage) === cleanUrl(img);
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`shrink-0 overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#8b5e34] ring-2 ring-[#8b5e34]/20 scale-105'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={cleanUrl(img)}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
                        }}
                        className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase */}
          <div className="flex flex-col justify-center">
            
            {/* Element Suitability Header */}
            {menu.elementSuitability && menu.elementSuitability.length > 0 && (
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200/60 w-fit">
                <svg className="w-4 h-4 text-[#8b5e34] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>ปรับสมดุลธาตุ: {menu.elementSuitability.map((el) => `ธาตุ${el}`).join(', ')}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug mb-3">
              {title}
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              {menu.description}
            </p>

            {/* Price & Servings */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-stone-100">
              <span className="text-4xl sm:text-5xl font-black text-[#8b5e34]">
                ฿{menu.price}
              </span>
              <span className="text-sm font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                ชุด Cooking Kit สำหรับ {menu.servings || 2} ที่
              </span>
            </div>

            {/* Per-Serving Macronutrients Metric Cards */}
            {perServing && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                  สารอาหารเฉลี่ยต่อ 1 ที่เสิร์ฟ (Nutrition per Serving)
                </p>
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-2.5 sm:p-3 text-center">
                    <span className="block text-[11px] font-semibold text-amber-800">พลังงาน</span>
                    <span className="block text-lg sm:text-xl font-bold text-amber-900 leading-tight my-0.5">
                      {perServing.calories}
                    </span>
                    <span className="block text-[10px] text-amber-700/80">kcal</span>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-2.5 sm:p-3 text-center">
                    <span className="block text-[11px] font-semibold text-emerald-800">โปรตีน</span>
                    <span className="block text-lg sm:text-xl font-bold text-emerald-900 leading-tight my-0.5">
                      {perServing.protein}g
                    </span>
                    <span className="block text-[10px] text-emerald-700/80">กรัม</span>
                  </div>

                  <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-2.5 sm:p-3 text-center">
                    <span className="block text-[11px] font-semibold text-orange-800">คาร์โบไฮเดรต</span>
                    <span className="block text-lg sm:text-xl font-bold text-orange-900 leading-tight my-0.5">
                      {perServing.carbs}g
                    </span>
                    <span className="block text-[10px] text-orange-700/80">กรัม</span>
                  </div>

                  <div className="bg-stone-100/80 border border-stone-200/80 rounded-2xl p-2.5 sm:p-3 text-center">
                    <span className="block text-[11px] font-semibold text-stone-700">ไขมัน</span>
                    <span className="block text-lg sm:text-xl font-bold text-stone-900 leading-tight my-0.5">
                      {perServing.fat}g
                    </span>
                    <span className="block text-[10px] text-stone-600/80">กรัม</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Button */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-stone-300 rounded-2xl bg-stone-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-stone-200 text-stone-700 font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-2xs"
                  aria-label="ลดจำนวน"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-stone-900 text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-stone-200 text-stone-700 font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-2xs"
                  aria-label="เพิ่มจำนวน"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (handleAddToCart) handleAddToCart(menu, quantity);
                }}
                className="flex-1 rounded-2xl bg-[#8b5e34] hover:bg-[#724a26] text-white font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all py-3.5 px-6 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Ingredients & Nutrition Breakdown Section */}
        {recipe.length > 0 && (
          <section className="bg-white rounded-3xl border border-[#ebe4dc] p-6 sm:p-8 lg:p-10 shadow-xs mt-10">
            
            {/* Header & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8b5e34] border border-amber-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    วัตถุดิบในชุด Cooking Kit และธาตุเจ้าเรือน
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    แยกย่อยส่วนผสมจริง {recipe.length} รายการ พร้อมระบุรสยาแพทย์แผนไทยและสารอาหารต่อ 100 กรัม
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs (Cards vs Table) */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'cards'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  การ์ดวัตถุดิบ
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'table'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  ตารางโภชนาการ
                </button>
              </div>
            </div>

            {/* View 1: Responsive Visual Ingredient Cards (Easy to read, modern light look) */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mt-6">
                {recipe.map((item, idx) => {
                  const n = item.nutrientsPer100g || {};
                  const catBadge = getCategoryBadge(item.category, item.categoryTh);
                  return (
                    <div
                      key={item.ingredientId || idx}
                      className="bg-[#faf8f5] hover:bg-white rounded-2xl border border-stone-200/80 p-4 transition-all duration-200 hover:shadow-sm hover:border-[#8b5e34]/30 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top: Name & Quantity */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-stone-900 text-sm leading-snug">
                            {item.nameTh}
                          </h4>
                          <span className="shrink-0 bg-stone-200/80 text-stone-800 text-xs font-extrabold px-2.5 py-0.5 rounded-md whitespace-nowrap">
                            {item.quantity} {item.unit || 'g'}
                          </span>
                        </div>

                        {/* Category & Taste & Element Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border whitespace-nowrap ${catBadge.className}`}>
                            {catBadge.label}
                          </span>
                          {item.medicinalTaste && (
                            <span className="text-[11px] bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                              รส{item.medicinalTaste.replace(/^รส/, '')}
                            </span>
                          )}
                          {Array.isArray(item.elements) && item.elements.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {item.elements.map((el) => {
                                const elPill = getElementPill(el);
                                return (
                                  <span
                                    key={el}
                                    className={`text-[11px] px-2 py-0.5 rounded-md border whitespace-nowrap ${elPill.className}`}
                                  >
                                    ธาตุ{elPill.label}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Nutrient Micronutrient Strip (per 100g) */}
                      <div className="pt-2.5 border-t border-stone-200/60 grid grid-cols-4 gap-1 text-center text-[10px]">
                        <div>
                          <span className="block text-stone-600 font-medium">แคลอรี</span>
                          <span className="font-bold text-stone-800">{n.calories ?? '-'}</span>
                        </div>
                        <div>
                          <span className="block text-stone-600 font-medium">โปรตีน</span>
                          <span className="font-bold text-stone-800">{n.protein ?? '-'}g</span>
                        </div>
                        <div>
                          <span className="block text-stone-600 font-medium">คาร์บ</span>
                          <span className="font-bold text-stone-800">{n.carbs ?? '-'}g</span>
                        </div>
                        <div>
                          <span className="block text-stone-600 font-medium">ไขมัน</span>
                          <span className="font-bold text-stone-800">{n.fat ?? '-'}g</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View 2: High-contrast Detailed Nutrition Table */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto mt-6 rounded-2xl border border-stone-200 bg-white shadow-2xs">
                <table className="w-full text-left text-sm min-w-[860px]">
                  <thead>
                    <tr className="bg-stone-50/90 border-b border-stone-200 text-xs font-bold text-stone-700 uppercase tracking-wider">
                      <th className="py-3.5 px-4 min-w-[200px]">วัตถุดิบ (Ingredient)</th>
                      <th className="py-3.5 px-3 text-center min-w-[130px]">หมวดหมู่</th>
                      <th className="py-3.5 px-3 text-center min-w-[120px]">รสยา (แพทย์แผนไทย)</th>
                      <th className="py-3.5 px-3 text-center min-w-[110px]">ธาตุที่ควรกิน</th>
                      <th className="py-3.5 px-3 text-right min-w-[100px]">ปริมาณในชุด</th>
                      <th className="py-3.5 px-3 text-right min-w-[100px]">พลังงาน (/100g)</th>
                      <th className="py-3.5 px-3 text-right min-w-[80px]">โปรตีน (/100g)</th>
                      <th className="py-3.5 px-3 text-right min-w-[80px]">คาร์บ (/100g)</th>
                      <th className="py-3.5 px-4 text-right min-w-[80px]">ไขมัน (/100g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recipe.map((item, index) => {
                      const n = item.nutrientsPer100g || {};
                      const catBadge = getCategoryBadge(item.category, item.categoryTh);
                      return (
                        <tr key={item.ingredientId || index} className="hover:bg-amber-50/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-stone-900 leading-snug break-words">
                            <span>{item.nameTh}</span>
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-medium border ${catBadge.className}`}>
                              {catBadge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span className="text-xs text-stone-700 font-medium bg-stone-50 border border-stone-200/80 px-2 py-0.5 rounded-md">
                              {item.medicinalTaste ? `รส${item.medicinalTaste.replace(/^รส/, '')}` : '-'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {Array.isArray(item.elements) && item.elements.length > 0 ? (
                                item.elements.map((el) => {
                                  const elPill = getElementPill(el);
                                  return (
                                    <span
                                      key={el}
                                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${elPill.className}`}
                                    >
                                      {elPill.label}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-xs text-stone-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-[#8b5e34] whitespace-nowrap">
                            {item.quantity} {item.unit || 'g'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-stone-700 whitespace-nowrap">
                            {n.calories !== undefined ? `${n.calories} kcal` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-stone-700 whitespace-nowrap">
                            {n.protein !== undefined ? `${n.protein}g` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-stone-700 whitespace-nowrap">
                            {n.carbs !== undefined ? `${n.carbs}g` : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-medium text-stone-700 whitespace-nowrap">
                            {n.fat !== undefined ? `${n.fat}g` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total Nutrition Cache Summary Banner */}
            {nutrition && nutrition.totals && (
              <div className="mt-8 rounded-2xl bg-[#faf6f0] border border-[#e8ded4] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#8b5e34]"></span>
                    <h3 className="text-sm font-bold text-stone-900">
                      สรุปคุณค่าทางโภชนาการรวมทั้งชุด Cooking Kit ({menu.servings || 2} เสิร์ฟ)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500">
                    น้ำตาลรวม: <strong className="text-stone-700">{nutrition.totals.sugar}g</strong> | ใยอาหาร: <strong className="text-stone-700">{nutrition.totals.fiber}g</strong> | โซเดียม: <strong className="text-stone-700">{nutrition.totals.sodium}mg</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold">
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 text-stone-800 shadow-2xs">
                    พลังงานรวม <span className="text-[#8b5e34] font-black">{nutrition.totals.calories}</span> kcal
                  </div>
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 text-stone-800 shadow-2xs">
                    โปรตีน <span className="text-emerald-700 font-black">{nutrition.totals.protein}g</span>
                  </div>
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 text-stone-800 shadow-2xs">
                    คาร์บ <span className="text-orange-700 font-black">{nutrition.totals.carbs}g</span>
                  </div>
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 text-stone-800 shadow-2xs">
                    ไขมัน <span className="text-stone-700 font-black">{nutrition.totals.fat}g</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Culinary Heritage & Storage/Reheating Section */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          
          {/* Heritage Card */}
          <div className="bg-white rounded-3xl border border-[#ebe4dc] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#8b5e34] border border-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                ภูมิปัญญาและประวัติอาหาร
              </h3>
            </div>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {menu.history || menu.description}
            </p>
          </div>

          {/* Cooking & Storage Instructions Card */}
          <div className="bg-white rounded-3xl border border-[#ebe4dc] p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-6">
            
            {/* Storage */}
            <div>
              <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2 text-sm">
                <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </span>
                การเก็บรักษาวัตถุดิบ
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pl-9">
                {menu.storageInstruction || "ควรเก็บในตู้เย็นอุณหภูมิ 0-4°C และปรุงภายใน 2 วันเพื่อความสดใหม่"}
              </p>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Reheating */}
            <div>
              <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2 text-sm">
                <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </span>
                คำแนะนำการปรุง / อุ่นร้อน
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pl-9">
                {menu.reheatingInstruction || "ทำตามลำดับขั้นตอนในคู่มือ ปรุงด้วยความร้อนปานกลางจนสุกทั่วถึง"}
              </p>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}