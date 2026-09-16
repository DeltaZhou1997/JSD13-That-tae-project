import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// animations control
export default function useHomeAnimations(pageRef) {
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (reduceMotion || mobileViewport) return undefined;

    const animationContext = gsap.context(() => {
      const sections = gsap.utils.toArray("[data-animate-section]");

      sections.forEach((section) => {
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
