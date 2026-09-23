# 🚀 แผนและคู่มือการ Deploy ฉบับสมบูรณ์ (Vercel + Render + MongoDB Atlas)

โปรเจกต์: **"ธาตุแท้" (That Tae) - Cooking Kit E-Commerce (v2 Architecture)**
เอกสารนี้สรุปขั้นตอนตั้งแต่เตรียมฐานข้อมูล MongoDB จริง, Deploy Backend ไปยัง Render, Deploy Frontend ไปยัง Vercel, จนถึงการทดสอบระบบเมื่อขึ้น Cloud จริง

---

## 🏗️ แผนภาพสถาปัตยกรรมระบบ (Architecture Overview)

```
[ Frontend: React + Vite ] (Vercel)
        │
        │ HTTP / HTTPS API Calls (Bearer Token / Cookie)
        ▼
[ Backend: Node.js Express v2 ] (Render Web Service)
        │
        ├── 📂 GridFS Buckets (images.files & images.chunks) ──> เก็บรูปเมนูใน DB
        │
        ▼
[ Database: MongoDB Atlas Cluster ] (Cloud Database)
        ├── users (ข้อมูลสมาชิก & Hash Password)
        ├── ingredients (คลังวัตถุดิบ & สต็อก & โภชนาการ)
        ├── products (เมนู Cooking Kit & สูตร & Food Restrictions)
        ├── carts (ตะกร้าสินค้า)
        └── orders (คำสั่งซื้อ & ตัดสต็อก & สถานะการชำระเงิน)
```

---

## 📋 เช็คลิสต์สิ่งที่เตรียมความพร้อมให้แล้วในโค้ด (Pre-deployment Done)
- [x] **Production Start Script**: กำหนด `"start": "node src/server.js"` ใน `server/package.json`
- [x] **Smart Database Seed Script**: สร้าง `seedDatabase.js` ที่ seed ทั้ง `ingredients` (สต็อก) และ `products` พร้อมผูก ObjectId ของสูตรอาหารและแท็กโรค/การแพ้ให้อัตโนมัติ (`npm run seed`)
- [x] **Full GridFS Image Storage**: ระบบจัดเก็บรูปอาหารลง MongoDB โดยตรง ไม่ต้องพึ่ง AWS S3 หรือ Cloudinary
- [x] **Dynamic Cross-Origin CORS**: รองรับ Request ทั้งจาก `localhost` และ Production Domain ของ Vercel
- [x] **Backward Compatible Route**: มี `app.use("/api/v1", v2Router)` รองรับโค้ดเก่าใน Frontend ไม่ให้เกิด 404

---

## 🛠️ ขั้นตอนที่ 1: เตรียม MongoDB Atlas (Real Cloud DB)

1. เข้าเว็บ [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) แล้วล็อกอิน
2. **สร้าง Cluster**:
   - เลือก **M0 Free (Shared)**
   - Region: แนะนำ **Singapore** (ใกล้ประเทศไทย ค่า latency ต่ำที่สุด)
3. **สร้าง Database User**:
   - เมนู **Security** > **Database Access** > **Add New Database User**
   - Authentication Method: **Password**
   - Username: เช่น `app_admin`
   - Password: กำหนดรหัสผ่าน (จดบันทึกไว้)
   - Built-in Role: **Read and write to any database**
4. **เปิดสิทธิ์ Network IP**:
   - เมนู **Security** > **Network Access** > **Add IP Address**
   - เลือก **Allow Access from Anywhere (`0.0.0.0/0`)** ⚠️ *(จำเป็นมากเพื่อให้ Render สามารถติดต่อ DB ได้)*
5. **คัดลอก Connection String**:
   - เมนู **Deployment** > **Database** > กดปุ่ม **Connect** ของ Cluster
   - เลือก **Drivers** (Node.js)
   - จะได้ URI หน้าตาแบบนี้:
     ```text
     mongodb+srv://app_admin:<password>@cluster0.xxxxx.mongodb.net/thattae?retryWrites=true&w=majority
     ```
     *(เปลี่ยน `<password>` เป็นรหัสจริง และเปลี่ยนชื่อ DB ด้านหลังให้เป็น `/thattae`)*

---

## 🖥️ ขั้นตอนที่ 2: Deploy Backend ไปที่ Render

1. เข้าเว็บ [render.com](https://render.com) แล้วล็อกอินผ่าน GitHub
2. กดปุ่ม **New +** > เลือก **Web Service**
3. เลือก Repository: `PJ-G4-SP2`
4. กรอกข้อมูลการตั้งค่า:
   - **Name**: `that-tae-api` (หรือชื่อที่คุณต้องการ)
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `server` ⚠️ *(ระบุให้ตรง เพื่อให้ Render รันในโฟลเดอร์เซิร์ฟเวอร์)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. กำหนด **Environment Variables** (ในแถบ Environment):

| Key | Value (ตัวอย่าง) | คำอธิบาย |
|---|---|---|
| `NODE_ENV` | `production` | รันในโหมด Production |
| `PORT` | `3001` | พอร์ตของเซิร์ฟเวอร์ |
| `MONGODB_URI` | `mongodb+srv://app_admin:...` | Connection String จากขั้นตอนที่ 1 |
| `MONGO_URI` | `mongodb+srv://app_admin:...` | ใส่เหมือน `MONGODB_URI` |
| `JWT_SECRET` | `that-tae-jwt-secret-key-2026-production` | คีย์ลับสำหรับ Sign JWT Token |
| `CLIENT_URL` | `https://your-frontend.vercel.app` | URL Frontend ของ Vercel (ใส่หลังทำขั้นตอนที่ 3) |
| `STRIPE_SECRET_KEY` | `sk_test_...` | คีย์ Stripe (ถ้ามี) |

6. กด **Create Web Service**
7. รอจนสถานะเปลี่ยนเป็น **Live** จะได้รับ URL เช่น:
   ```text
   https://that-tae-api.onrender.com
   ```
8. **ทดสอบสถานะเซิร์ฟเวอร์**: เปิดเบราว์เซอร์ไปที่ `https://that-tae-api.onrender.com/api/health` ต้องตอบกลับเป็น JSON:
   ```json
   { "status": "healthy", "version": "2.0.0" }
   ```

---

## 🌐 ขั้นตอนที่ 3: Deploy Frontend ไปที่ Vercel

1. เข้าเว็บ [vercel.com](https://vercel.com) แล้วล็อกอินผ่าน GitHub
2. กด **Add New...** > เลือก **Project**
3. เลือก Repository: `PJ-G4-SP2`
4. การตั้งค่า Build & Output:
   - **Framework Preset**: `Vite`
   - **Root Directory**: กด Edit แล้วเลือกโฟลเดอร์ `client` ⚠️ *(สำคัญมาก)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. กำหนด **Environment Variables**:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://that-tae-api.onrender.com` |

*(⚠️ ข้อควรระวัง: ใส่เฉพาะโดเมน Backend ของ Render ไม่ต้องใส่ `/api` หรือ `/api/v2` ต่อท้าย)*

6. กด **Deploy** และรอระบบ Build จนเสร็จสิ้น
7. Vercel จะสร้าง URL ให้ เช่น `https://that-tae.vercel.app`
8. **นำ URL Vercel ไปใส่ใน Render**: กลับไปที่ Dashboard ของ Render > เข้า Web Service > Environment > แก้ไข `CLIENT_URL` ให้เป็น URL ของ Vercel เพื่อความปลอดภัยของ CORS

---

## 🌱 ขั้นตอนที่ 4: Seed ข้อมูลเมนู & วัตถุดิบจริงเข้า MongoDB Atlas

เมื่อต่อ MongoDB Atlas แล้ว ฐานข้อมูลจะยังว่างเปล่า ให้รันสคริปต์ Seed ครั้งแรกจากเครื่องของคุณไปยัง Cloud DB:

1. เปิดไฟล์ `server/.env` ในเครื่อง
2. เปลี่ยน `MONGODB_URI` และ `MONGO_URI` ให้เป็น Connection String ของ MongoDB Atlas
3. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ `server`:
   ```bash
   cd server
   npm run seed
   ```
4. ระบบจะทำการ:
   - เพิ่มวัตถุดิบทั้งหมดเข้า Collection `ingredients` พร้อมกำหนดสต็อกและภูมิภาค
   - เพิ่มเมนู Cooking Kit ทั้งหมดเข้า Collection `products` พร้อมผูกสูตรอาหาร (Recipe) และแท็กข้อจำกัดทางอาหาร (`foodRestrictions`)
   - ขึ้นข้อความ: `🎉 Seed ฐานข้อมูล MongoDB ทั้งหมดเสร็จสมบูรณ์ พร้อมใช้งาน 100%!`

---

## 🧪 ขั้นตอนที่ 5: ตรวจสอบและทดสอบระบบหลังขึ้น Production (Checklist)

1. [ ] **Health Check**: ตรวจสอบ `GET /api/health` บน Render
2. [ ] **รายการเมนูอาหาร**: เปิดหน้าเว็บ Vercel เมนูอาหารต้องโหลดขึ้นมาจาก MongoDB Atlas จริง
3. [ ] **ตัวกรองเมนู (Food Restrictions & Elements)**: ลองคลิกเลือกตัวกรองโรค/การแพ้ (เช่น GERD Friendly, โซเดียมต่ำ) ว่ากรองเมนูได้ถูกต้อง
4. [ ] **ระบบสมาชิก**: ลองสมัครสมาชิกใหม่ (Register) และล็อกอิน (Login) เพื่อรับ Token
5. [ ] **ระบบตะกร้าสินค้า**: ลองเพิ่มเมนูลงตะกร้า แล้วรีเฟรชหน้าเว็บ ข้อมูลต้องยังคงอยู่ (Persist ใน MongoDB)
6. [ ] **การสั่งซื้อและตัดสต็อก**: ลองสั่งซื้อสินค้า แล้วตรวจสอบว่า Order ถูกสร้าง และสต็อกวัตถุดิบใน MongoDB ถูกตัดจริง
7. [ ] **ระบบรูปภาพ GridFS**: ลองอัปโหลดรูปผ่านแอดมิน รูปต้องถูกบันทึกลง MongoDB และแสดงผลผ่าน `/api/v2/images/:id` ได้อย่างสมบูรณ์
