import mongoose from "mongoose";
import bcrypt from "bcrypt";


const addressSchema = new mongoose.Schema({
  label: { type: String, default: "บ้าน" },
  address: { type: String, required: true },
  subdistrict: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
  zipcode: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Regex สำหรับรหัสไปรษณีย์ไทย 5 หลัก (เลข 1-9 ในหลักแรก ตามด้วยตัวเลขอีก 4 หลัก)
        return /^[1-9]\d{4}$/.test(v);
      },
      message: (props) => `${props.value} ไม่ใช่รหัสไปรษณีย์ที่ถูกต้อง`,
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^0[2-9]\d{7,8}$/.test(v);
      },
      message: (props) => `${props.value} ไม่ใช่เบอร์โทรศัพท์ที่ถูกต้อง`,
    },
  },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Regex มาตรฐานสำหรับการตรวจสอบรูปแบบ Email
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} ไม่ใช่รูปแบบอีเมลที่ถูกต้อง`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // ต้องมี พิมพ์เล็ก + พิมพ์ใหญ่ + ตัวเลข + สัญลักษณ์ อย่างน้อยอย่างละ 1 ตัว และยาว 8-20 ตัว
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/.test(
          v,
        );
      },
      message:
        "รหัสผ่านต้องมีความยาว 8-20 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และสัญลักษณ์พิเศษ",
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^0[2-9]\d{7,8}$/.test(v);
      },
      message: (props) => `${props.value} ไม่ใช่เบอร์โทรศัพท์ที่ถูกต้อง`,
    },
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  birthDate: {
    type: Date,
    required: [true, "กรุณากรอกวันเกิด"],
    validate: {
      validator: function (v) {
        // ต้องไม่เป็นวันในอนาคต (v ต้องน้อยกว่าหรือเท่ากับวันปัจจุบัน)
        return v <= new Date();
      },
      message: "วันเกิดต้องไม่เป็นวันที่ในอนาคต",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "not_specified", ""],
    default: "not_specified",
  },
  bloodType: {
    type: String,
    required: true,
    enum: {
      values: [
        "A",
        "B",
        "AB",
        "O",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      message: "{VALUE} ไม่ใช่หมู่เลือดที่ถูกต้อง",
    },
    uppercase: true,
    trim: true,
  },
  element: {
    type: String,
    enum: ["ดิน", "earth", "น้ำ", "water", "ลม", "wind", "ไฟ", "fire", ""],
    default: "ดิน",
  },
  avatar: {
    type: String,
    default: "",
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  addresses: [addressSchema],
  membership: {
    tier: {
      type: String,
      enum: [
        "BRONZE",
        "SILVER",
        "GOLD",
        "PLATINUM",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
      ],
      default: "BRONZE",
    },
  },
  restrictions: [
    { type: String, trim: true }
  ],
},
  {
    timestamps: true,
  }
);

// Hash password before saving to db
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds)
})


export const User = mongoose.model("User", userSchema);