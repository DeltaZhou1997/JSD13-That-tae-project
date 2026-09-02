import dishes from "../../mock-data/dishes";
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import CartItem from './cartItems';

export default function Cart() {
  const { cartItems, handleUpdateQuantity, handleRemoveItem } = useOutletContext();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = cartItems.length > 0 ? 50 : 0; 
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (subtotal >= 1499) {
      alert("🎉ยอดสั่งซื้อของคุณถึง 1,499 บาท รับแต้มสะสม!");
    }
  }, [subtotal]);

  return (
    <div className="cart-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🛒 ตะกร้าสินค้า</h2>

      {cartItems.length === 0 ? (
        <p>ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div className="cart-items-list">
         {cartItems.map((item) => (
            <CartItem 
              key={item._id} 
              item={item} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemove={handleRemoveItem} 
            />
          ))}
        </div>
      )}

      {/* ส่วนสรุปยอดยังเหมือนเดิม*/}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>สรุปยอดสั่งซื้อ</h3>
        <p>ค่าสินค้า (Subtotal): {subtotal.toLocaleString()} บาท</p>
        <p>ค่าจัดส่ง {shippingFee.toLocaleString()} บาท</p>
        <h3>ยอดรวมทั้งสิ้น (Total): {total.toLocaleString()} บาท</h3>
      </div>
    </div>
  );
}