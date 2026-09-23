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
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, default: "g" },
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

// ตรวจสอบว่าวัตถุดิบทุกตัวในสูตรของเมนูนี้มีสต็อกในคลัง Ingredient เพียงพอหรือไม่
productSchema.methods.checkStockAvailability = async function (orderQuantity = 1) {
  const Ingredient = mongoose.model("Ingredient");
  const missingOrInsufficient = [];

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
      const currentStock = ing.stockQuantity ?? ing.currentStockGrams ?? 0;
      if (currentStock < requiredAmount) {
        missingOrInsufficient.push({
          ingredientName: ing.nameTh,
          required: requiredAmount,
          available: currentStock,
          unit: ing.unit || "g",
          reason: `สต็อกไม่เพียงพอ (ต้องการ ${requiredAmount}${ing.unit} แต่คงเหลือเพียง ${currentStock}${ing.unit})`,
        });
      }
    }
  }

  return {
    isAvailable: missingOrInsufficient.length === 0,
    details: missingOrInsufficient,
  };
};

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
