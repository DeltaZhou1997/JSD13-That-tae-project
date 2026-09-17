const steps = [
  [
    "เลือก",
    "เลือกเมนูโปรด หรือให้เราช่วยคัดตามสุขภาพ ธาตุเจ้าเรือน และสิ่งที่คุณแพ้",
  ],
  ["รับ", "รับกล่องวัตถุดิบสดในสัดส่วนพอดี พร้อมการ์ดสูตรและข้อมูลโภชนาการ"],
  [
    "ปรุง",
    "ทำตามขั้นตอนง่าย ๆ ใช้เวลาเพียง 15–30 นาที แล้วอร่อยพร้อมกันที่บ้าน",
  ],
];

export default function StepsSection() {
  return (
    <section className="home-section bg-[linear-gradient(180deg,#f6e6d2_0%,#f1dec9_100%)]">
      <div className="home-container">
        <div className="home-heading">
          <span className="home-eyebrow">How it works</span>
          <h2 className="mt-4">จากเมนูที่ชอบ สู่จานที่ภูมิใจ</h2>
          <p>สามขั้นตอนสั้น ๆ สำหรับมื้อไทยที่สดใหม่และมีเรื่องราว</p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden border-t border-dashed border-[#a4907c] md:block" />
          {steps.map(([title, text], index) => (
            <article key={title} className="relative text-center">
              <span className="relative z-10 mx-auto grid h-24 w-24 place-items-center rounded-full border border-white/70 bg-[#fdfbf7] text-2xl font-bold text-[#7b5139] shadow-[0_18px_35px_rgba(123,81,57,0.14)]">
                {index + 1}
              </span>
              <div className="mt-6 rounded-[1.8rem] border border-white/50 bg-white/75 p-7 shadow-[0_16px_40px_rgba(123,81,57,0.08)] backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-[#2f2119]">{title}</h3>
                <p className="mt-3 leading-7 text-[#6f675f]">{text}</p>
                <div className="mt-5 inline-flex rounded-full bg-[#f6ede5] px-4 py-2 text-sm font-medium text-[#8c6a53]">
                  ขั้นตอนที่ {index + 1}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
