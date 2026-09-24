import { SHIPPING_FEE } from "../constants/checkout";

// กติกาคิดเบี้ยอยู่ที่ constants/membership.js (ใช้สูตรเดียวกับ Server)
export { calculateEarnedPoints } from "../constants/membership";

//ฟังก์ชันคำนวณราคารวมทั้งหมด
export const calculateGrandTotal = (itemsSubtotal, pointsDiscount = 0) => {
  return itemsSubtotal - pointsDiscount + SHIPPING_FEE;
};

//ฟังก์ชั่นสร้าง QR Code สำหรับพร้อมเพย์
export const generatePromptPayQrUrl = (target, amount) => {
  const cleanTarget = target.replace(/[^0-9]/g, "");
  let formattedTarget = cleanTarget;
  if (cleanTarget.length === 10 && cleanTarget.startsWith("0")) {
    formattedTarget = "0066" + cleanTarget.substring(1);
  }

  const targetTag = formattedTarget.length === 13 ? "02" : "01";
  const targetLength = formattedTarget.length.toString().padStart(2, "0");
  const merchantAccountInfo = `0016A000000677010111${targetTag}${targetLength}${formattedTarget}`;

  const amountStr = amount.toFixed(2);
  const amountLength = amountStr.length.toString().padStart(2, "0");

  const rawPayload =
    `000201` +
    `010212` +
    `29${merchantAccountInfo.length.toString().padStart(2, "0")}${merchantAccountInfo}` +
    `5303764` +
    `54${amountLength}${amountStr}` +
    `5802TH` +
    `6304`;

  //ฟังก์ชั่นคำนวณอัลกอรึทึม CRC16  เพื่อตรวจสอบว่าโอนเงินจริงมั้ย
  const crc = crc16CCITT(rawPayload);
  const fullPayload = rawPayload + crc;

  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(fullPayload)}`;
};

const crc16CCITT = (currentPayload) => {
  // แปลง String เป็น Array ของ Byte (รองรับ UTF-8 / ภาษาไทย / ตัวอักษรพิเศษครบ)
  const bytes = new TextEncoder().encode(currentPayload);

  let crc = 0xffff;
  for (let i = 0; i < bytes.length; i++) {
    let x = ((crc >> 8) ^ bytes[i]) & 0xff; // ใช้ byte จริงๆ แทน charCodeAt
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff;
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
};
