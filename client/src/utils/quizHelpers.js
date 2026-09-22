/**
 * คำนวณธาตุหลักของผู้ใช้
 * @param {Object} answers - { 1: "earth", 2: "fire", ... }
 * @returns {string} ID ของธาตุหลัก (earth, water, air, fire)
 */
export const calculatePrimaryElement = (answers) => {
  const counts = { earth: 0, water: 0, air: 0, fire: 0 };

  // นับคะแนนทุกข้อ
  Object.values(answers).forEach((element) => {
    if (counts[element] !== undefined) {
      counts[element] += 1;
    }
  });

  // ค้นหาคะแนนสูงสุด
  let maxScore = 0;
  Object.values(counts).forEach((score) => {
    if (score > maxScore) maxScore = score;
  });

  // หาธาตุทั้งหมดที่ได้คะแนนสูงสุดเท่ากัน
  const topElements = Object.keys(counts).filter(
    (elem) => counts[elem] === maxScore,
  );

  // กรณีมีธาตุเดียวที่ได้คะแนนสูงสุด
  if (topElements.length === 1) {
    return topElements[0];
  }

  // กรณีคะแนนเท่ากัน (Tie-breaker): ให้สิทธิ์ธาตุเจ้าเรือนตามเดือนเกิด (คำตอบของข้อ 1)
  const birthMonthElement = answers[1];
  if (birthMonthElement && topElements.includes(birthMonthElement)) {
    return birthMonthElement;
  }

  // ถ้าเดือนเกิดไม่ได้อยู่ในกลุ่มธาตุที่คะแนนสูงสุด ให้คืนค่าธาตุแรกในกลุ่ม
  return topElements[0] || "earth";
};

export const ELEMENT_EN_TO_TH = {
  earth: "ดิน",
  water: "น้ำ",
  air: "ลม",
  wind: "ลม",
  fire: "ไฟ",
  ดิน: "ดิน",
  น้ำ: "น้ำ",
  ลม: "ลม",
  ไฟ: "ไฟ",
};

export const ELEMENT_TH_TO_EN = {
  ดิน: "earth",
  น้ำ: "water",
  ลม: "air",
  ไฟ: "fire",
  earth: "earth",
  water: "water",
  air: "air",
  wind: "air",
  fire: "fire",
};

/**
 * คำนวณหรือดึงธาตุประจำตัวของผู้ใช้ที่ล็อกอิน หรือผลทดสอบในเครื่อง
 * @param {Object} user - ข้อมูลผู้ใช้
 * @returns {string|null} ธาตุเป็นภาษาไทย ('ดิน', 'น้ำ', 'ลม', 'ไฟ') หรือ null ถ้ายังไม่ทราบธาตุ
 */
export const getUserElement = (user) => {
  // 1. ตรวจสอบจากฟิลด์ใน user object
  if (user?.element && ELEMENT_EN_TO_TH[user.element]) {
    return ELEMENT_EN_TO_TH[user.element];
  }
  if (user?.bodyElement && ELEMENT_EN_TO_TH[user.bodyElement]) {
    return ELEMENT_EN_TO_TH[user.bodyElement];
  }

  // 2. ตรวจสอบจากผลทดสอบที่เซฟไว้ใน localStorage
  try {
    const saved =
      localStorage.getItem("quizResult") ||
      localStorage.getItem("userElement");
    if (saved) {
      if (ELEMENT_EN_TO_TH[saved]) return ELEMENT_EN_TO_TH[saved];
      const parsed = JSON.parse(saved);
      const val = parsed?.element || parsed?.id;
      if (val && ELEMENT_EN_TO_TH[val]) return ELEMENT_EN_TO_TH[val];
    }
  } catch {}

  // 3. คำนวณจากเดือนเกิด (birthDate) ถ้ามีระบุไว้ในโปรไฟล์
  if (user?.birthDate) {
    const d = new Date(user.birthDate);
    if (!isNaN(d.getTime())) {
      const month = d.getMonth() + 1; // 1 - 12
      if (month >= 1 && month <= 3) return "น้ำ";
      if (month >= 4 && month <= 6) return "ลม";
      if (month >= 7 && month <= 9) return "ไฟ";
      if (month >= 10 && month <= 12) return "ดิน";
    }
  }

  // ถ้ายังไม่เคยทำควิซ และไม่มีข้อมูลธาตุ คืนค่า null (ไม่ทราบธาตุ)
  return null;
};
