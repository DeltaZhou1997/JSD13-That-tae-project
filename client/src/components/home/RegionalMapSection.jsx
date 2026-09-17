import { useCallback, useEffect, useRef, useState } from "react";
<<<<<<< HEAD
=======
import { Link } from "react-router-dom";
>>>>>>> feature/delta-storefront-product-api
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
<<<<<<< HEAD
  const marqueeTweenRef = useRef(null);
=======
>>>>>>> feature/delta-storefront-product-api
  const active = regions[activeIndex];
  const activeDishes = Object.values(dishes).filter(
    (dish) => dish.region === active.dataRegion,
  );

<<<<<<< HEAD
  const isMapPreparedRef = useRef(false);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

=======
>>>>>>> feature/delta-storefront-product-api
  const selectRegion = useCallback((regionId) => {
    const nextIndex = regions.findIndex((region) => region.id === regionId);
    if (nextIndex !== -1) setActiveIndex(nextIndex);
  }, []);

<<<<<<< HEAD
  // รวมจังหวัดในไฟล์ SVG เป็นกลุ่มครั้งเดียวเมื่อ SVG โหลดเสร็จ
=======
  // รวมจังหวัดในไฟล์ SVG เป็นกลุ่ม เพื่อให้ยกขึ้นพร้อมกันทั้งภูมิภาค
>>>>>>> feature/delta-storefront-product-api
  const prepareMap = useCallback(() => {
    const svg = mapObjectRef.current?.contentDocument?.querySelector("svg");
    const featureLayer = svg?.querySelector("#features");
    if (!svg || !featureLayer) return;

    svg.style.overflow = "visible";
    mapGroupsRef.current.clear();

    regions.forEach((region) => {
<<<<<<< HEAD
      let group = featureLayer.querySelector(`g[data-region="${region.id}"]`);
      if (!group) {
        group = document.createElementNS("http://www.w3.org/2000/svg", "g");
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
        group.addEventListener("click", () => selectRegion(region.id));
        featureLayer.appendChild(group);
      }
      mapGroupsRef.current.set(region.id, group);

      const isSelected = region.id === regions[activeIndexRef.current].id;
      gsap.set(group, {
        fill: isSelected ? "#5c3729" : "#b8896b",
        opacity: isSelected ? 1 : 0.82,
        y: isSelected ? -22 : 0,
        scale: isSelected ? 1.05 : 1,
        transformOrigin: "50% 50%",
        filter: isSelected
          ? "drop-shadow(0px 20px 16px rgba(45, 28, 26, 0.38))"
          : "drop-shadow(0px 0px 0px rgba(45, 28, 26, 0))",
      });

      const paths = group.querySelectorAll("path");
      gsap.set(paths, {
        stroke: isSelected ? "#ffffff" : "#f3e8dc",
        strokeWidth: isSelected ? 1.2 : 0.8,
      });
    });

    // ตัดพื้นที่ว่างเดิมของ SVG ออก และเว้น padding เผื่อระยะการลอยและเงา
    const bounds = featureLayer.getBBox();
    const padding = 36;
=======
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
>>>>>>> feature/delta-storefront-product-api
    svg.setAttribute(
      "viewBox",
      `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`,
    );
<<<<<<< HEAD
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    isMapPreparedRef.current = true;
  }, [selectRegion]);

  // ตรวจสอบความพร้อมของ SVG หากโหลดเสร็จก่อน event listener ทำงาน
  useEffect(() => {
    const svg = mapObjectRef.current?.contentDocument?.querySelector("svg");
    if (svg && !isMapPreparedRef.current) {
      prepareMap();
    }
  }, [prepareMap]);
=======
    svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
  }, [activeIndex, selectRegion]);
>>>>>>> feature/delta-storefront-product-api

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

<<<<<<< HEAD
  // GSAP ทำให้แผนที่ลอยขึ้น-ลงอย่างนุ่มนวล มีแอนิเมชัน Smooth Physics แบบ Back.out
  useEffect(() => {
    mapGroupsRef.current.forEach((group, regionId) => {
      const selected = regionId === active.id;
      const paths = group.querySelectorAll("path");

      gsap.to(group, {
        fill: selected ? "#5c3729" : "#b8896b",
        y: selected ? -22 : 0,
        scale: selected ? 1.05 : 1,
        transformOrigin: "50% 50%",
        opacity: selected ? 1 : 0.82,
        filter: selected
          ? "drop-shadow(0px 20px 16px rgba(45, 28, 26, 0.38))"
          : "drop-shadow(0px 0px 0px rgba(45, 28, 26, 0))",
        duration: selected ? 0.75 : 0.5,
        ease: selected ? "back.out(1.65)" : "power2.out",
        overwrite: "auto",
      });

      gsap.to(paths, {
        stroke: selected ? "#ffffff" : "#f3e8dc",
        strokeWidth: selected ? 1.2 : 0.8,
        duration: selected ? 0.6 : 0.4,
        ease: "power2.out",
        overwrite: "auto",
=======
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
>>>>>>> feature/delta-storefront-product-api
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
<<<<<<< HEAD
      marqueeTweenRef.current = gsap.fromTo(
=======
      gsap.fromTo(
>>>>>>> feature/delta-storefront-product-api
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
<<<<<<< HEAD
    <section id="kits" className="home-section scroll-mt-24 overflow-hidden bg-[#efe5d8]">
      <div className="home-container">
        {/* หัวข้อส่วนแผนที่ */}
        <div className="mb-8 lg:mb-12 max-w-3xl">
          <span className="home-eyebrow">Interactive Regional Flavors</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl text-[#251911]">
            เมนูไทยหลากหลาย จากเหนือสู่ใต้
          </h2>
          <p className="mt-3 sm:mt-4 leading-7 text-lg sm:text-xl text-[#6f675f]">
            ชุด Cooking Kit พร้อมปรุง รวบรวมอาหารไทยจานเด็ดจาก 4 ภูมิภาคทั่วไทย พร้อมให้ทุกคนได้ลิ้มลอง
          </p>
        </div>

        {/* ปุ่มเลือกภูมิภาคบนจอมือถือและแท็บเล็ต */}
        <div
          className="hide-scrollbar mb-6 flex w-full gap-2 overflow-x-auto pb-1 lg:hidden"
          aria-label="เลือกภูมิภาค"
        >
          {regions.map((region, index) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`cursor-pointer shrink-0 rounded-full border px-4 py-2 sm:px-5 sm:py-2.5 text-base sm:text-lg font-medium transition-all duration-200 ${active.id === region.id
                  ? "border-[#3d2c2e] bg-[#3d2c2e] text-white shadow-md scale-[1.02]"
                  : "border-[#cdbdac] bg-white/70 text-[#6f5b4e] hover:bg-white"
                }`}
              aria-pressed={active.id === region.id}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Grid แสดงแผนที่คู่กับการ์ดอาหาร */}
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] 2xl:grid-cols-[440px_minmax(0,1fr)] lg:items-start xl:gap-12">
          {/* คอลัมน์แผนที่ประเทศไทย */}
          <div
            className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <div className="relative h-[380px] sm:h-[460px] lg:h-[580px] xl:h-[660px] 2xl:h-[700px] w-full flex items-center justify-center">
              {/* แสงเงาใต้ฐานแผนที่เพื่อเสริมมิติความลึกของการลอย */}
              <div
                className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 h-8 w-2/3 rounded-full bg-[#3d2c2e]/15 blur-xl transition-opacity duration-500"
                aria-hidden="true"
              />
=======
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
>>>>>>> feature/delta-storefront-product-api
              <object
                ref={mapObjectRef}
                data={thailandMap}
                type="image/svg+xml"
                aria-label="แผนที่ประเทศไทยแบบโต้ตอบ แบ่งตามภูมิภาค"
<<<<<<< HEAD
                className="h-full w-full object-contain overflow-visible"
=======
                className="h-full w-full overflow-visible"
>>>>>>> feature/delta-storefront-product-api
                onLoad={prepareMap}
              />
            </div>

            <div
              ref={labelRef}
<<<<<<< HEAD
              className="pointer-events-none mx-auto -mt-2 w-fit rounded-full border border-white/80 bg-[#3d2c2e]/95 px-5 py-2 text-base sm:text-lg font-bold text-white shadow-xl backdrop-blur"
=======
              className="pointer-events-none mx-auto  w-fit rounded-full border border-white/80 bg-[#3d2c2e]/95 px-5 py-2.5 text-xl font-bold text-white shadow-xl backdrop-blur"
>>>>>>> feature/delta-storefront-product-api
            >
              {active.label}
            </div>

            <div
<<<<<<< HEAD
              className="mt-3 sm:mt-4 flex justify-center gap-2"
=======
              className="mt-4 flex justify-center gap-2"
>>>>>>> feature/delta-storefront-product-api
              aria-label="เลือกภูมิภาค"
            >
              {regions.map((region, index) => (
                <button
                  key={region.id}
                  type="button"
                  onFocus={() => setIsInteracting(true)}
                  onBlur={() => setIsInteracting(false)}
                  onClick={() => setActiveIndex(index)}
<<<<<<< HEAD
                  className={`h-2.5 rounded-full cursor-pointer transition-[width,background-color] duration-300 ${active.id === region.id
                      ? "w-8 bg-[#3d2c2e]"
                      : "w-2.5 bg-[#bcae9e] hover:bg-[#8d7b68]"
                    }`}
=======
                  className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${active.id === region.id ? "w-8 bg-[#3d2c2e]" : "w-2.5 bg-[#bcae9e] hover:bg-[#8d7b68]"}`}
>>>>>>> feature/delta-storefront-product-api
                  aria-label={`แสดง${region.label}`}
                  aria-pressed={active.id === region.id}
                />
              ))}
            </div>
          </div>

<<<<<<< HEAD
          {/* คอลัมน์รายละเอียดภูมิภาคและการ์ดอาหาร */}
          <div className="min-w-0" ref={detailsRef} key={active.id} aria-live="polite">
            <div data-region-content className="flex items-center gap-3">
              <span
                className="h-3.5 w-3.5 rounded-full shadow-sm"
                style={{ backgroundColor: active.accent }}
              />
              <span className="font-bold text-2xl sm:text-3xl xl:text-4xl text-[#5e5046]">
                {active.label}
              </span>
            </div>

            <p data-region-content className="mt-2 sm:mt-3 text-base sm:text-lg xl:text-xl text-[#6f675f] leading-relaxed max-w-2xl">
              {active.description}
            </p>

            <div
              data-region-content
              className="regional-marquee-viewport mt-6 sm:mt-8 overflow-hidden py-2"
              onMouseEnter={() => marqueeTweenRef.current?.pause()}
              onMouseLeave={() => marqueeTweenRef.current?.resume()}
=======
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
>>>>>>> feature/delta-storefront-product-api
            >
              <div
                ref={marqueeRef}
                className="flex w-max will-change-transform"
              >
                {[0, 1].map((copyIndex) => (
                  <div
                    key={copyIndex}
<<<<<<< HEAD
                    className="flex shrink-0 gap-5 sm:gap-7 pr-5 sm:pr-7"
=======
                    className="flex shrink-0 gap-8 pr-4"
>>>>>>> feature/delta-storefront-product-api
                    aria-hidden={copyIndex === 1}
                  >
                    {activeDishes.map((dish) => (
                      <article
                        key={`${copyIndex}-${dish._id}`}
<<<<<<< HEAD
                        className="group w-[270px] sm:w-[320px] md:w-[360px] xl:w-[380px] shrink-0 overflow-hidden rounded-3xl bg-[#fdfbf7] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                        <div className="h-[220px] sm:h-[260px] xl:h-[300px] w-full overflow-hidden bg-[#e8ded0]">
                          <img
                            src={dish.imageUrl[0]}
                            alt={copyIndex === 0 ? dish.nameTh : ""}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-5 sm:p-6">
                          <h4 className="font-bold text-xl sm:text-2xl text-[#251911]">
                            {dish.nameTh}
                          </h4>
                          <p className="mt-2 line-clamp-2 text-sm sm:text-base leading-snug text-[#766b63]">
=======
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
>>>>>>> feature/delta-storefront-product-api
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
<<<<<<< HEAD
=======
          </div>
>>>>>>> feature/delta-storefront-product-api
        </div>
      </div>
    </section>
  );
}
