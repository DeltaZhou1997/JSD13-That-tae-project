import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import thailandMap from "../../assets/thailand-map.svg";
import { dishes, regions } from "../../mock-data/index.js";

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

    // ตัดพื้นที่ว่างเดิมของ SVG ออก เพื่อให้ตัวแผนที่ขยายเต็มกรอบจริง ๆ
    const bounds = featureLayer.getBBox();
    const padding = 35;
    svg.setAttribute(
      "viewBox",
      `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`,
    );
    svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
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
        <div className="grid gap-4 xl:grid-cols-2 xl:items-start xl:gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(0,6fr)]
        2xl:grid-cols-[minmax(0,20fr)_minmax(0,80fr)]">
          <div
            className="relative hidden xl:block xl:w-full xl:w-[400px] 2xl:-translate-x-60  3xl:-translate-x-80 2xl:w-[440px]"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <div className="relative h-[560px] w-full lg:h-[650px] xl:h-[750px]">
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
              className="pointer-events-none mx-auto  w-fit rounded-full border border-white/80 bg-[#3d2c2e]/95 px-5 py-2.5 text-xl font-bold text-white shadow-xl backdrop-blur"
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

          <div className="min-w-0">
            <div className="mb-7 max-w-3xl sm:mb-10">
              <h2 className="text-3xl font-bold sm:text-5xl">
                เมนูไทยหลากหลาย จากเหนือสู่ใต้
              </h2>
              <p className="mt-4 leading-7 text-[#6f675f]">
                <span className="inline text-xl md:text-xl">
                  ชุด Cooking Kit พร้อมปรุง รวบรวมอาหารไทยจานเด็ด พร้อมให้ทุกคนได้ลิ้มลอง
                </span>
              </p>
            </div>

            <div
              className="hide-scrollbar mb-7 flex w-full gap-2 overflow-x-auto pb-1 xl:hidden"
              aria-label="เลือกภูมิภาค"
            >
              {regions.map((region, index) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer shrink-0 rounded-full border px-5 py-2.5 text-xl transition-colors ${active.id === region.id ? "border-[#3d2c2e] bg-[#3d2c2e] text-white" : "border-[#cdbdac] bg-white/55 text-[#6f5b4e]"}`}
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
              <span className="font-bold text-4xl text-[#5e5046]">{active.label}</span>
            </div>

            <p data-region-content className="mt-2 text-xl text-[#6f675f]">
              {active.description}
            </p>

            <div data-region-content className="mt-5">
              <Link 
                to={`/menus?region=${active.dataRegion}`} 
                className="inline-block rounded-full bg-[#8d5b47] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#684334]"
              >
                ดูเมนู{active.label}ทั้งหมด →
              </Link>
            </div>
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
                    className="flex shrink-0 gap-8 pr-4"
                    aria-hidden={copyIndex === 1}
                  >
                    {activeDishes.map((dish) => (
                      <article
                        key={`${copyIndex}-${dish._id}`}
                        className="group min-h-[580px] max-w-100 shrink-0 overflow-hidden 
                        rounded-3xl bg-[#fdfbf7] shadow-sm transition-shadow duration-300 hover:shadow-lg w-[480px] "
                      >
                        <img
                          src={dish.imageUrl[0]}
                          alt={copyIndex === 0 ? dish.nameTh : ""}
                          className="h-[400px] w-[full] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                        />
                        <div className="p-7">
                          <h4 className="font-bold text-3xl">{dish.nameTh}</h4>
                          <p className="mt-3 line-clamp-2 text-lg leading-5 text-[#766b63]">
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
      </div>
    </section>
  );
}
