import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CATEGORY_MAP, useIngredients } from "../../context/IngredientsContext.js";
import useToast from "../../hooks/useToast.js";
import {
  ELEMENTS,
  MEDICINAL_TASTES,
  NUTRIENT_KEYS,
  analyzeMedicinalTastes,
  calculateRecipeMetrics,
  getElementFromMedicinalTastes,
} from "../../utils/recipeCalculator.js";

import { getApiUrl, getAuthHeaders } from "../../utils/authHeader.js";
import { formatDate } from "../../utils/dateFormatter.js";
import DatePicker from "../../components/common/DatePicker.jsx";

const inputClass =
  "w-full rounded border border-[#f1ead7] p-2 focus:border-[#4c1f08] focus:outline-none focus:ring-2 focus:ring-[#f1ead7]";
const labelClass = "mb-1 block font-medium text-[#4c1f08]";

const NUTRIENT_LABELS = {
  calories: "แคลอรี (kcal)",
  carbs: "คาร์โบไฮเดรต (g)",
  sugar: "น้ำตาล (g)",
  fiber: "ใยอาหาร (g)",
  protein: "โปรตีน (g)",
  fat: "ไขมัน (g)",
  sodium: "โซเดียม (mg)",
};

const ELEMENT_COLORS = {
  ดิน: "bg-amber-700",
  น้ำ: "bg-sky-600",
  ลม: "bg-emerald-600",
  ไฟ: "bg-red-600",
};

// รสยา 10 รส พร้อมสรรพคุณย่อ (แสดงเป็นตัวเลือกเดียว ไม่แบ่งหมวดธาตุ)
const TASTE_OPTIONS = [
  { taste: "รสหวาน", hint: "ซึมซาบ บำรุงกล้ามเนื้อ" },
  { taste: "รสเปรี้ยว", hint: "กัดเสมหะ ฟอกโลหิต" },
  { taste: "รสเค็ม", hint: "ซึมซาบผิวหนัง รักษาเนื้อ" },
  { taste: "รสขม", hint: "แก้ทางโลหิตและดี" },
  { taste: "รสเผ็ดร้อน", hint: "แก้ลม ขับลม บำรุงไฟธาตุ" },
  { taste: "รสมัน", hint: "บำรุงเส้นเอ็น ไขข้อ" },
  { taste: "รสฝาด", hint: "สมานแผล คุมธาตุ" },
  { taste: "รสหอมเย็น", hint: "บำรุงหัวใจ ชื่นใจ" },
  { taste: "รสจืด", hint: "ขับปัสสาวะ ดับพิษร้อน" },
  { taste: "รสเมาเบื่อ", hint: "แก้พิษ แก้พยาธิ" },
];

const ELEMENT_THEMES = {
  ดิน: {
    name: "ธาตุดิน",
    title: "ปถวีธาตุ",
    color: "text-amber-900",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    gradient: "from-amber-500/20 via-amber-100/50 to-amber-50/80 border-amber-300",
    iconBg: "bg-amber-700 text-white shadow-amber-700/20",
    ring: "ring-amber-500/20",
    desc: "บำรุงโครงสร้าง เนื้อ เอ็น ข้อกระดูก",
  },
  น้ำ: {
    name: "ธาตุน้ำ",
    title: "อาโปธาตุ",
    color: "text-sky-900",
    badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
    gradient: "from-sky-500/20 via-sky-100/50 to-sky-50/80 border-sky-300",
    iconBg: "bg-sky-600 text-white shadow-sky-600/20",
    ring: "ring-sky-500/20",
    desc: "บำรุงเลือด น้ำดี ของเหลว ขับเสมหะ",
  },
  ลม: {
    name: "ธาตุลม",
    title: "วาโยธาตุ",
    color: "text-emerald-900",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
    gradient: "from-emerald-500/20 via-emerald-100/50 to-emerald-50/80 border-emerald-300",
    iconBg: "bg-emerald-600 text-white shadow-emerald-600/20",
    ring: "ring-emerald-500/20",
    desc: "กระจายลม กระตุ้นไหลเวียน บำรุงหัวใจ",
  },
  ไฟ: {
    name: "ธาตุไฟ",
    title: "เตโชธาตุ",
    color: "text-rose-900",
    badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
    gradient: "from-rose-500/20 via-rose-100/50 to-rose-50/80 border-rose-300",
    iconBg: "bg-rose-600 text-white shadow-rose-600/20",
    ring: "ring-rose-500/20",
    desc: "ปรับสมดุลความร้อน ดับพิษไข้ ถอนพิษร้อน",
  },
};

function ElementIcon({ element, className = "h-10 w-10" }) {
  const paths = {
    ดิน: "m8 3 4 8 5-5 5 15H2L8 3z",
    น้ำ: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
    ลม: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2",
    ไฟ: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={paths[element] || paths.ดิน} /></svg>;
}

function emptyNutrientForm() {
  return NUTRIENT_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {});
}

export const REGIONAL_CONFIG = [
  { key: "north", label: "ภาคเหนือ", icon: "⛰️", color: "border-emerald-300 bg-emerald-50/50 text-emerald-900" },
  { key: "northeast", label: "ภาคอีสาน", icon: "🌾", color: "border-amber-300 bg-amber-50/50 text-amber-900" },
  { key: "central", label: "ภาคกลาง", icon: "🏛️", color: "border-sky-300 bg-sky-50/50 text-sky-900" },
  { key: "south", label: "ภาคใต้", icon: "🌊", color: "border-teal-300 bg-teal-50/50 text-teal-900" },
];

function createEmptyForm() {
  return {
    nameTh: "",
    nameEn: "",
    scientificName: "",
    category: "vegetable",
    imageUrl: "",
    imageId: null,
    medicinalTastes: [],
    elements: [],
    nutrientsPer100g: emptyNutrientForm(),
    basisWeightG: "100",
    regionalStocks: {
      north: "2500",
      northeast: "2500",
      central: "2500",
      south: "2500",
    },
    currentStockGrams: "10000",
    lowStockThresholdGrams: "1000",
    expiryDate: "",
    isActive: true,
  };
}

function parseTastes(raw) {
  const text = String(raw || "");
  return MEDICINAL_TASTES.filter((taste) => text.includes(taste.replace("รส", "")));
}

function IngredientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { getIngredientById, addIngredient, updateIngredient } = useIngredients();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(createEmptyForm);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const apiUrl = getApiUrl();

  const handleUploadImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)");
      return;
    }

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
          imageId: data.fileId || data.id || null,
        }));
        toast.success("อัปโหลดรูปภาพวัตถุดิบขึ้นระบบเรียบร้อย! ✨");
      } else {
        toast.error(data.message || "อัปโหลดภาพไม่สำเร็จ");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดภาพ");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUploadImageFile(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleUploadImageFile(file);
  };

  useEffect(() => {
    if (!isEditMode) return;

    const item = getIngredientById(id);
    if (!item) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setFormData({
      ...createEmptyForm(),
      ...item,
      medicinalTastes: parseTastes(item.medicinalTaste),
      elements: Array.isArray(item.elements) ? item.elements : [],
      nutrientsPer100g: NUTRIENT_KEYS.reduce(
        (acc, key) => ({ ...acc, [key]: String(item.nutrientsPer100g?.[key] ?? "") }),
        {},
      ),
      basisWeightG: String(item.basisWeightG ?? "100"),
      regionalStocks: {
        north: String(item.regionalStocks?.north ?? 0),
        northeast: String(item.regionalStocks?.northeast ?? 0),
        central: String(item.regionalStocks?.central !== undefined ? item.regionalStocks.central : (item.currentStockGrams ?? 0)),
        south: String(item.regionalStocks?.south ?? 0),
      },
      currentStockGrams: String(
        ((item.regionalStocks?.north ?? 0) +
          (item.regionalStocks?.northeast ?? 0) +
          (item.regionalStocks?.central !== undefined ? item.regionalStocks.central : (item.currentStockGrams ?? 0)) +
          (item.regionalStocks?.south ?? 0)) || item.currentStockGrams || "0"
      ),
      lowStockThresholdGrams: String(item.lowStockThresholdGrams ?? ""),
      expiryDate: item.expiryDate || "",
    });
  }, [id, isEditMode, getIngredientById]);

  const clearError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };
  const handleRegionalStockChange = (regionKey, val) => {
    setFormData((prev) => {
      const nextReg = { ...(prev.regionalStocks || {}), [regionKey]: val };
      const sum =
        (Number(nextReg.north) || 0) +
        (Number(nextReg.northeast) || 0) +
        (Number(nextReg.central) || 0) +
        (Number(nextReg.south) || 0);
      return {
        ...prev,
        regionalStocks: nextReg,
        currentStockGrams: String(sum),
      };
    });
    clearError(`regionalStock_${regionKey}`);
  };


  const handleNutrientChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      nutrientsPer100g: { ...prev.nutrientsPer100g, [name]: value },
    }));
    clearError("nutrientsPer100g");
  };

  const toggleInList = (field, value) => {
    setFormData((prev) => {
      const list = prev[field] || [];
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
    clearError(field);
  };

  const preview = useMemo(() => {
    const derivedElement = getElementFromMedicinalTastes(formData.medicinalTastes);
    const candidate = {
      category: formData.category,
      medicinalTaste: formData.medicinalTastes.join("/"),
      elements: [derivedElement],
      basisWeightG: Number(formData.basisWeightG) || 100,
      nutrientsPer100g: NUTRIENT_KEYS.reduce(
        (acc, key) => ({ ...acc, [key]: Number(formData.nutrientsPer100g[key]) || 0 }),
        {},
      ),
      quantity: 100,
    };
    return calculateRecipeMetrics([candidate], 1);
  }, [formData]);

  // ผลวิเคราะห์รสยา → ธาตุ (ถ้าไม่เข้าสูตร เช่น ธาตุคะแนนเท่ากัน จะบันทึกไม่ได้)
  const tasteAnalysis = useMemo(
    () => analyzeMedicinalTastes(formData.medicinalTastes),
    [formData.medicinalTastes],
  );
  const canSave = tasteAnalysis.status === "ok";

  // จำรสล่าสุดที่กด เพื่อเล่น animation feedback
  const [lastTasteTap, setLastTasteTap] = useState(null);
  const handleToggleTaste = (taste) => {
    const added = !formData.medicinalTastes.includes(taste);
    toggleInList("medicinalTastes", taste);
    clearError("medicinalTastes");
    setLastTasteTap((prev) => ({ taste, added, n: (prev?.n || 0) + 1 }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameTh || formData.nameTh.trim().length < 2) {
      newErrors.nameTh = "ชื่อวัตถุดิบต้องไม่เป็นค่าว่าง และมีความยาวอย่างน้อย 2 ตัวอักษร";
    }

    if (!formData.category || !CATEGORY_MAP[formData.category]) {
      newErrors.category = "กรุณาเลือกหมวดหมู่วัตถุดิบ";
    }

    if (tasteAnalysis.status === "empty") {
      newErrors.medicinalTastes = "กรุณาเลือกรสยาอย่างน้อย 1 รส";
    } else if (tasteAnalysis.status === "conflict") {
      newErrors.medicinalTastes = `รสที่เลือกให้ธาตุ${tasteAnalysis.tiedElements.join(" / ธาตุ")} เท่ากัน ระบุธาตุเด่นไม่ได้ กรุณาปรับรสยา`;
    } else if (tasteAnalysis.status === "unknown") {
      newErrors.medicinalTastes = "รสยาที่เลือกไม่ตรงกับสูตรคำนวณธาตุ";
    }

    const badNutrients = NUTRIENT_KEYS.filter((key) => {
      const raw = formData.nutrientsPer100g[key];
      const num = Number(raw);
      return raw === "" || Number.isNaN(num) || num < 0;
    });
    if (badNutrients.length > 0) {
      newErrors.nutrientsPer100g = `ค่าสารอาหารต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป (ตรวจ: ${badNutrients
        .map((key) => NUTRIENT_LABELS[key])
        .join(", ")})`;
    }

    const basis = Number(formData.basisWeightG);
    if (formData.basisWeightG === "" || Number.isNaN(basis) || basis <= 0) {
      newErrors.basisWeightG = "น้ำหนักอ้างอิงต้องเป็นตัวเลขมากกว่า 0";
    }

    [
      ["currentStockGrams", "จำนวนสต็อก (กรัม)"],
      ["lowStockThresholdGrams", "จุดเตือนสต็อก (กรัม)"],
    ].forEach(([field, label]) => {
      const num = Number(formData[field]);
      if (
        formData[field] === "" ||
        Number.isNaN(num) ||
        num < 0 ||
        !Number.isInteger(num)
      ) {
        newErrors[field] = `${label} ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป`;
      }
    });

    if (formData.expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.expiryDate);
      selected.setHours(0, 0, 0, 0);
      if (Number.isNaN(selected.getTime()) || selected < today) {
        newErrors.expiryDate = "วันหมดอายุของล็อตวัตถุดิบต้องไม่เป็นวันที่ในอดีต";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("กรุณาตรวจสอบข้อมูลในฟอร์มให้ถูกต้อง");
      return;
    }

    const payload = {
      nameTh: formData.nameTh.trim(),
      nameEn: formData.nameEn.trim(),
      scientificName: formData.scientificName.trim(),
      category: formData.category,
      categoryTh: CATEGORY_MAP[formData.category],
      medicinalTaste: formData.medicinalTastes.join("/"),
      elements: [preview.dominantElement],
      basisWeightG: Number(formData.basisWeightG) || 100,
      nutrientsPer100g: {
        calories: Number(formData.nutrientsPer100g.calories) || 0,
        carb: Number(formData.nutrientsPer100g.carbs) || 0,
        carbs: Number(formData.nutrientsPer100g.carbs) || 0,
        sugar: Number(formData.nutrientsPer100g.sugar) || 0,
        fiber: Number(formData.nutrientsPer100g.fiber) || 0,
        protein: Number(formData.nutrientsPer100g.protein) || 0,
        fat: Number(formData.nutrientsPer100g.fat) || 0,
        sodium: Number(formData.nutrientsPer100g.sodium) || 0,
      },
      nutritionPer100G: {
        calories: Number(formData.nutrientsPer100g.calories) || 0,
        carb: Number(formData.nutrientsPer100g.carbs) || 0,
        carbs: Number(formData.nutrientsPer100g.carbs) || 0,
        sugar: Number(formData.nutrientsPer100g.sugar) || 0,
        fiber: Number(formData.nutrientsPer100g.fiber) || 0,
        protein: Number(formData.nutrientsPer100g.protein) || 0,
        fat: Number(formData.nutrientsPer100g.fat) || 0,
        sodium: Number(formData.nutrientsPer100g.sodium) || 0,
      },
      regionalStocks: {
        north: Math.max(0, Number(formData.regionalStocks?.north) || 0),
        northeast: Math.max(0, Number(formData.regionalStocks?.northeast) || 0),
        central: Math.max(0, Number(formData.regionalStocks?.central) || 0),
        south: Math.max(0, Number(formData.regionalStocks?.south) || 0),
      },
      stockQuantity: (
        Math.max(0, Number(formData.regionalStocks?.north) || 0) +
        Math.max(0, Number(formData.regionalStocks?.northeast) || 0) +
        Math.max(0, Number(formData.regionalStocks?.central) || 0) +
        Math.max(0, Number(formData.regionalStocks?.south) || 0)
      ),
      currentStockGrams: (
        Math.max(0, Number(formData.regionalStocks?.north) || 0) +
        Math.max(0, Number(formData.regionalStocks?.northeast) || 0) +
        Math.max(0, Number(formData.regionalStocks?.central) || 0) +
        Math.max(0, Number(formData.regionalStocks?.south) || 0)
      ),
      unit: "g",
      lowStockThresholdGrams: Number(formData.lowStockThresholdGrams) || 0,
      expiryDate: formData.expiryDate || undefined,
      imageUrl: formData.imageUrl || "",
      imageId: formData.imageId || null,
      isActive: formData.isActive !== false,
    };

    if (isEditMode) {
      await updateIngredient(id, payload);
      toast.success("แก้ไขข้อมูลวัตถุดิบสำเร็จ");
    } else {
      await addIngredient(payload);
      toast.success("เพิ่มวัตถุดิบใหม่เข้าคลังสำเร็จ");
    }

    navigate("/admin/ingredients");
  };

  if (notFound) {
    return (
      <div className="mx-auto my-8 max-w-3xl rounded-lg border border-[#f1ead7] bg-white p-6 text-center shadow-md">
        <p className="text-[#4c1f08]">ไม่พบวัตถุดิบรหัส {id} ในคลัง</p>
        <button
          type="button"
          onClick={() => navigate("/admin/ingredients")}
          className="mt-4 rounded-lg bg-[#4c1f08] px-6 py-2 font-medium text-white transition hover:bg-[#6b3215]"
        >
          กลับไปหน้าคลังวัตถุดิบ
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-24 mb-8 grid max-w-6xl gap-6 px-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-[#f1ead7] bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-[#4c1f08]">
          {isEditMode ? "แก้ไขข้อมูลวัตถุดิบ" : "เพิ่มวัตถุดิบ"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ส่วนอัปโหลดรูปภาพวัตถุดิบ (Drag & Drop + File Selector) */}
          <div>
            <label className={labelClass}>
              รูปภาพวัตถุดิบ <span className="text-xs font-normal text-stone-500">(ไม่บังคับ - จะมีหรือไม่มีรูปภาพก็ได้)</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleImageDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragging
                  ? "border-[#4c1f08] bg-[#f8f5f0]"
                  : "border-[#f1ead7] hover:border-[#4c1f08] bg-[#faf7f2]/50"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="hidden"
              />
              {formData.imageUrl ? (
                <div className="relative group text-center" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={formData.imageUrl}
                    alt="Ingredient preview"
                    className="w-32 h-32 object-cover rounded-xl shadow-md border-2 border-white mx-auto ring-1 ring-[#e8dfd1]"
                  />
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-[#4c1f08] text-white px-3 py-1 rounded-md hover:bg-[#6b3215] transition"
                    >
                      เปลี่ยนรูป
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "", imageId: null }))}
                      className="text-xs bg-rose-600 text-white px-3 py-1 rounded-md hover:bg-rose-700 transition"
                    >
                      ลบรูป
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-3 border-[#4c1f08] border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm font-medium text-[#4c1f08]">กำลังอัปโหลดรูปภาพขึ้นระบบ...</p>
                    </div>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-10 h-10 text-[#8d593a] mx-auto mb-2">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <p className="text-sm font-semibold text-[#4c1f08]">
                        ลากและวางรูปภาพที่นี่ หรือ <span className="underline">คลิกเพื่อเลือกไฟล์</span>
                      </p>
                      <p className="text-xs text-[#8d593a]/80 mt-1">รองรับไฟล์ PNG, JPG, WEBP (อัปโหลดเข้า MongoDB GridFS จริง)</p>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="หรือกรอก URL รูปภาพโดยตรง (https://...)"
                className="w-full text-xs rounded border border-[#f1ead7] p-2 focus:border-[#4c1f08] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="nameTh">
              ชื่อวัตถุดิบ (ภาษาไทย) <span className="text-red-500">*</span>
            </label>
            <input
              id="nameTh"
              type="text"
              name="nameTh"
              value={formData.nameTh}
              onChange={handleChange}
              placeholder="เช่น ตะไคร้ซอย, กระเทียมสด"
              className={inputClass}
            />
            {errors.nameTh && <p className="mt-1 text-sm text-red-500">{errors.nameTh}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="nameEn">
                ชื่อภาษาอังกฤษ
              </label>
              <input
                id="nameEn"
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="เช่น Sliced Lemongrass"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="scientificName">
                ชื่อวิทยาศาสตร์
              </label>
              <input
                id="scientificName"
                type="text"
                name="scientificName"
                value={formData.scientificName}
                onChange={handleChange}
                placeholder="เช่น Cymbopogon citratus"
                className={inputClass}
              />
            </div>
          </div>


          <div>
            <label className={labelClass} htmlFor="category">
              หมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
            >
              {Object.entries(CATEGORY_MAP).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>


          {/* ──────────────────────────────────────────────────────────
              รสยา (Medicinal Tastes) — เลือกเป็นรสอย่างเดียว
              ธาตุเจ้าเรือนคำนวณอัตโนมัติจากรสที่เลือก (getElementFromMedicinalTastes)
              ────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className={labelClass}>
                  รสยาของวัตถุดิบ <span className="text-red-500">*</span>
                </span>
                <p className="text-xs text-[#8d593a]">
                  แตะเลือกรสที่วัตถุดิบนี้มี (เลือกได้หลายรส) ระบบจะคำนวณธาตุให้อัตโนมัติ
                </p>
              </div>
              <span
                key={formData.medicinalTastes.length}
                className="element-result-in rounded-full bg-[#f5ece2] px-2.5 py-1 text-xs font-bold text-[#4c1f08]"
              >
                เลือกแล้ว {formData.medicinalTastes.length} รส
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TASTE_OPTIONS.map(({ taste, hint }) => {
                const isChecked = formData.medicinalTastes.includes(taste);
                const isLastTap = lastTasteTap?.taste === taste;
                return (
                  <button
                    // เปลี่ยน key ทุกครั้งที่กด เพื่อให้ animation เล่นซ้ำได้
                    key={isLastTap ? `${taste}-${lastTasteTap.n}` : taste}
                    type="button"
                    aria-pressed={isChecked}
                    onClick={() => handleToggleTaste(taste)}
                    className={`relative flex min-h-[64px] cursor-pointer flex-col items-start justify-center rounded-2xl border-2 px-3.5 py-2.5 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4c1f08]/40 ${
                      isLastTap ? "taste-pop" : ""
                    } ${
                      isChecked
                        ? "border-[#4c1f08] bg-[#4c1f08] text-white shadow-md"
                        : "border-[#f1ead7] bg-white text-[#4c1f08] hover:border-[#d9c4ae] hover:bg-[#fffaf5] active:scale-[.97]"
                    }`}
                  >
                    {/* วงแหวนกระเพื่อมตอนกด */}
                    {isLastTap && (
                      <span className="taste-ring pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#c49758]" />
                    )}
                    {/* ป้ายลอยบอกผลการกด */}
                    {isLastTap && (
                      <span
                        className={`taste-float pointer-events-none absolute left-1/2 top-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${
                          lastTasteTap.added ? "bg-[#c49758] text-white" : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {lastTasteTap.added ? `+ ${taste}` : `− ${taste}`}
                      </span>
                    )}

                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-extrabold">{taste}</span>
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-black ${
                          isChecked ? "taste-check-in border-white bg-white text-[#4c1f08]" : "border-[#e2d5c6] text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    </span>
                    <span className={`mt-0.5 text-[11px] leading-snug ${isChecked ? "text-white/75" : "text-[#8d593a]"}`}>
                      {hint}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.medicinalTastes && tasteAnalysis.status === "empty" && (
              <p className="text-sm font-medium text-red-500">{errors.medicinalTastes}</p>
            )}

            {/* ผลคำนวณธาตุ (อ่านอย่างเดียว) — นับจำนวนรสของแต่ละธาตุ ธาตุที่มากที่สุดเพียงธาตุเดียวคือธาตุเด่น */}
            <div
              className={`rounded-2xl border p-3 transition-colors duration-300 ${
                tasteAnalysis.status === "conflict" || tasteAnalysis.status === "unknown"
                  ? "border-amber-300 bg-amber-50"
                  : "border-[#f1ead7] bg-[#fffaf5]"
              }`}
            >
              {tasteAnalysis.status === "empty" && (
                <p className="text-xs text-[#8d593a]">
                  ยังไม่ได้เลือกรส — เลือกอย่างน้อย 1 รสเพื่อคำนวณธาตุของวัตถุดิบ
                </p>
              )}

              {(tasteAnalysis.status === "conflict" || tasteAnalysis.status === "unknown") && (
                <div key={`warn-${tasteAnalysis.tiedElements.join()}`} className="element-result-in flex items-start gap-2.5" role="alert">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-lg font-black text-white shadow-xs">!</span>
                  <div className="text-xs text-amber-900">
                    <p className="text-sm font-extrabold">ยังคำนวณธาตุไม่ได้ — บันทึกวัตถุดิบไม่ได้</p>
                    {tasteAnalysis.status === "conflict" ? (
                      <p className="mt-0.5 leading-relaxed">
                        รสที่เลือกให้ <strong>ธาตุ{tasteAnalysis.tiedElements.join(" และ ธาตุ")}</strong> เท่ากัน
                        วัตถุดิบ 1 ชนิดต้องมีธาตุเด่นเพียง 1 ธาตุ — เพิ่มรสของธาตุที่เด่นกว่า หรือเอารสที่ไม่ใช่รสหลักออก
                      </p>
                    ) : (
                      <p className="mt-0.5">รสยาที่เลือกไม่ตรงกับสูตรคำนวณธาตุ</p>
                    )}
                  </div>
                </div>
              )}

              {tasteAnalysis.status === "ok" && (
                <div key={`ok-${tasteAnalysis.element}`} className="element-result-in flex items-center gap-2.5">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-xs ${ELEMENT_COLORS[tasteAnalysis.element]}`}>
                    <ElementIcon element={tasteAnalysis.element} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] text-[#8d593a]">คำนวณได้เป็น</p>
                    <p className="text-sm font-extrabold text-[#4c1f08]">ธาตุ{tasteAnalysis.element}</p>
                  </div>
                </div>
              )}

              {tasteAnalysis.status !== "empty" && (
                <div className="mt-3 grid grid-cols-4 gap-2 border-t border-black/5 pt-2.5">
                  {ELEMENTS.map((key) => {
                    const count = tasteAnalysis.counts[key] || 0;
                    const isTop = tasteAnalysis.element === key || tasteAnalysis.tiedElements.includes(key);
                    return (
                      <div
                        key={key}
                        className={`rounded-lg px-2 py-1.5 text-center transition-colors ${
                          isTop ? "bg-white shadow-2xs ring-1 ring-[#4c1f08]/15" : ""
                        }`}
                      >
                        <p className={`text-[11px] ${isTop ? "font-bold text-[#4c1f08]" : "text-stone-500"}`}>ธาตุ{key}</p>
                        <p className={`text-sm font-extrabold ${count > 0 ? "text-[#4c1f08]" : "text-stone-300"}`}>
                          {count} <span className="text-[10px] font-medium">รส</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>


          <div>
            <span className={labelClass}>
              คุณค่าทางโภชนาการต่อ {formData.basisWeightG || 100} กรัม{" "}
              <span className="text-red-500">*</span>
            </span>
            <div className="grid grid-cols-2 gap-3 rounded border border-[#f1ead7] p-3 md:grid-cols-4">
              {NUTRIENT_KEYS.map((key) => (
                <div key={key}>
                  <label
                    className="mb-1 block text-xs text-[#6b3215]"
                    htmlFor={`nutrient-${key}`}
                  >
                    {NUTRIENT_LABELS[key]}
                  </label>
                  <input
                    id={`nutrient-${key}`}
                    type="number"
                    min="0"
                    step="0.1"
                    name={key}
                    value={formData.nutrientsPer100g[key]}
                    onChange={handleNutrientChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
            {errors.nutrientsPer100g && (
              <p className="mt-1 text-sm text-red-500">{errors.nutrientsPer100g}</p>
            )}
          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="basisWeightG">
                น้ำหนักอ้างอิงของค่าสารอาหาร (กรัม){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="basisWeightG"
                type="number"
                min="1"
                step="1"
                name="basisWeightG"
                value={formData.basisWeightG}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.basisWeightG && (
                <p className="mt-1 text-sm text-red-500">{errors.basisWeightG}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="expiryDate">
                วันหมดอายุของล็อตปัจจุบัน
              </label>
              <DatePicker
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
              )}
            </div>
          </div>


          {/* ส่วนระบุปริมาณสต็อกแยกตาม 4 ภูมิภาค */}
          <div className="rounded-2xl border border-[#e8ded4] bg-[#fbf9f5] p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#4c1f08]">
                  📦 ปริมาณสต็อกแยกตาม 4 ภูมิภาค <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-[#7a5c4d]">
                  ระบุสต็อกวัตถุดิบจริงที่มีในแต่ละภาค เพื่อให้ระบบคำนวณจำนวนชุดอาหารตามภาคนั้นๆ ได้จริง
                </p>
              </div>
              <div className="rounded-xl border border-[#d9cbbd] bg-white px-3 py-1.5 shadow-2xs">
                <span className="text-xs text-[#8d593a]">สต็อกรวมทุกภูมิภาค: </span>
                <span className="text-sm font-black text-[#4c1f08]">
                  {Number(formData.currentStockGrams || 0).toLocaleString()} กรัม
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {REGIONAL_CONFIG.map(({ key, label, icon, color }) => (
                <div key={key} className={`rounded-xl border p-3 ${color} bg-white shadow-2xs`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor={`reg-stock-${key}`} className="flex items-center gap-1.5 text-xs font-bold">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </label>
                    <span className="text-[10px] text-stone-500 font-medium">กรัม (g)</span>
                  </div>
                  <input
                    id={`reg-stock-${key}`}
                    type="number"
                    min="0"
                    step="1"
                    value={formData.regionalStocks?.[key] ?? 0}
                    onChange={(e) => handleRegionalStockChange(key, e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm font-semibold text-[#4c1f08] focus:border-[#4c1f08] focus:outline-none focus:ring-1 focus:ring-[#4c1f08]"
                  />
                  {errors[`regionalStock_${key}`] && (
                    <p className="mt-1 text-[11px] text-red-500">{errors[`regionalStock_${key}`]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#f1ead7] flex flex-wrap items-center justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <label className={labelClass} htmlFor="lowStockThresholdGrams">
                  จุดเตือนให้สั่งซื้อเพิ่มรวม (กรัม) <span className="text-red-500">*</span>
                </label>
                <input
                  id="lowStockThresholdGrams"
                  type="number"
                  min="0"
                  step="1"
                  name="lowStockThresholdGrams"
                  value={formData.lowStockThresholdGrams}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.lowStockThresholdGrams && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lowStockThresholdGrams}
                  </p>
                )}
              </div>
              <div className="text-xs text-[#7a5c4d] sm:text-right">
                💡 เมื่อสต็อกรวมลดลงต่ำกว่าจุดนี้ ระบบจะแสดงสถานะ &quot;ใกล้หมด&quot; ในคลังวัตถุดิบ
              </div>
            </div>
          </div>





          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={!canSave}
              title={canSave ? undefined : "ปรับรสยาให้คำนวณธาตุได้ก่อน จึงจะบันทึกได้"}
              className={`rounded-lg px-6 py-2 font-medium shadow-sm transition duration-200 ${
                canSave
                  ? "bg-[#4c1f08] text-white hover:-translate-y-0.5 hover:bg-[#6b3215]"
                  : "cursor-not-allowed bg-stone-300 text-stone-500 shadow-none"
              }`}
            >
              {isEditMode ? "บันทึกการแก้ไข" : "เพิ่มเข้าคลัง"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/ingredients")}
              className="rounded-lg bg-gray-300 px-6 py-2 font-medium text-gray-800 transition hover:bg-gray-400"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>


      <aside className="h-fit rounded-2xl border border-[#f1ead7] bg-white p-5 shadow-sm lg:sticky lg:top-28">
        <div className="flex items-center justify-between pb-3 border-b border-[#f5ede3] mb-4">
          <div>
            <h2 className="font-bold text-[#4c1f08] text-base">พรีวิววัตถุดิบ (ต่อ 100g)</h2>
            <p className="text-xs text-[#8d593a]">ประเมินธาตุเดี่ยวจากรสยา & สรุปโภชนาการ</p>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#f4ece3] text-[#6b3215]">
            1 ชนิด : 1 ธาตุ
          </span>
        </div>

        {/* ──────────────────────────────────────────────────────────
            การ์ดแสดงผลธาตุเดี่ยว (Single Element Card) พร้อม Transition
            ────────────────────────────────────────────────────────── */}
        {(() => {
          // ยังไม่เลือกรส / รสไม่เข้าสูตร → ไม่แสดงธาตุ (เดิมขึ้นธาตุดินเสมอ ทำให้สับสน)
          if (tasteAnalysis.status !== "ok") {
            const isWarn = tasteAnalysis.status !== "empty";
            return (
              <div
                className={`mb-4 rounded-2xl border-2 border-dashed p-4 text-center text-xs ${
                  isWarn ? "border-amber-300 bg-amber-50 text-amber-900" : "border-[#e8ddd0] bg-[#fffaf5] text-[#8d593a]"
                }`}
              >
                <p className="text-sm font-extrabold">{isWarn ? "ระบุธาตุเด่นไม่ได้" : "ยังไม่ทราบธาตุ"}</p>
                <p className="mt-1">
                  {isWarn ? "ปรับรสยาให้มีธาตุเด่นเพียง 1 ธาตุ" : "เลือกรสยาเพื่อคำนวณธาตุของวัตถุดิบ"}
                </p>
              </div>
            );
          }
          const domElem = tasteAnalysis.element;
          const theme = ELEMENT_THEMES[domElem] || ELEMENT_THEMES.ดิน;
          const tastesText = formData.medicinalTastes.join(" · ") || "ยังไม่ได้เลือกรสยา";
          const hasTastes = formData.medicinalTastes.length > 0;

          return (
            <div
              key={domElem}
              className={`relative overflow-hidden rounded-2xl border-2 p-4 mb-4 transition-all duration-300 transform bg-gradient-to-br ${theme.gradient} shadow-xs ring-4 ${theme.ring}`}
            >
              <div className="flex items-start gap-3.5">
                {/* SVG Icon ประจำธาตุเด่น */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 hover:scale-105 ${theme.iconBg}`}
                >
                  <ElementIcon element={domElem} className="w-7 h-7" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-[#8d593a]">{theme.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                      ธาตุเดี่ยว 100%
                    </span>
                  </div>

                  <h3 className={`text-xl font-extrabold tracking-tight ${theme.color} leading-snug mt-0.5`}>
                    {theme.name}
                  </h3>

                  <p className="text-xs text-[#6b3215]/90 mt-1 line-clamp-1 font-medium">
                    {theme.desc}
                  </p>
                </div>
              </div>

              {/* แถบรสยาที่ส่งผลต่อธาตุนี้ */}
              <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">คำนวณจากรสยา:</span>
                <span className={`font-bold truncate max-w-[150px] text-right ${hasTastes ? "text-[#4c1f08]" : "text-stone-400 italic"}`}>
                  {tastesText}
                </span>
              </div>
            </div>
          );
        })()}

        {/* ──────────────────────────────────────────────────────────
            ตารางสรุปคุณค่าทางโภชนาการ (Clean & Compact)
            ────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-[#f5ece3] bg-[#fffbf8] p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0e4d7] text-xs font-bold text-[#4c1f08]">
            <span>สารอาหาร</span>
            <span>ปริมาณ / 100g</span>
          </div>

          <dl className="space-y-1.5 text-xs text-[#6b3215]">
            {NUTRIENT_KEYS.map((key) => {
              const val = preview.totals[key] || 0;
              const isCalories = key === "calories";
              return (
                <div
                  key={key}
                  className={`flex justify-between items-center py-0.5 ${
                    isCalories ? "font-bold text-[#4c1f08] border-b border-[#f0e4d7]/60 pb-1" : ""
                  }`}
                >
                  <dt className="text-stone-600">{NUTRIENT_LABELS[key]}</dt>
                  <dd className={`font-medium ${isCalories ? "text-sm text-[#4c1f08]" : "text-stone-800"}`}>
                    {val}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </aside>
    </div>
  );
}

export default IngredientForm;
