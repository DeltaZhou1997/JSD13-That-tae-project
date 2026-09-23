
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";


import {
  getTodayInputValue,
  regionMap,
  useProducts,
} from "../../context/ProductsContext.js";
import useToast from "../../hooks/useToast.js";
import {
  POPULAR_FOOD_RESTRICTIONS,
  RESTRICTION_CATEGORIES,
} from "../../constants/foodRestrictions.js";
import { getAuthHeaders } from "../../utils/authHeader.js";

// Preset ภาพตัวอย่างอาหารไทยยอดนิยม
const PRESET_DISH_IMAGES = [
  { label: "ต้มยำกุ้ง", url: "https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600&auto=format&fit=crop&q=80" },
  { label: "แกงฮังเล", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80" },
  { label: "ข้าวซอยไก่", url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80" },
  { label: "ส้มตำไทย", url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80" },
  { label: "คั่วกลิ้ง", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" },
  { label: "ผัดไทยกุ้งสด", url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80" },
];

const inputClass =
  "w-full rounded-xl border border-[#d9cbbd] p-2.5 text-sm focus:border-[#4c1f08] focus:outline-none focus:ring-2 focus:ring-[#f1ead7]";
const labelClass = "mb-1 block text-xs font-bold text-[#4c1f08]";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { getProductById, addProduct, updateProduct } = useProducts();
  const isEditMode = Boolean(id);

  // วัตถุดิบทั้งหมดที่มีในสต็อก
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  // วัตถุดิบที่ถูกเลือกใส่ในสูตรนี้
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // State สำหรับตัวเลือกการใส่วัตถุดิบ
  const [pickerIngId, setPickerIngId] = useState("");
  const [pickerQty, setPickerQty] = useState(100);
  const [pickerUnit, setPickerUnit] = useState("g");

  const [foodRestrictions, setFoodRestrictions] = useState([
    "gerd_friendly",
    "low_sodium",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    region: "northern",
    regionNameTh: regionMap.northern,
    dominantElement: "ดิน",
    description: "",
    history: "",
    price: "",
    quantity: "30",
    calories: "",
    date: getTodayInputValue(),
    tags: "ภาคเหนือ, ธาตุดิน, เมนูเพื่อสุขภาพ",
    ingredients: "",
    cookingSteps: "",
    imageUrl: "",
    imageId: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

  // ฟังก์ชันอัปโหลดรูปภาพขึ้น MongoDB GridFS
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    setIsUploadingImage(true);
    try {
      const res = await fetch(`${apiUrl}/api/v2/images/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const fullUrl = data.url.startsWith("http") ? data.url : `${apiUrl}${data.url}`;
        setFormData((prev) => ({
          ...prev,
          imageUrl: fullUrl,
          imageId: data.fileId || data.id || "",
        }));
        toast.success("อัปโหลดรูปภาพเข้า MongoDB GridFS สำเร็จ! ✨");
      } else {
        toast.error(data.message || "อัปโหลดภาพไม่สำเร็จ");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดภาพ");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 1. ดึงวัตถุดิบทั้งหมดจากสต็อกมาให้แอดมินเลือก
  useEffect(() => {
    let isMounted = true;
    async function loadIngredients() {
      setLoadingIngredients(true);
      try {
        const res = await fetch(`${apiUrl}/api/v2/ingredients`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && isMounted) {
            setAvailableIngredients(json.data);
            if (json.data.length > 0) {
              setPickerIngId(json.data[0]._id || json.data[0].id);
              setPickerUnit(json.data[0].unit || "g");
            }
          }
        }
      } catch (err) {
        console.warn("⚠️ โหลดวัตถุดิบจาก API ไม่สำเร็จ:", err.message);
      } finally {
        if (isMounted) setLoadingIngredients(false);
      }
    }
    loadIngredients();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  // 2. โหมดแก้ไข: ดึงข้อมูลเดิมมาเติมในฟอร์ม
  useEffect(() => {
    if (!isEditMode) return;

    const product = getProductById(id);
    if (!product) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setComputed({
      servings: product.servings,
      recipe: product.recipe,
      nutritionCache: product.nutritionCache,
      dominantElement: product.dominantElement,
      elementSuitability: product.elementSuitability,
    });
    setFormData({
      name: product.name || product.nameTh || "",
      nameEn: product.nameEn || "",
      region: product.region || "northern",
      regionNameTh: product.regionNameTh || regionMap[product.region] || "ภาคเหนือ",
      dominantElement: product.dominantElement || "ดิน",
      description: product.description || "",
      history: product.history || "",
      price: String(product.price ?? ""),
      quantity: String(product.quantity ?? ""),
      calories: String(product.calories ?? ""),
      date: product.date || getTodayInputValue(),
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
      ingredients: Array.isArray(product.ingredients)
        ? product.ingredients.join("\n")
        : product.ingredients || "",
      cookingSteps: Array.isArray(product.cookingSteps)
        ? product.cookingSteps.join("\n")
        : product.cookingSteps || "",
      imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl || "",
    });

    if (Array.isArray(product.foodRestrictions)) {
      setFoodRestrictions(product.foodRestrictions);
    }

    // ถ้ามี recipe ใน product ให้โหลดเข้ามาใน selectedIngredients
    if (Array.isArray(product.recipe) && product.recipe.length > 0) {
      setSelectedIngredients(
        product.recipe.map((r) => ({
          id: r.ingredientId || r._id || r.id,
          nameTh: r.nameTh || "วัตถุดิบ",
          quantity: Number(r.quantity) || 100,
          unit: r.unit || "g",
          calories: Number(r.nutrientsPer100g?.calories) || 0,
          elements: r.elements || [],
          region: r.region || "ทั่วไป",
        }))
      );
    }
  }, [id, isEditMode, getProductById]);

  // 3. เมื่อเลือกวัตถุดิบใน Dropdown ให้เปลี่ยน Unit ตาม
  const handlePickerChange = (e) => {
    const ingId = e.target.value;
    setPickerIngId(ingId);
    const found = availableIngredients.find((i) => (i._id || i.id) === ingId);
    if (found) {
      setPickerUnit(found.unit || "g");
    }
  };

  // 4. เพิ่มวัตถุดิบลงในสูตรอาหาร
  const handleAddIngredientToRecipe = () => {
    if (!pickerIngId) return;
    const target = availableIngredients.find((i) => (i._id || i.id) === pickerIngId);
    if (!target) return;

    const targetId = target._id || target.id;
    const existingIndex = selectedIngredients.findIndex((s) => s.id === targetId);

    const qty = Math.max(1, Number(pickerQty) || 50);

    if (existingIndex >= 0) {
      // อัปเดตจำนวนถ้ามีอยู่แล้ว
      setSelectedIngredients((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
        )
      );
    } else {
      // เพิ่มชิ้นใหม่
      setSelectedIngredients((prev) => [
        ...prev,
        {
          id: targetId,
          nameTh: target.nameTh,
          nameEn: target.nameEn,
          quantity: qty,
          unit: target.unit || pickerUnit || "g",
          calories: Number(target.nutrientsPer100g?.calories) || 0,
          protein: Number(target.nutrientsPer100g?.protein) || 0,
          carbs: Number(target.nutrientsPer100g?.carbs) || 0,
          fat: Number(target.nutrientsPer100g?.fat) || 0,
          sodium: Number(target.nutrientsPer100g?.sodium) || 0,
          elements: target.elements || [],
          region: target.regionNameTh || target.region || "ทั่วไป",
        },
      ]);
    }

    toast.success(`เพิ่ม "${target.nameTh}" ลงในเมนูแล้ว`);
  };

  // ลบวัตถุดิบออกจากสูตร
  const handleRemoveIngredient = (idToRemove) => {
    setSelectedIngredients((prev) => prev.filter((i) => i.id !== idToRemove));
  };

  // คำนวณสารอาหารและแคลอรีรวมจากวัตถุดิบที่เลือก
  const calculatedNutrition = useMemo(() => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalSodium = 0;

    selectedIngredients.forEach((item) => {
      // คิดสัดส่วนตามต่อ 100g
      const ratio = (item.quantity || 100) / 100;
      totalCalories += (item.calories || 0) * ratio;
      totalProtein += (item.protein || 0) * ratio;
      totalCarbs += (item.carbs || 0) * ratio;
      totalFat += (item.fat || 0) * ratio;
      totalSodium += (item.sodium || 0) * ratio;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      sodium: Math.round(totalSodium),
    };
  }, [selectedIngredients]);

  // ซิงค์แคลอรีที่คำนวณได้ลงฟอร์ม (ถ้ายังไม่มีการแก้ไขโดยตรง)
  useEffect(() => {
    if (calculatedNutrition.calories > 0 && !formData.calories) {
      setFormData((prev) => ({ ...prev, calories: String(calculatedNutrition.calories) }));
    }
  }, [calculatedNutrition.calories, formData.calories]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "region") {
      setFormData((prev) => ({ ...prev, region: value, regionNameTh: regionMap[value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const splitTags = (value) =>
    typeof value === "string"
      ? value.split(",").map((tag) => tag.trim()).filter(Boolean)
      : value || [];

  // ตรวจสอบความถูกต้องของฟอร์ม (Validation)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "ชื่อเมนูต้องมีความยาวอย่างน้อย 3 ตัวอักษร";
    }

    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "รายละเอียดเมนูต้องไม่เป็นค่าว่าง";
    }

    const priceNum = Number(formData.price);
    if (formData.price === "" || Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "ราคาต้องเป็นตัวเลขที่มากกว่า 0";
    }

    const qtyNum = Number(formData.quantity);
    if (
      formData.quantity === "" ||
      Number.isNaN(qtyNum) ||
      qtyNum < 0 ||
      !Number.isInteger(qtyNum)
    ) {
      newErrors.quantity = "จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    }

    if (!formData.date) {
      newErrors.date = "กรุณาระบุวันที่เริ่มวางจำหน่าย";
    }

    if (splitTags(formData.tags).length === 0) {
      newErrors.tags = "ต้องระบุอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, GERD Friendly, ธาตุไฟ)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลในฟอร์มให้ครบถ้วนและถูกต้อง");
      return;
    }

    // สร้าง text สำหรับ ingredients อัตโนมัติจากวัตถุดิบที่เลือก ถ้าไม่ได้พิมพ์เอง
    const ingredientsText =
      selectedIngredients.length > 0
        ? selectedIngredients.map((i) => `${i.nameTh} ${i.quantity} ${i.unit}`).join("\n")
        : formData.ingredients;

    const payload = {
      ...formData,
      ...(computed || {}),
      name: formData.name.trim(),
      nameTh: formData.name.trim(),
      nameEn: formData.nameEn.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      stock: Number(formData.quantity),
      calories: formData.calories === "" ? calculatedNutrition.calories : Number(formData.calories),
      foodRestrictions: foodRestrictions,
      tags: [
        ...new Set([
          ...splitTags(formData.tags),
          ...foodRestrictions.map(
            (id) => POPULAR_FOOD_RESTRICTIONS.find((r) => r.id === id)?.shortLabel || id
          ),
        ]),
      ],
      ingredients: ingredientsText,
      recipe: selectedIngredients.map((s) => ({
        ingredientId: s.id,
        nameTh: s.nameTh,
        nameEn: s.nameEn,
        quantity: s.quantity,
        unit: s.unit,
        elements: s.elements,
        nutrientsPer100g: {
          calories: s.calories,
          protein: s.protein,
          carbs: s.carbs,
          fat: s.fat,
          sodium: s.sodium,
        },
      })),
    };

    if (isEditMode) {
      updateProduct(id, payload);
      toast.success(`อัปเดตเมนู "${formData.name}" เรียบร้อยแล้ว ✨`);
    } else {
      addProduct(payload);
      toast.success(`เพิ่มเมนู "${formData.name}" เข้าระบบเรียบร้อยแล้ว 🍲`);
    }

    navigate("/admin/products");
  };

  if (notFound) {
    return (
      <div className="mx-auto my-8 max-w-3xl rounded-3xl border border-[#f1ead7] bg-white p-8 text-center shadow-md">
        <p className="text-[#4c1f08] font-bold text-lg">ไม่พบเมนูรหัส {id} ในรายการสินค้า</p>
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mt-4 rounded-xl bg-[#4c1f08] px-6 py-2.5 font-bold text-white transition hover:bg-[#6b3215] cursor-pointer"
        >
          กลับไปหน้ารายการสินค้า
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-4xl px-4 sm:px-6">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#8d593a]">
        <Link to="/admin/dashboard" className="hover:underline">
          แผงควบคุมแอดมิน
        </Link>
        <span>/</span>
        <Link to="/admin/products" className="hover:underline">
          รายการสินค้า
        </Link>
        <span>/</span>
        <span className="text-[#4c1f08]">
          {isEditMode ? "แก้ไขเมนูอาหาร" : "เพิ่มเมนูใหม่"}
        </span>
      </div>

      <div className="rounded-3xl border border-[#f1ead7] bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-black text-[#4c1f08] sm:text-3xl">
          {isEditMode ? `แก้ไขเมนู: ${formData.name}` : "สร้างเมนู Cooking Kit ใหม่"}
        </h1>
        <p className="mb-6 text-xs text-[#7a5c4d]">
          เลือกวัตถุดิบที่มีอยู่ในสต็อกเพื่อประกอบเป็นเมนู คำนวณคุณค่าทางโภชนาการ และใส่ข้อมูลที่ 1 เมนูควรมีอย่างครบถ้วน
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* ─────────────────────────────────────────────────────────
              ส่วน 1: ข้อมูลชื่อ และภาพถ่ายอาหาร
          ────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#f1ead7] bg-[#fdfbf7] p-4 sm:p-5">
            <h2 className="text-sm font-bold text-[#4c1f08] uppercase tracking-wider mb-3">
              1. ชื่อเมนู และภาพถ่ายอาหาร (Name & Visual)
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  ชื่อเมนูภาษาไทย <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="เช่น แกงฮังเลหมูล้านนา, ต้มยำกุ้งน้ำใส"
                  className={inputClass}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className={labelClass}>ชื่อเมนูภาษาอังกฤษ</label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="เช่น Northern Hang-Le Curry"
                  className={inputClass}
                />
              </div>
            </div>

            {/* ช่องระบุ URL รูปภาพ หรือ อัปโหลดเข้า MongoDB GridFS */}
            <div className="mt-4">
              <label className={labelClass}>
                รูปภาพอาหาร (อัปโหลดเข้า MongoDB GridFS หรือใส่ URL)
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/dish.jpg หรืออัปโหลดไฟล์ด้านขวา"
                  className={`${inputClass} flex-1`}
                />

                <label className="flex items-center justify-center gap-2 rounded-xl bg-[#4c1f08] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6b3215] transition cursor-pointer shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{isUploadingImage ? "กำลังอัปโหลด..." : "อัปโหลดภาพ"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset รูปภาพอาหารแนะนำ */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#7a5c4d]">
                <span className="font-semibold text-[#4c1f08]">เลือกภาพด่วน:</span>
                {PRESET_DISH_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: img.url }))}
                    className="rounded-lg bg-white px-2 py-1 border border-[#d9cbbd] text-[11px] font-medium hover:bg-[#f8ede3] cursor-pointer"
                  >
                    {img.label}
                  </button>
                ))}
              </div>

              {/* Live Preview Box */}
              <div className="mt-3 flex items-center gap-4 rounded-xl border border-[#d9cbbd] bg-white p-3">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#f1ead7] flex items-center justify-center border">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="พรีวิวภาพอาหาร"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/120x80?text=Invalid+URL";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-[#8d593a]">ไม่มีรูปภาพ</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#4c1f08]">
                    ตัวอย่างการแสดงผลภาพอาหารในเว็บไซต์
                  </div>
                  <div className="text-[11px] text-[#7a5c4d]">
                    ภาพที่คมชัดจะแสดงในหน้าแคตตาล็อก, หน้าทดสอบธาตุ และหน้าสรุปออเดอร์
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              ส่วน 2: การเลือกวัตถุดิบจากคลังสต็อก (Pick Ingredients)
          ────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#f1ead7] bg-[#fff8f5] p-4 sm:p-5">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-[#4c1f08] uppercase tracking-wider">
                  2. เลือกวัตถุดิบประกอบเมนู (เลือกจากสต็อกที่มีอยู่)
                </h2>
                <p className="text-xs text-[#7a5c4d]">
                  เลือกวัตถุดิบที่มีอยู่ในสต็อก เพื่อให้ระบบคำนวณคุณค่าทางโภชนาการให้อัตโนมัติ
                </p>
              </div>

              {/* =========================================================================
                  [มาร์กจุดเชื่อมต่อ: ปุ่มไปหน้าเพิ่มวัตถุดิบใหม่เข้าสต็อก - รอเพื่อนพัฒนาเสร็จ]
                  TODO: เมื่อเพื่อนในทีมทำหน้าเพิ่มวัตถุดิบเสร็จแล้ว ให้แก้ไขคำสั่งด้านล่างเป็น:
                  onClick={() => window.open("/admin/ingredients/new", "_blank")} 
                  หรือ navigate("/admin/ingredients")
                 ========================================================================= */}
              <button
                type="button"
                onClick={() => {
                  /* TODO: เมื่อเพื่อนทำหน้าเสร็จแล้ว ให้เปิดใช้งานคำสั่งด้านล่าง:
                     // navigate("/admin/ingredients"); หรือเปิดแท็บใหม่
                  */
                  alert("ปุ่มเพิ่มวัตถุดิบใหม่เข้าสต็อก: อยู่ระหว่างการพัฒนาโดยเพื่อนในทีม (รอเชื่อมต่อไปยังหน้ารายการ/เพิ่มวัตถุดิบ)");
                }}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-[#d9cbbd] bg-white px-3 py-1.5 text-xs font-semibold text-[#4c1f08] hover:bg-[#f8ede3] cursor-pointer shadow-sm transition-colors"
                title="รอเชื่อมต่อกับหน้าเพิ่มวัตถุดิบของเพื่อนร่วมทีม"
              >
                <svg className="h-3.5 w-3.5 text-[#3d7a36]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>เพิ่มวัตถุดิบใหม่เข้าสต็อก</span>
              </button>
            </div>

            {/* แถบเลือกและเพิ่มวัตถุดิบ */}
            <div className="flex flex-col sm:flex-row gap-2 rounded-xl bg-white p-3 border border-[#d9cbbd]">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-[#4c1f08] mb-1">
                  เลือกวัตถุดิบในสต็อก
                </label>
                <select
                  value={pickerIngId}
                  onChange={handlePickerChange}
                  className="w-full rounded-lg border border-[#d9cbbd] p-2 text-xs text-[#4c1f08] cursor-pointer"
                >
                  {loadingIngredients ? (
                    <option>กำลังโหลดวัตถุดิบ...</option>
                  ) : (
                    availableIngredients.map((ing) => (
                      <option key={ing._id || ing.id} value={ing._id || ing.id}>
                        {ing.nameTh} ({ing.regionNameTh || "ทั่วไป"}) — คงเหลือ {ing.stockQuantity} {ing.unit}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="w-24">
                <label className="block text-[11px] font-bold text-[#4c1f08] mb-1">
                  ปริมาณ/ชุด
                </label>
                <input
                  type="number"
                  min="1"
                  value={pickerQty}
                  onChange={(e) => setPickerQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#d9cbbd] p-2 text-xs"
                />
              </div>

              <div className="w-20">
                <label className="block text-[11px] font-bold text-[#4c1f08] mb-1">
                  หน่วย
                </label>
                <input
                  type="text"
                  value={pickerUnit}
                  onChange={(e) => setPickerUnit(e.target.value)}
                  className="w-full rounded-lg border border-[#d9cbbd] p-2 text-xs bg-gray-50"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddIngredientToRecipe}
                  className="w-full sm:w-auto rounded-lg bg-[#4c1f08] px-4 py-2 text-xs font-bold text-white hover:bg-[#6b3215] cursor-pointer"
                >
                  + เพิ่มในเมนู
                </button>
              </div>
            </div>

            {/* รายการวัตถุดิบที่ถูกเลือกในเมนูนี้ */}
            <div className="mt-4">
              <h3 className="text-xs font-bold text-[#4c1f08] mb-2">
                วัตถุดิบที่รวมอยู่ใน Cooking Kit ชุดนี้ ({selectedIngredients.length} รายการ):
              </h3>

              {selectedIngredients.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d9cbbd] p-4 text-center text-xs text-[#7a5c4d]">
                  ยังไม่ได้เลือกวัตถุดิบจากคลัง — สามารถเลือกวัตถุดิบด้านบนเพื่อประกอบเมนู
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedIngredients.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-[#d9cbbd] bg-white p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#4c1f08]">{item.nameTh}</span>
                        <span className="rounded-md bg-[#f8ede3] px-2 py-0.5 text-[11px] font-semibold text-[#8b5e34]">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="text-[11px] text-[#7a5c4d]">
                          (📍 {item.region})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#7a5c4d]">
                          ~{Math.round((item.calories * item.quantity) / 100)} kcal
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(item.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="ลบวัตถุดิบนี้"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* สรุปคุณค่าทางโภชนาการที่คำนวณได้อัตโนมัติ */}
            {selectedIngredients.length > 0 && (
              <div className="mt-4 rounded-xl bg-white p-3 border border-[#d9cbbd]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4c1f08]">
                    📊 โภชนาการรวมที่คำนวณได้จากวัตถุดิบ:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        calories: String(calculatedNutrition.calories),
                      }))
                    }
                    className="text-[11px] font-bold text-[#8d593a] underline hover:text-[#4c1f08] cursor-pointer"
                  >
                    ใช้ค่าแคลอรีนี้ ({calculatedNutrition.calories} kcal)
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[#f8ede3] p-1.5">
                    <div className="font-bold text-[#4c1f08]">{calculatedNutrition.calories}</div>
                    <div className="text-[10px] text-[#7a5c4d]">แคลอรี (kcal)</div>
                  </div>
                  <div className="rounded-lg bg-[#fdfbf7] p-1.5 border">
                    <div className="font-bold text-[#4c1f08]">{calculatedNutrition.protein}g</div>
                    <div className="text-[10px] text-[#7a5c4d]">โปรตีน</div>
                  </div>
                  <div className="rounded-lg bg-[#fdfbf7] p-1.5 border">
                    <div className="font-bold text-[#4c1f08]">{calculatedNutrition.carbs}g</div>
                    <div className="text-[10px] text-[#7a5c4d]">คาร์บ</div>
                  </div>
                  <div className="rounded-lg bg-[#fdfbf7] p-1.5 border">
                    <div className="font-bold text-[#4c1f08]">{calculatedNutrition.fat}g</div>
                    <div className="text-[10px] text-[#7a5c4d]">ไขมัน</div>
                  </div>
                  <div className="rounded-lg bg-[#fdfbf7] p-1.5 border">
                    <div className="font-bold text-[#4c1f08]">{calculatedNutrition.sodium}mg</div>
                    <div className="text-[10px] text-[#7a5c4d]">โซเดียม</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────
              ส่วน 3: ภูมิภาค, ธาตุเจ้าเรือน และราคา/สต็อก
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* ภูมิภาคอาหาร */}
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

            {/* ธาตุเด่นประจำเมนู */}
            <div>
              <label className={labelClass}>
                ธาตุเจ้าเรือนที่เด่น (Elemental Affinity) <span className="text-red-500">*</span>
              </label>
              <select
                name="dominantElement"
                value={formData.dominantElement}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="ดิน">ธาตุดิน (Earth - บำรุงกล้ามเนื้อ กระดูก รสมัน/หวาน)</option>
                <option value="น้ำ">ธาตุน้ำ (Water - ปรับสมดุลของเหลว รสเปรี้ยว/ขม)</option>
                <option value="ลม">ธาตุลม (Wind - ช่วยระบบย่อย ขับลม รสเผ็ดร้อน)</option>
                <option value="ไฟ">ธาตุไฟ (Fire - เพิ่มการเผาผลาญ ความอบอุ่น รสขม/เย็น)</option>
              </select>
            </div>

            {/* ราคาขาย */}
            <div>
              <label className={labelClass}>
                ราคาขาย (บาท) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="เช่น 280"
                className={inputClass}
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* จำนวนสต็อกพร้อมส่ง */}
            <div>
              <label className={labelClass}>
                จำนวนชุดในสต็อก (Stock Quantity) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="เช่น 40"
                className={inputClass}
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
            </div>

            {/* วันที่เริ่มวางจำหน่าย */}
            <div>
              <label className={labelClass}>
                วันที่เริ่มวางขาย / ผลิต <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>

            {/* แคลอรี */}
            <div>
              <label className={labelClass}>พลังงานต่อชุด (kcal)</label>
              <input
                type="number"
                min="0"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="เช่น 380"
                className={inputClass}
              />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              ส่วน 4: คำอธิบาย, ประวัติ และขั้นตอนการปรุง
          ────────────────────────────────────────────────────────── */}
          {/* รายละเอียดเมนู */}
          <div>
            <label className={labelClass}>
              รายละเอียดเมนูอาหาร <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="อธิบายเกี่ยวกับรสชาติ เอกลักษณ์ สัมผัส หรือจุดเด่นของเมนูนี้..."
              className={inputClass}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* ประวัติความเป็นมา */}
          <div>
            <label className={labelClass}>ประวัติความเป็นมา / วัฒนธรรมอาหาร (History & Context)</label>
            <textarea
              name="history"
              rows="2"
              value={formData.history}
              onChange={handleChange}
              placeholder="เรื่องราวความเป็นมาของเมนูพื้นบ้าน หรือภูมิปัญญาอาหาร..."
              className={inputClass}
            />
          </div>

          {/* ข้อจำกัดทางอาหาร / โรคประจำตัว / การแพ้อาหาร (Food Restrictions) */}
          <div className="rounded-2xl border border-[#d9cbbd] bg-[#fdfbf7] p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-bold text-[#4c1f08] flex items-center gap-1.5">
                  <span className="text-base">🏷️</span>
                  <span>ข้อจำกัดทางอาหาร & โภชนาการเฉพาะ (Food Restrictions)</span>
                  <span className="text-xs text-[#8d593a] font-normal">(เลือกได้หลายแบบ ให้ลูกค้ากรองหาได้)</span>
                </label>
                <p className="text-[11px] text-[#7a5c4d] mt-0.5">
                  เลือกโรคประจำตัว, การแพ้อาหาร หรือประเภทอาหารที่เมนูนี้รองรับอย่างปลอดภัย
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#4c1f08] bg-white px-2.5 py-1 rounded-full border border-[#d9cbbd]">
                เลือกแล้ว {foodRestrictions.length} แท็ก
              </span>
            </div>

            {/* หมวดหมู่ให้เลือกแบบปุ่มคลิกหลายแท็ก */}
            <div className="space-y-3 mt-3">
              {Object.entries(RESTRICTION_CATEGORIES).map(([catKey, catInfo]) => {
                const itemsInCat = POPULAR_FOOD_RESTRICTIONS.filter((r) => r.category === catKey);
                return (
                  <div key={catKey}>
                    <div className="text-[11px] font-bold text-[#6f5647] mb-1.5 flex items-center gap-1">
                      <span>•</span>
                      <span>{catInfo.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {itemsInCat.map((item) => {
                        const isSelected = foodRestrictions.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setFoodRestrictions((prev) =>
                                isSelected
                                  ? prev.filter((id) => id !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                            className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                              isSelected
                                ? "bg-[#4c1f08] text-white shadow-xs scale-[1.02]"
                                : "bg-white border border-[#d9cbbd] text-[#4c1f08] hover:border-[#8d593a] hover:bg-[#f8ede3]"
                            }`}
                          >
                            <span>{isSelected ? "✓" : "+"}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* แท็กกำหนดเองเพิ่มเติม */}
            <div className="mt-4 pt-3 border-t border-[#e8dfd1]">
              <label className={labelClass}>
                แท็กเพิ่มเติมอื่นๆ (คั่นด้วยเครื่องหมายจุลภาค ,)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="เช่น เมนูล้านนาโบราณ, ไม่ใส่ผงชูรส, แคลเซียมสูง"
                className={inputClass}
              />
              {errors.tags && <p className="mt-1 text-xs text-red-500">{errors.tags}</p>}
            </div>
          </div>

          {/* ขั้นตอนการปรุงอาหาร */}
          <div>
            <label className={labelClass}>ขั้นตอนการปรุงอาหาร (Cooking Steps - บรรทัดละ 1 ขั้นตอน)</label>
            <textarea
              name="cookingSteps"
              rows="3"
              value={formData.cookingSteps}
              onChange={handleChange}
              placeholder={"1. เตรียมวัตถุดิบและล้างให้สะอาด\n2. ตั้งหม้อใส่น้ำพริกแกงและเคี่ยวกับเนื้อสัตว์จนเข้าเนื้อ\n3. ปรุงรสตามชอบพร้อมเสิร์ฟ"}
              className={inputClass}
            />
          </div>

          {/* ปุ่ม Submit & Cancel */}
          <div className="flex items-center gap-3 border-t border-[#f1ead7] pt-4">
            <button
              type="submit"
              className="rounded-xl bg-[#4c1f08] px-8 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] cursor-pointer"
            >
              {isEditMode ? "💾 บันทึกการแก้ไขเมนู" : "🍲 สร้างเมนู Cooking Kit ใหม่"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-xl bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 cursor-pointer"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
