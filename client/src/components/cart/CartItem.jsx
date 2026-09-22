export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemId = item._id || item.id;
  const displayName = item.nameTh || item.name || "Cooking Kit เมนูพิเศษ";
  const unitPrice = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;

  return (
    <div className="flex items-center justify-between border-b border-[#f1ead7] py-4 last:border-0 gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Thumbnail Image */}
        <div className="w-14 h-14 rounded-xl bg-[#f6ede5] flex items-center justify-center shrink-0 border border-[#e8dfd1] overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#8d593a]" aria-hidden="true">
              <path d="M12 2v3M8 3.5v2M16 3.5v2M3 11h18c0 4.97-4.03 9-9 9s-9-4.03-9-9z" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-[#3d2c2e] truncate">{displayName}</h4>
          <p className="text-xs text-[#8d593a] font-medium">
            ฿{unitPrice.toLocaleString()} บาท / ชุด
          </p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center rounded-lg border border-[#dfd1c1] bg-white overflow-hidden shadow-sm">
          <button 
            type="button"
            onClick={() => onUpdateQuantity(itemId, -1)}
            className="px-2.5 py-1 text-slate-600 transition hover:bg-[#f6ede5] disabled:opacity-40 cursor-pointer"
            aria-label="ลดจำนวน" 
          >
            -
          </button>
          <span className="w-7 text-center text-xs font-bold text-[#3d2c2e]">{quantity}</span>
          <button 
            type="button"
            onClick={() => onUpdateQuantity(itemId, 1)}
            className="px-2.5 py-1 text-slate-600 transition hover:bg-[#f6ede5] cursor-pointer"
            aria-label="เพิ่มจำนวน"
          >
            +
          </button>
        </div>
        
        <button 
          type="button"
          onClick={() => onRemove(itemId)}
          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
          title="ลบรายการนี้"
          aria-label="ลบรายการ"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}