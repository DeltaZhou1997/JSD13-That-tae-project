import mongoose from "mongoose";

export const INGREDIENT_CATEGORIES = {
  meat: "เนื้อสัตว์ & โปรตีน",
  poultry: "สัตวปีก",
  seafood: "อาหารทะเล",
  plantprotein: "โปรตีนจากพืช",
  vegetable: "ผัก & พืชสมุนไพร",
  seasoning_spice: "เครื่องปรุง & เครืองเทศ",
  seasoning: "เครื่องปรุงรส",
  herb_spice: "สมุนไพร & เครื่องเทศ",
  carb: "แป้ง & คาร์โบไฮเดรต",
  dairy: "นม",
  egg: "ไข่",
  other: "อื่นๆ",
};

export const MEDICINAL_TASTES = [
  "ฝาด",
  "หวาน",
  "มัน",
  "เค็ม",
  "เปรี้ยว",
  "ขม",
  "เผ็ดร้อน",
  "หอมเย็น",
  "เมาเบื่อ",
  "จืด",
];

export const ELEMENTS = [
  "ดิน",
  "น้ำ",
  "ลม",
  "ไฟ",
  "earth",
  "water",
  "wind",
  "fire",
];

export const INGREDIENT_UNIT = [
  "g", "kg", "ml", "l", "piece"
]

export const REGION = {
  north: "เหนือ",
  central: "กลาง",
  south: "ใต้",
  northeast: "อีสาน",
};

const nutrientSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0, min: 0 },
    carb: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    sugar: { type: Number, default: 0, min: 0 },
    fiber: { type: Number, default: 0, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    sodium: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const ingredientSchema = new mongoose.Schema({
  nameTh: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  nameEn: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: Object.keys(INGREDIENT_CATEGORIES),
      message: "หมวดหมู่ไม่ถูกต้อง",
    },
  },
  categoryTh: {
    type: String,
    trim: true,
  },
  medicinalTaste: {
    type: String,
    required: [true, "กรุณาระบุรสยาอย่างน้อย 1 รส"],
    trim: true,
  },
  elements: {
    type: [
      {
        type: String,
        enum: {
          values: ELEMENTS,
          message:
            "{VALUE} ไม่ใช่ธาตุเจ้าเรือนที่ถูกต้อง (ต้องเป็น ดิน, น้ำ, ลม, หรือ ไฟ)",
        },
      },
    ],
    required: [true, "กรุณาระบุธาตุเจ้าเรือนอย่างน้อย 1 ธาตุ"],
    validate: {
      validator: function (arr) {
        // ตรวจสอบว่าต้องเป็น Array และมีข้อมูลอย่างน้อย 1 ตัว
        return Array.isArray(arr) && arr.length > 0;
      },
      message: "ต้องระบุธาตุเจ้าเรือนอย่างน้อย 1 ธาตุ",
    },
  },
  // ปริมาณอ้างอิงของค่าสารอาหาร (หน่วยเดียวกับ unit เช่น 100 g, 0.1 kg, 1 piece)
  basisWeightG: {
    type: Number,
    default: 100,
    min: 0.001,
  },
  nutritionPer100G: {
    type: nutrientSchema,
    default: () => ({}),
  },
  nutrientsPer100g: {
    type: nutrientSchema,
    default: () => ({}),
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  // alias ที่ frontend form ใช้ (เก็บเป็น gram)
  currentStockGrams: {
    type: Number,
    default: 0,
    min: 0,
  },
  // ปริมาณสต็อกแยกตาม 4 ภูมิภาคหลัก (north, northeast, central, south)
  regionalStocks: {
    north: { type: Number, default: 0, min: 0 },
    northeast: { type: Number, default: 0, min: 0 },
    central: { type: Number, default: 0, min: 0 },
    south: { type: Number, default: 0, min: 0 },
  },
  lowStockThresholdGrams: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: {
      values: INGREDIENT_UNIT,
      message: "หน่วยต้องตรงตามมาตรฐาน g / kg / ml / l / piece",
    },
    default: "g",
    trim: true,
  },
  pricePerUnit: {
    type: Number,
    default: 1,
    min: 1,
  },
  // วัตถุดิบ 1 ชนิดสามารถมีได้หลายภูมิภาค (เช่น ข่า ตะไคร้ มีทั้ง เหนือ กลาง ใต้ อีสาน)
  regions: [
    {
      type: String,
      enum: {
        values: [...Object.keys(REGION), "all"],
        message: "ภูมิภาคไม่ถูกต้อง",
      },
    },
  ],
  region: {
    type: String,
    enum: {
      values: [...Object.keys(REGION), "all"],
      message: "ภูมิภาคไม่ถูกต้อง",
    },
    default: "all",
  },
  regionNameTh: {
    type: String,
    trim: true,
  },
  // รูปภาพวัตถุดิบ — ไม่บังคับ (optional)
  imageUrl: {
    type: String,
    default: "",
    trim: true,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "images.files",
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Middleware auto-fill categoryTh, sync regions, sync stock fields และ sync สารอาหาร ก่อน validate
ingredientSchema.pre("validate", function () {
  if (this.category && !this.categoryTh) {
    this.categoryTh = INGREDIENT_CATEGORIES[this.category] || "อื่น ๆ";
  }

  // Sync regionalStocks กับ total stock
  if (this.regionalStocks) {
    const north = Math.max(0, Number(this.regionalStocks.north) || 0);
    const northeast = Math.max(0, Number(this.regionalStocks.northeast) || 0);
    const central = Math.max(0, Number(this.regionalStocks.central) || 0);
    const south = Math.max(0, Number(this.regionalStocks.south) || 0);
    this.regionalStocks = { north, northeast, central, south };

    const totalFromRegions = north + northeast + central + south;
    const currentTotal = Number(this.currentStockGrams ?? this.stockQuantity ?? 0);

    // ถ้ายอดรวมจาก 4 ภาคมากกว่า 0 หรือมีการส่ง regionalStocks มา ให้ใช้ยอดรวมของภาคเป็นหลัก
    if (totalFromRegions > 0 || (this.currentStockGrams === 0 && this.stockQuantity === 0) || this.isModified("regionalStocks")) {
      this.currentStockGrams = totalFromRegions;
      this.stockQuantity = totalFromRegions;
    } else if (currentTotal > 0 && totalFromRegions === 0) {
      // กรณีข้อมูลเดิมมีแต่ stock รวม ให้ default เข้า central (ภาคกลาง)
      this.regionalStocks.central = currentTotal;
    }

    // Auto-update regions จากภาคที่มีสต็อกจริง (> 0)
    const activeRegions = [];
    if (this.regionalStocks.north > 0) activeRegions.push("north");
    if (this.regionalStocks.northeast > 0) activeRegions.push("northeast");
    if (this.regionalStocks.central > 0) activeRegions.push("central");
    if (this.regionalStocks.south > 0) activeRegions.push("south");

    if (activeRegions.length > 0) {
      this.regions = activeRegions;
      if (!this.region || !activeRegions.includes(this.region)) {
        this.region = activeRegions[0];
      }
    }
  } else {
    const existing = Number(this.currentStockGrams ?? this.stockQuantity ?? 0);
    this.regionalStocks = {
      north: 0,
      northeast: 0,
      central: existing,
      south: 0,
    };
    this.stockQuantity = existing;
    this.currentStockGrams = existing;
  }

  // Sync region และ regions array
  if (this.region && (!this.regions || this.regions.length === 0)) {
    this.regions = [this.region];
  } else if (this.regions && this.regions.length > 0 && !this.region) {
    this.region = this.regions[0];
  }
  if (this.region && !this.regionNameTh) {
    this.regionNameTh = REGION[this.region] || (this.region === "all" ? "ทุกภูมิภาค (ทั่วไป)" : "ทั่วไป");
  }

  // ซิงค์สารอาหารให้ครบทั้ง 7 ชนิดตาม Model
  const n = this.nutrientsPer100g || this.nutritionPer100G || {};
  const c = n.carb !== undefined ? n.carb : n.carbs !== undefined ? n.carbs : 0;
  const completeNutrients = {
    calories: Number(n.calories || 0),
    carb: Number(c),
    carbs: Number(c),
    sugar: Number(n.sugar || 0),
    fiber: Number(n.fiber || 0),
    protein: Number(n.protein || 0),
    fat: Number(n.fat || 0),
    sodium: Number(n.sodium || 0),
  };
  this.nutritionPer100G = completeNutrients;
  this.nutrientsPer100g = completeNutrients;
});

export const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
