// บริษัทขนส่ง (id ต้องตรงกับ SHIPPING_CARRIERS ใน server/src/models/Order.model.js)
export const SHIPPING_CARRIERS = [
  { id: "thailandpost", label: "ไปรษณีย์ไทย (EMS/ลงทะเบียน)" },
  { id: "kerry", label: "KEX (Kerry Express)" },
  { id: "flash", label: "Flash Express" },
  { id: "jt", label: "J&T Express" },
  { id: "dhl", label: "DHL eCommerce" },
  { id: "other", label: "อื่น ๆ" },
];

export const getCarrierLabel = (id) => SHIPPING_CARRIERS.find((c) => c.id === id)?.label || "";

// เลขพัสดุ: ตัวอักษรอังกฤษ/ตัวเลข/ขีด 6–30 ตัว (ตรงกับ TRACKING_NUMBER_RE ฝั่ง server)
export const TRACKING_NUMBER_RE = /^[A-Z0-9-]{6,30}$/;

export const normalizeTrackingNumber = (value) => String(value || "").trim().toUpperCase().replace(/\s+/g, "");
