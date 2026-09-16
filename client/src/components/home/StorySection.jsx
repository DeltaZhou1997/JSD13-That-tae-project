const impacts = [
  ["50+", "เกษตรกรและผู้ผลิตท้องถิ่น"],
  ["พอดีมื้อ", "ลดวัตถุดิบเหลือทิ้ง"],
  ["ตามฤดู", "สดกว่าและสนับสนุนผลผลิตไทย"],
];

export default function StorySection() {
  return (
    <section
      id="local-sourcing"
      className="home-section scroll-mt-24 overflow-hidden bg-[#3d2c2e] text-white"
    >
      <div className="home-container grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <img
            src="https://freshpoint.co.th/wp-content/uploads/2024/05/fresh-organic-vegetable-in-local-farm-at-countryside-1024x683.jpg"
            alt="เกษตรกรท้องถิ่นกับผลผลิตสด"
            className="aspect-[1.05] w-full rounded-[2rem] object-cover"
          />
          <div className="absolute bottom-3 left-3 rounded-3xl text-2xl bg-white/90 p-4 text-[#3d2c2e] backdrop-blur sm:bottom-5 sm:left-5 sm:p-5">
            <strong>รู้ที่มาในทุกกล่อง</strong>
            <span className="mt-1 block text-lg">
              จากแหล่งผลิตที่ตรวจสอบได้
            </span>
          </div>
        </div>
        <div>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            สดจากชุมชน เติบโตไปพร้อมเกษตรกร
          </h2>
          <p className="mt-5 leading-8 text-xl text-[#e8dfd1]">
            ธาตุแท้เลือกซื้อวัตถุดิบตามฤดูกาลในราคาที่เป็นธรรม
            จัดสัดส่วนเท่าที่ต้องใช้ และเล่าเรื่องของผู้ผลิตผ่าน InfoCard
            ในกล่อง เพื่อให้ทุกมื้อสร้างคุณค่ามากกว่าความอร่อย
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {impacts.map(([value, label]) => (
              <article
                key={value}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <strong className="text-3xl text-[#f2c89f]">{value}</strong>
                <p className="mt-2 text-lg leading-6 text-[#d8c8bb]">{label}</p>
              </article>
            ))}
          </div>
          <a
            href="#kits"
            className="mt-8 inline-flex rounded-full
             bg-white px-6 py-3 font-bold text-[#3d2c2e] text-xl hover:bg-[#f1dec9]"
          >
            เลือกเมนูจากท้องถิ่น →
          </a>
        </div>
      </div>
    </section>
  );
}
