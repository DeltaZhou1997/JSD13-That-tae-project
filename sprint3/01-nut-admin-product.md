# 🧑‍💻 Task Assignment: Nut (Admin Product Management & Form Validation)
## Sprint 3 — That-tae (ธาตุแท้) Cooking Kit E-Commerce

---

### 🎯 เป้าหมายของ Nut ใน Sprint 3
รับผิดชอบระบบหลังบ้าน (Admin Dashboard) และระบบจัดการข้อมูลสินค้า (Cooking Kit Products) โดยต้องเชื่อมต่อกับ **MongoDB ผ่าน Mongoose** จริง ครบทั้งการ `CREATE`, `UPDATE`, `DELETE` และทำ **Form Validation** ที่รัดกุมตามเกณฑ์ **Task 8 และ Task 10**

---

### 📋 เกณฑ์การประเมินที่เกี่ยวข้อง (Assessment Rubrics)

#### 1. Technical Skills — Task 8 (CRUD Operations)
* [x] **CREATE Operation:** เชื่อมต่อการบันทึก Cooking Kit เมนูใหม่ลงใน MongoDB (`POST /api/v1/products`)
* [x] **UPDATE Operation:** เชื่อมต่อการอัปเดตข้อมูลเมนู/สต็อก/ราคาใน MongoDB (`PUT /api/v1/products/:id`)
* [x] **DELETE Operation:** เชื่อมต่อการลบเมนู Cooking Kit ออกจาก MongoDB (`DELETE /api/v1/products/:id`)

#### 2. Technical Skills — Task 10 (Form Validation & Input Types)
* [x] **Correct Input Types:** กำหนด HTML `type` ให้ถูกต้องเพื่อป้องกัน User กรอกผิดชนิดข้อมูล:
  * `Name` (ชื่อเมนู): `type="text"`
  * `Description` (รายละเอียด/วัฒนธรรมอาหาร): `<textarea>`
  * `Price` (ราคาชุด): `type="number" min="0" step="1"`
  * `Quantity / Stock` (จำนวนชุดพร้อมส่ง): `type="number" min="0" step="1"`
  * `Date` (วันที่เริ่มจำหน่าย / ผลิต): `type="date"`
  * `Tag` (ภูมิภาค / ธาตุ / สุขภาพ): `type="checkbox"` หรือ Multi-select
* [x] **Form Submission Validation:** ตรวจสอบข้อมูลก่อนส่ง (Client-side & Server-side):
  * `Name`: ห้ามว่าง, ความยาว 3 - 100 ตัวอักษร
  * `Description`: ห้ามว่าง, ความยาวอย่างน้อย 10 ตัวอักษร
  * `Price`: ตัวเลขมากกว่า 0
  * `Quantity`: ตัวเลขจำนวนเต็ม $\ge 0$
  * `Date`: ต้องไม่เป็นวันที่ในอดีต (valid date)
  * `Tag`: ต้องเลือกอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, ธาตุดิน)
* [x] **Meaningful Error UI:** แสดง Error Message สีแดงชัดเจนใต้ช่องที่กรอกผิดพลาด พร้อม Toast แจ้งเตือนเมื่อ Submit ไม่ผ่าน

---

### 💻 รายละเอียดไฟล์และการเขียนโค้ด (Step-by-Step Implementation)

#### Step 1: ออกแบบ Mongoose Schema (`server/src/models/Product.model.js`)
```javascript
import mongoose from 'mongoose';

const NutrientSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 }
}, { _id: false });

const RecipeItemSchema = new mongoose.Schema({
  ingredientId: { type: String, required: true },
  nameTh: { type: String, required: true },
  nameEn: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'g' },
  category: { type: String, required: true },
  categoryTh: { type: String },
  medicinalTaste: { type: String },
  elements: [{ type: String }],
  nutrientsPer100g: NutrientSchema
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  nameTh: { 
    type: String, 
    required: [true, 'กรุณาระบุชื่อเมนูภาษาไทย'], 
    trim: true,
    minlength: [3, 'ชื่อเมนูต้องมีความยาวอย่างน้อย 3 ตัวอักษร']
  },
  nameEn: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  region: { 
    type: String, 
    required: [true, 'กรุณาระบุภูมิภาค'],
    enum: ['north', 'northeast', 'central', 'south', 'fusion'] 
  },
  regionNameTh: { type: String, required: true },
  dominantElement: { 
    type: String, 
    required: [true, 'กรุณาระบุธาตุเด่น'],
    enum: ['ดิน', 'น้ำ', 'ลม', 'ไฟ'] 
  },
  elementSuitability: [{ type: String }],
  description: { 
    type: String, 
    required: [true, 'กรุณาระบุคำอธิบายเมนู'],
    minlength: [10, 'คำอธิบายต้องมีความยาวอย่างน้อย 10 ตัวอักษร']
  },
  price: { 
    type: Number, 
    required: [true, 'กรุณาระบุราคา'], 
    min: [1, 'ราคาต้องมากกว่า 0 บาท'] 
  },
  stock: { 
    type: Number, 
    required: [true, 'กรุณาระบุจำนวนสต็อก'], 
    min: [0, 'สต็อกต้องไม่ติดลบ'],
    default: 20 
  },
  releaseDate: { 
    type: Date, 
    required: [true, 'กรุณาระบุวันที่เริ่มจำหน่าย'],
    default: Date.now 
  },
  tags: [{ type: String }],
  imageUrl: [{ type: String }],
  recipe: [RecipeItemSchema],
  nutrition: {
    totals: NutrientSchema,
    perServing: NutrientSchema
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);
```

---

#### Step 2: สร้าง Controller สำหรับ CRUD (`server/src/controllers/product.controller.js`)
```javascript
import Product from '../models/Product.model.js';

// 1. CREATE Product (POST /api/v1/products)
export const createProduct = async (req, res, next) => {
  try {
    const { nameTh, price, stock, releaseDate, tags, description, region, dominantElement } = req.body;
    
    // Server-side Validation
    if (!nameTh || nameTh.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'ชื่อเมนูต้องยาวอย่างน้อย 3 ตัวอักษร' });
    }
    if (price <= 0) {
      return res.status(400).json({ success: false, message: 'ราคาต้องมากกว่า 0 บาท' });
    }
    if (stock < 0) {
      return res.status(400).json({ success: false, message: 'จำนวนสต็อกต้องไม่ติดลบ' });
    }
    if (!tags || tags.length === 0) {
      return res.status(400).json({ success: false, message: 'ต้องระบุแท็กอย่างน้อย 1 แท็ก' });
    }

    const slug = req.body.slug || nameTh.trim().toLowerCase().replace(/\s+/g, '-');
    const newProduct = await Product.create({ ...req.body, slug });
    
    res.status(201).json({ success: true, data: newProduct, message: 'สร้าง Cooking Kit สำเร็จ' });
  } catch (error) {
    next(error);
  }
};

// 2. UPDATE Product (PUT /api/v1/products/:id)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'ไม่พบเมนูนี้ในระบบ' });
    }
    res.json({ success: true, data: updated, message: 'อัปเดตข้อมูลเมนูสำเร็จ' });
  } catch (error) {
    next(error);
  }
};

// 3. DELETE Product (DELETE /api/v1/products/:id)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'ไม่พบเมนูที่ต้องการลบ' });
    }
    res.json({ success: true, message: 'ลบ Cooking Kit เรียบร้อยแล้ว' });
  } catch (error) {
    next(error);
  }
};
```

---

#### Step 3: หน้า Frontend Form Validation (`client/src/pages/admin/AdminProductForm.jsx`)
```jsx
import { useState } from 'react';
import useToast from '../../hooks/useToast.js';

export default function AdminProductForm({ initialData, onSubmitSuccess }) {
  const toast = useToast();
  const [formData, setFormData] = useState(initialData || {
    nameTh: '',
    description: '',
    price: '',
    stock: '',
    releaseDate: new Date().toISOString().split('T')[0],
    tags: [],
    region: 'north',
    dominantElement: 'ดิน'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Logic ตรงตามเกณฑ์ Task 10
  const validateForm = () => {
    const newErrors = {};

    // 1. Name validation
    if (!formData.nameTh || formData.nameTh.trim().length < 3) {
      newErrors.nameTh = 'กรุณาระบุชื่อเมนูอย่างน้อย 3 ตัวอักษร';
    }

    // 2. Description validation
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'กรุณากรอกคำอธิบายอย่างน้อย 10 ตัวอักษร';
    }

    // 3. Price validation
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'ราคาต้องเป็นตัวเลขที่มากกว่า 0';
    }

    // 4. Quantity / Stock validation
    if (formData.stock === '' || Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock))) {
      newErrors.stock = 'จำนวนสต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป';
    }

    // 5. Date validation
    if (!formData.releaseDate) {
      newErrors.releaseDate = 'กรุณาระบุวันที่เริ่มวางจำหน่าย';
    }

    // 6. Tag validation
    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = 'กรุณาเลือกแท็กอย่างน้อย 1 แท็ก';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('กรุณาตรวจสอบข้อมูลในฟอร์มให้ถูกต้อง');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = initialData?._id 
        ? `${import.meta.env.VITE_API_BASE_URL}/products/${initialData._id}` 
        : `${import.meta.env.VITE_API_BASE_URL}/products`;
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'บันทึกไม่สำเร็จ');

      toast.success(initialData?._id ? 'อัปเดตเมนูสำเร็จ' : 'เพิ่มเมนูใหม่สำเร็จ');
      if (onSubmitSuccess) onSubmitSuccess(result.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebe4dc] shadow-sm max-w-2xl mx-auto space-y-5">
      <h2 className="text-2xl font-bold text-stone-900">
        {initialData?._id ? 'แก้ไขเมนู Cooking Kit' : 'เพิ่มเมนู Cooking Kit ใหม่'}
      </h2>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">ชื่อเมนู (ภาษาไทย) *</label>
        <input 
          type="text"
          value={formData.nameTh}
          onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
          placeholder="เช่น แกงฮังเลหมูสูตรล้านนา"
          className={`w-full p-3 rounded-xl border text-sm ${errors.nameTh ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
        />
        {errors.nameTh && <p className="text-red-500 text-xs mt-1">{errors.nameTh}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">รายละเอียดเมนู *</label>
        <textarea 
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="อธิบายเอกลักษณ์ รสชาติ หรือความเป็นมาของอาหาร..."
          className={`w-full p-3 rounded-xl border text-sm ${errors.description ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Price & Stock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">ราคา (บาท) *</label>
          <input 
            type="number"
            min="1"
            step="1"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className={`w-full p-3 rounded-xl border text-sm ${errors.price ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">จำนวนสต็อก (ชุด) *</label>
          <input 
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className={`w-full p-3 rounded-xl border text-sm ${errors.stock ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>
      </div>

      {/* Release Date */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">วันที่เริ่มจำหน่าย *</label>
        <input 
          type="date"
          value={formData.releaseDate}
          onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
          className={`w-full p-3 rounded-xl border text-sm ${errors.releaseDate ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
        />
        {errors.releaseDate && <p className="text-red-500 text-xs mt-1">{errors.releaseDate}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-[#8b5e34] hover:bg-[#704924] text-white font-bold rounded-2xl shadow-md transition disabled:opacity-50"
      >
        {isSubmitting ? 'กำลังบันทึก...' : initialData?._id ? 'บันทึกการแก้ไข' : 'สร้างเมนูใหม่'}
      </button>
    </form>
  );
}
```

---

### ✅ Checklist ก่อนส่งมอบงาน (Definition of Done)
1. [ ] ฟอร์มมีการเช็ค `type="number"`, `type="date"`, `type="text"` ถูกต้อง
2. [ ] เมื่อกรอกฟอร์มไม่ครบ จะมีข้อความเตือนสีแดงแจ้งใต้ช่องทันที
3. [ ] สามารถสร้างเมนูใหม่ และข้อมูลวิ่งไปบันทึกบน MongoDB Atlas ได้จริง
4. [ ] สามารถกด Edit แล้วข้อมูลเดิมถูกโหลดขึ้นมา และแก้ไขได้จริง
5. [ ] สามารถกด Delete พร้อม Modal ยืนยัน และเมนูถูกลบออกจาก MongoDB จริง
