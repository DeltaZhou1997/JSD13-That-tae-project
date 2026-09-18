import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuCard from '../components/Menu/MenuCard'
import MenuFilters from '../components/Menu/MenuFilters'
import { useApp } from '../context/AppContext'
import { useProducts } from '../context/ProductsContext.js'
import { dishes } from '../mock-data/index.js' 

export default function MenuOverview() {
  const { language } = useApp() || { language: 'th' };
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [menus, setMenus] = useState([])
  const [status, setStatus] = useState('loading')
  
  const initialRegion = searchParams.get('region');
  const [filters, setFilters] = useState({ 
    search: '', 
    region: initialRegion ? [initialRegion] : [],
    health: [],
    element: '' 
  })

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      if (products && products.length > 0) {
        setMenus(products);
      } else {
        setMenus(Object.values(dishes));
      }
      setStatus('ready');
    }, 200);
    return () => clearTimeout(timer);
  }, [products]);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const nameTh = (menu.nameTh || menu.name || '').toLowerCase();
        const nameEn = (menu.nameEn || '').toLowerCase();
        const desc = (menu.description || '').toLowerCase();
        if (!nameTh.includes(searchTerm) && !nameEn.includes(searchTerm) && !desc.includes(searchTerm)) {
          return false;
        }
      }
      
      if (filters.region.length > 0) {
        if (!filters.region.includes(menu.region) && !filters.region.includes(menu.regionNameTh)) {
          return false;
        }
      }
      return true;
    });
  }, [menus, filters]);

  return (
    <div className="bg-[#fdfbf7] dark:bg-[#2c1e16] min-h-screen">
      <section className="px-5 py-10 text-center sm:py-12 bg-[#f4ebd9] dark:bg-[#3b2a1a]">
        <p className="text-xs tracking-[0.25em] opacity-60 text-[#8b5e34] dark:text-[#dcb37b] font-bold">WEEKLY MENU</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl text-[#3b2a1a] dark:text-[#f0e6d8]">
          {language === 'th' ? 'ออกแบบมื้ออาหารประจำสัปดาห์' : 'Design Your Weekly Meals'}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base opacity-70">
          {language === 'th'
            ? 'เลือกเมนู Cooking Kit ปรุงสดใหม่ ส่งตรงถึงบ้านคุณ'
            : 'Select the menus you want for health and taste, prepared fresh.'}
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[280px_1fr]">
        <MenuFilters filters={filters} setFilters={setFilters} />

        <div>
          {status === 'loading' && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8b5e34]"></div>
            </div>
          )}
          
          {status === 'ready' && (
            <>
              <div className="mb-6 text-sm opacity-70">
                <span>{language === 'th' ? `พบ ${filteredMenus.length} เมนู` : `${filteredMenus.length} menus found`}</span>
              </div>
              
              {filteredMenus.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredMenus.map((menu) => (
                    <MenuCard key={menu._id} menu={menu} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#3b2a1a] border border-[#d4c5b0] rounded-2xl p-10 text-center shadow-sm">
                  <p className="font-medium text-lg text-[#523a24] dark:text-[#dcb37b]">
                    {language === 'th' ? 'ไม่พบเมนูที่ตรงกับการค้นหา' : 'No menus match your search.'}
                  </p>
                  <button 
                    onClick={() => setFilters({ search: '', region: [], health: [], element: '' })}
                    className="mt-4 px-4 py-2 bg-[#8b5e34] text-white rounded-lg hover:bg-[#755535]"
                  >
                    {language === 'th' ? 'ล้างตัวกรอง' : 'Clear Filters'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}