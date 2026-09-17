import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { dishes } from '../mock-data/index.js' 

export default function MenuDetail() {
  const { id } = useParams()
  const { language, addToCart, setIsCartOpen } = useApp() || { language: 'th', addToCart: () => {}, setIsCartOpen: () => {} };
  const [menu, setMenu] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    const foundMenu = dishes[id];
    if (foundMenu) {
      setMenu(foundMenu);
      setSelectedImage(foundMenu.imageUrl[0]);
    }
  }, [id])

  if (!menu) return (
    <main className="mx-auto max-w-5xl px-5 py-20 text-center">
      <h1 className="text-2xl font-semibold">ไม่พบเมนูนี้ (404)</h1>
      <Link to="/menus" className="mt-4 inline-block underline text-[#8b5e34]">กลับไปหน้าร้านค้า</Link>
    </main>
  )

  const title = language === 'th' ? menu.nameTh : menu.nameEn;
  const regionName = language === 'th' ? menu.regionNameTh : menu.region;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-10 bg-[#fdfbf7] dark:bg-[#2c1e16]">
      <nav className="mb-7 text-sm opacity-70 text-[#523a24] dark:text-[#f0e6d8]">
        <Link to="/menus" className="hover:underline">Storefront</Link>
        <span className="mx-2">›</span>
        <span>{regionName}</span>
        <span className="mx-2">›</span>
        <span className="font-medium opacity-100">{title}</span>
      </nav>

      <section className="grid gap-9 lg:grid-cols-2 lg:items-center">
        <div>
          <img src={selectedImage} alt={title} className="h-96 w-full rounded-2xl border border-[#d4c5b0] object-cover shadow-md" />
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {menu.imageUrl.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedImage(img)} 
                className={`shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === img ? 'border-[#8b5e34]' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="h-20 w-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col h-full justify-center">
          <span className="bg-[#f0e6d8] dark:bg-[#523a24] text-[#8b5e34] dark:text-[#dcb37b] text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
            {regionName}
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl text-[#3b2a1a] dark:text-[#f0e6d8] mb-4">
            {title}
          </h1>
          <p className="text-[#523a24] dark:text-[#d4c5b0] leading-relaxed mb-6 text-lg">
            {menu.description}
          </p>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-bold text-[#8b5e34]">฿{menu.price}</span>
            <span className="text-sm opacity-70 mb-1">/ {menu.servings} เสิร์ฟ</span>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center border border-[#d4c5b0] rounded-xl overflow-hidden bg-white dark:bg-[#3b2a1a]">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 text-xl hover:bg-[#f0e6d8] dark:hover:bg-[#523a24] transition">−</button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 text-xl hover:bg-[#f0e6d8] dark:hover:bg-[#523a24] transition">+</button>
            </div>
            <button 
              onClick={() => { addToCart(menu, quantity); setIsCartOpen(true); }} 
              className="flex-1 rounded-xl bg-[#8b5e34] hover:bg-[#755535] text-white font-semibold transition text-lg shadow-lg"
            >
              🛒 {language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-16 bg-[#f4ebd9] dark:bg-[#3b2a1a] rounded-3xl p-8 border border-[#e5d5c5] dark:border-[#523a24]">
        <h2 className="text-2xl font-bold text-[#523a24] dark:text-[#dcb37b] mb-4">📜 ประวัติอาหาร (InfoCard)</h2>
        <p className="text-lg leading-8 text-[#3b2a1a] dark:text-[#f0e6d8]">{menu.history}</p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8 border-t border-[#d4c5b0] dark:border-[#523a24] pt-8">
          <div>
            <h3 className="font-bold mb-2 flex items-center gap-2">❄️ การเก็บรักษา</h3>
            <p className="opacity-80">{menu.storageInstruction}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2 flex items-center gap-2">🔥 การอุ่น/ปรุง</h3>
            <p className="opacity-80">{menu.reheatingInstruction}</p>
          </div>
        </div>
      </section>
    </main>
  )
}