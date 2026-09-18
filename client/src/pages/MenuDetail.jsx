import { useEffect, useState } from 'react'
import { Link, useParams, useOutletContext } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useProducts } from '../context/ProductsContext.js'
import { dishes } from '../mock-data/index.js'

const CATEGORY_LABELS = {
  meat: 'เนื้อสัตว์ & โปรตีน',
  poultry: 'สัตว์ปีก',
  seafood: 'อาหารทะเล',
  protein: 'โปรตีนถั่วเหลือง',
  dairy_egg: 'ไข่และผลิตภัณฑ์นม',
  vegetable: 'ผัก & พืชสมุนไพร',
  herb_spice: 'พริก & เครื่องเทศ',
  carb: 'แป้ง & เส้น',
  coconut: 'กะทิ',
  seasoning: 'เครื่องปรุง & ไขมัน',
  dessert: 'ของหวาน',
  other: 'วัตถุดิบ',
};

const ELEMENT_COLORS = {
  ดิน: 'bg-[#f7efe6] text-[#8b5e34] border-[#e2cfbd] dark:bg-[#483321] dark:text-[#f2d8b8] dark:border-[#5a422d]',
  น้ำ: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe] dark:bg-[#1e293b] dark:text-[#93c5fd] dark:border-[#334155]',
  ลม: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0] dark:bg-[#143224] dark:text-[#86efac] dark:border-[#1e4632]',
  ไฟ: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca] dark:bg-[#3b1818] dark:text-[#fca5a5] dark:border-[#542323]',
};

export default function MenuDetail() {
  const { id } = useParams()
  const { language } = useApp() || { language: 'th' };
  const { handleAddToCart } = useOutletContext() || {};
  const { getProductById } = useProducts();
  const [menu, setMenu] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')

  const cleanUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('file://')) {
      const match = url.match(/assets\/([^\/]+)\/([^\/]+)$/);
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
  }, [id, getProductById])

  if (!menu) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">ไม่พบเมนูนี้ (404)</h1>
        <Link to="/menus" className="mt-4 inline-block underline text-[#8b5e34]">
          กลับไปหน้าร้านค้า
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
  const elementBadgeStyle = ELEMENT_COLORS[dominantElement] || ELEMENT_COLORS['ดิน'];

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-10 bg-[#fdfbf7] dark:bg-[#2c1e16]">
      {/* Breadcrumb Navigation */}
      <nav className="mb-7 text-sm opacity-70 text-[#523a24] dark:text-[#f0e6d8]">
        <Link to="/menus" className="hover:underline">Storefront</Link>
        <span className="mx-2">›</span>
        <span>{regionName}</span>
        <span className="mx-2">›</span>
        <span className="font-medium opacity-100">{title}</span>
      </nav>

      {/* Main Showcase Section */}
      <section className="grid gap-9 lg:grid-cols-2 lg:items-center">
        <div>
          <img
            src={cleanUrl(selectedImage) || images[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"}
            alt={title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = (images && images[1]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";
            }}
            className="h-96 w-full rounded-2xl border border-[#d4c5b0] object-cover shadow-md bg-[#f0e6d8] dark:bg-[#3d2c2e]"
          />
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 cursor-pointer ${
                    cleanUrl(selectedImage) === cleanUrl(img) ? 'border-[#8b5e34]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={cleanUrl(img)}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
                    }}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col h-full justify-center">
          {/* Tags: Region & Dominant Element */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-[#f0e6d8] dark:bg-[#523a24] text-[#8b5e34] dark:text-[#dcb37b] text-xs font-bold px-3 py-1 rounded-full">
              {regionName}
            </span>
            {menu.dominantElement && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${elementBadgeStyle}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                ธาตุเจ้าเรือนหลัก: ธาตุ{dominantElement}
              </span>
            )}
            {menu.elementSuitability && menu.elementSuitability.length > 0 && (
              <span className="text-xs text-[#8b5e34] dark:text-[#dcb37b] opacity-75">
                (บำรุงธาตุ {menu.elementSuitability.join(', ')})
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl text-[#3b2a1a] dark:text-[#f0e6d8] mb-4">
            {title}
          </h1>
          <p className="text-[#523a24] dark:text-[#d4c5b0] leading-relaxed mb-6 text-lg">
            {menu.description}
          </p>

          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-bold text-[#8b5e34]">฿{menu.price}</span>
            <span className="text-sm opacity-70 mb-1">/ {menu.servings || 2} เสิร์ฟ</span>
          </div>

          {/* Quick Macronutrient Summary Badges per Serving */}
          {perServing && (
            <div className="mb-6 grid grid-cols-4 gap-2 rounded-2xl bg-[#f4ebd9] dark:bg-[#3b2a1a] p-3 text-center border border-[#e5d5c5] dark:border-[#523a24]">
              <div className="flex flex-col">
                <span className="text-xs text-[#8b5e34] dark:text-[#dcb37b] font-medium">พลังงาน</span>
                <span className="text-base font-bold text-[#3b2a1a] dark:text-[#f0e6d8]">{perServing.calories}</span>
                <span className="text-[10px] opacity-70">kcal / เสิร์ฟ</span>
              </div>
              <div className="flex flex-col border-l border-[#d4c5b0] dark:border-[#523a24]">
                <span className="text-xs text-[#8b5e34] dark:text-[#dcb37b] font-medium">โปรตีน</span>
                <span className="text-base font-bold text-[#3b2a1a] dark:text-[#f0e6d8]">{perServing.protein}g</span>
                <span className="text-[10px] opacity-70">ต่อเสิร์ฟ</span>
              </div>
              <div className="flex flex-col border-l border-[#d4c5b0] dark:border-[#523a24]">
                <span className="text-xs text-[#8b5e34] dark:text-[#dcb37b] font-medium">คาร์โบไฮเดรต</span>
                <span className="text-base font-bold text-[#3b2a1a] dark:text-[#f0e6d8]">{perServing.carbs}g</span>
                <span className="text-[10px] opacity-70">ต่อเสิร์ฟ</span>
              </div>
              <div className="flex flex-col border-l border-[#d4c5b0] dark:border-[#523a24]">
                <span className="text-xs text-[#8b5e34] dark:text-[#dcb37b] font-medium">ไขมัน</span>
                <span className="text-base font-bold text-[#3b2a1a] dark:text-[#f0e6d8]">{perServing.fat}g</span>
                <span className="text-[10px] opacity-70">ต่อเสิร์ฟ</span>
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="flex gap-4">
            <div className="flex items-center border border-[#d4c5b0] rounded-xl overflow-hidden bg-white dark:bg-[#3b2a1a]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 text-xl hover:bg-[#f0e6d8] dark:hover:bg-[#523a24] transition flex items-center justify-center cursor-pointer"
                aria-label="ลดจำนวน"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-12 h-12 text-xl hover:bg-[#f0e6d8] dark:hover:bg-[#523a24] transition flex items-center justify-center cursor-pointer"
                aria-label="เพิ่มจำนวน"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                if (handleAddToCart) handleAddToCart(menu, quantity);
              }}
              className="flex-1 rounded-xl bg-[#8b5e34] hover:bg-[#755535] text-white font-semibold transition text-lg shadow-lg py-3 cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Ingredient Breakdown & Macronutrients Per 100g (ตามโครงสร้าง ER Diagram) */}
      {recipe.length > 0 && (
        <section className="mt-12 bg-white dark:bg-[#342418] rounded-3xl p-6 sm:p-8 border border-[#e5d5c5] dark:border-[#523a24] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e5d5c5] dark:border-[#523a24]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0e6d8] dark:bg-[#523a24] text-[#8b5e34] dark:text-[#dcb37b] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#3b2a1a] dark:text-[#f0e6d8]">
                  วัตถุดิบในชุด Cooking Kit และธาตุเจ้าเรือน
                </h2>
                <p className="text-xs sm:text-sm text-[#8b5e34] dark:text-[#dcb37b]">
                  แจกแจงวัตถุดิบแยกย่อย รสยาตามแพทย์แผนไทย และสารอาหารหลักในหน่วย 100 กรัม (Basis 100g)
                </p>
              </div>
            </div>
            <span className="text-xs bg-[#f4ebd9] dark:bg-[#483321] text-[#8b5e34] dark:text-[#dcb37b] px-3 py-1.5 rounded-full font-medium w-fit">
              ทั้งหมด {recipe.length} รายการ
            </span>
          </div>

          {/* Responsive Ingredient Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5d5c5] dark:border-[#523a24] text-xs uppercase text-[#8b5e34] dark:text-[#dcb37b]">
                  <th className="pb-3 pr-4">วัตถุดิบ (Ingredient)</th>
                  <th className="pb-3 px-3 text-center">หมวดหมู่</th>
                  <th className="pb-3 px-3 text-center">รสยา (แพทย์แผนไทย)</th>
                  <th className="pb-3 px-3 text-center">ธาตุที่ควรกิน</th>
                  <th className="pb-3 px-3 text-right">ปริมาณในชุด</th>
                  <th className="pb-3 px-3 text-right">พลังงาน (ต่อ 100g)</th>
                  <th className="pb-3 px-3 text-right">โปรตีน (ต่อ 100g)</th>
                  <th className="pb-3 px-3 text-right">คาร์บ (ต่อ 100g)</th>
                  <th className="pb-3 pl-3 text-right">ไขมัน (ต่อ 100g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d8] dark:divide-[#483321]">
                {recipe.map((item, index) => {
                  const n = item.nutrientsPer100g || {};
                  return (
                    <tr key={item.ingredientId || index} className="hover:bg-[#faf6ef] dark:hover:bg-[#3c2b1d] transition">
                      <td className="py-3 pr-4 font-medium text-[#3b2a1a] dark:text-[#f0e6d8]">
                        <div>{item.nameTh}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-xs bg-[#f4ebd9] dark:bg-[#523a24] text-[#8b5e34] dark:text-[#dcb37b] px-2 py-0.5 rounded-md">
                          {CATEGORY_LABELS[item.category] || item.categoryTh || 'วัตถุดิบ'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-xs text-[#523a24] dark:text-[#d4c5b0]">
                          {item.medicinalTaste || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {Array.isArray(item.elements) && item.elements.length > 0 ? (
                            item.elements.map((el) => (
                              <span key={el} className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#f0e6d8] dark:bg-[#523a24] text-[#8b5e34] dark:text-[#dcb37b]">
                                {el}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs opacity-50">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-[#8b5e34] dark:text-[#dcb37b]">
                        {item.quantity} {item.unit || 'g'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">{n.calories ?? '-'} kcal</td>
                      <td className="py-3 px-3 text-right font-mono">{n.protein !== undefined ? `${n.protein}g` : '-'}</td>
                      <td className="py-3 px-3 text-right font-mono">{n.carbs !== undefined ? `${n.carbs}g` : '-'}</td>
                      <td className="py-3 pl-3 text-right font-mono">{n.fat !== undefined ? `${n.fat}g` : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total Nutrition Cache Summary Card */}
          {nutrition && nutrition.totals && (
            <div className="mt-6 pt-5 border-t border-[#e5d5c5] dark:border-[#523a24] flex flex-wrap items-center justify-between gap-4 bg-[#fbf8f2] dark:bg-[#2c1e16] p-4 rounded-2xl">
              <div className="text-xs text-[#523a24] dark:text-[#d4c5b0]">
                <span className="font-bold text-[#8b5e34] dark:text-[#dcb37b]">สรุปโภชนาการรวมทั้งเซต ({menu.servings || 2} เสิร์ฟ):</span>
                <span className="ml-2">น้ำตาล {nutrition.totals.sugar}g | ใยอาหาร {nutrition.totals.fiber}g | โซเดียม {nutrition.totals.sodium}mg</span>
              </div>
              <div className="flex gap-4 text-xs sm:text-sm font-semibold text-[#3b2a1a] dark:text-[#f0e6d8]">
                <span>รวม {nutrition.totals.calories} kcal</span>
                <span>P: {nutrition.totals.protein}g</span>
                <span>C: {nutrition.totals.carbs}g</span>
                <span>F: {nutrition.totals.fat}g</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Culinary Heritage & Storage Instruction Section */}
      <section className="mt-12 bg-[#f4ebd9] dark:bg-[#3b2a1a] rounded-3xl p-6 sm:p-8 border border-[#e5d5c5] dark:border-[#523a24]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#8b5e34] text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#523a24] dark:text-[#dcb37b]">
            ประวัติอาหารและภูมิปัญญา
          </h2>
        </div>
        <p className="text-lg leading-8 text-[#3b2a1a] dark:text-[#f0e6d8]">
          {menu.history}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8 border-t border-[#d4c5b0] dark:border-[#523a24] pt-8">
          <div className="bg-white/60 dark:bg-black/20 p-5 rounded-2xl border border-[#e5d5c5]/60 dark:border-[#523a24]/60">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-[#8b5e34] dark:text-[#dcb37b]">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              การเก็บรักษาวัตถุดิบ
            </h3>
            <p className="opacity-80 text-sm leading-relaxed">{menu.storageInstruction}</p>
          </div>
          <div className="bg-white/60 dark:bg-black/20 p-5 rounded-2xl border border-[#e5d5c5]/60 dark:border-[#523a24]/60">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-[#8b5e34] dark:text-[#dcb37b]">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              คำแนะนำการปรุง / อุ่นร้อน
            </h3>
            <p className="opacity-80 text-sm leading-relaxed">{menu.reheatingInstruction}</p>
          </div>
        </div>
      </section>
    </main>
  );
}