const plans = [
  { size: "S", kits: 4, price: "599", note: "เหมาะกับ 1–2 คน" },
  {
    size: "M",
    kits: 6,
    price: "899",
    note: "สมดุลสำหรับทุกสัปดาห์",
    popular: true,
  },
  { size: "L", kits: 8, price: "1,169", note: "สำหรับคู่รักหรือครอบครัวเล็ก" },
  { size: "XL", kits: 12, price: "1,599", note: "อิ่มพร้อมหน้าทั้งครอบครัว" },
];

export default function ElementsSection() {
  return (
    <section id="plans" className="home-section bg-[#fdfbf7]">
      <div className="home-container">
        <div className="home-heading">
          <span className="home-eyebrow">Weekly plans</span>
          <h2 className="mt-4">เลือกจำนวนมื้อให้พอดีกับชีวิต</h2>
          <p>เปลี่ยนเมนูหรือหยุดรับกล่องได้ตามต้องการ ราคายังไม่รวมค่าจัดส่ง</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.size}
              className={`relative rounded-[1.8rem] border p-6 shadow-[0_18px_45px_rgba(61,44,46,0.06)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(61,44,46,0.12)] ${plan.popular ? "border-[#3d2c2e] bg-[#3d2c2e] text-white" : "border-[#e8dfd1] bg-white"}`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${plan.popular ? "bg-[#c89465]" : "bg-[#f3e4d5]"}`}
              />
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#c89465] px-4 py-1 text-xs font-bold text-white shadow-md">
                  ยอดนิยม
                </span>
              )}
              <span
                className={`text-xs font-bold uppercase tracking-widest ${plan.popular ? "text-[#d8c8bb]" : "text-[#8d7b68]"}`}
              >
                Size {plan.size}
              </span>
              <div className="mt-5 flex items-end gap-2">
                <strong className="text-5xl leading-none">{plan.kits}</strong>
                <span className="pb-1">Kits / สัปดาห์</span>
              </div>
              <p
                className={`mt-4 min-h-12 text-sm leading-6 ${plan.popular ? "text-[#d8c8bb]" : "text-[#6f675f]"}`}
              >
                {plan.note}
              </p>
              <div className="my-6 border-t border-current opacity-20" />
              <div className="flex items-end gap-2">
                <strong className="text-3xl">฿{plan.price}</strong>
                <span className="pb-1 text-sm">/ สัปดาห์</span>
              </div>
              <ul
                className={`mt-5 space-y-2 text-sm ${plan.popular ? "text-[#efe2d8]" : "text-[#725f52]"}`}
              >
                <li>• เปลี่ยนเมนูได้ทุกสัปดาห์</li>
                <li>• มีสูตรและข้อมูลโภชนาการ</li>
                <li>• จัดส่งวัตถุดิบพร้อมปรุง</li>
              </ul>
              <button
                type="button"
                className={`mt-6 w-full rounded-full py-3 font-bold transition-colors ${plan.popular ? "bg-white text-[#3d2c2e] hover:bg-[#f1dec9]" : "bg-[#f1dec9] text-[#3d2c2e] hover:bg-[#e5ccb2]"}`}
              >
                เลือกแพ็กเกจ
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
