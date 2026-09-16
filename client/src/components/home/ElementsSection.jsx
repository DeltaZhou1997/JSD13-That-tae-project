const plans = [
  { size: "S", kits: 4, price: "599", note: "เหมาะกับ 1–2 คน" },
  {
    size: "M",
    kits: 6,
    price: "899",
    note: "สมดุลสำหรับทุกสัปดาห์",
  },
  { size: "L", kits: 8, price: "1,169", note: "สำหรับคู่รักหรือครอบครัวเล็ก" },
  { size: "XL", kits: 12, price: "1,599", note: "อิ่มพร้อมหน้าทั้งครอบครัว" },
];

export default function ElementsSection() {
  return (
    <section id="plans" className="home-section overflow-hidden bg-[#fdfbf7]">
      <div className="home-container">
        <div className="home-heading max-w-3xl">
          <h2 className="mt-4">เลือกจำนวนมื้อให้พอดีกับชีวิต</h2>
          <span className="text-2xl">
            เปลี่ยนเมนูหรือหยุดรับกล่องได้ตามต้องการ ราคายังไม่รวมค่าจัดส่ง
          </span>
        </div>
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.size}
              className="relative flex h-full flex-col rounded-[1.8rem] border border-[#e8dfd1] bg-white p-6 text-[#2f2119] shadow-[0_18px_45px_rgba(61,44,46,0.06)]"
            >
              <span
                className="flex justify-center rounded-full bg-amber-800 px-3 py-2 text-xl font-bold uppercase tracking-widest text-white"
              >
                Size {plan.size}
              </span>
              <div className="mt-5 flex items-end gap-2">
                <strong className="text-5xl leading-none">{plan.kits}</strong>
                <span className="pb-1 text-base font-medium">ชุด / สัปดาห์</span>
              </div>
              <p
                className="mt-4 min-h-14 text-base leading-7 text-[#6f675f]"
              >
                {plan.note}
              </p>
              <div className="my-6 border-t border-current opacity-20" />
              <div className="flex items-end gap-2">
                <strong className="text-3xl">฿{plan.price}</strong>
                <span className="pb-1 text-base">/ สัปดาห์</span>
              </div>
              <ul
                className="mt-5 space-y-2 text-base leading-7 text-[#725f52]"
              >
                <li>• เปลี่ยนเมนูได้ทุกสัปดาห์</li>
                <li>• มีสูตรและข้อมูลโภชนาการ</li>
                <li>• จัดส่งวัตถุดิบพร้อมปรุง</li>
              </ul>
              <button
                type="button"
                className="cursor-pointer mt-4 w-full rounded-full bg-[#f1dec9] px-4 py-3.5 text-lg font-bold text-[#3d2c2e] transition-colors hover:bg-[#3d2c2e] hover:text-white"
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
