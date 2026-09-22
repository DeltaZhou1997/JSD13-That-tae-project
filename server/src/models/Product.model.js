import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "ชื่อเมนูต้องไม่เป็นค่าว่าง และมีความยาวอย่างน้อย 3 ตัวอักษร"],
      minlength: [3, "ชื่อเมนูต้องไม่เป็นค่าว่าง และมีความยาวอย่างน้อย 3 ตัวอักษร"],
      trim: true,
    },
    nameTh: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "รายละเอียดเมนู/ประวัติอาหาร ต้องไม่เป็นค่าว่าง"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "ราคาต้องเป็นตัวเลขที่มากกว่า 0"],
      min: [1, "ราคาต้องเป็นตัวเลขที่มากกว่า 0"],
    },
    quantity: {
      type: Number,
      required: [true, "จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป"],
      min: [0, "จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป"],
      default: 20,
      validate: {
        validator: Number.isInteger,
        message: "จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป",
      },
    },
    date: {
      type: String,
      required: [true, "กรุณาระบุวันที่วางขาย/วันหมดอายุวัตถุดิบ"],
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "ต้องระบุอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, GERD Friendly, Keto Flex, ธาตุไฟ)",
      },
    },

    region: {
      type: String,
      enum: ["northern", "northeastern", "central", "southern", "fusion"],
    },
    regionNameTh: { type: String },
    dominantElement: {
      type: String,
      enum: ["ดิน", "น้ำ", "ลม", "ไฟ"],
    },
    elementSuitability: { type: [String], default: [] },
    calories: { type: Number, default: 350 },
    servings: { type: Number, default: 2 },
    history: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    images: { type: [String], default: [] },
    ingredients: { type: String, default: "" },
    storageInstruction: { type: String, default: "" },
    reheatingInstruction: { type: String, default: "" },
    recipe: { type: [mongoose.Schema.Types.Mixed], default: [] },
    nutritionCache: { type: mongoose.Schema.Types.Mixed, default: null },
    cookingSteps: { type: [mongoose.Schema.Types.Mixed], default: [] },
    slug: { type: String, lowercase: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function shadowNameTh() {
  if (!this.name && this.nameTh) this.name = this.nameTh;
  this.nameTh = this.name;
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
