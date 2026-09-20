# 🧑‍💻 Task Assignment: Delta (Storefront, Product Catalog & Query Engine)
## Sprint 3 — That-tae (ธาตุแท้) Cooking Kit E-Commerce

---

### 🎯 เป้าหมายของ Delta ใน Sprint 3
รับผิดชอบหน้าร้านค้าหลัก (Storefront) และแคตตาล็อกสินค้า (Product Catalog) โดยเชื่อมต่อการอ่านข้อมูลจาก **MongoDB Database จริง (Task 8: READ Operation)** พร้อมสร้าง React Components ที่มีโครงสร้างระดับพรีเมียมตามเกณฑ์ **Task 10 (Product Component & Product List Component)** รองรับการ Search & Filter ตามภูมิภาคและธาตุเจ้าเรือน

---

### 📋 เกณฑ์การประเมินที่เกี่ยวข้อง (Assessment Rubrics)

#### 1. Technical Skills — Task 8 (READ Operations)
* [x] **READ Operation (Single Product):** เชื่อมต่อการดึงข้อมูลสินค้ารายชิ้นจาก MongoDB (`GET /api/v1/products/:id`) แสดงในหน้า `MenuDetail.jsx`
* [x] **READ Operation (Product List):** เชื่อมต่อการดึงรายการสินค้าทั้งหมดจาก MongoDB (`GET /api/v1/products`) แสดงในหน้า `MenuOverview.jsx`

#### 2. Technical Skills — Task 10 (Components & Architecture)
* [x] **React Component to Represent a Product:** พัฒนาคอมโพเนนต์ `MenuCard.jsx` (Product Card) ที่แสดงรูปภาพ, ชื่อเมนู, แท็กภูมิภาค, ธาตุเจ้าเรือน, ราคา, และปุ่ม Add to Cart
* [x] **React Component to Represent a Products List:** พัฒนาคอมโพเนนต์ `MenuOverview.jsx` / `ProductList.jsx` ที่รวม Grid ของการ์ดสินค้า รองรับ Pagination และ Empty State เมื่อไม่พบสินค้า
* [x] **MongoDB Integration & RESTful Methods:** ใช้เมธอด `GET` ในการดึงข้อมูล ไม่มีการดึงข้อมูลผิดประเภท และรองรับ Query Parameters (`region`, `element`, `search`)

---

### 💻 รายละเอียดไฟล์และการเขียนโค้ด (Step-by-Step Implementation)

#### Step 1: Controller ดึงข้อมูลจาก MongoDB (`server/src/controllers/product.controller.js`)
```javascript
import Product from '../models/Product.model.js';

// 1. READ ALL Products with Dynamic Filters (GET /api/v1/products)
export const getProducts = async (req, res, next) => {
  try {
    const { region, element, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    // Filter by Region
    if (region) {
      const regionArr = Array.isArray(region) ? region : [region];
      query.region = { $in: regionArr };
    }

    // Filter by Element (ธาตุเด่น หรือ ธาตุที่เหมาะสม)
    if (element) {
      query.$or = [
        { dominantElement: element },
        { elementSuitability: element }
      ];
    }

    // Text Search
    if (search) {
      query.$or = [
        { nameTh: { $regex: search, $options: 'i' } },
        { nameEn: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    // Sort Options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. READ Single Product by ID (GET /api/v1/products/:id)
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเมนู Cooking Kit ที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
```

---

#### Step 2: Component รายการสินค้า (`client/src/pages/MenuOverview.jsx`)
```jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuCard from '../components/Menu/MenuCard.jsx';
import MenuFilters from '../components/Menu/MenuFilters.jsx';

export default function MenuOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const region = searchParams.get('region') || '';
  const element = searchParams.get('element') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (region) params.append('region', region);
        if (element) params.append('element', element);
        if (search) params.append('search', search);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?${params.toString()}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'ไม่สามารถดึงรายการสินค้าได้');

        setProducts(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [region, element, search]);

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest text-[#8b5e34] uppercase">WEEKLY COOKING KITS</span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">
          ชุดทำอาหารท้องถิ่นเพื่อสุขภาพและสมดุลธาตุ
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          วัตถุดิบคัดสรรแท้จากแหล่งกำเนิด พร้อมคำนวณสารอาหารและรสยาตามหลักแพทย์แผนไทย
        </p>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters Aside */}
        <aside>
          <MenuFilters />
        </aside>

        {/* Product List Grid Component */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8b5e34]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center">
              <p className="font-bold">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#ebe4dc] text-center">
              <span className="text-4xl">🍲</span>
              <h3 className="text-lg font-bold text-stone-800 mt-3">ไม่พบเมนูที่ตรงกับเงื่อนไข</h3>
              <p className="text-xs text-stone-500 mt-1">ลองเปลี่ยนภูมิภาคหรือธาตุเจ้าเรือนที่ค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <MenuCard key={product._id} menu={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

---

#### Step 3: Product Card Component (`client/src/components/Menu/MenuCard.jsx`)
```jsx
import { useNavigate, useOutletContext } from 'react-router-dom';

const ELEMENT_COLORS = {
  ดิน: 'bg-amber-100 text-amber-900 border-amber-300',
  น้ำ: 'bg-sky-100 text-sky-900 border-sky-300',
  ลม: 'bg-teal-100 text-teal-900 border-teal-300',
  ไฟ: 'bg-rose-100 text-rose-900 border-rose-300',
};

export default function MenuCard({ menu }) {
  const navigate = useNavigate();
  const { handleAddToCart } = useOutletContext() || {};

  const rawImg = Array.isArray(menu.imageUrl) ? menu.imageUrl[0] : menu.imageUrl;
  const imageUrl = rawImg || '/assets/placeholder.jpg';

  return (
    <div
      onClick={() => navigate(`/menus/${menu._id}`)}
      className="group bg-white border border-[#ebe4dc] rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#8b5e34]/30"
    >
      <div className="w-full h-48 overflow-hidden relative bg-stone-100">
        <img
          src={imageUrl}
          alt={menu.nameTh}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span>{menu.regionNameTh || menu.region}</span>
          {menu.dominantElement && (
            <span className="text-[#e2b887]">• ธาตุ{menu.dominantElement}</span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-stone-900 mb-1 line-clamp-1 group-hover:text-[#8b5e34] transition-colors">
          {menu.nameTh}
        </h3>
        <p className="text-xs text-stone-500 mb-4 line-clamp-2 leading-relaxed flex-1">
          {menu.description}
        </p>

        <div className="flex justify-between items-center pt-3 border-t border-stone-100">
          <div>
            <span className="text-lg font-black text-[#8b5e34]">฿{menu.price}</span>
            <span className="text-[11px] text-stone-400 ml-1">/ ชุด</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (handleAddToCart) handleAddToCart(menu, 1);
            }}
            className="bg-[#8b5e34] hover:bg-[#704924] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ ใส่ตะกร้า</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### ✅ Checklist ก่อนส่งมอบงาน (Definition of Done)
1. [ ] หน้าร้านดึงข้อมูลสดจาก `GET /api/v1/products` บน MongoDB
2. [ ] หน้ารายละเอียดเมนูดึงข้อมูลสดจาก `GET /api/v1/products/:id`
3. [ ] ตัวกรองตามภูมิภาค (เหนือ, ใต้, กลาง, อีสาน, Fusion) ใช้งานได้จริง
4. [ ] ตัวกรองตามธาตุเจ้าเรือน (ดิน, น้ำ, ลม, ไฟ) ใช้งานได้จริง
5. [ ] การ์ดสินค้าและหน้ารายละเอียดใช้ Light Theme สวยงาม คมชัด และ Responsive 100%
