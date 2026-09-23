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
  basisWeightG: {
    type: Number,
    default: 100,
    min: 1
  },
  nutritionPer100G: {
    type: nutrientSchema,
    default: () => ({}),
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
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
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Middleware auto-fill categoryTh และ sync regions ก่อน validate
ingredientSchema.pre("validate", function () {
  if (this.category && !this.categoryTh) {
    this.categoryTh = INGREDIENT_CATEGORIES[this.category] || "อื่น ๆ";
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
});

export const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
