import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext.js';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function MenuCard({ menu }) {
  const { language } = useApp() || { language: 'th' };
  const { handleAddToCart } = useOutletContext() || {};
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const navigate = useNavigate();

  const title = (language === 'th' ? (menu.nameTh || menu.name) : (menu.nameEn || menu.name)) || menu.name || '';
  const regionName = menu.regionNameTh || menu.region || '';
  
  const rawImg = Array.isArray(menu.imageUrl) ? (menu.imageUrl[0] || '') : (menu.imageUrl || '');
  const imageUrl = typeof rawImg === 'string' && rawImg.startsWith('file://')
    ? rawImg.replace(/^file:\/\/\/.*?assets\//, '/assets/')
    : rawImg || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      className="group bg-white dark:bg-[#523a24] border border-[#d4c5b0] dark:border-[#755535] rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
      onClick={() => navigate(`/menus/${menu._id}`)}
    >
      <div className="w-full h-48 overflow-hidden relative bg-[#f0e6d8] dark:bg-[#3d2c2e]">
        <img 
          src={imageUrl} 
          alt={title} 
          onError={(e) => {
            e.currentTarget.onerror = null;
            const fallback = (menu.images && menu.images[1]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            e.currentTarget.src = fallback;
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3 bg-[#3b2a1a]/80 text-[#f0e6d8] text-xs px-2 py-1 rounded-md flex items-center gap-1.5">
          <span>{regionName}</span>
          {menu.dominantElement && (
            <span className="opacity-75">• ธาตุ{menu.dominantElement}</span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-[1.1rem] font-medium mb-1 line-clamp-1">{title}</h4>
        <p className="text-sm opacity-70 mb-3 flex-1 line-clamp-2">{menu.description}</p>
        
        <div className="flex justify-between items-end border-t border-[#d4c5b0] dark:border-[#755535] pt-3 mt-auto">
          <div className="text-[1.2rem] font-semibold text-[#8b5e34] dark:text-[#dcb37b]">
            ฿{menu.price}
          </div>
          {isAdmin ? (
            <span className="text-xs font-bold text-[#8b5e34] dark:text-[#dcb37b] hover:underline">
              ดูเมนู &rarr;
            </span>
          ) : (
            <button 
              className="bg-[#dcb37b] hover:bg-[#c99c60] text-[#3b2a1a] px-3.5 py-1.5 rounded-lg flex justify-center items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (handleAddToCart) {
                  handleAddToCart(menu, 1);
                }
              }}
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{language === 'th' ? 'เพิ่ม' : 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}