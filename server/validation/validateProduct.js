export function validateProduct(data, { partial = false } = {}) {
  const errors = {};

  const has = (field) => Object.prototype.hasOwnProperty.call(data, field);
  const shouldCheck = (field) => !partial || has(field);

  if (shouldCheck("name")) {
    if (!data.name || String(data.name).trim().length < 3) {
      errors.name = "ชื่อเมนูต้องไม่เป็นค่าว่าง และมีความยาวอย่างน้อย 3 ตัวอักษร";
    }
  }

  if (shouldCheck("description")) {
    if (!data.description || String(data.description).trim() === "") {
      errors.description = "รายละเอียดเมนู/ประวัติอาหาร ต้องไม่เป็นค่าว่าง";
    }
  }

  if (shouldCheck("price")) {
    if (data.price === "" || data.price === null || data.price === undefined || isNaN(data.price) || Number(data.price) <= 0) {
      errors.price = "ราคาต้องเป็นตัวเลขที่มากกว่า 0";
    }
  }

  if (shouldCheck("quantity")) {
    const qtyNum = Number(data.quantity);
    if (data.quantity === "" || data.quantity === null || data.quantity === undefined || isNaN(qtyNum) || qtyNum < 0 || !Number.isInteger(qtyNum)) {
      errors.quantity = "จำนวนชุด Cooking Kit ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    }
  }

  if (shouldCheck("date")) {
    if (!data.date) {
      errors.date = "กรุณาระบุวันที่วางขาย/วันหมดอายุวัตถุดิบ";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(data.date);
      selectedDate.setHours(0, 0, 0, 0);
      if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
        errors.date = "วันที่เริ่มวางขาย/หมดอายุวัตถุดิบ ต้องไม่เป็นอดีต";
      }
    }
  }

  if (shouldCheck("tags")) {
    const tagList = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === "string"
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    if (tagList.length === 0) {
      errors.tags = "ต้องระบุอย่างน้อย 1 แท็ก (เช่น ภาคเหนือ, GERD Friendly, Keto Flex, ธาตุไฟ)";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
