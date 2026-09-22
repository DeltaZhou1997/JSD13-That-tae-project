import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "บ้าน" },
  address: { type: String, required: true },
  subdistrict: { type: String },
  district: { type: String },
  province: { type: String },
  zipcode: { type: String },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "กรุณากรอกอีเมล"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "รูปแบบอีเมลไม่ถูกต้อง"],
    },
    password: {
      type: String,
      required: [true, "กรุณากรอกรหัสผ่าน"],
      minlength: [6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"],
    },
    firstName: {
      type: String,
      required: [true, "กรุณากรอกชื่อจริง"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "กรุณากรอกนามสกุล"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    addresses: [addressSchema],
    healthRestrictions: [
      {
        name: { type: String },
        type: {
          type: String,
          enum: ["dietary_restriction", "allergy", "health_condition"],
          default: "allergy",
        },
        note: { type: String },
      },
    ],
    membership: {
      tier: { type: String, default: "SILVER" },
      points: { type: Number, default: 0 },
      stamps: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// ลบ password ออกจาก JSON response อัตโนมัติเพื่อความปลอดภัย
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model("User", userSchema);
