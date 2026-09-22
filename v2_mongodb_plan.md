# 🚀 That Tae API — แผน V2 เชื่อมต่อ MongoDB Atlas

> **จากสถานะปัจจุบัน:** v1 ใช้ in-memory / mockDB  
> **เป้าหมาย v2:** เชื่อมต่อ MongoDB Atlas จริง + Refresh Token + Upload รูปผ่าน GridFS + RAG AI Advisor API

---

## 📋 สรุปภาพรวม

| ส่วน | v1 (ปัจจุบัน) | v2 (เป้าหมาย) |
|------|-------------|-------------|
| Database | In-memory / mockDB arrays | MongoDB Atlas (Mongoose) |
| Auth | JWT Access Token (7d, HttpOnly Cookie) | Access Token (15m) + Refresh Token (7d) |
| Session | ไม่มี (stateless) | Refresh Token เก็บใน MongoDB |
| รูปภาพ | Static file `/assets` | GridFS (MongoDB) หรือ Cloudinary |
| Products | `data/products.js` array | `Product` Mongoose model |
| Cart | In-memory Map | `Cart` Mongoose model |
| Orders | In-memory array | `Order` Mongoose model |
| RAG AI | Client-side only | `/api/v2/advisor` — server-side RAG |
| Users | In-memory array | `User` Mongoose model |
| Admin | No auth guard | `requireAdmin` middleware |

---

## 🗂️ โครงสร้างไฟล์ v2 (server-test-src)

```
server-test-src/
├── config/
│   ├── db.js                   # connectDB() → MongoDB Atlas
│   └── gridfs.js               # GridFS bucket setup
│
├── middleware/
│   ├── auth.js                 # requireAuth, requireAdmin, optionalAuth
│   └── upload.js               # multer + GridFS storage
│
├── models/
│   ├── User.model.js           # ✅ มีอยู่แล้ว (เพิ่ม refreshTokens[])
│   ├── Product.model.js        # ✅ มีอยู่แล้ว
│   ├── Cart.js                 # ✅ มีอยู่แล้ว
│   ├── Order.js                # ✅ มีอยู่แล้ว
│   ├── RefreshToken.model.js   # 🆕 เก็บ refresh tokens
│   └── Review.model.js         # 🆕 รีวิวจากลูกค้า
│
├── routes/
│   └── v2/
│       ├── index.js            # mount ทุก routes
│       ├── auth.routes.js      # 🆕 /login /logout /refresh /me
│       ├── users.routes.js     # CRUD users (MongoDB)
│       ├── products.routes.js  # CRUD products (MongoDB) + filter
│       ├── cart.routes.js      # Cart (MongoDB, per-user)
│       ├── checkout.routes.js  # Order + stock deduct (MongoDB)
│       ├── orders.routes.js    # GET orders history
│       ├── upload.routes.js    # 🆕 POST image → GridFS
│       ├── ingredients.routes.js # Ingredients (MongoDB)
│       ├── regions.routes.js   # Static region data
│       ├── reviews.routes.js   # 🆕 Reviews CRUD (MongoDB)
│       ├── advisor.routes.js   # 🆕 RAG AI endpoint
│       └── admin.routes.js     # Admin-only: stats, manage users
│
└── server.js                   # Entry point (mount /api/v2)
```

---

## 🔧 Dependencies ที่ต้องเพิ่ม

```json
{
  "dependencies": {
    "mongoose": "^8.x",
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x",
    "cookie-parser": "^1.x",
    "multer": "^1.x",
    "multer-gridfs-storage": "^5.x",
    "gridfs-stream": "^1.x",
    "express": "^5.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "crypto-random-string": "^5.x"
  }
}
```

### `.env` เพิ่มเติม

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/that-tae
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
GRIDFS_BUCKET=uploads
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🔑 ส่วนที่ 1 — Authentication & Session (ทำก่อนทุกอย่าง)

**ไฟล์:** `routes/v2/auth.routes.js`  
**Middleware:** `middleware/auth.js`  
**Model:** `models/RefreshToken.model.js`

### กลไก Dual-Token

```
Login → Access Token (15m, memory) + Refresh Token (7d, HttpOnly Cookie + DB)

Client แนบ Authorization: Bearer <accessToken> ทุก request
เมื่อ Access หมดอายุ → POST /api/v2/auth/refresh (ดึงจาก Cookie)
                     → ได้ Access Token ใหม่

Logout → ลบ Refresh Token จาก DB + Clear Cookie
```

### Routes ใน auth.routes.js

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v2/auth/login` | Login, คืน accessToken + set refreshToken Cookie |
| `POST` | `/api/v2/auth/register` | สมัครสมาชิก |
| `POST` | `/api/v2/auth/refresh` | แลก Refresh Token → Access Token ใหม่ |
| `POST` | `/api/v2/auth/logout` | ลบ Refresh Token, Clear Cookie |
| `GET`  | `/api/v2/auth/me` | ดึง current user (ต้อง authenticate) |

### Middleware

```js
// requireAuth — ตรวจ Bearer Token (Access Token)
export const requireAuth = (req, res, next) => { ... }

// requireAdmin — ต่อจาก requireAuth, ตรวจ role === 'admin'
export const requireAdmin = (req, res, next) => { ... }

// optionalAuth — ถ้ามี token แนบ user ไว้, ถ้าไม่มีก็ผ่าน
export const optionalAuth = (req, res, next) => { ... }
```

---

## 👤 ส่วนที่ 2 — Users (MongoDB)

**ไฟล์:** `routes/v2/users.routes.js`  
**Model:** `models/User.model.js` (เพิ่ม field ด้านล่าง)

### เพิ่ม Field ใน User Model

```js
// เพิ่มใน userSchema
element: { type: String, enum: ['earth', 'water', 'air', 'fire', ''] },
bodyElement: { type: String },
birthDate: { type: String },
gender: { type: String },
bloodType: { type: String },
conditions: [{ type: String }],
biaPoints: { type: Number, default: 0 },
tierStatus: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
isSubscribed: { type: Boolean, default: false },
lastActiveAt: { type: Date },
profileImageUrl: { type: String, default: '' },     // 🆕 รูปโปรไฟล์ GridFS
profileImageId: { type: mongoose.Schema.Types.ObjectId }, // 🆕 GridFS file ID
```

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v2/users` | Admin | รายการ users ทั้งหมด |
| `GET` | `/api/v2/users/:id` | Auth (self/admin) | ดูข้อมูล user |
| `PUT` | `/api/v2/users/:id` | Auth (self/admin) | แก้ไขข้อมูล |
| `DELETE` | `/api/v2/users/:id` | Admin | ลบ user |
| `PUT` | `/api/v2/users/:id/element` | Auth | อัปเดตธาตุเจ้าเรือน |
| `PUT` | `/api/v2/users/:id/avatar` | Auth | อัปโหลดรูปโปรไฟล์ |
| `GET` | `/api/v2/users/:id/orders` | Auth | ดูประวัติ order ของ user |

---

## 🖼️ ส่วนที่ 3 — Image Upload (GridFS)

**ไฟล์:** `routes/v2/upload.routes.js`, `config/gridfs.js`, `middleware/upload.js`

### กลไก GridFS

```
Client → multipart/form-data POST /api/v2/upload/product-image
       → multer-gridfs-storage → บันทึกใน MongoDB GridFS bucket "uploads"
       → คืน { fileId, url: /api/v2/files/:id }

GET /api/v2/files/:id → stream file จาก GridFS กลับไปเป็น image
```

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v2/upload/product-image` | Admin | อัปโหลดรูปสินค้า |
| `POST` | `/api/v2/upload/avatar` | Auth | อัปโหลดรูปโปรไฟล์ |
| `GET`  | `/api/v2/files/:id` | Public | ดึงไฟล์จาก GridFS |
| `DELETE` | `/api/v2/files/:id` | Admin | ลบไฟล์จาก GridFS |

### multer config

```js
// multer-gridfs-storage เชื่อมตรงกับ MongoDB
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'uploads',
    metadata: { uploadedBy: req.user?._id }
  })
});
```

---

## 🛒 ส่วนที่ 4 — Products (MongoDB)

**ไฟล์:** `routes/v2/products.routes.js`  
**Model:** `models/Product.model.js` ✅

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v2/products` | Public | ดึงสินค้า + filter (element, region, search, sort, page) |
| `GET` | `/api/v2/products/:id` | Public | ดึงสินค้ารายชิ้น |
| `POST` | `/api/v2/products` | Admin | สร้างสินค้าใหม่ |
| `PUT` | `/api/v2/products/:id` | Admin | แก้ไขสินค้า |
| `DELETE` | `/api/v2/products/:id` | Admin | ลบสินค้า (soft delete: `isActive=false`) |
| `PATCH` | `/api/v2/products/:id/stock` | Admin | อัปเดต stock |

### Filter Logic (MongoDB Query)

```js
// v2 filter: ใช้ MongoDB Query แทน JS filter
const query = {};
if (element) {
  // normalize EN → TH
  const elTh = ELEMENT_EN_TO_TH[element] || element;
  query.$or = [
    { dominantElement: elTh },
    { elementSuitability: elTh }
  ];
}
if (region) query.region = region;
if (search) query.$text = { $search: search };  // ต้องสร้าง text index
query.isActive = true;

const products = await Product.find(query)
  .sort(sortOption)
  .skip((page-1) * limit)
  .limit(limit);
```

---

## 🛍️ ส่วนที่ 5 — Cart (MongoDB per-user)

**ไฟล์:** `routes/v2/cart.routes.js`  
**Model:** `models/Cart.js` ✅

### เปลี่ยนแปลงจาก v1

v1 ใช้ in-memory Map `inMemoryCarts` → v2 ใช้ MongoDB `Cart.findOneAndUpdate()`

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v2/cart` | Auth | ดึงตะกร้าของ user ที่ login |
| `POST` | `/api/v2/cart/items` | Auth | เพิ่มสินค้าลงตะกร้า |
| `PUT` | `/api/v2/cart/items/:productId` | Auth | แก้ไข quantity |
| `DELETE` | `/api/v2/cart/items/:productId` | Auth | ลบสินค้าออกจากตะกร้า |
| `DELETE` | `/api/v2/cart` | Auth | ล้างตะกร้าทั้งหมด |

> **สำคัญ:** v2 ใช้ `req.user._id` จาก token แทนการรับ `userId` จาก body

---

## 📦 ส่วนที่ 6 — Checkout & Orders (MongoDB)

**ไฟล์:** `routes/v2/checkout.routes.js`, `routes/v2/orders.routes.js`  
**Models:** `models/Order.js`, `models/Cart.js`, `models/Product.model.js`

### Flow การ Checkout (MongoDB Transaction)

```
1. ตรวจสอบ stock ของแต่ละ item (Product.findById)
2. สร้าง Order document
3. หัก stock ทุก product (Product.updateOne { $inc: { quantity: -qty } })
4. ล้าง Cart ของ user (Cart.findOneAndDelete)
5. เพิ่ม biaPoints ให้ user (User.updateOne { $inc: { biaPoints: earnedPoints } })

→ ทั้ง 5 ขั้นตอนอยู่ใน MongoDB Session Transaction (rollback ได้ถ้า error)
```

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v2/checkout` | Auth | สร้าง order ใหม่ |
| `GET` | `/api/v2/orders` | Auth | ดู orders ของ user ที่ login |
| `GET` | `/api/v2/orders/:orderId` | Auth | ดู order รายชิ้น |
| `PATCH` | `/api/v2/orders/:orderId/cancel` | Auth | ยกเลิก order (PENDING เท่านั้น) |
| `PATCH` | `/api/v2/orders/:orderId/status` | Admin | เปลี่ยนสถานะ (PREPARING/SHIPPED/DELIVERED) |

---

## ⭐ ส่วนที่ 7 — Reviews (MongoDB)

**ไฟล์:** `routes/v2/reviews.routes.js`  
**Model:** `models/Review.model.js` (สร้างใหม่)

### Review Model

```js
const reviewSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User', required: true },
  product: { type: ObjectId, ref: 'Product', required: true },
  order: { type: ObjectId, ref: 'Order' },        // ตรวจว่าซื้อจริง
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  imageUrl: { type: String },
}, { timestamps: true });
```

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v2/reviews/:productId` | Public | รีวิวของสินค้า |
| `POST` | `/api/v2/reviews` | Auth | เขียนรีวิว (ต้องเคยซื้อ) |
| `DELETE` | `/api/v2/reviews/:id` | Auth (owner/admin) | ลบรีวิว |

---

## 🤖 ส่วนที่ 8 — RAG AI Advisor (Server-side)

**ไฟล์:** `routes/v2/advisor.routes.js`

> ปัจจุบัน RAG engine ทำงานฝั่ง Client (`aiAdvisorEngine.js`) — v2 ย้ายมาฝั่ง Server เพื่อ:
> - Query ข้อมูลจาก MongoDB จริง (ไม่ใช่ mock)
> - รองรับ Gemini API / OpenAI API จาก environment variable ปลอดภัย
> - Cache คำตอบ (TTL 5 นาที)

### กลไก RAG

```
1. รับ { question, userElement } จาก client
2. Parse intent จาก question (element-advice / menu-recommend / cart-suggest)
3. Query products จาก MongoDB ที่ match กับ element + intent
4. Build context string (Knowledge Base + products data)
5. ส่ง context + question ไปให้ Gemini API (generateContent)
6. คืน response พร้อม recommended products
```

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v2/advisor/chat` | Optional Auth | ถาม-ตอบ RAG AI |
| `GET`  | `/api/v2/advisor/suggest` | Optional Auth | ขอคำแนะนำเมนูตามธาตุ |
| `POST` | `/api/v2/advisor/analyze-cart` | Auth | วิเคราะห์ตะกร้าตามธาตุเจ้าเรือน |

### Request / Response Format

```json
// POST /api/v2/advisor/chat
{
  "question": "อาหารอะไรดีสำหรับธาตุไฟ?",
  "userElement": "fire",
  "cartItems": ["id1", "id2"]
}

// Response
{
  "reply": "สำหรับธาตุไฟ แนะนำ...",
  "recommendedProducts": [{ "_id": "...", "name": "...", "price": ... }],
  "elementAdvice": { "balanceTastes": [...], "avoidTastes": [...] }
}
```

---

## 🛡️ ส่วนที่ 9 — Admin Routes

**ไฟล์:** `routes/v2/admin.routes.js`  
**Middleware:** `requireAdmin`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v2/admin/stats` | Dashboard stats (orders, users, revenue) |
| `GET` | `/api/v2/admin/users` | รายชื่อ users ทั้งหมด |
| `PATCH` | `/api/v2/admin/users/:id/role` | เปลี่ยน role user |
| `GET` | `/api/v2/admin/orders` | orders ทั้งหมด |
| `POST` | `/api/v2/admin/products/seed` | Seed products จาก mock data |
| `POST` | `/api/v2/admin/calculate-recipe` | คำนวณ recipe metrics |

---

## 🗃️ ส่วนที่ 10 — Ingredients & Regions

**ไฟล์:** `routes/v2/ingredients.routes.js`, `routes/v2/regions.routes.js`

- Ingredients: ปัจจุบัน v1 โหลดจาก JSON file → v2 เก็บใน MongoDB `Ingredient` model
- Regions: ข้อมูล static → คงเป็น JSON ไว้ก่อนได้ ไม่จำเป็นต้องย้าย

---

## 📋 ลำดับการ Implement (ทำตามลำดับ)

```
Phase 1 — Foundation
  [1] config/db.js          → connectDB()
  [2] middleware/auth.js    → requireAuth, requireAdmin, optionalAuth
  [3] models/ (ตรวจและ update User model)
  [4] models/RefreshToken.model.js

Phase 2 — Auth
  [5] routes/v2/auth.routes.js  → login, register, refresh, logout, me

Phase 3 — Core Resources
  [6] routes/v2/users.routes.js
  [7] routes/v2/products.routes.js
  [8] routes/v2/cart.routes.js

Phase 4 — Transactions
  [9] routes/v2/checkout.routes.js  (MongoDB Transaction)
  [10] routes/v2/orders.routes.js

Phase 5 — Media & Reviews
  [11] config/gridfs.js + middleware/upload.js
  [12] routes/v2/upload.routes.js
  [13] routes/v2/reviews.routes.js

Phase 6 — AI & Admin
  [14] routes/v2/advisor.routes.js  (RAG)
  [15] routes/v2/admin.routes.js
  [16] routes/v2/index.js  → mount ทุก router

Phase 7 — Integration
  [17] อัปเดต server.js → app.use('/api/v2', v2Router)
  [18] Migration script: seed mock data → MongoDB
```

---

## 🔗 Route Map ทั้งหมด (v2)

```
POST   /api/v2/auth/login
POST   /api/v2/auth/register
POST   /api/v2/auth/refresh
POST   /api/v2/auth/logout
GET    /api/v2/auth/me

GET    /api/v2/users
GET    /api/v2/users/:id
PUT    /api/v2/users/:id
DELETE /api/v2/users/:id
PUT    /api/v2/users/:id/element
PUT    /api/v2/users/:id/avatar

GET    /api/v2/products
GET    /api/v2/products/:id
POST   /api/v2/products              (admin)
PUT    /api/v2/products/:id          (admin)
DELETE /api/v2/products/:id          (admin)
PATCH  /api/v2/products/:id/stock    (admin)

GET    /api/v2/cart
POST   /api/v2/cart/items
PUT    /api/v2/cart/items/:productId
DELETE /api/v2/cart/items/:productId
DELETE /api/v2/cart

POST   /api/v2/checkout
GET    /api/v2/orders
GET    /api/v2/orders/:orderId
PATCH  /api/v2/orders/:orderId/cancel
PATCH  /api/v2/orders/:orderId/status (admin)

GET    /api/v2/reviews/:productId
POST   /api/v2/reviews
DELETE /api/v2/reviews/:id

POST   /api/v2/upload/product-image  (admin)
POST   /api/v2/upload/avatar
GET    /api/v2/files/:id
DELETE /api/v2/files/:id             (admin)

POST   /api/v2/advisor/chat
GET    /api/v2/advisor/suggest
POST   /api/v2/advisor/analyze-cart

GET    /api/v2/admin/stats
GET    /api/v2/admin/users
PATCH  /api/v2/admin/users/:id/role
GET    /api/v2/admin/orders
POST   /api/v2/admin/products/seed
POST   /api/v2/admin/calculate-recipe

GET    /api/v2/ingredients
GET    /api/v2/ingredients/:id
GET    /api/v2/regions
```

---

## ⚠️ ข้อควรระวัง

> [!IMPORTANT]
> - v2 ต้องการ MongoDB Atlas URI ใน `.env` ถึงจะทำงานได้
> - ต้องสร้าง Text Index บน Product collection: `db.products.createIndex({ name: "text", description: "text" })`
> - Refresh Token ต้องเก็บใน `HttpOnly Cookie` เท่านั้น (ห้ามส่งกลับใน JSON body)
> - MongoDB Transaction ต้องการ Replica Set (Atlas ทุก tier รองรับ)

> [!WARNING]
> - ห้าม import `inMemoryCarts`, `inMemoryOrders` หรือ `users` array ใน v2 routes
> - `Cart.userId` ใน v2 ต้องเป็น `ObjectId` — ไม่ใช่ string `"USR-001"` แบบ v1

> [!TIP]
> - ใช้ `mongoose.startSession()` + `session.withTransaction()` สำหรับ checkout
> - ใช้ `multer-gridfs-storage` แทน `multer` + disk storage เพื่อเก็บไฟล์ใน MongoDB โดยตรง
> - RAG advisor ควร cache ผลใน `Map` (TTL 5 min) เพื่อลด Gemini API calls
