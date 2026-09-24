import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext.js';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { formatMissing, getStockStatus } from '../../utils/stock.js';
import { restrictionShortLabel } from '../../constants/foodRestrictions.js';

const ELEMENT_CONFIG = {
  'ดิน': {
    th: 'ธาตุดิน',
    en: 'Earth',
    badgeClass: 'bg-amber-100/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    iconColor: 'text-amber-700 dark:text-amber-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  'น้ำ': {
    th: 'ธาตุน้ำ',
    en: 'Water',
    badgeClass: 'bg-blue-100/95 dark:bg-blue-950/90 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    iconColor: 'text-blue-700 dark:text-blue-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  'ลม': {
    th: 'ธาตุลม',
    en: 'Wind',
    badgeClass: 'bg-emerald-100/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
  },
  'ไฟ': {
    th: 'ธาตุไฟ',
    en: 'Fire',
    badgeClass: 'bg-rose-100/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    iconColor: 'text-rose-700 dark:text-rose-400',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
};

const ELEMENT_MAP = {
  earth: 'ดิน',
  water: 'น้ำ',
  air: 'ลม',
  wind: 'ลม',
  fire: 'ไฟ',
  ดิน: 'ดิน',
  น้ำ: 'น้ำ',
  ลม: 'ลม',
  ไฟ: 'ไฟ',
};

export default function MenuCard({ menu, index = 0 }) {
  const { language } = useApp() || { language: 'th' };
  const { handleAddToCart } = useOutletContext() || {};
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const navigate = useNavigate();

  const title = (language === 'th' ? (menu.nameTh || menu.name) : (menu.nameEn || menu.name)) || menu.name || '';
  const regionNames = {
    northern: language === 'th' ? 'ภาคเหนือ' : 'Northern',
    northeastern: language === 'th' ? 'ภาคอีสาน' : 'Northeastern',
    central: language === 'th' ? 'ภาคกลาง' : 'Central',
    southern: language === 'th' ? 'ภาคใต้' : 'Southern',
    fusion: language === 'th' ? 'ไทยฟิวชั่น' : 'Fusion',
  };
  const regionName = regionNames[menu.region] || menu.regionNameTh || menu.region || '';

  const rawElement = (menu.dominantElement || '').trim();
  const normalizedElement = ELEMENT_MAP[rawElement.toLowerCase()] || rawElement;
  const elConfig = ELEMENT_CONFIG[normalizedElement] || null;

  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
  const rawImg = Array.isArray(menu.imageUrl) ? (menu.imageUrl[0] || '') : (menu.imageUrl || '');
  let imageUrl = rawImg;
  if (typeof rawImg === 'string' && rawImg.startsWith('file://')) {
    imageUrl = rawImg.replace(/^file:\/\/\/.*?assets\//, '/assets/');
  } else if (typeof rawImg === 'string' && rawImg.startsWith('/api/v2/images/')) {
    imageUrl = `${apiUrl}${rawImg}`;
  } else if (!rawImg) {
    imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
  }

  // สร้างความสูงรูปที่เหลื่อมกันเล็กน้อยสไตล์ Bento ในจอมือถือ (เช่น index สลับ ให้ภาพสูง 32 กับ 40)
  const isTallImage = index % 3 === 1;

  // วัตถุดิบในภาคของเมนูไม่พอแม้แต่อย่างเดียว → สินค้าหมด
  const stock = getStockStatus(menu);
  const soldOut = stock.soldOut;
  const mobileImgHeight = isTallImage ? "h-36 sm:h-48" : "h-28 sm:h-48";

  return (
    <div
      className={`group border rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 ${
        soldOut
          ? 'bg-stone-50 dark:bg-[#3d2c2e] border-stone-200 dark:border-[#5a4a3a]'
          : 'bg-white dark:bg-[#523a24] border-[#d4c5b0] dark:border-[#755535] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10'
      }`}
      aria-label={soldOut ? `${title} (สินค้าหมด)` : undefined}
      onClick={() => navigate(`/menus/${menu._id}`)}
    >
      <div className={`w-full ${mobileImgHeight} overflow-hidden relative bg-[#f0e6d8] dark:bg-[#3d2c2e] shrink-0`}>
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            const fallback = (menu.images && menu.images[1]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            e.currentTarget.src = fallback;
          }}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            soldOut ? 'grayscale opacity-60' : 'group-hover:scale-110'
          }`}
        />

        {/* ลายน้ำ "สินค้าหมด" */}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/15 pointer-events-none select-none">
            <span className="-rotate-12 rounded-xl border-2 border-white/90 bg-stone-900/55 px-3 py-1 sm:px-5 sm:py-1.5 text-sm sm:text-lg font-black tracking-[0.2em] text-white shadow-lg backdrop-blur-[2px]">
              สินค้าหมด
            </span>
          </div>
        )}
        {/* Badges ขอบเมนู: แยกภูมิภาค และ ธาตุพร้อมโลโก้และสี Fill เด่นชัด อ่านง่าย */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex items-center gap-1 sm:gap-1.5 flex-wrap pointer-events-none">
          {regionName && (
            <span className="backdrop-blur-md bg-black/60 text-white border border-white/20 rounded-full px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-medium shadow-sm select-none">
              {regionName}
            </span>
          )}
          {elConfig && (
            <span className={`backdrop-blur-md rounded-full px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm border select-none transition-transform duration-200 group-hover:scale-105 ${elConfig.badgeClass}`}>
              <span className="shrink-0 scale-90 sm:scale-100">{elConfig.svg}</span>
              <span>{elConfig[language] || elConfig.th}</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <h4 className={`text-[0.92rem] sm:text-[1.1rem] font-semibold mb-1 line-clamp-1 transition-colors ${
            soldOut
              ? 'text-stone-500 dark:text-stone-400'
              : 'text-[#3b2a1a] dark:text-[#f8f5f0] group-hover:text-[#8b5e34] dark:group-hover:text-[#dcb37b]'
          }`}>
            {title}
          </h4>
          {/* ชื่อภาษาอีกภาษา (ไทย → อังกฤษ / อังกฤษ → ไทย) ตัวเล็กใต้ชื่อ */}
          {(() => {
            const sub = language === 'th' ? menu.nameEn : (menu.nameTh || menu.name);
            return sub && sub !== title ? (
              <p className="-mt-0.5 mb-1.5 text-[10px] sm:text-xs italic text-stone-500 dark:text-stone-400 line-clamp-1">{sub}</p>
            ) : null;
          })()}
          <p className="text-[11px] sm:text-sm opacity-70 mb-2 line-clamp-1 sm:line-clamp-2">
            {menu.description}
          </p>
          {/* แท็กข้อจำกัดทางอาหาร/โรค/การแพ้ */}
          {(Array.isArray(menu.foodRestrictions) && menu.foodRestrictions.length > 0) ? (
            <div className="flex flex-wrap gap-1 mb-2">
              {menu.foodRestrictions.slice(0, 3).map((r, i) => (
                <span
                  key={i}
                  className="rounded-md bg-[#f6ede5] dark:bg-[#483421] text-[#8d593a] dark:text-[#dcb37b] px-1.5 py-0.5 text-[9px] font-semibold"
                >
                  {restrictionShortLabel(r)}
                </span>
              ))}
              {menu.foodRestrictions.length > 3 && (
                <span className="text-[9px] text-[#8d593a] font-bold">
                  +{menu.foodRestrictions.length - 3}
                </span>
              )}
            </div>
          ) : Array.isArray(menu.tags) && menu.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mb-2">
              {menu.tags.slice(0, 2).map((t, i) => (
                <span
                  key={i}
                  className="rounded-md bg-[#f6ede5] dark:bg-[#483421] text-[#8d593a] dark:text-[#dcb37b] px-1.5 py-0.5 text-[9px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex justify-between items-center sm:items-end gap-2 border-t border-[#d4c5b0]/60 dark:border-[#755535]/60 pt-2 sm:pt-3 mt-auto">
          <div className="min-w-0">
            <div className={`text-[1rem] sm:text-[1.2rem] font-bold ${soldOut ? 'text-stone-400' : 'text-[#8b5e34] dark:text-[#dcb37b]'}`}>
              ฿{menu.price}
            </div>
            {soldOut && stock.missing.length > 0 && (
              <p className="truncate text-[10px] sm:text-[11px] text-stone-400" title={stock.missing.join(', ')}>
                {formatMissing(stock.missing, 1)}
              </p>
            )}
            {!soldOut && stock.availableKits !== null && (
              <p className={`text-[10px] sm:text-[11px] font-semibold ${stock.availableKits <= 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {stock.availableKits <= 5 ? `เหลือ ${stock.availableKits} ชุด` : `พร้อมขาย ${stock.availableKits} ชุด`}
              </p>
            )}
          </div>
          {isAdmin ? (
            <span className="text-[10px] sm:text-xs font-bold text-[#8b5e34] dark:text-[#dcb37b] hover:underline">
              ดูเมนู &rarr;
            </span>
          ) : soldOut ? (
            <button
              type="button"
              disabled
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 whitespace-nowrap bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-300 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-sm font-semibold cursor-not-allowed"
              title="วัตถุดิบไม่เพียงพอ"
            >
              สินค้าหมด
            </button>
          ) : (
            <button
              className="shrink-0 bg-[#dcb37b] hover:bg-[#c99c60] text-[#3b2a1a] px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg flex justify-center items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer active:scale-95 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (handleAddToCart) {
                  handleAddToCart(menu, 1);
                }
              }}
              title={language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to cart'}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-[11px] sm:text-sm">{language === 'th' ? 'เพิ่ม' : 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}