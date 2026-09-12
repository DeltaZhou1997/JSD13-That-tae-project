export const SHIPPING_FEE = 60;

export const POINT_CALCULATION = {
  MIN_AMOUNT_TO_EARN: 1499,
  BASE_AMOUNT: 10,
  POINTS_PER_BASE: 1,
};
export const SUBSCRIPTION_PLANS = {
  S: {
    id: "S",
    name: "SIZE S",
    kitsPerWeek: 4,
    price: 599,
    description: "เหมาะกับ 1–2 คน",
    isPopular: false,
    features: [
      "เปลี่ยนเมนูได้ทุกสัปดาห์",
      "มีสูตรและข้อมูลโภชนาการ",
      "จัดส่งวัตถุดิบพร้อมปรุง",
    ],
  },
  M: {
    id: "M",
    name: "SIZE M",
    kitsPerWeek: 6,
    price: 899,
    description: "สมดุลสำหรับทุกสัปดาห์",
    isPopular: true,
    features: [
      "เปลี่ยนเมนูได้ทุกสัปดาห์",
      "มีสูตรและข้อมูลโภชนาการ",
      "จัดส่งวัตถุดิบพร้อมปรุง",
    ],
  },
  L: {
    id: "L",
    name: "SIZE L",
    kitsPerWeek: 8,
    price: 1169,
    description: "สำหรับคู่รักหรือครอบครัวเล็ก",
    isPopular: false,
    features: [
      "เปลี่ยนเมนูได้ทุกสัปดาห์",
      "มีสูตรและข้อมูลโภชนาการ",
      "จัดส่งวัตถุดิบพร้อมปรุง",
    ],
  },
  XL: {
    id: "XL",
    name: "SIZE XL",
    kitsPerWeek: 12,
    price: 1599,
    description: "อิ่มพร้อมหน้าทั้งครอบครัว",
    isPopular: false,
    features: [
      "เปลี่ยนเมนูได้ทุกสัปดาห์",
      "มีสูตรและข้อมูลโภชนาการ",
      "จัดส่งวัตถุดิบพร้อมปรุง",
    ],
  },
};

export const PAYMENT_METHODS = {
  PROMPTPAY: "promptpay",
  CREDIT_CARD: "creditCard",
  COD: "cod",
};
