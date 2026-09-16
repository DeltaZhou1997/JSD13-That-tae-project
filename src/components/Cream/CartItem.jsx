export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-4 last:border-0">
      <div>
        <h4 className="text-lg font-semibold text-slate-800">{item.nameTh}</h4>
        <p className="text-sm text-slate-600">ราคา: {item.price} บาท</p>
      </div>
      
      <div className="flex items-center gap-3">
      
        <div className="flex items-center rounded-lg border border-slate-300 bg-white">
        <button 
            onClick={() => onUpdateQuantity(item._id, -1)}
            className="px-3 py-1 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            disabled={item.quantity <= 1} 
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item._id, 1)}
            className="px-3 py-1 text-slate-600 transition hover:bg-slate-100"
          >
            +
          </button>
        </div>
        
      
        <button 
          onClick={() => onRemove(item._id)}
          className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          ลบ
        </button>
      </div>
    </div>
  );
}