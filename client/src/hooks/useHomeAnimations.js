import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * รวม animation ของหน้า Home ไว้ที่เดียว เพื่อไม่ให้ component แต่ละส่วนมี logic ปะปน
 * element ที่ต้องการให้แสดงตอนเลื่อนถึง ให้ใส่ data-animate-section
 */
export default function useHomeAnimations(pageRef) {
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    // เคารพการตั้งค่าระบบของผู้ใช้ที่ต้องการลดการเคลื่อนไหว
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (reduceMotion || mobileViewport) return undefined;

    // จำกัด selector ให้อยู่ในหน้า Home และล้าง animation เมื่อออกจากหน้า
    const animationContext = gsap.context(() => {
      const sections = gsap.utils.toArray("[data-animate-section]");

      sections.forEach((section) => {
        // เลือกเฉพาะรายการย่อยที่เหมาะกับการแสดงแบบไล่ลำดับ
        const items = section.querySelectorAll("article, blockquote, details");

        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          },
        );

        // การ์ดหรือรายการย่อยจะค่อย ๆ แสดงตามกันมา
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 76%", once: true },
            },
          );
        }
      });
    }, page);

    return () => animationContext.revert();
  }, [pageRef]);
}
