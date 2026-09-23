import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CATEGORY_MAP, getUnitInfo, useIngredients } from "../../context/IngredientsContext.js";
import { regionMap, useProducts } from "../../context/ProductsContext.js";
import useToast from "../../hooks/useToast.js";
import {
  ELEMENTS,
  NUTRIENT_KEYS,
  calculateRecipeMetrics,
  toElementPercentages,
} from "../../utils/recipeCalculator.js";

const inputClass =
  "w-full rounded border border-[#f1ead7] p-2 text-sm focus:border-[#4c1f08] focus:outline-none focus:ring-2 focus:ring-[#f1ead7]";
const labelClass = "mb-1 block text-sm font-medium text-[#4c1f08]";

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

const DEFAULT_QUANTITY_G = 50;

function AdminRecipeBuilder() {
  const navigate = useNavigate();
  const toast = useToast();
  const { ingredients } = useIngredients();
  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [dishInfo, setDishInfo] = useState({
    name: "",
    region: "northern",
    price: "",
    servings: "2",
    description: "",
  });
  const [sourceDishId, setSourceDishId] = useState("");

  const availableIngredients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients.filter((item) => {
      if (item.isActive === false) return false;
      if (category && item.category !== category) return false;
      if (!q) return true;
      return (
        (item.nameTh && item.nameTh.toLowerCase().includes(q)) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(q))
      );
    });
  }, [ingredients, search, category]);

  const servings = Number(dishInfo.servings) || 1;

  const metrics = useMemo(
    () => calculateRecipeMetrics(selectedItems, servings),
    [selectedItems, servings],
  );

  const percentages = useMemo(
    () => toElementPercentages(metrics.elementScores),
    [metrics],
  );

  const producibleSets = useMemo(() => {
    if (selectedItems.length === 0) return null;
    let limit = Infinity;
    let limiter = null;
    selectedItems.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) return;
      const stock = Number(item.currentStockGrams) || 0;
      const sets = Math.floor(stock / qty);
      if (sets < limit) {
        limit = sets;
        limiter = item;
      }
    });
    return Number.isFinite(limit) ? { sets: limit, limiter } : null;
  }, [selectedItems]);

  const handleAddIngredient = (ingredient) => {
    if (selectedItems.some((item) => item._id === ingredient._id)) {
      toast.error(`"${ingredient.nameTh}" อยู่ในสูตรแล้ว`);
      return;
    }
    setSelectedItems((prev) => [
      ...prev,
      { ...ingredient, quantity: DEFAULT_QUANTITY_G },
    ]);
  };

  const handleQuantityChange = (id, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: value === "" ? "" : Number(value) } : item,
      ),
    );
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleDishChange = (event) => {
    const { name, value } = event.target;
    setDishInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadFromDish = (dishId) => {
    setSourceDishId(dishId);
    if (!dishId) return;

    const dish = products.find((product) => (product._id || product.id) === dishId);
    if (!dish || !Array.isArray(dish.recipe) || dish.recipe.length === 0) {
      toast.error("เมนูนี้ยังไม่มีข้อมูลสูตรวัตถุดิบให้โหลด");
      return;
    }

    const loaded = dish.recipe.map((item) => {
      const master = ingredients.find(
        (ing) => ing._id === (item.ingredientId || item._id),
      );
      return {
        ...(master || {}),
        ...item,
        _id: item.ingredientId || item._id,
        quantity: Number(item.quantity) || 0,
      };
    });

    setSelectedItems(loaded);
    setDishInfo((prev) => ({
      ...prev,
      name: dish.name || prev.name,
      region: dish.region || prev.region,
      price: String(dish.price ?? prev.price),
      servings: String(dish.servings ?? prev.servings),
      description: dish.description || prev.description,
    }));
    toast.success(`โหลดสูตรของ "${dish.name}" มาแล้ว ${loaded.length} รายการ`);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setSourceDishId("");
    setDishInfo({
      name: "",
      region: "northern",
      price: "",
      servings: "2",
      description: "",
    });
  };

  const handleUseRecipe = () => {
    if (selectedItems.length === 0) {
      toast.error("กรุณาเลือกวัตถุดิบอย่างน้อย 1 รายการ");
      return;
    }
    if (selectedItems.some((item) => !(Number(item.quantity) > 0))) {
      toast.error("กรุณาระบุปริมาณวัตถุดิบให้มากกว่า 0 ทุกรายการ");
      return;
    }

    const regionNameTh = regionMap[dishInfo.region] || "";
    const recipe = selectedItems.map((item) => ({
      ingredientId: item._id,
      nameTh: item.nameTh,
      nameEn: item.nameEn || "",
      category: item.category,
      categoryTh: item.categoryTh,
      quantity: Number(item.quantity),
      unit: getUnitInfo(item.unit).value,
      medicinalTaste: item.medicinalTaste,
      elements: item.elements || [],
      basisWeightG: Number(item.basisWeightG) || getUnitInfo(item.unit).defaultBasis,
      nutrientsPer100g: item.nutrientsPer100g || {},
    }));

    const recipeDraft = {
      name: dishInfo.name.trim(),
      region: dishInfo.region,
      regionNameTh,
      description: dishInfo.description.trim(),
      price: dishInfo.price,
      servings,
      calories: metrics.perServing.calories,

      ingredients: recipe.map((item) => `${item.nameTh} (${item.quantity} ${getUnitInfo(item.unit).short})`).join(", "),
      recipe,
      nutritionCache: {
        basisWeightUnit: "100g_ingredients",
        servings,
        totals: metrics.totals,
        perServing: metrics.perServing,
      },
      dominantElement: metrics.dominantElement,
      elementSuitability: metrics.elementSuitability,
      tags: [regionNameTh, `ธาตุ${metrics.dominantElement}`].filter(Boolean).join(", "),
    };

    navigate("/admin/products/new", { state: { recipeDraft } });
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4c1f08]">
            ออกแบบสูตรอาหาร &amp; คำนวณธาตุเจ้าเรือน
          </h1>
          <p className="mt-1 text-sm text-[#6b3215]">
            เลือกวัตถุดิบจากคลัง {ingredients.length} ชนิด ใส่ปริมาณตามหน่วยของวัตถุดิบแต่ละชนิด
            ระบบจะประมวลผลโภชนาการและธาตุตามรสยาให้อัตโนมัติ
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={sourceDishId}
            onChange={(event) => handleLoadFromDish(event.target.value)}
            className="rounded border border-[#f1ead7] p-2 text-sm text-[#4c1f08]"
          >
            <option value="">โหลดสูตรจากเมนูที่มีอยู่...</option>
            {products.map((product) => (
              <option key={product._id || product.id} value={product._id || product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer rounded-lg border border-[#4c1f08] px-4 py-2 text-sm font-medium text-[#4c1f08] transition hover:bg-[#f1ead7]"
          >
            ล้างสูตร
          </button>
        </div>
      </div>

      
      <div className="mb-6 rounded-lg border border-[#f1ead7] bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold text-[#4c1f08]">ข้อมูลเมนู</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="dish-name">
              ชื่อเมนู
            </label>
            <input
              id="dish-name"
              type="text"
              name="name"
              value={dishInfo.name}
              onChange={handleDishChange}
              placeholder="เช่น แกงฮังเลหมูสูตรล้านนา"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="dish-region">
              ภูมิภาค
            </label>
            <select
              id="dish-region"
              name="region"
              value={dishInfo.region}
              onChange={handleDishChange}
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
            <label className={labelClass} htmlFor="dish-price">
              ราคา (บาท)
            </label>
            <input
              id="dish-price"
              type="number"
              min="0"
              step="1"
              name="price"
              value={dishInfo.price}
              onChange={handleDishChange}
              placeholder="เช่น 189"
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass} htmlFor="dish-description">
            คำอธิบายเมนู
          </label>
          <textarea
            id="dish-description"
            name="description"
            rows="2"
            value={dishInfo.description}
            onChange={handleDishChange}
            placeholder="อธิบายเอกลักษณ์ รสชาติ หรือความเป็นมาของอาหาร"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        
        <section className="rounded-lg border border-[#f1ead7] bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-bold text-[#4c1f08]">
            1. เลือกวัตถุดิบในคลัง ({availableIngredients.length} รายการ)
          </h3>
          <div className="mb-3 space-y-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาวัตถุดิบ"
              className={inputClass}
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
            >
              <option value="">ทุกหมวดหมู่</option>
              {Object.entries(CATEGORY_MAP).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="max-h-[460px] space-y-1.5 overflow-y-auto pr-1">
            {availableIngredients.length === 0 ? (
              <p className="py-10 text-center text-xs text-[#6b3215]">
                ไม่พบวัตถุดิบที่ตรงกับเงื่อนไข
              </p>
            ) : (
              availableIngredients.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-2 rounded border border-[#f1ead7] p-2 hover:bg-[#fff8f5]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#4c1f08]">
                      {item.nameTh}
                    </p>
                    <p className="truncate text-xs text-[#6b3215]">
                      {item.medicinalTaste || "-"} · {(item.elements || []).join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddIngredient(item)}
                    className="shrink-0 cursor-pointer rounded bg-[#4c1f08] px-2.5 py-1 text-xs text-white transition hover:bg-[#6b3215]"
                  >
                    เพิ่ม
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        
        <section className="rounded-lg border border-[#f1ead7] bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-bold text-[#4c1f08]">
            2. วัตถุดิบในสูตร ({selectedItems.length} ชนิด)
          </h3>
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {selectedItems.length === 0 ? (
              <p className="py-20 text-center text-xs text-[#6b3215]">
                ยังไม่ได้เลือกวัตถุดิบ กดปุ่ม &quot;เพิ่ม&quot; จากคอลัมน์ซ้าย
              </p>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded border border-[#f1ead7] bg-[#fff8f5] p-2.5"
                >
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[#4c1f08]">{item.nameTh}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item._id)}
                      className="shrink-0 cursor-pointer rounded bg-red-600 px-2 py-0.5 text-xs text-white transition hover:bg-red-700"
                    >
                      ลบ
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step={item.unit === "piece" ? 1 : "any"}
                      value={item.quantity}
                      onChange={(event) =>
                        handleQuantityChange(item._id, event.target.value)
                      }
                      className="w-24 rounded border border-[#f1ead7] p-1.5 text-sm"
                    />
                    <span className="text-xs text-[#6b3215]">{getUnitInfo(item.unit).label}</span>
                    <span className="ml-auto text-xs text-[#6b3215]">
                      คลังเหลือ {item.currentStockGrams ?? "-"} {getUnitInfo(item.unit).short}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-3 border-t border-[#f1ead7] pt-3 text-sm text-[#6b3215]">
              <div className="flex justify-between">
                <span>น้ำหนักรวมทั้งสูตร</span>
                <span className="font-bold text-[#4c1f08]">{metrics.totalWeight} g</span>
              </div>
              {producibleSets && (
                <div className="mt-1 flex justify-between">
                  <span>ผลิตได้สูงสุด</span>
                  <span
                    className={`font-bold ${
                      producibleSets.sets === 0 ? "text-red-600" : "text-[#4c1f08]"
                    }`}
                  >
                    {producibleSets.sets} ชุด
                  </span>
                </div>
              )}
              {producibleSets?.limiter && (
                <p className="mt-1 text-xs">
                  วัตถุดิบที่จำกัดจำนวน: {producibleSets.limiter.nameTh}
                </p>
              )}
            </div>
          )}
        </section>

        
        <section className="rounded-lg border border-[#f1ead7] bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-bold text-[#4c1f08]">3. ผลการคำนวณ</h3>

          <div className="mb-4">
            <label className={labelClass} htmlFor="dish-servings">
              จำนวนที่เสิร์ฟ (ชุดละกี่ที่)
            </label>
            <input
              id="dish-servings"
              type="number"
              min="1"
              step="1"
              name="servings"
              value={dishInfo.servings}
              onChange={handleDishChange}
              className={inputClass}
            />
          </div>

          {selectedItems.length === 0 ? (
            <p className="py-20 text-center text-xs text-[#6b3215]">
              เพิ่มวัตถุดิบเพื่อเริ่มคำนวณธาตุและสารอาหาร
            </p>
          ) : (
            <>
              <div className="mb-4 rounded bg-[#fff8f5] p-3 text-center">
                <p className="text-xs text-[#6b3215]">ธาตุเด่นของเมนูนี้</p>
                <p className="text-2xl font-bold text-[#4c1f08]">
                  ธาตุ{metrics.dominantElement}
                </p>
                <p className="text-xs text-[#6b3215]">
                  เหมาะกับผู้มีธาตุ {metrics.elementSuitability.join(", ")}
                </p>
              </div>

              <div className="mb-4 space-y-2">
                {ELEMENTS.map((element) => (
                  <div key={element}>
                    <div className="mb-0.5 flex justify-between text-xs text-[#6b3215]">
                      <span>ธาตุ{element}</span>
                      <span>{percentages[element]}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1ead7]">
                      <div
                        className={`h-full ${ELEMENT_COLORS[element]} transition-all duration-300`}
                        style={{ width: `${percentages[element]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1ead7] text-xs text-[#6b3215]">
                    <th className="py-1 text-left">สารอาหาร</th>
                    <th className="py-1 text-right">รวมทั้งชุด</th>
                    <th className="py-1 text-right">ต่อเสิร์ฟ</th>
                  </tr>
                </thead>
                <tbody>
                  {NUTRIENT_KEYS.map((key) => (
                    <tr key={key} className="border-b border-[#f1ead7]/60">
                      <td className="py-1 text-[#6b3215]">{NUTRIENT_LABELS[key]}</td>
                      <td className="py-1 text-right text-[#6b3215]">
                        {metrics.totals[key]}
                      </td>
                      <td className="py-1 text-right font-medium text-[#4c1f08]">
                        {metrics.perServing[key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={handleUseRecipe}
                className="mt-5 w-full cursor-pointer rounded-lg bg-[#4c1f08] px-4 py-3 font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215]"
              >
                ใช้สูตรนี้สร้างเมนู
              </button>
              <p className="mt-2 text-center text-xs text-[#6b3215]">
                ระบบจะพาไปหน้าเพิ่มเมนู พร้อมเติมข้อมูลสูตรให้อัตโนมัติ
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminRecipeBuilder;
