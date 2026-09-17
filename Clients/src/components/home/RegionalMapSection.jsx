import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import thailandMap from "../../assets/thailand-map.svg";
import { dishes } from "../../mock-data/index.js";

const regions = [
  {
    id: "north",
    dataRegion: "northern",
    label: "ภาคเหนือ",
    accent: "#9b6747",
    description: "รสนุ่ม หอมเครื่องเทศและสมุนไพรจากภูเขา",
    provinceIds: [
      "TH50",
      "TH51",
      "TH52",
      "TH53",
      "TH54",
      "TH55",
      "TH56",
      "TH57",
      "TH58",
      "TH60",
      "TH62",
      "TH63",
      "TH64",
      "TH65",
      "TH66",
      "TH67",
    ],
  },
  {
    id: "northeast",
    dataRegion: "northeastern",
    label: "ภาคอีสาน",
    accent: "#a77b45",
    description: "รสแซ่บ สดชื่นจากสมุนไพร และสนุกกับการกินร่วมกัน",
    provinceIds: [
      "TH30",
      "TH31",
      "TH32",
      "TH33",
      "TH34",
      "TH35",
      "TH36",
      "TH37",
      "TH38",
      "TH39",
      "TH40",
      "TH41",
      "TH42",
      "TH43",
      "TH44",
      "TH45",
      "TH46",
      "TH47",
      "TH48",
      "TH49",
    ],
  },
  {
    id: "central",
    dataRegion: "central",
    label: "ภาคกลาง",
    accent: "#6f7b52",
    description: "ครบรส กลมกล่อม และประณีตแบบสำรับไทย",
    provinceIds: [
      "TH10",
      "TH11",
      "TH12",
      "TH13",
      "TH14",
      "TH15",
      "TH16",
      "TH17",
      "TH18",
      "TH19",
      "TH20",
      "TH21",
      "TH22",
      "TH23",
      "TH24",
      "TH25",
      "TH26",
      "TH27",
      "TH61",
      "TH70",
      "TH71",
      "TH72",
      "TH73",
      "TH74",
      "TH75",
      "TH76",
      "TH77",
      "THS",
    ],
  },
  {
    id: "south",
    dataRegion: "southern",
    label: "ภาคใต้",
    accent: "#8d5b47",
    description: "เข้มข้น จัดจ้าน หอมพริกแกงและเครื่องเทศ",
    provinceIds: [
      "TH80",
      "TH81",
      "TH82",
      "TH83",
      "TH84",
      "TH85",
      "TH86",
      "TH90",
      "TH91",
      "TH92",
      "TH93",
      "TH94",
      "TH95",
      "TH96",
    ],
  },
];

export default function RegionalMapSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const mapObjectRef = useRef(null);
  const mapGroupsRef = useRef(new Map());
  const detailsRef = useRef(null);
  const labelRef = useRef(null);
  const marqueeRef = useRef(null);
  const active = regions[activeIndex];
  const activeDishes = Object.values(dishes).filter(
    (dish) => dish.region === active.dataRegion,
  );

  const selectRegion = useCallback((regionId) => {
    const nextIndex = regions.findIndex((region) => region.id === regionId);
    if (nextIndex !== -1) setActiveIndex(nextIndex);
  }, []);

  // รวมจังหวัดในไฟล์ SVG เป็นกลุ่ม เพื่อให้ยกขึ้นพร้อมกันทั้งภูมิภาค
  const prepareMap = useCallback(() => {
    const svg = mapObjectRef.current?.contentDocument?.querySelector("svg");
    const featureLayer = svg?.querySelector("#features");
    if (!svg || !featureLayer) return;

    svg.style.overflow = "visible";
    mapGroupsRef.current.clear();

    regions.forEach((region) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.dataset.region = region.id;
      Object.assign(group.style, {
        cursor: "pointer",
        transformBox: "fill-box",
        transformOrigin: "center",
      });

      region.provinceIds.forEach((provinceId) => {
        const path = svg.querySelector(`#${provinceId}`);
        if (path) {
          path.style.stroke = "#f3e8dc";
          path.style.strokeWidth = "0.8";
          group.appendChild(path);
        }
      });

      group.addEventListener("mouseenter", () => selectRegion(region.id));
      featureLayer.appendChild(group);
      mapGroupsRef.current.set(region.id, group);

      gsap.set(group, {
        fill: region.id === regions[activeIndex].id ? "#684334" : "#b8896b",
        opacity: region.id === regions[activeIndex].id ? 1 : 0.82,
        y: region.id === regions[activeIndex].id ? -9 : 0,
        scale: region.id === regions[activeIndex].id ? 1.035 : 1,
      });
    });
  }, [activeIndex, selectRegion]);

  // เมื่อไม่ได้ชี้แผนที่ ระบบจะสุ่มภูมิภาคใหม่ทุก 15 วินาที
  useEffect(() => {
    if (isInteracting) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const choices = regions
          .map((_, index) => index)
          .filter((index) => index !== current);
        return choices[Math.floor(Math.random() * choices.length)];
      });
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [isInteracting]);

  // GSAP ทำให้แผนที่ ชื่อภาค และข้อมูลอาหารเปลี่ยนอย่างต่อเนื่อง
  useEffect(() => {
    mapGroupsRef.current.forEach((group, regionId) => {
      const selected = regionId === active.id;
      gsap.to(group, {
        fill: selected ? "#684334" : "#b8896b",
        y: selected ? -9 : 0,
        scale: selected ? 1.035 : 1,
        opacity: selected ? 1 : 0.82,
        filter: selected
          ? "drop-shadow(0 14px 10px rgba(61,44,46,.24))"
          : "none",
        duration: selected ? 0.7 : 0.45,
        ease: selected ? "back.out(1.65)" : "power2.out",
        overwrite: true,
      });
    });

    const context = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { autoAlpha: 0, y: 14, scale: 0.88 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.8)" },
      );
      gsap.fromTo(
        detailsRef.current?.querySelectorAll("[data-region-content]"),
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.55,
          ease: "power3.out",
        },
      );

      const marquee = marqueeRef.current;
      gsap.fromTo(
        marquee,
        { xPercent: 0 },
        {
          xPercent: -50,
          duration: Math.max(activeDishes.length * 4, 18),
          ease: "none",
          repeat: -1,
        },
      );
    }, detailsRef);
    return () => context.revert();
  }, [active, activeDishes.length]);

  return (
    <section id="kits" className="home-section scroll-mt-24 bg-[#efe5d8]">
      <div className="home-container">
        <div className="mb-7 max-w-3xl sm:mb-10">
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            เมนูไทยหลากหลาย จากเหนือสู่ใต้
          </h2>
          <p className="mt-4 leading-7 text-[#6f675f]">
            <span className="hidden lg:inline">
              ลองวางเมาส์บนแผนที่เพื่อเปิดรสชาติของแต่ละภูมิภาค หากไม่ได้เลือก
              ระบบจะพาเที่ยวทั่วไทยทุก 10 วินาที
            </span>
            <span className="lg:hidden">
              เลือกภูมิภาคที่สนใจ แล้วสำรวจเมนูไทยที่เลื่อนมาให้ชมได้ทันที
            </span>
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)] lg:gap-12">
          <div
            className="relative mx-auto hidden w-full max-w-[390px] lg:block lg:mx-0"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <div className="relative aspect-square p-2">
              <object
                ref={mapObjectRef}
                data={thailandMap}
                type="image/svg+xml"
                aria-label="แผนที่ประเทศไทยแบบโต้ตอบ แบ่งตามภูมิภาค"
                className="h-full w-full overflow-visible"
                onLoad={prepareMap}
              />
            </div>

            <div
              ref={labelRef}
              className="pointer-events-none mx-auto  w-fit rounded-full border border-white/80 bg-[#3d2c2e]/95 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur"
            >
              {active.label}
            </div>

            <div
              className="mt-4 flex justify-center gap-2"
              aria-label="เลือกภูมิภาค"
            >
              {regions.map((region, index) => (
                <button
                  key={region.id}
                  type="button"
                  onFocus={() => setIsInteracting(true)}
                  onBlur={() => setIsInteracting(false)}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${active.id === region.id ? "w-8 bg-[#3d2c2e]" : "w-2.5 bg-[#bcae9e] hover:bg-[#8d7b68]"}`}
                  aria-label={`แสดง${region.label}`}
                  aria-pressed={active.id === region.id}
                />
              ))}
            </div>
          </div>

          <div
            className="hide-scrollbar flex w-full gap-2 overflow-x-auto pb-1 lg:hidden"
            aria-label="เลือกภูมิภาค"
          >
            {regions.map((region, index) => (
              <button
                key={region.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${active.id === region.id ? "border-[#3d2c2e] bg-[#3d2c2e] text-white" : "border-[#cdbdac] bg-white/55 text-[#6f5b4e]"}`}
                aria-pressed={active.id === region.id}
              >
                {region.label}
              </button>
            ))}
          </div>

          <div ref={detailsRef} key={active.id} aria-live="polite">
            <div data-region-content className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: active.accent }}
              />
              <span className="font-bold text-[#7b6658]">{active.label}</span>
            </div>
            <h3 data-region-content className="mt-3 text-2xl font-bold sm:text-3xl">
              เมนูเด่นจาก{active.label}
            </h3>
            <p data-region-content className="mt-2 text-[#6f675f]">
              {active.description}
            </p>
            <div
              data-region-content
              className="regional-marquee-viewport mt-6 overflow-hidden py-1"
            >
              <div
                ref={marqueeRef}
                className="flex w-max will-change-transform"
              >
                {[0, 1].map((copyIndex) => (
                  <div
                    key={copyIndex}
                    className="flex shrink-0 gap-4 pr-4"
                    aria-hidden={copyIndex === 1}
                  >
                    {activeDishes.map((dish) => (
                      <article
                        key={`${copyIndex}-${dish._id}`}
                        className="group w-[82vw] max-w-[400px] shrink-0 overflow-hidden rounded-2xl bg-[#fdfbf7] shadow-sm transition-shadow duration-300 hover:shadow-lg sm:w-[400px]"
                      >
                        <img
                          src={dish.imageUrl[0]}
                          alt={copyIndex === 0 ? dish.nameTh : ""}
                          className="h-[180px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                        />
                        <div className="p-4">
                          <h4 className="font-bold text-2xl">{dish.nameTh}</h4>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#766b63]">
                            {dish.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
