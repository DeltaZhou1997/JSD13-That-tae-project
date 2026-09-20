# 🧑‍💻 Task Assignment: Nate (Core Architecture, Deployment & Admin Ingredient/Recipe Builder)
## Sprint 3 — That-tae (ธาตุแท้) Cooking Kit E-Commerce

---

### 👤 ผู้รับผิดชอบ (Assignee)
* **ชื่อสมาชิก:** **Nate** (Role: Core Architect, DevOps & Admin Ingredient/Recipe Systems)
* **ขอบเขตงาน:**
  1. **Core Architecture & Deployment (Task 9 & 10):** วางรากฐาน MongoDB Atlas, Mongoose Connection, Seed Script (30 เมนู 217 วัตถุดิบ), JWT Authentication, Centralized Error Handling, และ Deploy ขึ้น **Vercel (Frontend)** + **Render (Backend)**
  2. **Admin Ingredient & Stock Management:** จัดการคลังวัตถุดิบ 217 รายการ (`Ingredient.model.js`), ควบคุมสต็อกวัตถุดิบและแจ้งเตือนเมื่อวัตถุดิบใกล้หมด
  3. **Admin Recipe Builder & Elemental Calculator:** พัฒนาระบบให้ Admin สามารถสร้างเมนูอาหารใหม่ โดยการเลือกดึงวัตถุดิบจากฐานข้อมูล ระบุปริมาตร/น้ำหนัก (กรัม/มล.) แล้วระบบจะ **คำนวณคุณค่าทางโภชนาการรวม และคำนวณธาตุเด่น (ดิน/น้ำ/ลม/ไฟ) ตามสัดส่วนรสยาแพทย์แผนไทยอัตโนมัติ**

---

### 🗺️ แผนการพัฒนา 2 ระยะ (Two-Stage Roadmap: v1 ➔ v2)

```
┌────────────────────────────────────────────────────────┐
│  Stage 1 (ดูแล v1 Mock Architecture & Ingredient Logic) │
│  • ดูแล Express Server v1, CORS, Request Logging       │
│  • ทำ In-Memory Ingredient Management & Recipe Calc    │
│  • ทดสอบสูตรคำนวณธาตุตามรสยาแพทย์แผนไทย                │
│  • ซัพพอร์ตเพื่อนในทีมให้ทดสอบ Full-Stack กับ Mock Data│
└───────────────────────────┬────────────────────────────┘
                            │ Upgrade สัปดาห์ถัดไป
┌───────────────────────────▼────────────────────────────┐
│  Stage 2 (เชื่อมต่อ MongoDB Atlas, Recipe Builder &    │
│           Production Deployment Vercel/Render)         │
│  • เชื่อมต่อ MongoDB Atlas Cluster และ Mongoose Models  │
│  • สร้าง Admin Ingredient CRUD & Recipe Builder UI     │
│  • คำนวณสารอาหารและธาตุสดจาก MongoDB Collection        │
│  • Deploy ระบบขึ้น Public URL (Task 9)                 │
└────────────────────────────────────────────────────────┘
```

---

### 📋 เกณฑ์การประเมินที่เกี่ยวข้อง (Assessment Rubrics: Task 8, 9, 10)
* [x] **React App Deployment (Task 9):** Deploy React Frontend ขึ้น Vercel และเข้าถึงได้ผ่าน Public HTTPS URL
* [x] **Express API Deployment (Task 9):** Deploy Express API ขึ้น Render/Fly.io และเข้าถึงได้ผ่าน Public HTTPS URL
* [x] **Cross-Origin & Networking (Task 9):** ตั้งค่า CORS และ Environment Variables (`VITE_API_BASE_URL`, `CLIENT_URL`) ให้ Frontend กับ Backend สื่อสารกันได้ 100%
* [x] **Mongoose & Database Setup (Task 10):** ตั้งค่าการเชื่อมต่อ MongoDB Atlas ผ่าน Mongoose อย่างสมบูรณ์ ไม่มี Error ตอนรัน `npm start`
* [x] **Admin Ingredient CRUD (Task 8):** จัดการ `CREATE`, `READ`, `UPDATE`, `DELETE` วัตถุดิบในฐานข้อมูล
* [x] **Recipe & Nutrition Engine:** คำนวณสัดส่วนสารอาหารและธาตุเจ้าเรือนแบบ Dynamic

---

### 💻 รายละเอียดการพัฒนาระบบ Full-Stack (Step-by-Step)

#### 🔹 1. Mongoose Schema สำหรับวัตถุดิบ (`server/src/models/Ingredient.model.js`)
```javascript
import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  ingredientId: { type: String, required: true, unique: true }, // e.g. "ING_001"
  nameTh: { type: String, required: true, trim: true },
  nameEn: { type: String, trim: true },
  scientificName: { type: String, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['meat', 'poultry', 'seafood', 'protein', 'vegetable', 'herb_spice', 'carb', 'seasoning', 'dairy_egg', 'other'] 
  },
  categoryTh: { type: String, required: true },
  medicinalTaste: { 
    type: String, 
    required: true,
    // รสยา 9 รส: ฝาด, หวาน, เมาเบื่อ, ขม, เผ็ดร้อน, มัน, หอมเย็น, เค็ม, เปรี้ยว, จืด
    enum: ['รสฝาด', 'รสหวาน', 'รสขม', 'รสเผ็ดร้อน', 'รสมัน', 'รสเค็ม', 'รสเปรี้ยว', 'รสจืด', 'รสหอมเย็น']
  },
  elements: [{ 
    type: String, 
    enum: ['ดิน', 'น้ำ', 'ลม', 'ไฟ'] 
  }],
  nutrientsPer100g: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  currentStockGrams: { type: Number, default: 10000 }, // สต็อกวัตถุดิบในคลังกลาง (กรัม)
  lowStockThresholdGrams: { type: Number, default: 1000 }, // จุดเตือนสั่งซื้อเพิ่ม
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Ingredient', IngredientSchema);
```

---

#### 🔹 2. Dynamic Elemental & Nutrition Calculation Engine (`server/src/utils/elementCalculator.js`)
```javascript
/**
 * คำนวณธาตุเด่นและสารอาหารรวมของเมนู จากรายการวัตถุดิบและสัดส่วนน้ำหนัก
 * @param {Array} recipeItems รายการวัตถุดิบ [{ ingredient, quantityGrams }]
 * @param {Number} servings จำนวนที่เสิร์ฟ (ค่าเริ่มต้น 2)
 */
export const calculateRecipeMetrics = (recipeItems, servings = 2) => {
  let totalWeight = 0;
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    sodium: 0
  };

  // ธาตุและรสยาตามหลักแพทย์แผนไทย:
  // • ธาตุดิน: รสฝาด, รสหวาน, รสมัน, รสเค็ม
  // • ธาตุน้ำ: รสเปรี้ยว, รสขม, รสหวาน
  // • ธาตุลม: รสเผ็ดร้อน, รสหอมเย็น
  // • ธาตุไฟ: รสขม, รสเย็น, รสจืด
  const elementWeights = {
    ดิน: 0,
    น้ำ: 0,
    ลม: 0,
    ไฟ: 0
  };

  recipeItems.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const ing = item.ingredient || item;
    const n = ing.nutrientsPer100g || {};

    totalWeight += qty;

    // คำนวณสารอาหารตามสัดส่วน (qty / 100)
    const ratio = qty / 100;
    totals.calories += (n.calories || 0) * ratio;
    totals.protein += (n.protein || 0) * ratio;
    totals.carbs += (n.carbs || 0) * ratio;
    totals.fat += (n.fat || 0) * ratio;
    totals.sugar += (n.sugar || 0) * ratio;
    totals.fiber += (n.fiber || 0) * ratio;
    totals.sodium += (n.sodium || 0) * ratio;

    // คำนวณน้ำหนักคะแนนธาตุตามรสยาและปริมาณที่ใช้
    const taste = ing.medicinalTaste || '';
    if (taste.includes('ฝาด') || taste.includes('มัน') || taste.includes('เค็ม')) {
      elementWeights['ดิน'] += qty * 1.5;
    }
    if (taste.includes('หวาน')) {
      elementWeights['ดิน'] += qty * 1.0;
      elementWeights['น้ำ'] += qty * 0.8;
    }
    if (taste.includes('เปรี้ยว')) {
      elementWeights['น้ำ'] += qty * 1.5;
    }
    if (taste.includes('เผ็ดร้อน')) {
      elementWeights['ลม'] += qty * 1.8; // เครื่องเทศเผ็ดร้อนส่งผลต่อลมสูง
    }
    if (taste.includes('ขม') || taste.includes('จืด') || taste.includes('เย็น')) {
      elementWeights['ไฟ'] += qty * 1.5;
      elementWeights['น้ำ'] += qty * 0.5;
    }
  });

  // ปัดเศษตัวเลขให้อ่านง่าย
  const roundedTotals = {
    calories: Math.round(totals.calories),
    protein: Number(totals.protein.toFixed(1)),
    carbs: Number(totals.carbs.toFixed(1)),
    fat: Number(totals.fat.toFixed(1)),
    sugar: Number(totals.sugar.toFixed(1)),
    fiber: Number(totals.fiber.toFixed(1)),
    sodium: Math.round(totals.sodium)
  };

  const perServing = {
    calories: Math.round(totals.calories / servings),
    protein: Number((totals.protein / servings).toFixed(1)),
    carbs: Number((totals.carbs / servings).toFixed(1)),
    fat: Number((totals.fat / servings).toFixed(1)),
    sugar: Number((totals.sugar / servings).toFixed(1)),
    fiber: Number((totals.fiber / servings).toFixed(1)),
    sodium: Math.round(totals.sodium / servings)
  };

  // หาธาตุเด่นที่มีคะแนนสัดส่วนสูงที่สุด
  let dominantElement = 'ดิน';
  let maxWeight = -1;
  const sortedElements = Object.entries(elementWeights).sort((a, b) => b[1] - a[1]);
  if (sortedElements.length > 0 && sortedElements[0][1] > 0) {
    dominantElement = sortedElements[0][0];
  }

  // ธาตุที่เหมาะสม 2 อันดับแรก
  const elementSuitability = sortedElements
    .filter(([_, weight]) => weight > 0)
    .slice(0, 2)
    .map(([el]) => el);

  return {
    totalWeight,
    totals: roundedTotals,
    perServing,
    dominantElement,
    elementSuitability: elementSuitability.length > 0 ? elementSuitability : [dominantElement],
    elementScores: elementWeights
  };
};
```

---

#### 🔹 3. Admin Recipe Builder Component (`client/src/pages/admin/AdminRecipeBuilder.jsx`)
```jsx
import { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast.js';

export default function AdminRecipeBuilder() {
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dishInfo, setDishInfo] = useState({
    nameTh: '',
    nameEn: '',
    region: 'north',
    price: 280,
    servings: 2,
    description: ''
  });
  const [calculatedMetrics, setCalculatedMetrics] = useState(null);
  const toast = useToast();

  // ดึงรายการวัตถุดิบทั้งหมดในคลัง
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/ingredients`)
      .then(res => res.json())
      .then(data => setAvailableIngredients(data.data || []))
      .catch(err => console.error('Failed to load ingredients', err));
  }, []);

  // เมื่อมีการเพิ่ม/ปรับปริมาณวัตถุดิบ ให้คำนวณสารอาหารและธาตุแบบ Realtime
  useEffect(() => {
    if (selectedItems.length === 0) {
      setCalculatedMetrics(null);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/calculate-recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: selectedItems, servings: dishInfo.servings })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setCalculatedMetrics(result.data);
        }
      });
  }, [selectedItems, dishInfo.servings]);

  const handleAddIngredient = (ingredient) => {
    if (selectedItems.some(i => i.ingredientId === ingredient.ingredientId)) {
      toast.info('วัตถุดิบนี้อยู่ในสูตรแล้ว');
      return;
    }
    setSelectedItems([...selectedItems, {
      ingredientId: ingredient.ingredientId,
      nameTh: ingredient.nameTh,
      quantity: 50, // ค่าเริ่มต้น 50g
      unit: 'g',
      category: ingredient.category,
      medicinalTaste: ingredient.medicinalTaste,
      nutrientsPer100g: ingredient.nutrientsPer100g
    }]);
  };

  const handleUpdateQty = (index, qty) => {
    const updated = [...selectedItems];
    updated[index].quantity = Math.max(1, Number(qty));
    setSelectedItems(updated);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSaveMenu = async () => {
    if (!dishInfo.nameTh || selectedItems.length === 0) {
      toast.error('กรุณาระบุชื่อเมนูและเลือกวัตถุดิบอย่างน้อย 1 รายการ');
      return;
    }

    try {
      const payload = {
        ...dishInfo,
        recipe: selectedItems,
        nutrition: {
          totals: calculatedMetrics.totals,
          perServing: calculatedMetrics.perServing
        },
        dominantElement: calculatedMetrics.dominantElement,
        elementSuitability: calculatedMetrics.elementSuitability
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'สร้างเมนูไม่สำเร็จ');

      toast.success(`สร้างเมนู "${dishInfo.nameTh}" พร้อมคำนวณธาตุ${calculatedMetrics.dominantElement}สำเร็จ!`);
      setSelectedItems([]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-[#faf8f5]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">เครื่องมือออกแบบสูตรอาหาร & คำนวณธาตุเจ้าเรือน (Recipe Builder)</h1>
          <p className="text-xs text-stone-500">เลือกวัตถุดิบจากคลัง 217 ชนิด ใส่สัดส่วนกรัม ระบบจะประมวลผลโภชนาการและรสยาให้อัตโนมัติ</p>
        </div>
        <button
          onClick={handleSaveMenu}
          className="px-6 py-2.5 bg-[#8b5e34] hover:bg-[#704924] text-white font-bold rounded-xl shadow-md cursor-pointer"
        >
          💾 บันทึกเป็นเมนูใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* คอลัมน์ 1: เลือกวัตถุดิบจากคลัง */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 h-[600px] flex flex-col">
          <h3 className="font-bold text-stone-800 mb-3 text-sm">1. เลือกวัตถุดิบในคลัง ({availableIngredients.length} รายการ)</h3>
          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {availableIngredients.map(ing => (
              <div key={ing.ingredientId} className="flex justify-between items-center p-2.5 bg-stone-50 hover:bg-amber-50/50 rounded-xl border border-stone-200/70 text-xs">
                <div>
                  <span className="font-bold text-stone-800">{ing.nameTh}</span>
                  <span className="block text-[10px] text-stone-500">{ing.medicinalTaste} • {ing.categoryTh}</span>
                </div>
                <button
                  onClick={() => handleAddIngredient(ing)}
                  className="px-2.5 py-1 bg-white hover:bg-[#8b5e34] hover:text-white border border-stone-300 rounded-lg font-bold"
                >
                  + เพิ่ม
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* คอลัมน์ 2: ปรับสัดส่วนวัตถุดิบในชุด */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 h-[600px] flex flex-col">
          <h3 className="font-bold text-stone-800 mb-3 text-sm">2. วัตถุดิบในสูตร ({selectedItems.length} ชนิด)</h3>
          <div className="overflow-y-auto space-y-3 flex-1 pr-1">
            {selectedItems.map((item, idx) => (
              <div key={item.ingredientId} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-stone-900">{item.nameTh}</span>
                  <span className="block text-[10px] text-amber-800 font-medium">{item.medicinalTaste}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQty(idx, e.target.value)}
                    className="w-16 p-1 bg-white border border-stone-300 rounded text-center font-bold"
                  />
                  <span>กรัม</span>
                  <button onClick={() => handleRemoveItem(idx)} className="text-red-500 font-bold px-1">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* คอลัมน์ 3: ผลการคำนวณธาตุ & สารอาหารสด */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 h-[600px] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-800 mb-3 text-sm">3. ผลการคำนวณธาตุและโภชนาการ</h3>
            {calculatedMetrics ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800">ธาตุเด่นที่คำนวณได้:</span>
                  <div className="text-2xl font-black text-[#8b5e34] mt-1">
                    ธาตุ{calculatedMetrics.dominantElement}
                  </div>
                  <p className="text-[10px] text-amber-900 mt-1">
                    เหมาะสมกับ: {calculatedMetrics.elementSuitability.map(e => `ธาตุ${e}`).join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">พลังงานรวม</span>
                    <span className="font-bold text-base text-stone-900">{calculatedMetrics.totals.calories} kcal</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">ต่อ 1 เสิร์ฟ</span>
                    <span className="font-bold text-base text-stone-900">{calculatedMetrics.perServing.calories} kcal</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">โปรตีน</span>
                    <span className="font-bold text-stone-800">{calculatedMetrics.perServing.protein}g</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">คาร์บ</span>
                    <span className="font-bold text-stone-800">{calculatedMetrics.perServing.carbs}g</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 text-center py-20">เพิ่มวัตถุดิบเพื่อเริ่มคำนวณธาตุและสารอาหาร</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### ✅ Checklist ก่อนส่งมอบงาน (Definition of Done)
1. [ ] MongoDB Atlas Cluster เชื่อมต่อผ่าน Mongoose สมบูรณ์ และรัน Seed Scripts 30 เมนู 217 วัตถุดิบสำเร็จ
2. [ ] มี CRUD API และหน้า Admin สำหรับจัดการคลังวัตถุดิบ 217 รายการ
3. [ ] มีระบบ Recipe Builder ที่ดึงวัตถุดิบจาก DB มาประกอบเมนูและคำนวณสารอาหาร/ธาตุตามรสยาแพทย์แผนไทยอัตโนมัติ
4. [ ] Frontend Deploy บน Vercel พร้อม Public URL
5. [ ] Backend Deploy บน Render พร้อม Public URL และ CORS สำหรับสื่อสารข้ามโดเมน
