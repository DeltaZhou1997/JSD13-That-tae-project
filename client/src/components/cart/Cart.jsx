import { useOutletContext, Link } from 'react-router-dom';
import CartItem from './CartItem.jsx';

export default function Cart() {
  const context = useOutletContext() || {};
  const {
    cartItems = [],
    handleUpdateQuantity = () => {},
    handleRemoveItem = () => {},
  } = context;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const shippingFee = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shippingFee;
  const qualifiesForReward = subtotal >= 1499;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 text-[#2f2119]">
      <h2 className="mb-6 flex items-center gap-2.5 text-2xl font-bold text-[#3d2c2e]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 text-[#8d593a]"
          aria-hidden="true"
        >
          <path d="M3 9h18l-1.4 9H4.4L3 9Z" />
          <path d="m8 9 4-5 4 5M8 13v2m4-2v2m4-2v2" />
        </svg>
        <span>ตะกร้าสินค้า</span>
      </h2>

      {/* Rewards Banner */}
      {cartItems.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8dfd1] bg-white p-4 shadow-sm">
          {qualifiesForReward ? (
            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 12 12 8 8 12" />
                <line x1="12" y1="16" x2="12" y2="8" />
              </svg>
              <span>ยอดสั่งซื้อครบ 1,499 บาทแล้ว! รับสิทธิประโยชน์แต้มสะสมพิเศษเรียบร้อย</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#6f675f]">
                <span>ซื้อเพิ่มอีก <strong>{(1499 - subtotal).toLocaleString()}</strong> บาท เพื่อรับแต้มสะสมพิเศษ</span>
                <span className="font-bold text-[#8d593a]">{Math.min(100, Math.round((subtotal / 1499) * 100))}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#f1ead7] overflow-hidden">
                <div
                  className="h-full bg-[#8d593a] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / 1499) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d9cbbd] bg-white p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#fcf8f2] border border-[#e8dfd1] text-[#8d593a] flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
              <path d="M3 9h18l-1.4 9H4.4L3 9Z" />
              <path d="m8 9 4-5 4 5M8 13v2m4-2v2m4-2v2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#3d2c2e] mb-1">ยังไม่มีสินค้าในตะกร้า</h3>
          <p className="text-xs text-[#6f675f] max-w-sm mx-auto mb-6">
            เลือก Cooking Kit เมนูอาหารไทยตามธาตุเจ้าเรือนที่คุณชื่นชอบลงตะกร้าได้เลย
          </p>
          <Link
            to="/menus"
            className="inline-block rounded-full bg-[#4c1f08] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#6b3215] transition-colors"
          >
            เลือกดูเมนูอาหาร
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#e8dfd1]">
          <div className="flex flex-col">
            {cartItems.map((item) => (
              <CartItem
                key={item._id || item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-8 rounded-3xl bg-white border border-[#e8dfd1] p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-[#3d2c2e]">สรุปยอดสั่งซื้อ</h3>
          <div className="space-y-2.5 text-xs text-[#6f675f]">
            <div className="flex justify-between">
              <span>ค่าสินค้า (Subtotal)</span>
              <span className="font-semibold text-[#2f2119]">
                ฿{subtotal.toLocaleString()} บาท
              </span>
            </div>
            <div className="flex justify-between">
              <span>ค่าจัดส่ง</span>
              <span className="font-semibold text-[#2f2119]">
                ฿{shippingFee.toLocaleString()} บาท
              </span>
            </div>
            <div className="my-3 border-t border-[#f1ead7]"></div>
            <div className="flex justify-between text-sm font-bold text-[#3d2c2e]">
              <span>ยอดรวมทั้งสิ้น (Total)</span>
              <span className="text-base text-[#8d593a]">
                ฿{total.toLocaleString()} บาท
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/checkout"
              className="block w-full rounded-full bg-[#4c1f08] py-3.5 text-center text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] cursor-pointer"
            >
              ดำเนินการชำระเงิน
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}