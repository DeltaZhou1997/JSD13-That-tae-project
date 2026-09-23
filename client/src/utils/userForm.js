// ข้อมูลและฟังก์ชันของฟอร์มผู้ใช้ที่ใช้ร่วมกัน (หน้าสมัครสมาชิก + กล่องเพิ่มสมาชิกของแอดมิน)
// แยกจาก UserFormParts.jsx เพื่อให้ไฟล์ component export แต่ component (Fast Refresh)

export const GENDER_OPTIONS = [
  { value: "female", label: "หญิง" },
  { value: "male", label: "ชาย" },
  { value: "other", label: "LGBTQ+ / อื่นๆ" },
  { value: "not_specified", label: "ไม่ระบุ" },
];

export const BLOOD_TYPES = ["O", "A", "B", "AB", "O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

export function createEmptyUserForm() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "not_specified",
    bloodType: "O",
    // ที่อยู่จัดส่ง
    street: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
  };
}

/** ตรวจข้อมูลแบบเดียวกับหน้าสมัครสมาชิก คืนข้อความ error หรือ null */
export function validateUserForm(formData) {
  const { firstName, lastName, email, phone, password, confirmPassword } = formData;
  if (!firstName.trim() || !lastName.trim()) return "กรุณากรอกชื่อจริงและนามสกุล";
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "กรุณากรอกอีเมลที่ถูกต้อง";
  if (!phone.trim() || !/^0[2-9]\d{7,8}$/.test(phone.trim()))
    return "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0812345678)";
  if (password.length < 6) return "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
  if (password !== confirmPassword) return "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน";
  return null;
}

/** แปลงข้อมูลฟอร์มเป็น payload สำหรับ POST /api/v2/users/register */
export function toRegisterPayload(formData) {
  return {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    phone: formData.phone.trim(),
    birthDate: formData.birthDate || undefined,
    gender: formData.gender,
    bloodType: formData.bloodType,
    deliveryAddress: {
      street: formData.street.trim(),
      subdistrict: formData.subdistrict.trim(),
      district: formData.district.trim(),
      province: formData.province,
      postalCode: formData.postalCode.trim(),
    },
  };
}
