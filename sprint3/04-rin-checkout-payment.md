# 🧑‍💻 Task Assignment: Rin (Checkout, Stripe Payment Gateway & Order Stock)
## Sprint 3 — That-tae (ธาตุแท้) Cooking Kit E-Commerce

---

### 👤 ผู้รับผิดชอบ (Assignee)
* **ชื่อสมาชิก:** **Rin** (Role: Full-Stack Developer — Checkout & Payment Systems)
* **ขอบเขตงาน:** รับผิดชอบระบบการสั่งซื้อ (Checkout Flow), การเชื่อมต่อระบบชำระเงินจริงด้วย **Stripe Payment Gateway**, การสร้าง Mongoose `Order` Model, และการตัดสต็อกสินค้าอัตโนมัติเมื่อการชำระเงินเสร็จสมบูรณ์

---

### 🗺️ แผนการพัฒนา 2 ระยะ (Two-Stage Roadmap: v1 ➔ v2)

```
┌────────────────────────────────────────────────────────┐
│  Stage 1 (ศึกษา & จำลองการ Checkout บน v1 Mock Flow)   │
│  • ทำฟอร์มกรอกที่อยู่จัดส่ง, เบอร์โทรศัพท์, รหัสไปรษณีย์│
│  • จำลองการ Checkout (Simulated Success)              │
│  • ทดสอบการตัด Stock จำลองใน Memory                   │
└───────────────────────────┬────────────────────────────┘
                            │ Upgrade สัปดาห์ถัดไป
┌───────────────────────────▼────────────────────────────┐
│  Stage 2 (เชื่อมต่อ Stripe Payment Gateway จริง & DB)  │
│  • เชื่อมต่อ Stripe Checkout Session (บัตร / PromptPay)│
│  • จัดการ Webhook `checkout.session.completed`        │
│  • บันทึก Order ถาวรลง MongoDB และตัด Stock แบบ Atomic │
└────────────────────────────────────────────────────────┘
```

---

### 📋 เกณฑ์การประเมินที่เกี่ยวข้อง (Assessment Rubrics: Task 8 & Payment)
* [x] **CREATE Operation (Order):** เชื่อมต่อการบันทึกคำสั่งซื้อใหม่ลงในฐานข้อมูล (`POST /api/v1/checkout/create-session` หรือ `POST /api/v1/orders`)
* [x] **Real Payment Integration (Stripe):** เชื่อมต่อระบบชำระเงินจริง รองรับบัตรเครดิต/เดบิต และ QR PromptPay
* [x] **Stock Management:** ตัดลดจำนวน Cooking Kit ในคลังสินค้า (`Product.stock = stock - qty`) อย่างถูกต้องเมื่อจ่ายเงินสำเร็จ
* [x] **Checkout Form Validation:** ตรวจสอบชื่อผู้รับ, ที่อยู่, เบอร์โทรศัพท์ ก่อนอนุญาตให้ไปหน้าชำระเงิน

---

### 💻 รายละเอียดการพัฒนาระบบ Full-Stack (Step-by-Step)

#### 🔹 1. ฝั่ง Backend: Stripe Payment Gateway & Order Controller

##### ติดตั้ง Dependency:
```bash
cd server
npm install stripe
```

##### [Stage 2: Stripe Session & Webhook Controller] (`server/src/controllers/v1/checkout.controller.js`)
```javascript
import Stripe from 'stripe';
import Order from '../../models/Order.model.js';
import Product from '../../models/Product.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// 1. สร้าง Stripe Checkout Session (POST /api/v1/checkout/create-session)
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { items, shippingAddress, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'ไม่มีสินค้าในคำสั่งซื้อ' });
    }

    // แปลง Cart Items เป็น Stripe Line Items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.nameTh,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe ใช้หน่วยสตางค์
      },
      quantity: item.quantity,
    }));

    // บันทึก Order สถานะ PENDING ไว้ชั่วคราว
    const pendingOrder = await Order.create({
      user: userId || null,
      items: items.map(i => ({
        product: i.productId,
        nameTh: i.nameTh,
        price: i.price,
        quantity: i.quantity
      })),
      totalAmount: items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
      shippingAddress,
      paymentStatus: 'pending'
    });

    // สร้าง Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // รองรับ Card (และ promptpay ถ้าเปิดใน Stripe Dashboard)
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${pendingOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
      metadata: {
        orderId: pendingOrder._id.toString()
      }
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      orderId: pendingOrder._id
    });
  } catch (error) {
    next(error);
  }
};

// 2. Stripe Webhook Handler (POST /api/v1/webhook/stripe)
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    // 1. อัปเดตสถานะ Order เป็น PAID
    const order = await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      stripePaymentIntentId: session.payment_intent
    }, { new: true });

    // 2. ตัด Stock สินค้าแต่ละชิ้นแบบ Atomic
    if (order && order.items) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }
  }

  res.json({ received: true });
};
```

---

##### [Mongoose Order Schema] (`server/src/models/Order.model.js`)
```javascript
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nameTh: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    recipient: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  stripePaymentIntentId: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
```

---

#### 🔹 2. ฝั่ง Frontend: หน้า Checkout และ Redirect ไป Stripe

##### `client/src/pages/CheckoutPage.jsx`
```jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import useToast from '../hooks/useToast.js';

export default function CheckoutPage() {
  const { cart } = useCart();
  const toast = useToast();
  const [shipping, setShipping] = useState({
    recipient: '',
    phone: '',
    address: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePayWithStripe = async (e) => {
    e.preventDefault();
    if (!shipping.recipient || !shipping.phone || !shipping.address) {
      toast.error('กรุณากรอกข้อมูลจัดส่งให้ครบถ้วน');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('ไม่มีสินค้าในตะกร้า');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          shippingAddress: shipping
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'สร้างรายการชำระเงินไม่สำเร็จ');

      // Redirect ไปยังหน้าจ่ายเงินของ Stripe
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8">
        {/* Shipping Form */}
        <form onSubmit={handlePayWithStripe} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebe4dc] shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-stone-900 mb-4">ข้อมูลการจัดส่ง Cooking Kit</h2>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
            <input 
              type="text" 
              required
              value={shipping.recipient}
              onChange={(e) => setShipping({ ...shipping, recipient: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm"
              placeholder="สมชาย ใจดี"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
            <input 
              type="tel" 
              required
              value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm"
              placeholder="081-234-5678"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">ที่อยู่จัดส่ง *</label>
            <textarea 
              rows="3"
              required
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm"
              placeholder="เลขที่บ้าน, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">รหัสไปรษณีย์ *</label>
            <input 
              type="text" 
              required
              value={shipping.postalCode}
              onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm"
              placeholder="10110"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#8b5e34] hover:bg-[#704924] text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <span>💳 ไปยังหน้าชำระเงิน (Stripe Gateway)</span>
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="bg-white p-6 rounded-3xl border border-[#ebe4dc] shadow-sm h-fit">
          <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">สรุปคำสั่งซื้อ</h3>
          <div className="divide-y divide-stone-100 py-3 space-y-2">
            {cart.items.map((item) => (
              <div key={item.itemId} className="flex justify-between text-xs pt-2">
                <span className="text-stone-700">{item.nameTh} x {item.quantity}</span>
                <span className="font-bold text-stone-900">฿{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-black text-[#8b5e34]">
            <span>ยอดชำระรวม</span>
            <span>฿{cart.subtotal}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
```

---

### ✅ Checklist ก่อนส่งมอบงาน (Definition of Done)
1. [ ] ฟอร์มข้อมูลจัดส่งมีการตรวจสอบความถูกต้อง (Name, Phone, Address, PostalCode)
2. [ ] เมื่อกดปุ่มชำระเงิน สามารถสร้าง Stripe Session และ Redirect ไปหน้าของ Stripe ได้สำเร็จ
3. [ ] เมื่อชำระเงินผ่านบัตรทดสอบ (`4242 4242...`) ใน Stripe สำเร็จ สามารถ Redirect กลับหน้า `/order-success`
4. [ ] Stripe Webhook ดักจับ Event และทำการตัดสต็อกสินค้าในคลัง MongoDB อัตโนมัติ
