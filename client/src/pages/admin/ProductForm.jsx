import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTodayInputValue,
  regionMap,
  useProducts,
} from "../../context/ProductsContext.js";

const inputClass =
  "w-full rounded border border-[#f1ead7] p-2 focus:border-[#4c1f08] focus:outline-none focus:ring-2 focus:ring-[#f1ead7]";
const labelClass = "mb-1 block font-medium text-[#4c1f08]";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct } = useProducts();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    region: "northern",
    regionNameTh: regionMap.northern,
    description: "",
    history: "",
    price: "",
    quantity: "",
    calories: "",
    date: getTodayInputValue(),
    tags: "",
    ingredients: "",
    cookingSteps: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  // โหมดแก้ไข: ดึงค่าเดิมจาก state กลางมาเติมในฟอร์ม
  useEffect(() => {
    if (!isEditMode) return;

    const product = getProductById(id);
    if (!product) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setFormData({
      ...product,
      price: String(product.price ?? ""),
      quantity: String(product.quantity ?? ""),
      calories: String(product.calories ?? ""),
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
    });
  }, [id, isEditMode, getProductById]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "region") {
      // เปลี่ยนภาคแล้วให้ชื่อภาคภาษาไทยเปลี่ยนตามอัตโนมัติ
      setFormData((prev) => ({ ...prev, region: value, regionNameTh: regionMap[value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // ล้าง error ของช่องที่กำลังแก้ ให้ข้อความแดงหายทันทีที่ผู้ใช้เริ่มพิมพ์
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const splitTags = (value) =>
    typeof value === "string"
      ? value.split(",").map((tag) => tag.trim()).filter(Boolean)
      : value || [];

  // *** Validation Logic ***
  const validateForm = () => {
    const newErrors = {};

    // 1. Name: ไม่เป็นค่าว่าง และยาวอย่างน้อย 3 ตัวอักษร
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "ชื่อเมนูต้องไม่เป็นค่าว่าง และมีความยาวอย่างน้อย 3 ตัวอักษร";
    }

    // 2. Description: รายละเอียดเมนู ต้องไม่เป็นค่าว่าง
    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "รายละเอียดเมนู/ประวัติอาหาร ต้องไม่เป็นค่าว่าง";
    }

    // 3. Price: เป็นตัวเลขมากกว่า 0
    const priceNum = Number(formData.price);
    if (formData.price === "" || Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "ราคาต้องเป็นตัวเลขที่มากกว่า 0";
    }

    // 4. Quantity (Stock): จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็ม >= 0
    const qtyNum = Number(formData.quantity);
    if (
      formData.quantity === "" ||
      Number.isNaN(qtyNum) ||
      qtyNum < 0 ||
      !Number.isInteger(qtyNum)
    ) {
      newErrors.quantity = "จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    }

    // 5. Date: วันที่เริ่มวางขาย/วันหมดอายุวัตถุดิบ
    if (!formData.date) {
      newErrors.date = "กรุณาระบุวันที่วางขาย/วันหมดอายุวัตถุดิบ";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "วันที่เริ่มวางขาย/หมดอายุวัตถุดิบ ต้องไม่เป็นอดีต";
      }
    }

    // 6. Tag (Health/Region/Element): ต้องเลือกอย่างน้อย 1 แท็ก
    if (splitTags(formData.tags).length === 0) {
      newErrors.tags =
        "ต้องระบุอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, GERD Friendly, Keto Flex, ธาตุไฟ)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      name: formData.name.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      calories: formData.calories === "" ? 0 : Number(formData.calories),
      tags: splitTags(formData.tags),
    };

    if (isEditMode) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }

    navigate("/admin/products");
  };

  if (notFound) {
    return (
      <div className="mx-auto my-8 max-w-3xl rounded-lg border border-[#f1ead7] bg-white p-6 text-center shadow-md">
        <p className="text-[#4c1f08]">ไม่พบเมนูรหัส {id} ในรายการสินค้า</p>
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mt-4 rounded-lg bg-[#4c1f08] px-6 py-2 font-medium text-white transition hover:bg-[#6b3215]"
        >
          กลับไปหน้ารายการสินค้า
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-3xl rounded-lg border border-[#f1ead7] bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-[#4c1f08]">
        {isEditMode ? "แก้ไขข้อมูล Cooking Kit" : "เพิ่มเมนู Cooking Kit ใหม่"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* ชื่อเมนู */}
        <div>
          <label className={labelClass}>
            ชื่อเมนู <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="เช่น แกงฮังเล, ข้าวซอยไก่"
            className={inputClass}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* ภาคอาหาร & แคลอรี */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              ภูมิภาคอาหาร <span className="text-red-500">*</span>
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={inputClass}
            >
              {Object.entries(regionMap).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>แคลอรี (kcal)</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="เช่น 350"
              className={inputClass}
            />
          </div>
        </div>

        {/* รายละเอียด */}
        <div>
          <label className={labelClass}>
            รายละเอียดเมนู <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="อธิบายเกี่ยวกับรสชาติ สัมผัส หรือจุดเด่นของเมนูนี้"
            className={inputClass}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* ประวัติอาหาร */}
        <div>
          <label className={labelClass}>ประวัติอาหาร (InfoCard Context)</label>
          <textarea
            name="history"
            rows="2"
            value={formData.history}
            onChange={handleChange}
            placeholder="ประวัติความเป็นมา หรือที่มาของเมนูพื้นบ้านนี้"
            className={inputClass}
          />
        </div>

        {/* ราคา & จำนวนสต็อก */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              ราคา (บาท) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="เช่น 189"
              className={inputClass}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className={labelClass}>
              จำนวนชุดในสต็อก (Quantity) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="เช่น 50"
              className={inputClass}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>
        </div>

        {/* วันที่วางขาย/หมดอายุ */}
        <div>
          <label className={labelClass}>
            วันที่เริ่มวางขาย / หมดอายุวัตถุดิบ <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>
            แท็กสุขภาพ/ภาค/ธาตุเจ้าเรือน (คั่นด้วยคอมม่า){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="เช่น ภาคเหนือ, GERD Friendly, Keto Flex, ธาตุไฟ"
            className={inputClass}
          />
          {errors.tags && <p className="mt-1 text-sm text-red-500">{errors.tags}</p>}
        </div>

        {/* วัตถุดิบ */}
        <div>
          <label className={labelClass}>วัตถุดิบ (บรรทัดละ 1 รายการ)</label>
          <textarea
            name="ingredients"
            rows="3"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder={"พริกแกง 1 ซอง\nวัตถุดิบสด 1 ชุด"}
            className={inputClass}
          />
        </div>

        {/* ขั้นตอนการทำ */}
        <div>
          <label className={labelClass}>ขั้นตอนการทำ (บรรทัดละ 1 ขั้นตอน)</label>
          <textarea
            name="cookingSteps"
            rows="3"
            value={formData.cookingSteps}
            onChange={handleChange}
            placeholder={"1. เตรียมวัตถุดิบ\n2. ปรุงให้สุกพร้อมเสิร์ฟ"}
            className={inputClass}
          />
        </div>

        {/* URL รูปภาพ */}
        <div>
          <label className={labelClass}>ลิงก์รูปภาพ (Image URL)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
        </div>

        {/* ปุ่ม Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="rounded-lg bg-[#4c1f08] px-6 py-2 font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
          >
            {isEditMode ? "บันทึกการแก้ไข" : "สร้างเมนูใหม่"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-lg bg-gray-300 px-6 py-2 font-medium text-gray-800 transition hover:bg-gray-400"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
