# 🧑‍💻 Task Assignment: Cream (Cart Management & State Operations)
## Sprint 3 — That-tae (ธาตุแท้) Cooking Kit E-Commerce

---

### 👤 ผู้รับผิดชอบ (Assignee)
* **ชื่อสมาชิก:** **Cream** (Role: Full-Stack Developer — Cart Management)
* **ขอบเขตงาน:** รับผิดชอบระบบตะกร้าสินค้าแบบ Full-Stack ทั้งการจัดการ State หน้าบ้าน (React Context / LocalStorage) และ API หลังบ้านสำหรับบันทึก, อัปเดตจำนวน, และลบสินค้าออกจากตะกร้า

---

### 🗺️ แผนการพัฒนา 2 ระยะ (Two-Stage Roadmap: v1 ➔ v2)

```
┌────────────────────────────────────────────────────────┐
│  Stage 1 (ศึกษา & ทดสอบกับ v1 Mock Data / In-Memory)    │
│  • เข้าใจ Data Flow การ Add, Update Qty, Remove Item   │
│  • จัดการ Cart State บน React Context & LocalStorage   │
│  • ทดสอบ CRUD ตะกร้าสินค้าผ่าน Express v1 Routes       │
└───────────────────────────┬────────────────────────────┘
                            │ Upgrade สัปดาห์ถัดไป
┌───────────────────────────▼────────────────────────────┐
│  Stage 2 (เชื่อมต่อ v2 MongoDB / Mongoose Database)    │
│  • สร้าง Mongoose Cart Model เชื่อมโยงกับ User ID      │
│  • Sync ตะกร้าสินค้าลง Cloud MongoDB Atlas             │
│  • รองรับการคำนวณแต้มสะสมและโปรโมชันอัตโนมัติ         │
└────────────────────────────────────────────────────────┘
```

---

### 📋 เกณฑ์การประเมินที่เกี่ยวข้อง (Assessment Rubrics: Task 8)
* [x] **CREATE Operation (Cart):** เชื่อมต่อการบันทึก Cooking Kit ลงตะกร้าสินค้า (`POST /api/v1/cart`)
* [x] **UPDATE Operation (Cart):** เชื่อมต่อการปรับเพิ่ม/ลดจำนวนชุด Cooking Kit ในตะกร้า (`PUT /api/v1/cart/:itemId`)
* [x] **DELETE Operation (Cart):** เชื่อมต่อการลบ Cooking Kit ออกจากตะกร้าสินค้า (`DELETE /api/v1/cart/:itemId`)
* [x] **Cart State Calculations:** คำนวณ Subtotal, ค่าจัดส่ง, และแจ้งเตือนสิทธิ์พิเศษเมื่อสั่งซื้อครบตามยอด

---

### 💻 รายละเอียดการพัฒนาระบบ Full-Stack (Step-by-Step)

#### 🔹 1. ฝั่ง Backend: Cart Controller & Routes

##### [Stage 1: v1 In-Memory Cart Handler] (`server/src/controllers/v1/cart.controller.js`)
```javascript
// Mock In-memory Storage สำหรับศึกษา Flow v1
let mockCarts = {};

// 1. GET User Cart
export const getCart = (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest_user';
  const cart = mockCarts[userId] || { items: [], subtotal: 0 };
  res.json({ success: true, data: cart });
};

// 2. CREATE / Add Item to Cart (POST /api/v1/cart)
export const addToCart = (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest_user';
  const { productId, nameTh, price, quantity = 1, imageUrl } = req.body;

  if (!productId || price <= 0) {
    return res.status(400).json({ success: false, message: 'ข้อมูลสินค้าไม่ถูกต้อง' });
  }

  if (!mockCarts[userId]) {
    mockCarts[userId] = { items: [], subtotal: 0 };
  }

  const existingIndex = mockCarts[userId].items.findIndex(item => item.productId === productId);
  if (existingIndex > -1) {
    mockCarts[userId].items[existingIndex].quantity += quantity;
  } else {
    mockCarts[userId].items.push({
      itemId: `item_${Date.now()}`,
      productId,
      nameTh,
      price,
      quantity,
      imageUrl
    });
  }

  mockCarts[userId].subtotal = mockCarts[userId].items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  res.status(201).json({ success: true, data: mockCarts[userId], message: 'เพิ่มลงตะกร้าแล้ว' });
};

// 3. UPDATE Item Quantity (PUT /api/v1/cart/:itemId)
export const updateCartItem = (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest_user';
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!mockCarts[userId]) {
    return res.status(404).json({ success: false, message: 'ไม่พบตะกร้าสินค้า' });
  }

  const item = mockCarts[userId].items.find(i => i.itemId === itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'ไม่พบรายการสินค้านี้ในตะกร้า' });
  }

  if (quantity <= 0) {
    mockCarts[userId].items = mockCarts[userId].items.filter(i => i.itemId !== itemId);
  } else {
    item.quantity = quantity;
  }

  mockCarts[userId].subtotal = mockCarts[userId].items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  res.json({ success: true, data: mockCarts[userId], message: 'อัปเดตจำนวนเรียบร้อย' });
};

// 4. DELETE Item from Cart (DELETE /api/v1/cart/:itemId)
export const removeCartItem = (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest_user';
  const { itemId } = req.params;

  if (!mockCarts[userId]) {
    return res.status(404).json({ success: false, message: 'ไม่พบตะกร้าสินค้า' });
  }

  mockCarts[userId].items = mockCarts[userId].items.filter(i => i.itemId !== itemId);
  mockCarts[userId].subtotal = mockCarts[userId].items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  
  res.json({ success: true, data: mockCarts[userId], message: 'ลบรายการออกจากตะกร้าแล้ว' });
};
```

---

##### [Stage 2: v2 MongoDB Mongoose Schema] (`server/src/models/Cart.model.js`)
```javascript
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  nameTh: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  imageUrl: { type: String }
});

const CartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true 
  },
  items: [CartItemSchema],
  subtotal: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Cart', CartSchema);
```

---

#### 🔹 2. ฝั่ง Frontend: Cart Context & UI

##### `client/src/context/CartContext.jsx`
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import useToast from '../hooks/useToast.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('thattae_cart');
    return saved ? JSON.parse(saved) : { items: [], subtotal: 0 };
  });
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('thattae_cart', JSON.stringify(cart));
  }, [cart]);

  // CREATE (Add to Cart)
  const addToCart = async (product, count = 1) => {
    const targetId = product._id || product.id;
    const displayName = product.nameTh || product.name;
    const price = product.price || 0;
    const imageUrl = Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl;

    setCart(prev => {
      const existing = prev.items.find(i => (i.productId === targetId));
      let newItems;
      if (existing) {
        newItems = prev.items.map(i => i.productId === targetId ? { ...i, quantity: i.quantity + count } : i);
      } else {
        newItems = [...prev.items, { itemId: `item_${Date.now()}`, productId: targetId, nameTh: displayName, price, quantity: count, imageUrl }];
      }
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, subtotal };
    });

    toast.success(`เพิ่ม "${displayName}" (${count} ชุด) ลงตะกร้าแล้ว`);
  };

  // UPDATE (Update Qty)
  const updateQuantity = (itemId, quantity) => {
    setCart(prev => {
      let newItems;
      if (quantity <= 0) {
        newItems = prev.items.filter(i => i.itemId !== itemId);
      } else {
        newItems = prev.items.map(i => i.itemId === itemId ? { ...i, quantity } : i);
      }
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, subtotal };
    });
  };

  // DELETE (Remove Item)
  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newItems = prev.items.filter(i => i.itemId !== itemId);
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, subtotal };
    });
    toast.info('ลบรายการออกจากตะกร้าเรียบร้อย');
  };

  const clearCart = () => {
    setCart({ items: [], subtotal: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

---

### ✅ Checklist ก่อนส่งมอบงาน (Definition of Done)
1. [ ] ทดสอบปุ่ม Add to Cart จากหน้าร้าน สามารถเพิ่มสินค้าลงใน Cart State ได้ถูกต้อง
2. [ ] ปุ่ม `+` และ `-` ใน Cart Drawer สามารถปรับจำนวนชุดและคำนวณราคารวมได้แบบ Realtime
3. [ ] ปุ่มถังขยะสามารถลบสินค้าออกจากตะกร้าได้สมบูรณ์
4. [ ] รองรับการเชื่อมต่อกับ Express API (`POST`, `PUT`, `DELETE` `/api/v1/cart`)
5. [ ] พร้อมสำหรับการเชื่อมต่อกับ Mongoose `Cart` Schema ใน Stage 2
