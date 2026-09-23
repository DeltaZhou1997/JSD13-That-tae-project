import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameTh: {
      type: String,
      trim: true,
    },
    nameEn: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    history: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: function (v) {
          return Number.isInteger(v);
        },
        message: "จำนวนสินค้าต้องเป็นเลขจำนวนเต็ม",
      },
    },
    stock: {
      type: Number,
      default: function () {
        return this.quantity;
      },
    },
    region: {
      type: String,
      enum: ["northern", "northeastern", "central", "southern", "fusion"],
      default: "northern",
    },
    regionNameTh: {
      type: String,
      default: "ภาคเหนือ",
    },
    dominantElement: {
      type: String,
      enum: ["ดิน", "น้ำ", "ลม", "ไฟ"],
      default: "ดิน",
    },
    elementSuitability: [
      {
        type: String,
        enum: ["ดิน", "น้ำ", "ลม", "ไฟ"],
      },
    ],
    calories: {
      type: Number,
      default: 0,
    },
    servings: {
      type: Number,
      default: 2,
    },
    date: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    // ข้อจำกัดทางอาหาร/โรค/การแพ้ (Food Restrictions & Allergens)
    foodRestrictions: [
      {
        type: String,
        trim: true,
      },
    ],
    ingredients: {
      type: String,
      default: "",
    },
    recipe: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: false,
        },
        ingredientId: { type: String },
        nameTh: { type: String },
        nameEn: { type: String },
        // หน่วยตาม unit ของวัตถุดิบ (เช่น 0.5 kg) จึงรองรับทศนิยม
        quantity: { type: Number, required: true, min: 0.001 },
        unit: { type: String, default: "g" },
        // ปริมาณอ้างอิงของ nutrientsPer100g (หน่วยเดียวกับ unit เช่น 100 g, 1 piece)
        basisWeightG: { type: Number },
        elements: [{ type: String }],
        nutrientsPer100g: {
          calories: { type: Number, default: 0 },
          protein: { type: Number, default: 0 },
          carbs: { type: Number, default: 0 },
          fat: { type: Number, default: 0 },
          sodium: { type: Number, default: 0 },
        },
      },
    ],
    nutritionCache: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    cookingSteps: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    storageInstruction: {
      type: String,
      default: "",
    },
    reheatingInstruction: {
      type: String,
      default: "",
    },
    // 🖼️ รูปภาพของอาหารที่ถูกเซฟใน MongoDB (GridFS)
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "images.files",
      default: null,
    },
    // รองรับกรณีอาหาร 1 เมนูมีรูปภาพหลายมุมมอง ทั้ง URL และ GridFS
    images: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    // URL สำหรับ Client เรียกดูรูปภาพ (Auto sync จาก /api/v2/images/:imageId)
    imageUrl: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          // เมนูอาหารต้องมีรูปภาพ (อย่างน้อย 1 แหล่ง: imageUrl หรือ imageId หรือ images)
          return Boolean(v || this.imageId || (Array.isArray(this.images) && this.images.length > 0));
        },
        message: "เมนูอาหารต้องมีรูปภาพ (imageUrl หรือ imageId)",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: ซิงค์ nameTh/name และ Auto-generate imageUrl จาก imageId ของ GridFS
productSchema.pre("save", function () {
  // เก็บรหัสข้อจำกัดแบบ canonical ให้ตรงกับ filter ฝั่งลูกค้าและค้นหาใน MongoDB
  if (Array.isArray(this.foodRestrictions)) {
    this.foodRestrictions = [...new Set(this.foodRestrictions.map((value) => String(value).trim()).filter(Boolean))];
    this.tags = [...new Set([...(this.tags || []), ...this.foodRestrictions])];
  }
  if (this.name && !this.nameTh) {
    this.nameTh = this.name;
  } else if (this.nameTh && !this.name) {
    this.name = this.nameTh;
  }

  // หากมีการระบุ imageId แต่ยังไม่มี imageUrl ให้ชี้ไปที่ GridFS API ของ v2 อัตโนมัติ
  if (this.imageId && !this.imageUrl) {
    this.imageUrl = `/api/v2/images/${this.imageId}`;
  }
});

export const PRODUCT_TO_INGREDIENT_REGION = {
  northern: "north",
  northeastern: "northeast",
  central: "central",
  southern: "south",
  fusion: "central", // ไทยฟิวชั่น ภาคกลางจะเป็นคนซัพพอร์ตเสมอ
};

export const REGION_TH_NAMES = {
  north: "ภาคเหนือ",
  northeast: "ภาคอีสาน",
  central: "ภาคกลาง",
  south: "ภาคใต้",
};

// ตรวจสอบว่าวัตถุดิบทุกตัวในสูตรของเมนูนี้มีสต็อกในคลัง Ingredient เฉพาะภูมิภาคเพียงพอหรือไม่
productSchema.methods.checkStockAvailability = async function (orderQuantity = 1) {
  const Ingredient = mongoose.model("Ingredient");
  const missingOrInsufficient = [];
  const targetRegion = PRODUCT_TO_INGREDIENT_REGION[this.region] || "central";
  const targetRegionNameTh = REGION_TH_NAMES[targetRegion] || "ภาคกลาง";

  for (const item of this.recipe) {
    if (!item.ingredient && !item.ingredientId) continue;
    const ingId = item.ingredient || item.ingredientId;
    
    // ค้นหาวัตถุดิบใน DB
    let ing = null;
    if (mongoose.Types.ObjectId.isValid(ingId)) {
      ing = await Ingredient.findById(ingId);
    }
    if (!ing && item.nameTh) {
      ing = await Ingredient.findOne({ nameTh: item.nameTh });
    }

    const requiredAmount = (Number(item.quantity) || 1) * orderQuantity;
    if (!ing) {
      missingOrInsufficient.push({
        ingredientName: item.nameTh || "ไม่ทราบชื่อ",
        reason: "ไม่พบข้อมูลวัตถุดิบในคลัง",
      });
    } else {
      const regionStock = ing.regionalStocks?.[targetRegion] !== undefined
        ? Number(ing.regionalStocks[targetRegion])
        : (ing.stockQuantity ?? ing.currentStockGrams ?? 0);

      if (regionStock < requiredAmount) {
        missingOrInsufficient.push({
          ingredientName: ing.nameTh,
          required: requiredAmount,
          available: regionStock,
          unit: ing.unit || "g",
          region: targetRegion,
          regionNameTh: targetRegionNameTh,
          reason: `สต็อก${targetRegionNameTh}ไม่เพียงพอ (ต้องการ ${requiredAmount}${ing.unit} แต่คงเหลือเพียง ${regionStock}${ing.unit})`,
        });
      }
    }
  }

  return {
    isAvailable: missingOrInsufficient.length === 0,
    targetRegion,
    targetRegionNameTh,
    details: missingOrInsufficient,
  };
};

// คำนวณจำนวนชุดที่สามารถทำได้จริงจากสต็อกวัตถุดิบในภาคนั้นๆ
productSchema.methods.calculateAvailableKits = async function () {
  const Ingredient = mongoose.model("Ingredient");
  const targetRegion = PRODUCT_TO_INGREDIENT_REGION[this.region] || "central";
  const targetRegionNameTh = REGION_TH_NAMES[targetRegion] || "ภาคกลาง";

  if (!Array.isArray(this.recipe) || this.recipe.length === 0) {
    return { availableKits: 0, targetRegion, targetRegionNameTh, bottleneck: null, breakdown: [] };
  }

  let minKits = Infinity;
  let bottleneck = null;
  const breakdown = [];

  for (const item of this.recipe) {
    const ingId = item.ingredient || item.ingredientId;
    let ing = null;
    if (mongoose.Types.ObjectId.isValid(ingId)) {
      ing = await Ingredient.findById(ingId);
    }
    if (!ing && item.nameTh) {
      ing = await Ingredient.findOne({ nameTh: item.nameTh });
    }

    // เดิม Math.max(1, ...) ทำให้ 0.05 kg ถูกนับเป็น 1 kg
    const requiredPerKit = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    const regionStock = ing?.regionalStocks?.[targetRegion] !== undefined
      ? Number(ing.regionalStocks[targetRegion])
      : (ing?.stockQuantity ?? ing?.currentStockGrams ?? 0);
    
    const possibleKits = Math.floor(regionStock / requiredPerKit);
    breakdown.push({
      ingredientName: ing?.nameTh || item.nameTh || "ไม่ทราบชื่อ",
      regionStock,
      requiredPerKit,
      unit: ing?.unit || item.unit || "g",
      possibleKits,
    });

    if (possibleKits < minKits) {
      minKits = possibleKits;
      bottleneck = {
        ingredientName: ing?.nameTh || item.nameTh,
        regionStock,
        requiredPerKit,
        unit: ing?.unit || item.unit || "g",
      };
    }
  }

  return {
    availableKits: minKits === Infinity ? 0 : Math.max(0, minKits),
    targetRegion,
    targetRegionNameTh,
    bottleneck,
    breakdown,
  };
};

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
