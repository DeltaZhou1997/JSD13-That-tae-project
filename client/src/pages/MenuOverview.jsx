import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuCard from '../components/Menu/MenuCard'
import MenuFilters from '../components/Menu/MenuFilters'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext.js'
import { useProducts } from '../context/ProductsContext.js'
import { getUserElement, ELEMENT_EN_TO_TH } from '../utils/quizHelpers.js'

export default function MenuOverview() {
  const { language } = useApp() || { language: 'th' };
  const { currentUser } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const [searchParams] = useSearchParams();
  const [menus, setMenus] = useState([])
  const [status, setStatus] = useState('loading')

  const initialRegion = searchParams.get('region');
  // normalize URL element param: EN ("fire") → TH ("ไฟ") ให้ตรงกับข้อมูลและ MenuFilters
  const rawInitialElement = searchParams.get('element');
  const initialElement = rawInitialElement
    ? (ELEMENT_EN_TO_TH[rawInitialElement] || rawInitialElement)
    : null;

  const userElement = useMemo(() => getUserElement(currentUser), [currentUser]);

  const [filters, setFilters] = useState(() => {
    const defaultElements = initialElement
      ? [initialElement]
      : (currentUser && userElement ? [userElement] : []);
    return {
      search: '',
      region: initialRegion ? [initialRegion] : [],
      health: [],
      element: defaultElements,
      restrictions: [],
    };
  });

  // อัปเดตธาตุ auto เมื่อผู้ใช้เข้าสู่ระบบหรือเปลี่ยนบัญชี
  useEffect(() => {
    if (currentUser && userElement && !initialElement) {
      setFilters((prev) => {
        const currentElements = Array.isArray(prev.element)
          ? prev.element
          : prev.element
            ? [prev.element]
            : [];
        // ถ้ายังไม่ได้เลือกธาตุอะไรเลย ให้ auto เลือกธาตุประจำตัวของผู้ใช้
        if (currentElements.length === 0) {
          return { ...prev, element: [userElement] };
        }
        return prev;
      });
    }
  }, [currentUser, userElement, initialElement]);

  useEffect(() => {
    if (productsLoading) {
      setStatus('loading');
      return;
    }
    const timer = setTimeout(() => {
      // ใช้เฉพาะข้อมูลจาก DB เท่านั้น — ไม่ fallback ไป mock data
      setMenus(Array.isArray(products) ? products : []);
      setStatus('ready');
    }, 200);
    return () => clearTimeout(timer);
  }, [products, productsLoading]);

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

      // ตรวจสอบข้อจำกัดทางอาหาร/โรค/การแพ้ (Food Restrictions & Health Conditions)
      if (Array.isArray(filters.restrictions) && filters.restrictions.length > 0) {
        const menuRestrictions = Array.isArray(menu.foodRestrictions)
          ? menu.foodRestrictions
          : [];
        const menuTags = Array.isArray(menu.tags) ? menu.tags : [];
        const combinedMenuTags = [...menuRestrictions, ...menuTags].map((t) =>
          String(t).toLowerCase().trim()
        );

        // เมนูต้องรองรับทุก restriction ที่เลือก หรือมีแท็กที่ตรงกัน
        const matchesAllRestrictions = filters.restrictions.every((req) => {
          const reqLower = req.toLowerCase();
          return combinedMenuTags.some(
            (tag) => tag === reqLower || tag.includes(reqLower) || reqLower.includes(tag)
          );
        });

        if (!matchesAllRestrictions) {
          return false;
        }
      }

      const rawSelected = Array.isArray(filters.element)
        ? filters.element
        : filters.element
          ? [filters.element]
          : [];

      // normalize เผื่อกรณีค่าที่ยังเป็น EN ผ่านมา (safety net)
      const selectedElements = rawSelected.map(e => ELEMENT_EN_TO_TH[e] || e);

      if (selectedElements.length > 0) {
        // normalize dominantElement ในเมนูด้วยเผื่อ data บางส่วนเก็บเป็น EN
        const menuElem = ELEMENT_EN_TO_TH[menu.dominantElement] || menu.dominantElement;
        const matchesDominant = selectedElements.includes(menuElem);
        const matchesSuitability =
          Array.isArray(menu.elementSuitability) &&
          menu.elementSuitability.some((el) => selectedElements.includes(ELEMENT_EN_TO_TH[el] || el));
        if (!matchesDominant && !matchesSuitability) {
          return false;
        }
      }

      return true;
    });
  }, [menus, filters]);

  return (
    <div className="-mt-20 min-h-screen bg-[#fdfbf7] sm:-mt-24 dark:bg-[#2c1e16]">
      <section className="bg-gradient-to-b from-[#f4ebd9] via-[#f4ebd9] via-80% to-[#fdfbf7] px-5 pt-28 pb-10 text-center sm:pt-36 sm:pb-12 dark:from-[#3b2a1a] dark:via-[#3b2a1a] dark:via-70% dark:to-[#2c1e16]">
        <h1 className="mt-2 text-3xl font-semibold sm:text-5xl text-[#3b2a1a] dark:text-[#f0e6d8]">
          {language === 'th' ? 'ออกแบบมื้ออาหารประจำสัปดาห์' : 'Design Your Weekly Meals'}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-lg opacity-70">
          {language === 'th'
            ? 'เลือกเมนู Cooking Kit ปรุงสดใหม่ ส่งตรงถึงบ้านคุณ'
            : 'Select the menus you want for health and taste, prepared fresh.'}
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 sm:px-6 py-8 lg:grid-cols-[295px_1fr]">
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
                <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredMenus.map((menu, index) => (
                    <div 
                      key={menu._id}
                      className={
                        /* ให้เกิดจังหวะเหลื่อมแบบ Bento บนมือถือ (สลับ card ที่ 1 และ 4 ให้มีระยะ offset เบาๆ) */
                        index % 4 === 1 ? "sm:mt-0 mt-3" : index % 4 === 2 ? "sm:mt-0 -mt-1" : ""
                      }
                    >
                      <MenuCard menu={menu} index={index} />
                    </div>
                  ))}
                </div>
              ) : menus.length === 0 ? (
                <div className="bg-white dark:bg-[#3b2a1a] border border-[#d4c5b0] rounded-2xl p-10 text-center shadow-sm">
                  <p className="text-4xl mb-4">🍽️</p>
                  <p className="font-medium text-lg text-[#523a24] dark:text-[#dcb37b]">
                    {language === 'th' ? 'ยังไม่มีเมนูอาหารในระบบ' : 'No menus available yet.'}
                  </p>
                  <p className="mt-2 text-sm opacity-60">
                    {language === 'th' ? 'แอดมินสามารถเพิ่มเมนูได้ที่หน้าจัดการสินค้า' : 'An admin can add menus from the product management page.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#3b2a1a] border border-[#d4c5b0] rounded-2xl p-10 text-center shadow-sm">
                  <p className="font-medium text-lg text-[#523a24] dark:text-[#dcb37b]">
                    {language === 'th' ? 'ไม่พบเมนูที่ตรงกับการค้นหา' : 'No menus match your search.'}
                  </p>
                  <button
                    onClick={() => setFilters({ search: '', region: [], health: [], element: [], restrictions: [] })}
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