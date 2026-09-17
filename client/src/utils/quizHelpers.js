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
