import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import CartItem from './CartItem.jsx';

export default function Cart() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const context = useOutletContext() || {};
  const {
    cartItems = [],
    handleUpdateQuantity = () => {},
    handleRemoveItem = () => {},
  } = context;

  const [itemToDelete, setItemToDelete] = useState(null);

  const onUpdateQuantity = (itemId, delta) => {
    const item = cartItems.find((i) => (i._id || i.id) === itemId);
    if (!item) return;

    if (item.quantity === 1 && delta === -1) {
      setItemToDelete(itemId);
    } else {
      handleUpdateQuantity(itemId, delta);
    }
  };

  const onRequestRemove = (itemId) => {
    setItemToDelete(itemId);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      handleRemoveItem(itemToDelete); 
      setItemToDelete(null); 
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null); 
  };


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
      {cartItems.length > 0 && !isAdmin && (
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

      {/* Items List */}
      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-[#e8dfd1] bg-white p-12 text-center shadow-sm">
          <p className="mb-4 text-base text-[#6f675f]">ยังไม่มีสินค้าในตะกร้า</p>
          <Link
            to="/menus"
            className="inline-block rounded-full bg-[#4c1f08] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6b3215]"
          >
            เลือกดูเมนูอาหาร
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#e8dfd1] bg-white shadow-sm">
          <div className="divide-y divide-[#f1ead7] p-2 sm:p-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id || item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRequestRemove}
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
            {isAdmin ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-center text-xs font-semibold text-amber-900">
                ⚠️ บัญชีผู้ดูแลระบบ (Admin) สำหรับจัดการระบบหลังบ้าน ไม่มีสิทธิ์สั่งซื้อสินค้า
              </div>
            ) : (
              <Link
                to="/checkout"
                className="block w-full rounded-full bg-[#4c1f08] py-3.5 text-center text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] cursor-pointer"
              >
                ดำเนินการชำระเงิน
              </Link>
            )}
          </div>
        </div>
      )}
          {/* Pop-up Modal ยืนยันการลบสินค้า */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-[#e8dfd1] text-center transform transition-all scale-100">
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-[#3d2c2e] mb-2">แน่ใจหรือไม่ที่จะลบสินค้า?</h3>
            <p className="text-xs text-[#6f675f] mb-6">
              การลดจำนวนสินค้าเหลือ 0 จะเป็นการนำรายการนี้ออกจากตะกร้าของคุณ
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 rounded-full border border-[#dfd1c1] py-2.5 text-xs font-semibold text-[#6f675f] hover:bg-[#f6ede5] transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-sm transition cursor-pointer"
              >
                ยืนยันการลบ
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}