import { useRef } from "react";

import FeatureSection from "../components/home/FeatureSection.jsx";
import RegionalMapSection from "../components/home/RegionalMapSection.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import StorySection from "../components/home/StorySection.jsx";
import StepsSection from "../components/home/StepsSection.jsx";
import ElementsSection from "../components/home/ElementsSection.jsx";
import ReviewsSection from "../components/home/ReviewsSection.jsx";
import useHomeAnimations from "../hooks/useHomeAnimations.js";

export default function HomePage() {
  const pageRef = useRef(null);

  // เริ่ม animation และจำกัดการทำงานให้อยู่ภายในหน้า Home เท่านั้น
  useHomeAnimations(pageRef);

  return (
    <div ref={pageRef} className="home-page w-full">
      {/* Hero แสดงเต็มความกว้างหน้าจอ */}
      <HeroSection />

      <div data-animate-section>
        <FeatureSection />
      </div>
      <div data-animate-section>
        <RegionalMapSection />
      </div>
      <div data-animate-section>
        <StorySection />
      </div>
      <div data-animate-section>
        <StepsSection />
      </div>
      <div data-animate-section>
        <ElementsSection />
      </div>
      <div data-animate-section>
        <ReviewsSection />
      </div>
    </div>
  );
}
