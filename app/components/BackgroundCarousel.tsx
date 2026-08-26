"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// ⚠️ እዚህ ላይ ተጨማሪ ምስሎችህን ጨምር (public/image/ ውስጥ ካስቀመጥካቸው በኋላ)
const lightImages = [
  "/image/restaurantlm.Webp",
  "/image/restarat.webp",
  "/image/restaurant.webp",
];

const darkImages = [
  "/image/restaurant.webp",
  "/image/restaurant.webp",
  "/image/restaurant3-dark.webp",
];

const SLIDE_INTERVAL_MS = 5000; // 5 ሰከንድ በየምስሉ

export default function BackgroundCarousel() {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = theme === "dark" ? darkImages : lightImages;

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
  }, [theme]);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {images.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1200ms ease-in-out"
          style={{
            backgroundImage: `url('${src}')`,
            transform: `translateX(${(idx - activeIndex) * 100}%)`,
          }}
        />
      ))}
    </div>
  );
}