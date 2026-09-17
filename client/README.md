# 🛒 Cooking Kit E-Commerce - Sprint 2 Roles & Responsibilities

ระบบ E-Commerce สำหรับสั่งซื้อ **Cooking Kit (ชุดวัตถุดิบพร้อมปรุง)** ที่เน้นโภชนาการตามภูมิภาคและธาตุเจ้าเรือน ด้วยธีมเอิร์ธโทน-ใบลาน

---

## 📋 Overview & Architecture

โปรเจกต์นี้พัฒนาด้วย **MERN Stack** (MongoDB, Express, React, Node.js) โดยแบ่งหน้าที่และขอบเขตงานตาม Feature Branch ดังนี้:

| Member | Role / Responsibilities | Frontend (React) | Backend (API & Database) |
| :--- | :--- | :--- | :--- |
| **Nut** | **1. Admin Product & Validation** | Form Validation, Error UI, Admin Product Form, Register / Login | Admin CRUD (`POST`, `PUT`, `DELETE` `/api/products`) |
| **Delta** | **2. Storefront & Catalog** | Storefront UI, Product List & Detail Cards, Search & Filter | Fetch Products API (`GET` All / Single Product) |
| **Cream** | **3. Cart Management** | Cart UI Component, Add/Update/Remove Actions | Cart Operation APIs (`POST` Select, `PUT` Update, `DELETE` Item) |
| **Rin** | **4. Checkout & Order Flow** | Checkout UI, User ID Context, Order Summary | Fetch User Cart API (`GET` `/api/cart/:user_id`), Checkout & Stock Cut |
| **Nate** | **5. Core Arch & Global Layout** | React Routing, Global Layout (Navbar/Footer), Toast Alert UI | Mongoose Setup, Express Server Config, Centralized Error Middleware |

---

## Member Roles & Task Details

### Person 1: Admin Product Management & Form Validation
> **Goal:** ทำระบบหลังบ้านให้ Admin เพิ่ม/แก้ไข/ลบ เมนู Cooking Kit และ InfoCard โภชนาการ พร้อมตรวจสอบข้อมูล (Validation)
* **Frontend (React Tasks):**
  * `ProductForm.jsx`: สร้างฟอร์มสร้าง/แก้ไข Cooking Kit (ชื่อเมนู, ภาคอาหาร เช่น เหนือ/ใต้, แคลอรี/โภชนาการ, ราคา, สต็อก, ลิงก์รูปภาพ)
  * **Validation Logic:** ตรวจสอบข้อมูลก่อน 제출 (Submit)
    * `Name`: ไม่เป็นค่าว่าง, ยาวอย่างน้อย 3 ตัวอักษร
    * `Description`: รายละเอียดเมนู/ประวัติอาหาร ต้องไม่เป็นค่าว่าง
    * `Price`: เป็นตัวเลขมากกว่า 0
    * `Quantity (Stock)`: จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็ม $\ge 0$
    * `Date`: วันที่เริ่มวางขาย/วันหมดอายุวัตถุดิบ ต้องไม่เป็นอดีต
    * `Tag (Health/Region)`: ต้องเลือกอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, GERD Friendly, Keto Flex, ธาตุไฟ)
  * **Error State UI:** แสดงข้อความแจ้งเตือนสีแดง (Inline Error) ใต้ช่องกรอก
  * `AdminProductList.jsx`: ตารางแสดงรายการ Cooking Kit ทั้งหมดในคลังพร้อมปุ่ม Edit / Delete
* **Backend & Database Tasks:**
  * `POST /api/products`: บันทึก Cooking Kit เมนูใหม่ลง MongoDB (พร้อม Server-side Validation)
  * `PUT /api/products/:id`: แก้ไขข้อมูล Cooking Kit
  * `DELETE /api/products/:id`: ลบ Cooking Kit ออกจากคลัง
  * **Mongoose Schema:** ออกแบบ `ProductSchema` (กำหนด Types, Required, Min/Max)

---

### Person 2: Product Catalog & Storefront
> **Goal:** ทำหน้าร้านฝั่งลูกค้า ดึงรายการ Cooking Kit มาโชว์ พร้อมระบบค้นหาและกรองเมนูอาหารตามสุขภาพ/ภาค/ธาตุเจ้าเรือน
* **Frontend (React Tasks):**
  * `ProductCatalog.jsx`: หน้าหลักแสดงรายการ Cooking Kit ทั้งหมด (ธีมเอิร์ธโทน ใบลาน)
  * `ProductCard.jsx`: การ์ดแสดงผล Cooking Kit แต่ละเมนู (รูปอาหาร, ชื่อเมนู, ภาค, ราคา, แคลอรี, สถานะคงเหลือ)
  * `ProductDetailModal.jsx` / `ProductDetailPage.jsx`: แสดงรายละเอียดฉบับเต็ม เช่น วัตถุดิบในกล่อง, ข้อมูลโภชนาการ (Nutrition Breakdown), ขั้นตอนการทำ และประวัติอาหาร (InfoCard context)
  * **Search & Filter UI:** ช่องค้นหาชื่อเมนู และตัวเลือกกรองจำเพาะ (Tags: ภูมิภาค [เหนือ/ใต้/กลาง/อีสาน], ปัญหาสุขภาพ [คุมเบาหวาน/โรคไต/แพ้อาหาร], หรือ ธาตุเจ้าเรือน)
* **Backend & Database Tasks:**
  * `GET /api/products`: ดึงรายการ Cooking Kit ทั้งหมด รองรับ Query Params เช่น `?tag=ภาคเหนือ`, `?search=แกงฮังเล`, `?health=diabetes`
  * `GET /api/products/:id`: ดึงรายละเอียดของ Cooking Kit ชิ้นนั้นๆ
  * **Mongoose Query Optimization:** Select เฉพาะ Field ที่จำเป็น และคืนค่า 404 หากไม่พบสินค้า

---

### Person 3: Cart Management & State Operations
> **Goal:** จัดการระบบตะกร้าสินค้า ปรับเพิ่ม-ลดจำนวนเมนู และคำนวณราคาสินค้า/สิทธิ์รับแต้มสะสม
* **Frontend (React Tasks):**
  * `CartDrawer.jsx` / `CartPage.jsx`: UI แสดง Cooking Kit ที่อยู่ในตะกร้า
  * `CartItem.jsx`: การ์ดสินค้าแต่ละชิ้นในตะกร้า มีปุ่ม `+` / `-` ปรับจำนวนชุด และปุ่มถังขยะเพื่อลบ
  * **State Management:** เขียน Context/State ใน React สำหรับเก็บตะกร้าชั่วคราว คำนวณ Subtotal, ค่าจัดส่ง, ยอดรวม และแสดง Alert แจ้งเตือนหากยอดถึง 1,499 บาทเพื่อรับแต้มสะสม
  * เชื่อมปุ่ม **"Add to Cart"** จาก `ProductCard.jsx` ให้ส่ง Trigger มาเพิ่มลงตะกร้า
* **Backend & Database Tasks:**
  * `POST /api/cart/selected`: บันทึกการเลือก Cooking Kit เข้าตะกร้า (ถ้ามีในตะกร้าแล้วให้เพิ่ม quantity)
  * `PUT /api/cart/:item_id`: อัปเดตจำนวน (quantity) หรือสถานะในตะกร้า
  * `DELETE /api/cart/:item_id`: ลบ Cooking Kit ออกจากตะกร้า

---

### Person 4: User Cart Sync & Checkout Flow
> **Goal:** ผูกตะกร้าสินค้ากับ User ID, หน้าชำระเงินสำหรับซื้อรายชุด/สมัคร Subscription รายสัปดาห์ และตัด Stock
* **Frontend (React Tasks):**
  * `CheckoutPage.jsx`: หน้าสรุปรายการสั่งซื้อ Cooking Kit เลือกรูปแบบการซื้อ (รายชุด A La Carte หรือ Subscription รายสัปดาห์ Size S/M/L/XL) และฟอร์มกรอกที่อยู่จัดส่ง
  * **Checkout Form Validation:** ตรวจสอบที่อยู่จัดส่ง, เบอร์โทรศัพท์, วิธีชำระเงิน พร้อม Error Message
  * `OrderSuccess.jsx`: หน้าแสดงคำสั่งซื้อสำเร็จ สรุปยอด และแจ้งเตือนแต้มสะสมที่ได้รับ (เมื่อซื้อครบ 1,499 บาท)
* **Backend & Database Tasks:**
  * `GET /api/cart/:user_id`: ดึงรายการสินค้าในตะกร้าของ User ID ที่ระบุ
  * `POST /api/checkout`: ประมวลผลสร้าง Order Record, ล้าง Cart ของ User นั้น และทำการตัดลด Quantity ใน Product Stock
  * **Mongoose Schema:** ออกแบบ `CartSchema` และ `OrderSchema` (ระบุ reference `ref` ไปยัง User และ Product)

---

### 🧑‍💻 Person 5: Core Infrastructure, App Layout & DB Setup
> **Goal:** ผู้ดูแลโครงสร้างโปรเจกต์ วางระบบ Database, Routing, Global State และ UI ธีมเอิร์ธโทนประยุกต์
* **Frontend (React Tasks):**
  * **App Shell & Routing:** เซ็ตอัป React Router จัดโครงสร้างหน้าหลัก (`App.jsx`, `Layout.jsx`) ในดีไซน์กระเบื้อง/ใบลาน ธีมเอิร์ธโทน
  * `Navbar.jsx` & `Footer.jsx`: ส่วนหัว/ท้ายเว็บไซต์ แสดงโลโก้แบรนด์, เมนูเลือกภาค/ธาตุเจ้าเรือน และ Badge แสดงจำนวน Cooking Kit ในตะกร้าแบบ Dynamic
  * `NotificationToast.jsx`: ระบบแจ้งเตือนส่วนกลาง (Toast Notification) สำหรับแสดง Error / Success ให้ทุกคนเรียกใช้ผ่าน Context
* **Backend & Database Tasks:**
  * **Server Setup:** สร้าง Express Server, ตั้งค่า CORS, Body Parser (`express.json()`), และ `.env`
  * **Database Connection:** เขียน Module เชื่อมต่อ MongoDB ผ่าน Mongoose พร้อมจัดการ Error ตอนเริ่ม Server (`mongoose.connect`)
  * **Global Middleware:** เขียน Centralized Error Handler ให้กับ Express API ทั้งโปรเจกต์

---

## 🛠 Tech Stack
* **Frontend:** React, React Router, Context API, CSS (Earth Tone Theme)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM
