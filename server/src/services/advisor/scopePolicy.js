// ขอบเขตข้อมูลที่ Advisor ใช้ได้ตามบทบาทผู้ใช้
// role มาจาก JWT ที่ server ตรวจแล้วเท่านั้น — ไม่รับ role จาก body ของ client

export const ADVISOR_SCOPES = {
  guest: {
    role: "guest",
    visibilities: ["public"], // เอกสารที่ค้นเจอได้
    personal: false, // โปรไฟล์ / ตะกร้า / คำสั่งซื้อของตัวเอง
    adminInsights: false, // สต็อกต่ำ / สถิติคำสั่งซื้อ
    description: "ผู้เยี่ยมชม (ยังไม่เข้าสู่ระบบ): ใช้ได้เฉพาะข้อมูลเมนู วัตถุดิบ ความรู้ธาตุเจ้าเรือน และวิธีใช้งานเว็บ",
  },
  customer: {
    role: "customer",
    visibilities: ["public"],
    personal: true,
    adminInsights: false,
    description:
      "ลูกค้าที่เข้าสู่ระบบ: ใช้ได้เฉพาะข้อมูลสาธารณะ + โปรไฟล์ ตะกร้า และคำสั่งซื้อของผู้ใช้คนนี้เท่านั้น",
  },
  admin: {
    role: "admin",
    visibilities: ["public", "admin"],
    personal: false,
    adminInsights: true,
    description:
      "ผู้ดูแลระบบ: ใช้ได้ข้อมูลสาธารณะ เมนู/วัตถุดิบที่ปิดขาย สต็อกวัตถุดิบ และสถิติคำสั่งซื้อแบบสรุป (ไม่มีข้อมูลส่วนตัวของลูกค้ารายบุคคล)",
  },
};

/** แปลง payload ใน token เป็น scope (token ไม่ถูกต้อง/ไม่มี → guest) */
export function resolveScope(tokenUser) {
  if (!tokenUser?.id) return { ...ADVISOR_SCOPES.guest, userId: null };
  const scope = tokenUser.role === "admin" ? ADVISOR_SCOPES.admin : ADVISOR_SCOPES.customer;
  return { ...scope, userId: String(tokenUser.id) };
}
