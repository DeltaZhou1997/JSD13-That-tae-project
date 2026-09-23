
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";


import {
  getTodayInputValue,
  regionMap,
  useProducts,
} from "../../context/ProductsContext.js";
import { getUnitInfo, roundQty } from "../../context/IngredientsContext.js";
import useToast from "../../hooks/useToast.js";

// ปริมาณเริ่มต้นต่อชุดตามหน่วยของวัตถุดิบ
const DEFAULT_QTY_BY_UNIT = { g: 50, ml: 50, kg: 0.1, l: 0.1, piece: 1 };
import {
  POPULAR_FOOD_RESTRICTIONS,
  RESTRICTION_CATEGORIES,
} from "../../constants/foodRestrictions.js";
import { getAuthHeaders } from "../../utils/authHeader.js";
import { formatDate } from "../../utils/dateFormatter.js";
import DatePicker from "../../components/common/DatePicker.jsx";

// Preset ภาพตัวอย่างอาหารไทยยอดนิยม
const PRESET_DISH_IMAGES = [
  { label: "ต้มยำกุ้ง", url: "https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600&auto=format&fit=crop&q=80" },
  { label: "แกงฮังเล", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80" },
  { label: "ข้าวซอยไก่", url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80" },
  { label: "ส้มตำไทย", url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80" },
  { label: "คั่วกลิ้ง", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" },
  { label: "ผัดไทยกุ้งสด", url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80" },
];

export const REGION_MAP_TO_INGREDIENT = {
  northern: "north",
  northeastern: "northeast",
  central: "central",
  southern: "south",
  fusion: "central", // ไทยฟิวชั่น ภาคกลางซัพพอร์ตเสมอ
};

export const REGION_TH_TITLES = {
  north: "ภาคเหนือ",
  northeast: "ภาคอีสาน",
  central: "ภาคกลาง",
  south: "ภาคใต้",
};

export const ELEMENT_ORDER = ["ดิน", "น้ำ", "ลม", "ไฟ"];

export const ELEMENT_CONFIG = {
  ดิน: {
    th: "ธาตุดิน",
    en: "Earth",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    badgeDarkClass: "bg-amber-900/40 text-amber-200 border-amber-600/40",
    accentColor: "#b58145",
    description: "บำรุงกล้ามเนื้อ กระดูก และเนื้อเยื่อ (รสมัน, หวาน, ฝาด, เค็ม)",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  น้ำ: {
    th: "ธาตุน้ำ",
    en: "Water",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
    badgeDarkClass: "bg-blue-900/40 text-blue-200 border-blue-600/40",
    accentColor: "#4b8daa",
    description: "ปรับสมดุลของเหลว เลือด น้ำเหลือง (รสเปรี้ยว, หวาน, ขม)",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  ลม: {
    th: "ธาตุลม",
    en: "Wind",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    badgeDarkClass: "bg-emerald-900/40 text-emerald-200 border-emerald-600/40",
    accentColor: "#5d9c76",
    description: "ช่วยระบบย่อยอาหาร ขับลม การไหลเวียน (รสเผ็ดร้อน, หอมเย็น)",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
  },
  ไฟ: {
    th: "ธาตุไฟ",
    en: "Fire",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
    badgeDarkClass: "bg-rose-900/40 text-rose-200 border-rose-600/40",
    accentColor: "#c65f52",
    description: "เพิ่มการเผาผลาญ ให้ความอบอุ่น ขจัดความเย็น (รสขม, เย็น, จืด)",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
};

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

  const [foodRestrictions, setFoodRestrictions] = useState([]);

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
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  // computed fields จาก RecipeBuilder (สารอาหาร, elements, recipe)
  const [computed, setComputed] = useState(null);
  const fileInputRef = useRef(null);

  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

  // ฟังก์ชันอัปโหลดรูปภาพเมนูอาหารขึ้น MongoDB GridFS
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
          imageId: data.fileId || data.id || "",
        }));
        setErrors((prev) => ({ ...prev, imageUrl: "" }));
        toast.success("อัปโหลดรูปภาพเมนูอาหารเข้า MongoDB GridFS สำเร็จ! ✨");
      } else {
        toast.error(data.message || "อัปโหลดภาพไม่สำเร็จ");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดภาพ");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUploadImageFile(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleUploadImageFile(file);
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
    } else {
      setFoodRestrictions([]);
    }

    // ถ้ามี recipe ใน product ให้โหลดเข้ามาใน selectedIngredients
    if (Array.isArray(product.recipe) && product.recipe.length > 0) {
      setSelectedIngredients(
        product.recipe.map((r) => ({
          id: r.ingredientId || r._id || r.id,
          nameTh: r.nameTh || "วัตถุดิบ",
          quantity: Number(r.quantity) || 100,
          unit: r.unit || "g",
          basis: Number(r.basisWeightG) || getUnitInfo(r.unit).defaultBasis,
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
      setPickerQty(DEFAULT_QTY_BY_UNIT[found.unit] ?? 50);
    }
  };

  // 4. เพิ่มวัตถุดิบลงในสูตรอาหาร
  const handleAddIngredientToRecipe = () => {
    if (!pickerIngId) return;
    const target = availableIngredients.find((i) => (i._id || i.id) === pickerIngId);
    if (!target) return;

    const targetId = target._id || target.id;
    const existingIndex = selectedIngredients.findIndex((s) => s.id === targetId);

    // รองรับทศนิยม (เช่น 0.2 kg) — เดิม Math.max(1, ...) ทำให้ 0.2 kg กลายเป็น 1 kg
    const qty = Number(pickerQty) > 0 ? roundQty(Number(pickerQty)) : (DEFAULT_QTY_BY_UNIT[target.unit] ?? 50);

    if (existingIndex >= 0) {
      // อัปเดตจำนวนถ้ามีอยู่แล้ว
      setSelectedIngredients((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: roundQty(item.quantity + qty) } : item
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
          // ปริมาณอ้างอิงของค่าสารอาหาร (หน่วยเดียวกับ unit)
          basis: Number(target.basisWeightG) || getUnitInfo(target.unit).defaultBasis,
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
      // คิดสัดส่วนตามปริมาณอ้างอิงของวัตถุดิบ (เช่น ต่อ 100 g หรือ ต่อ 1 ชิ้น)
      const ratio = (Number(item.quantity) || 0) / (item.basis || getUnitInfo(item.unit).defaultBasis);
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

  // คำนวณสัดส่วนธาตุเจ้าเรือน (Elemental Breakdown & Dominant Element)
  // ใช้วิธีคำนวณเดียวกับ RecipePieChart.jsx ในหน้า MenuDetail.jsx 100%
  // จำนวนชุดที่ทำได้จากสต็อกวัตถุดิบในภาคของเมนู (สูตรเดียวกับ Product.calculateAvailableKits ฝั่ง Server)
  // ปริมาณในสูตรกับสต็อกใช้หน่วยของวัตถุดิบตัวเดียวกัน (g / kg / ml / l / ชิ้น)
  const calculatedStockMetrics = useMemo(() => {
    const targetRegion = REGION_MAP_TO_INGREDIENT[formData.region] || "central";
    const targetRegionNameTh = REGION_TH_TITLES[targetRegion];

    const breakdown = selectedIngredients.map((item) => {
      const ing = availableIngredients.find((i) => (i._id || i.id) === item.id);
      const availableInRegion = Number(
        ing?.regionalStocks?.[targetRegion] ?? ing?.stockQuantity ?? ing?.currentStockGrams ?? 0,
      );
      const requiredQty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      return {
        id: item.id,
        nameTh: item.nameTh,
        unit: getUnitInfo(ing?.unit || item.unit).short,
        requiredQty,
        availableInRegion,
        possibleSets: Math.max(0, Math.floor(availableInRegion / requiredQty)),
      };
    });

    const bottleneck = breakdown.reduce(
      (min, b) => (!min || b.possibleSets < min.possibleSets ? b : min),
      null,
    );

    return {
      targetRegion,
      targetRegionNameTh,
      calculatedStock: bottleneck ? bottleneck.possibleSets : 0,
      bottleneck,
      breakdown,
    };
  }, [selectedIngredients, availableIngredients, formData.region]);

  const calculatedElementMetrics = useMemo(() => {
    const scores = { ดิน: 0, น้ำ: 0, ลม: 0, ไฟ: 0 };

    selectedIngredients.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) return;

      const elements = Array.isArray(item.elements)
        ? item.elements.filter((el) => ELEMENT_ORDER.includes(el))
        : [];

      if (elements.length === 0) return;

      // เฉลี่ยน้ำหนักตามจำนวนธาตุเพื่อไม่ให้นับคะแนนซ้ำ (Split evenly across elements)
      const share = qty / elements.length;
      elements.forEach((el) => {
        scores[el] += share;
      });
    });

    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);

    const slices = ELEMENT_ORDER.map((el) => ({
      element: el,
      name: `ธาตุ${el}`,
      value: scores[el],
      percentage: totalScore > 0 ? (scores[el] / totalScore) * 100 : 0,
      color: ELEMENT_CONFIG[el]?.accentColor || "#b58145",
    })).sort((a, b) => b.value - a.value);

    // ธาตุที่มีคะแนนรวมสูงสุด
    const dominant = totalScore > 0 ? slices[0].element : (formData.dominantElement || "ดิน");
    const suitability = slices.filter((s) => s.value > 0).map((s) => s.element);

    return {
      scores,
      totalScore,
      slices,
      dominantElement: dominant,
      elementSuitability: suitability.length > 0 ? suitability : [dominant],
    };
  }, [selectedIngredients, formData.dominantElement]);

  // ซิงค์ dominantElement ที่คำนวณได้อัตโนมัติลงใน formData
  useEffect(() => {
    if (calculatedElementMetrics.totalScore > 0) {
      setFormData((prev) => {
        if (prev.dominantElement !== calculatedElementMetrics.dominantElement) {
          return { ...prev, dominantElement: calculatedElementMetrics.dominantElement };
        }
        return prev;
      });
    }
  }, [calculatedElementMetrics.dominantElement, calculatedElementMetrics.totalScore]);

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

    // จำนวนชุดถูกคำนวณอัตโนมัติจากสต็อกวัตถุดิบในภาคนั้นๆ ไม่ต้องตรวจสอบ error การพิมพ์

    if (!formData.date) {
      newErrors.date = "กรุณาระบุวันที่เริ่มวางจำหน่าย";
    }

    if (splitTags(formData.tags).length === 0) {
      newErrors.tags = "ต้องระบุอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, GERD Friendly, ธาตุไฟ)";
    }

    if (!formData.imageUrl && !formData.imageId) {
      newErrors.imageUrl = "กรุณาอัปโหลดรูปภาพเมนูอาหาร (เมนูอาหารจำเป็นต้องมีรูปภาพ)";
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

    // บันทึกธาตุเด่นที่คำนวณได้จากวัตถุดิบ (สอดคล้องกับ MenuDetail.jsx)
    const dominantElementToSave =
      calculatedElementMetrics.totalScore > 0
        ? calculatedElementMetrics.dominantElement
        : (formData.dominantElement || "ดิน");

    const payload = {
      ...formData,
      ...(computed || {}),
      dominantElement: dominantElementToSave,
      elementSuitability: calculatedElementMetrics.elementSuitability,
      name: formData.name.trim(),
      nameTh: formData.name.trim(),
      nameEn: formData.nameEn.trim(),
      price: Number(formData.price),
      quantity: calculatedStockMetrics.calculatedStock,
      stock: calculatedStockMetrics.calculatedStock,
      calories: formData.calories === "" ? calculatedNutrition.calories : Number(formData.calories),
      foodRestrictions: foodRestrictions,
      tags: [
        ...new Set([
          ...splitTags(formData.tags),
          `ธาตุ${dominantElementToSave}`,
          regionMap[formData.region] || formData.regionNameTh,
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
        basisWeightG: s.basis || getUnitInfo(s.unit).defaultBasis,
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

  const activeElement = formData.dominantElement || "ดิน";
  const activeElementConfig = ELEMENT_CONFIG[activeElement] || ELEMENT_CONFIG["ดิน"];

  return (
    <div className="mx-auto my-8 max-w-7xl px-4 sm:px-6 lg:px-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* คอลัมน์ซ้าย: ฟอร์มหลักกรอกข้อมูล */}
        <div className="lg:col-span-7 xl:col-span-8">
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

                {/* ช่องอัปโหลดรูปภาพอาหาร (จำเป็นต้องมี - Drag & Drop / File Selector / URL) */}
                <div className="mt-4">
                  <label className={labelClass}>
                    รูปภาพเมนูอาหาร <span className="text-rose-600 font-bold">* (จำเป็นต้องมีรูปภาพอาหาร)</span>
                  </label>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleImageDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragging
                      ? "border-[#4c1f08] bg-[#f8f5f0]"
                      : errors.imageUrl
                        ? "border-rose-400 bg-rose-50/40 hover:border-rose-600"
                        : "border-[#d9cbbd] hover:border-[#4c1f08] bg-white"
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />

                    {formData.imageUrl ? (
                      <div className="relative group text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-44 h-32 rounded-xl overflow-hidden shadow-md mx-auto border-2 border-[#4c1f08]/20">
                          <img
                            src={formData.imageUrl}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/180x120?text=Invalid+Image";
                            }}
                          />
                        </div>
                        <div className="mt-2.5 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs bg-[#4c1f08] text-white px-3 py-1.5 rounded-lg hover:bg-[#6b3215] font-semibold transition shadow-sm"
                          >
                            เปลี่ยนรูป
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, imageUrl: "", imageId: "" }));
                              setErrors((prev) => ({ ...prev, imageUrl: "กรุณาอัปโหลดรูปภาพเมนูอาหาร (เมนูอาหารจำเป็นต้องมีรูปภาพ)" }));
                            }}
                            className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 font-semibold transition shadow-sm"
                          >
                            ลบรูป
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center py-2">
                            <div className="w-9 h-9 border-3 border-[#4c1f08] border-t-transparent rounded-full animate-spin mb-2" />
                            <p className="text-sm font-bold text-[#4c1f08]">กำลังอัปโหลดรูปภาพเมนูเข้า MongoDB GridFS...</p>
                            <span className="text-xs text-stone-500">กรุณารอสักครู่</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-[#f8f5f0] text-[#4c1f08] flex items-center justify-center mx-auto mb-2 border border-[#d9cbbd]">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                            </div>
                            <p className="text-sm font-bold text-[#4c1f08]">
                              ลากและวางรูปภาพเมนูอาหารที่นี่ หรือ <span className="underline text-amber-800">คลิกเพื่อเลือกไฟล์</span>
                            </p>
                            <p className="text-xs text-[#7a5c4d] mt-1">
                              รองรับ PNG, JPG, WEBP
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {errors.imageUrl && (
                    <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.imageUrl}
                    </p>
                  )}



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
                      min="0"
                      step={pickerUnit === "piece" ? 1 : "any"}
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
                              ~{Math.round((item.calories * item.quantity) / (item.basis || getUnitInfo(item.unit).defaultBasis))} kcal
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

                {/* ธาตุเด่นประจำเมนู — แสดงผลลัพธ์ที่คำนวณได้อัตโนมัติ */}
                <div>
                  <label className={labelClass}>
                    ธาตุเจ้าเรือนที่เด่น (คำนวณอัตโนมัติจากสูตร) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-[#d9cbbd] bg-white p-2.5 h-[42px]">
                    {ELEMENT_CONFIG[formData.dominantElement || "ดิน"] && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border shadow-2xs ${ELEMENT_CONFIG[formData.dominantElement || "ดิน"].badgeClass}`}>
                        {ELEMENT_CONFIG[formData.dominantElement || "ดิน"].svg}
                        <span>{ELEMENT_CONFIG[formData.dominantElement || "ดิน"].th}</span>
                      </span>
                    )}
                    <span className="text-xs text-[#7a5c4d]">
                      {calculatedElementMetrics.totalScore > 0
                        ? `(คำนวณได้สัดส่วนสูงสุด ${calculatedElementMetrics.slices[0]?.percentage.toFixed(1)}%)`
                        : "(ค่าเริ่มต้น — เลือกวัตถุดิบเพื่อคำนวณ)"}
                    </span>
                  </div>
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

                {/* จำนวนสต็อกพร้อมส่ง - คำนวณอัตโนมัติตามสต็อกวัตถุดิบจริงในภาคนั้นๆ */}
                <div className="rounded-2xl border border-[#d9cbbd] bg-[#fbf9f5] p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#4c1f08] flex items-center gap-1.5">
                      <span>📦</span>
                      <span>จำนวนชุดพร้อมจำหน่าย (คำนวณอัตโนมัติ)</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#8d593a] bg-white border border-[#e8ded4] px-2.5 py-1 rounded-full shadow-2xs">
                      📍 สต็อกคลัง: {calculatedStockMetrics.targetRegionNameTh}
                      {formData.region === "fusion" && " (ไทยฟิวชั่น ใช้วัตถุดิบภาคกลาง)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-1">
                    <div className="flex items-baseline gap-1.5 bg-white border border-[#e8ded4] rounded-xl px-4 py-2 shadow-inner">
                      <span className="text-3xl font-black text-[#4c1f08]">
                        {calculatedStockMetrics.calculatedStock.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-[#7a5c4d]">ชุด</span>
                    </div>

                    <div className="flex-1 text-xs">
                      {selectedIngredients.length === 0 ? (
                        <p className="text-amber-800 font-medium">
                          ⚠️ ยังไม่ได้เลือกวัตถุดิบ — เพิ่มวัตถุดิบในสูตรด้านล่าง เพื่อให้ระบบคำนวณจำนวนชุดที่ผลิตได้
                        </p>
                      ) : calculatedStockMetrics.bottleneck ? (
                        <div>
                          <p className="font-bold text-[#4c1f08]">
                            จำกัดโดย: <span className="text-rose-700 underline font-extrabold">{calculatedStockMetrics.bottleneck.nameTh}</span>
                          </p>
                          <p className="text-[#7a5c4d] text-[11px] mt-0.5">
                            ใน{calculatedStockMetrics.targetRegionNameTh} มี {calculatedStockMetrics.bottleneck.availableInRegion.toLocaleString()} {calculatedStockMetrics.bottleneck.unit} (ใช้ {calculatedStockMetrics.bottleneck.requiredQty} {calculatedStockMetrics.bottleneck.unit}/ชุด) = ทำได้ {calculatedStockMetrics.bottleneck.possibleSets} ชุด
                          </p>
                        </div>
                      ) : (
                        <p className="text-emerald-700 font-medium">
                          ✓ วัตถุดิบทุกตัวพร้อมใช้งาน
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ตารางย่อยแสดงสต็อกแต่ละวัตถุดิบในภาคนั้น */}
                  {calculatedStockMetrics.breakdown.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#f1ead7]">
                      <details className="text-xs group">
                        <summary className="cursor-pointer font-bold text-[#8d593a] hover:text-[#4c1f08] flex items-center justify-between">
                          <span>🔍 แจกแจงสต็อกใน{calculatedStockMetrics.targetRegionNameTh} ทั้ง {calculatedStockMetrics.breakdown.length} รายการ</span>
                          <span className="text-[10px] text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {calculatedStockMetrics.breakdown.map((b) => (
                            <div
                              key={b.id}
                              className={`flex items-center justify-between p-1.5 rounded-lg border text-[11px] ${
                                b.possibleSets === calculatedStockMetrics.calculatedStock
                                  ? "bg-rose-50 border-rose-200 text-rose-900 font-bold"
                                  : "bg-white border-stone-100 text-stone-700"
                              }`}
                            >
                              <span>
                                {b.nameTh} (ใช้ {b.requiredQty} {b.unit})
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-stone-500">
                                  คลังมี: {b.availableInRegion} {b.unit}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  b.possibleSets === 0 ? "bg-red-100 text-red-700" : "bg-[#f5ece4] text-[#4c1f08]"
                                }`}>
                                  ทำได้ {b.possibleSets} ชุด
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>

                {/* วันที่เริ่มวางจำหน่าย */}
                <div>
                  <label className={labelClass}>
                    วันที่เริ่มวางขาย / ผลิต <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
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
                                className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none ${isSelected
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

        {/* คอลัมน์ขวา: แถบพรีวิวสด Sticky ปรับให้พอดี viewport และไม่โดน Navbar ทับ */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[96px] lg:max-h-[calc(100vh-112px)] lg:overflow-y-auto space-y-3 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-stone-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Header พรีวิว */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="text-xs font-bold text-[#4c1f08] uppercase tracking-wide">
                ตัวอย่างเมนู
              </h3>
            </div>

          </div>

          {/* 1. ตัวอย่าง ProductCard (ดีไซน์เดียวกับหน้ารายการเมนู กระชับ ไม่กินพื้นที่) */}
          <div className="rounded-2xl border border-[#d4c5b0] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* ภาพอาหาร + Badges ขอบซ้ายบน */}
            <div className="w-full h-36 overflow-hidden relative bg-[#f0e6d8]">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || "ตัวอย่างเมนู"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-[#8d593a] bg-[#faf6f0]">
                  <svg className="w-8 h-8 mb-1 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[11px] font-medium text-stone-500">ยังไม่มีภาพอาหาร</span>
                </div>
              )}

              {/* Badges ขอบซ้ายบน: ภูมิภาค + ธาตุเด่น */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap pointer-events-none">
                <span className="backdrop-blur-md bg-black/60 text-white border border-white/20 rounded-full px-2 py-0.5 text-[9px] font-medium shadow-sm">
                  {regionMap[formData.region] || formData.regionNameTh || "ภาคเหนือ"}
                </span>

                {activeElementConfig && (
                  <span
                    className={`backdrop-blur-md rounded-full px-2 py-0.5 text-[9px] font-bold flex items-center gap-1 shadow-sm border select-none ${activeElementConfig.badgeClass}`}
                  >
                    <span className="shrink-0">{activeElementConfig.svg}</span>
                    <span>{activeElementConfig.th}</span>
                  </span>
                )}
              </div>
            </div>

            {/* ข้อมูลเมนู */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold text-[#3b2a1a] line-clamp-1">
                  {formData.name || "ชื่อเมนูอาหารใหม่"}
                </h4>
                <span className="text-xs font-black text-[#8b5e34] shrink-0">
                  ฿{Number(formData.price || 0).toLocaleString("th-TH")}
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200 shrink-0">
                  {calculatedStockMetrics.calculatedStock} ชุด
                </span>
              </div>

              <p className="text-[11px] text-stone-500 mb-2 line-clamp-1">
                {formData.description || "คำอธิบายรสชาติ เอกลักษณ์ หรือจุดเด่นของเมนู..."}
              </p>

              {/* แถบแท็กอาหาร & วันที่เริ่มวางขาย */}
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1 overflow-hidden">
                  {foodRestrictions.slice(0, 2).map((r) => {
                    const item = POPULAR_FOOD_RESTRICTIONS.find((p) => p.id === r);
                    return (
                      <span
                        key={r}
                        className="rounded bg-[#f6ede5] text-[#8d593a] px-1.5 py-0.5 font-semibold truncate max-w-[100px]"
                      >
                        {item?.shortLabel || r.replace(/_/g, " ")}
                      </span>
                    );
                  })}
                  {foodRestrictions.length > 2 && (
                    <span className="text-[#8d593a] font-bold">+{foodRestrictions.length - 2}</span>
                  )}
                </div>

                <span className="text-stone-400 font-medium shrink-0">
                  {formData.calories || calculatedNutrition.calories || 0} kcal
                </span>
              </div>
            </div>
          </div>

          {/* 2. สรุปผลการวิเคราะห์ธาตุ & สารอาหาร (Visual-First & Compact All-in-One) */}
          <div className="rounded-2xl border border-[#ebe4dc] bg-white p-3.5 shadow-xs space-y-3">
            {/* หัวข้อสัดส่วนธาตุ */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#8b5e34]"></span>
                  <h4 className="text-xs font-bold text-stone-900">
                    สัดส่วนธาตุเจ้าเรือน
                  </h4>
                </div>
                {activeElementConfig && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${activeElementConfig.badgeClass}`}>
                    {activeElementConfig.th}
                  </span>
                )}
              </div>

              {/* หลอดสัดส่วน 4 ธาตุ */}
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden flex mb-2">
                {calculatedElementMetrics.slices.map((slice) =>
                  slice.percentage > 0 ? (
                    <div
                      key={slice.element}
                      style={{
                        width: `${slice.percentage}%`,
                        backgroundColor: slice.color,
                      }}
                      title={`${slice.name}: ${slice.percentage.toFixed(1)}%`}
                      className="h-full transition-all duration-300"
                    />
                  ) : null
                )}
              </div>

              {/* รายการ 4 ธาตุแบบมินิมอล */}
              <div className="grid grid-cols-4 gap-1 text-center">
                {ELEMENT_ORDER.map((el) => {
                  const slice = calculatedElementMetrics.slices.find((s) => s.element === el);
                  const pct = slice ? slice.percentage : 0;
                  const cfg = ELEMENT_CONFIG[el];
                  const isDominant = (formData.dominantElement || "ดิน") === el;
                  return (
                    <div
                      key={el}
                      className={`rounded-lg p-1 text-[10px] border transition-colors ${isDominant
                        ? "bg-amber-50 border-amber-300/80 font-bold text-[#8b5e34]"
                        : "bg-[#faf8f5] border-stone-100 font-medium text-stone-600"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ backgroundColor: cfg?.accentColor || "#888" }}
                        />
                        <span>{cfg?.th}</span>
                      </div>
                      <div className="font-extrabold mt-0.5">{pct.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* แถบสรุปสารอาหาร Cooking Kit */}
            <div className="pt-2.5 border-t border-stone-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 mb-1.5">
                <span>คุณค่าทางโภชนาการ</span>
                <span className="text-stone-400 font-normal">
                  {selectedIngredients.length} วัตถุดิบในชุด
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-[#faf8f5] rounded-lg py-1 px-1 border border-stone-100">
                  <span className="block text-[9px] text-stone-400">พลังงาน</span>
                  <span className="text-[11px] font-black text-[#8b5e34]">
                    {formData.calories || calculatedNutrition.calories || 0}
                  </span>
                  <span className="block text-[8px] text-stone-400">kcal</span>
                </div>
                <div className="bg-[#faf8f5] rounded-lg py-1 px-1 border border-stone-100">
                  <span className="block text-[9px] text-stone-400">โปรตีน</span>
                  <span className="text-[11px] font-black text-emerald-700">
                    {calculatedNutrition.protein}
                  </span>
                  <span className="block text-[8px] text-stone-400">g</span>
                </div>
                <div className="bg-[#faf8f5] rounded-lg py-1 px-1 border border-stone-100">
                  <span className="block text-[9px] text-stone-400">คาร์บ</span>
                  <span className="text-[11px] font-black text-orange-700">
                    {calculatedNutrition.carbs}
                  </span>
                  <span className="block text-[8px] text-stone-400">g</span>
                </div>
                <div className="bg-[#faf8f5] rounded-lg py-1 px-1 border border-stone-100">
                  <span className="block text-[9px] text-stone-400">ไขมัน</span>
                  <span className="text-[11px] font-black text-stone-700">
                    {calculatedNutrition.fat}
                  </span>
                  <span className="block text-[8px] text-stone-400">g</span>
                </div>
              </div>
              <div className="text-center text-[9px] text-stone-400 mt-1">
                โซเดียม: <strong className="text-stone-600">{calculatedNutrition.sodium} mg</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}