import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function MenuCard({ menu }) {
  const { language, addToCart } = useApp() || { language: 'th', addToCart: () => {} };
  const navigate = useNavigate();

  const title = language === 'th' ? menu.nameTh : menu.nameEn;
  const regionName = language === 'th' ? menu.regionNameTh : menu.region;
  const imageUrl = menu.imageUrl && menu.imageUrl.length > 0 ? menu.imageUrl[0] : '';

  return (
    <div 
      className="group bg-white dark:bg-[#523a24] border border-[#d4c5b0] dark:border-[#755535] rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
      onClick={() => navigate(`/menus/${menu._id}`)}
    >
      <div className="w-full h-48 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3 bg-[#3b2a1a]/80 text-[#f0e6d8] text-xs px-2 py-1 rounded-md">
          {regionName}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-[1.1rem] font-medium mb-1 line-clamp-1">{title}</h4>
        <p className="text-sm opacity-70 mb-3 flex-1 line-clamp-2">{menu.description}</p>
        
        <div className="flex justify-between items-end border-t border-[#d4c5b0] dark:border-[#755535] pt-3 mt-auto">
          <div className="text-[1.2rem] font-semibold text-[#8b5e34] dark:text-[#dcb37b]">
            ฿{menu.price}
          </div>
          <button 
            className="bg-[#dcb37b] hover:bg-[#c99c60] text-[#3b2a1a] px-3 py-1.5 rounded-lg flex justify-center items-center text-sm font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(menu, 1);
            }}
          >
            🛒 {language === 'th' ? 'เพิ่ม' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}