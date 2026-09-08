import { useEffect, useState } from "react";
import { LottieSvg } from "lottie-react";

const steps = [
  {
    title: "เลือก",
    text: "เลือกเมนูโปรด หรือให้เราช่วยคัดตามสุขภาพ ธาตุเจ้าเรือน และสิ่งที่คุณแพ้",
    animationUrl:
      "https://raw.githubusercontent.com/useAnimations/react-useanimations/master/src/lib/checkBox/checkBox.json",
    animationLabel: "ภาพเคลื่อนไหวการเลือกเมนู",
  },
  {
    title: "รับ",
    text: "รับกล่องวัตถุดิบสดในสัดส่วนพอดี พร้อมการ์ดสูตรและข้อมูลโภชนาการ",
    animationUrl:
      "https://raw.githubusercontent.com/xvrh/lottie-flutter/master/example/assets/lottiefiles/delivery_van.json",
    animationLabel: "ภาพเคลื่อนไหวรถจัดส่งกล่องวัตถุดิบ",
  },
  {
    title: "ปรุง",
    text: "ทำตามขั้นตอนง่าย ๆ ใช้เวลาเพียง 15–30 นาที แล้วอร่อยพร้อมกันที่บ้าน",
    animationUrl:
      "https://raw.githubusercontent.com/useAnimations/react-useanimations/master/src/lib/activity/activity.json",
    animationLabel: "ภาพเคลื่อนไหวแสดงขั้นตอนการปรุงอาหาร",
  },
];

function StepAnimation({ src, label }) {
  const [animationData, setAnimationData] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load Lottie animation");
        return response.json();
      })
      .then(setAnimationData)
      .catch((error) => {
        if (error.name !== "AbortError") setHasError(true);
      });

    return () => controller.abort();
  }, [src]);

  return (
    <div
      className="relative mx-auto grid aspect-square w-full max-w-[210px] place-items-center"
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-[10%] rounded-full bg-[#efd6bc]/55 blur-2xl" />
      {animationData ? (
        <LottieSvg
          src={animationData}
          loop
          autoplay
          className="relative z-10 h-full w-full"
        />
      ) : (
        <div
          className={`relative z-10 grid h-24 w-24 place-items-center rounded-full border border-white/80 bg-[#fdfbf7] text-3xl font-bold text-[#8d593a] shadow-sm ${hasError ? "opacity-100" : "animate-pulse"}`}
          aria-hidden="true"
        >
          {hasError ? "•" : ""}
        </div>
      )}
    </div>
  );
}

export default function StepsSection() {
  return (
    <section className="home-section overflow-hidden bg-[linear-gradient(180deg,#f6e6d2_0%,#f1dec9_100%)]">
      <div className="home-container">
        <div className="home-heading mx-auto max-w-2xl text-center">
          <span className="home-eyebrow">How it works</span>
          <h2 className="mt-4">จากเมนูที่ชอบ สู่จานที่ภูมิใจ</h2>
          <p>สามขั้นตอนสั้น ๆ สำหรับมื้อไทยที่สดใหม่และมีเรื่องราว</p>
        </div>

        <div className="relative mt-10 grid gap-6 md:grid-cols-3 md:gap-5 lg:mt-14 lg:gap-8">
          <div className="absolute left-[16%] right-[16%] top-[106px] hidden border-t-2 border-dashed border-[#b99778]/45 md:block" />

          {steps.map(({ title, text, animationUrl, animationLabel }, index) => (
            <article
              key={title}
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/65 bg-white/65 p-5 text-center shadow-[0_18px_45px_rgba(123,81,57,0.09)] backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-[0_26px_60px_rgba(123,81,57,0.15)] sm:p-6"
            >
              <span className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-[#3d2c2e] text-sm font-bold text-white shadow-lg">
                {String(index + 1).padStart(2, "0")}
              </span>

              <StepAnimation src={animationUrl} label={animationLabel} />

              <div className="relative z-10 mt-2 flex flex-1 flex-col rounded-[1.5rem] border border-white/80 bg-[#fdfbf7]/80 p-5">
                <h3 className="text-2xl font-bold text-[#2f2119]">{title}</h3>
                <p className="mt-3 flex-1 leading-7 text-[#6f675f]">{text}</p>
                <div className="mx-auto mt-5 inline-flex rounded-full bg-[#f1dec9] px-4 py-2 text-sm font-bold text-[#8c5c40]">
                  ขั้นตอนที่ {index + 1}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#8c796b]">
          Lottie animations: useAnimations (CC BY 4.0) และ LottieFiles community
        </p>
      </div>
    </section>
  );
}
