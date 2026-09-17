import dishes from "../../mock-data/dishes";
import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import CartItem from '../Cream/cartItems';

export default function Cart() {
  const { cartItems, handleUpdateQuantity, handleRemoveItem } = useOutletContext();
  const [hasAlerted, setHasAlerted] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = cartItems.length > 0 ? 50 : 0; 
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (subtotal >= 1499 && !hasAlerted ) {
      alert("🎉ยอดสั่งซื้อของคุณถึง 1,499 บาท รับแต้มสะสม!");
      setHasAlerted(true);
      } else if (subtotal < 1499) {
      setHasAlerted(false);
    }
  }, [subtotal, hasAlerted]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-[#3d2c2e]">🛒 ตะกร้าสินค้า</h2>

      {cartItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          ยังไม่มีสินค้าในตะกร้า
        </div>
      ) : (
      <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col">
           {cartItems.map((item) => (
              <CartItem 
                key={item._id} 
                item={item} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemove={handleRemoveItem} 
              />
            ))}
          </div>
        </div>
      )}

    
     <div className="mt-8 rounded-lg bg-[#fff8f5] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#3d2c2e]">สรุปยอดสั่งซื้อ</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>ค่าสินค้า (Subtotal)</span>
                <span>{subtotal.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>{shippingFee.toLocaleString()} บาท</span>
              </div>
              <div className="my-4 border-t border-slate-200"></div>
              <div className="flex justify-between text-lg font-bold text-[#3d2c2e]">
                <span>ยอดรวมทั้งสิ้น (Total)</span>
                <span>{total.toLocaleString()} บาท</span>
              </div>
            </div>

            {cartItems.length > 0 && (
          <div className="mt-6">
            <Link
              to="/checkout" 
              className="block w-full rounded-full bg-[#4c1f08] py-3 text-center text-base font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
            >
              ดำเนินการชำระเงิน
            </Link>
          </div>
        )}
          </div>
    </div>
  );
}