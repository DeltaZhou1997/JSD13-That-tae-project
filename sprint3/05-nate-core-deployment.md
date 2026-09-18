# 🧑‍💻 Task Assignment: Nate (Core Architecture, Database Setup & Deployment)
## Sprint 3 — That-tae (ธาตุแท้) Cooking Kit E-Commerce

---

### 👤 ผู้รับผิดชอบ (Assignee)
* **ชื่อสมาชิก:** **Nate** (Role: Core Architect, DevOps & Lead Full-Stack Developer)
* **ขอบเขตงาน:** วางรากฐานของโปรเจกต์ MERN Stack ทั้งหมด, จัดการ Database Setup (MongoDB Atlas & Mongoose), Seeding Scripts (30 เมนู 217 วัตถุดิบ), ระบบ JWT Authentication & Middleware, Centralized Error Handling, และรับผิดชอบ **Task 9: Deployment** นำระบบขึ้น Production บน Public URL (Vercel + Render)

---

### 🗺️ แผนการพัฒนา 2 ระยะ (Two-Stage Roadmap: v1 ➔ v2)

```
┌────────────────────────────────────────────────────────┐
│  Stage 1 (ดูแล v1 Mock Routes & Architecture Support) │
│  • ดูแล Express Server v1, CORS, Request Logging       │
│  • ทำ Centralized Error Middleware และ HTTP Helpers    │
│  • ซัพพอร์ตเพื่อนในทีมให้ทดสอบ Full-Stack กับ Mock Data│
└───────────────────────────┬────────────────────────────┘
                            │ Upgrade สัปดาห์ถัดไป
┌───────────────────────────▼────────────────────────────┐
│  Stage 2 (เชื่อมต่อ MongoDB Atlas & Production Deploy) │
│  • เชื่อมต่อ `mongoose.connect()` กับ MongoDB Atlas    │
│  • เขียน Seeding Script นำเข้า Database อัตโนมัติ       │
│  • Deploy Frontend บน Vercel และ Backend บน Render     │
└────────────────────────────────────────────────────────┘
```

---

### 📋 เกณฑ์การประเมินที่เกี่ยวข้อง (Assessment Rubrics: Task 9 & Task 10)
* [x] **React App Deployment (Task 9):** Deploy React Frontend ขึ้น Vercel และเข้าถึงได้ผ่าน Public HTTPS URL
* [x] **Express API Deployment (Task 9):** Deploy Express API ขึ้น Render/Fly.io และเข้าถึงได้ผ่าน Public HTTPS URL
* [x] **Cross-Origin & Networking (Task 9):** ตั้งค่า CORS และ Environment Variables (`VITE_API_BASE_URL`, `CLIENT_URL`) ให้ Frontend กับ Backend สื่อสารกันได้ 100%
* [x] **Mongoose & Database Setup (Task 10):** ตั้งค่าการเชื่อมต่อ MongoDB Atlas ผ่าน Mongoose อย่างสมบูรณ์ ไม่มี Error ตอนรัน `npm start`
* [x] **Centralized Error Handling (Task 10):** จัดการ Error Response ให้เป็นรูปแบบมาตรฐาน JSON `{ success: false, message, stack }`

---

### 💻 รายละเอียดการพัฒนาระบบ Full-Stack (Step-by-Step)

#### 🔹 1. ฝั่ง Backend: MongoDB Atlas Connection & Seed Script

##### [Database Connection Module] (`server/src/config/db.js`)
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thattae_db';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🌿 [MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB Atlas] Connection Error: ${error.message}`);
    // ไม่ให้ crash ทั้งหมด เพื่อให้ fallback mock ทำงานได้ในโหมด dev
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
```

---

##### [Database Seeding Script] (`server/src/scripts/seed-mongo-atlas.js`)
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import { dishes } from '../mockDB/dishes.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB Atlas for Seeding...');

    // 1. Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared old products collection.');

    // 2. Format & Insert 30 dishes
    const dishList = Object.values(dishes).map((dish) => ({
      nameTh: dish.nameTh,
      nameEn: dish.nameEn,
      slug: dish.slug || dish.nameEn?.toLowerCase().replace(/\s+/g, '-') || `dish-${dish.id}`,
      region: dish.region,
      regionNameTh: dish.regionNameTh,
      dominantElement: dish.dominantElement,
      elementSuitability: dish.elementSuitability || [],
      description: dish.description,
      price: dish.price,
      stock: 25,
      releaseDate: new Date(),
      tags: [dish.regionNameTh, `ธาตุ${dish.dominantElement}`, ...(dish.elementSuitability?.map(e => `ธาตุ${e}`) || [])],
      imageUrl: dish.imageUrl || ['/assets/placeholder.jpg'],
      recipe: dish.recipe || [],
      nutrition: dish.nutrition || {},
      isActive: true
    }));

    await Product.insertMany(dishList);
    console.log(`✅ Successfully seeded ${dishList.length} Cooking Kits to MongoDB Atlas!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
```

---

#### 🔹 2. Centralized Error Handler Middleware (`server/src/middlewares/errorHandler.js`)
```javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
```

---

#### 🔹 3. Production Deployment Guide (Vercel & Render)

##### A. Frontend Deploy บน Vercel (`client/vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
* **Vercel Environment Variables:**
  * `VITE_API_BASE_URL`: `https://thattae-api.onrender.com/api/v1`

##### B. Backend Deploy บน Render (`server/`)
* **Build Command:** `npm install`
* **Start Command:** `npm start`
* **Render Environment Variables:**
  * `NODE_ENV`: `production`
  * `PORT`: `3001`
  * `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/thattae?retryWrites=true&w=majority`
  * `CLIENT_URL`: `https://thattae.vercel.app`
  * `STRIPE_SECRET_KEY`: `sk_test_...`
  * `STRIPE_WEBHOOK_SECRET`: `whsec_...`

---

### ✅ Checklist ก่อนส่งมอบงาน (Definition of Done)
1. [ ] MongoDB Atlas Cluster ถูกตั้งค่าและต่อติดผ่าน Mongoose โดยไม่มี Warning
2. [ ] รัน Seeding Script และมีข้อมูลครบ 30 เมนูอาหารบน Atlas Collection
3. [ ] Frontend Deploy บน Vercel พร้อมเข้าถึงผ่าน Public URL ได้อย่างรวดเร็ว
4. [ ] Backend Deploy บน Render พร้อมเข้าถึงผ่าน Public URL
5. [ ] ระบบ CORS ถูกตั้งค่าอย่างปลอดภัยและ Frontend เรียก API ได้โดยไม่มีข้อผิดพลาด
