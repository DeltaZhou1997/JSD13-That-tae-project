/**
 * ฟอร์แมตวันที่ให้อยู่ในรูปแบบ DD/MM/YYYY แบบคริสต์ศักราช (ค.ศ. เช่น 23/09/2026)
 *
 * @param {string | number | Date} dateInput - วันที่ที่ต้องการฟอร์แมต
 * @param {object} [options]
 * @param {boolean} [options.showTime=false] - แสดงเวลาเพิ่มเติมด้วยหรือไม่ (HH:mm)
 * @returns {string} วันที่ในรูปแบบ DD/MM/YYYY
 */
export function formatDate(dateInput, options = {}) {
  if (!dateInput) return "-";

  // กรณีที่เป็นสตริงรูปแบบ YYYY-MM-DD (เช่น ค่าจาก input type="date")
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split("-");
    return `${day}/${month}/${year}`;
  }

  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear(); // ปี ค.ศ. 4 หลัก (คริสต์ศักราช)

  let formatted = `${day}/${month}/${year}`;

  if (options.showTime) {
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    formatted += ` ${hours}:${minutes} น.`;
  }

  return formatted;
}

/**
 * ดึงวันที่ปัจจุบันในรูปแบบ DD/MM/YYYY (ค.ศ.)
 * @returns {string} เช่น "23/09/2026"
 */
export function getTodayFormatted() {
  return formatDate(new Date());
}

export default formatDate;
