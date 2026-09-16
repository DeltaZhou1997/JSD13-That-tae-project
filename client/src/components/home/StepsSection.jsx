import { LottieSvg } from "lottie-react";
import orderFoodAnimation from "../../assets/StepsLotties/1orderfood.json";
import sendOrderAnimation from "../../assets/StepsLotties/2sentorder.json";
import cookingAnimation from "../../assets/StepsLotties/3Cooking.json";

const steps = [
  {
    title: "เลือก",
    text: "เลือกเมนูโปรด หรือให้เราช่วยคัดตามสุขภาพ ธาตุเจ้าเรือน และสิ่งที่คุณแพ้",
    animationData: orderFoodAnimation,
    animationLabel: "ภาพเคลื่อนไหวการเลือกเมนู",
  },
  {
    title: "รับ",
    text: "รับกล่องวัตถุดิบสดในสัดส่วนพอดี พร้อมการ์ดสูตรและข้อมูลโภชนาการ",
    animationData: sendOrderAnimation,
    animationLabel: "ภาพเคลื่อนไหวรถจัดส่งกล่องวัตถุดิบ",
  },
  {
    title: "ปรุง",
    text: "ทำตามขั้นตอนง่าย ๆ ใช้เวลาเพียง 15–30 นาที แล้วอร่อยพร้อมกันที่บ้าน",
    animationData: cookingAnimation,
    animationLabel: "ภาพเคลื่อนไหวแสดงขั้นตอนการปรุงอาหาร",
  },
];

function StepAnimation({ animationData, label }) {
  return (
    <div
      className="relative mx-auto grid aspect-square w-full max-w-[210px] place-items-center"
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-[10%] rounded-full bg-[#efd6bc]/55 blur-2xl" />
      <LottieSvg
        src={animationData}
        loop
        autoplay
        className="relative z-10 h-full w-full"
      />
    </div>
  );
}

export default function StepsSection() {
  return (
    <section className="home-section overflow-hidden bg-[linear-gradient(180deg,#f6e6d2_0%,#f1dec9_100%)]">
      <div className="home-container">
        <div className="home-heading mx-auto max-w-2xl text-center">

          <h2 className="mt-4">จากเมนูที่ชอบ สู่จานที่ภูมิใจ ที่คุณได้ปรุงเอง</h2>
          <span className="text-2xl">สามขั้นตอนสั้น ๆ สำหรับมื้อไทยที่สดใหม่และมีเรื่องราว</span>
        </div>

        <div className="relative mt-10 grid gap-6 md:grid-cols-3 md:gap-5 lg:mt-14 lg:gap-8">
          <div className="absolute left-[16%] right-[16%] top-[106px] hidden border-t-2 border-dashed border-[#b99778]/45 md:block" />

          {steps.map(({ title, text, animationData, animationLabel }) => (
            <article
              key={title}
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/65 bg-white/65 p-5 text-center shadow-[0_18px_45px_rgba(123,81,57,0.09)] backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-[0_26px_60px_rgba(123,81,57,0.15)] sm:p-6"
            >
              <StepAnimation
                animationData={animationData}
                label={animationLabel}
              />

              <div className="relative z-10 mt-2 flex flex-1 flex-col rounded-[1.5rem] border border-white/80 bg-[#fdfbf7]/80 p-5">
                <h3 className="text-2xl font-bold text-[#2f2119]">{title}</h3>
                <p className="mt-3 flex-1 text-xl leading-7 text-[#6f675f]">{text}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
