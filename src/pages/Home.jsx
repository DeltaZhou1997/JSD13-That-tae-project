import { useRef } from "react";

import FeatureSection from "../components/home/FeatureSection.jsx";
import RegionalMapSection from "../components/home/RegionalMapSection.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import StorySection from "../components/home/StorySection.jsx";
import StepsSection from "../components/home/StepsSection.jsx";
import ElementsSection from "../components/home/ElementsSection.jsx";
import ReviewsSection from "../components/home/ReviewsSection.jsx";
import useHomeAnimations from "../hooks/useHomeAnimations.js";
import { useOutletContext } from "react-router-dom";
import dishes from "../mock-data/dishes.js";

function ProductList() {
  const { handleAddToCart } = useOutletContext();
  const dishList = Object.values(dishes);

  return (
    <div
      className="product-grid"
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {dishList.slice(0, 5).map((dish) => (
        <div
          key={dish._id}
          className="card"
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{dish.nameTh}</h3>
          <p>ราคา: {dish.price} บาท</p>
          <button
            onClick={() => handleAddToCart(dish)}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      ))}
    </div>
  );
}

// 2. HomePage ตัวหลัก
export default function HomePage() {
  const pageRef = useRef(null);
  useHomeAnimations(pageRef);

  return (
    <div ref={pageRef} className="home-page w-full">
      <HeroSection />

      <div data-animate-section>
        <FeatureSection />
      </div>

      <div data-animate-section>
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>HOT</h2>
        <ProductList />
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