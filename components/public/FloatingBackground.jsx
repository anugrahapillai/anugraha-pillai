"use client";

import { useEffect, useState } from "react";

export default function FloatingBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute dynamic scroll animation values for top glow spot (30% brightness reduction)
  const mainGlowScale = 1 + Math.min(scrollY * 0.0015, 0.65);
  const mainGlowY = Math.min(scrollY * 0.22, 180);
  const mainGlowOpacity = Math.max(0.22, 0.45 - scrollY * 0.0003);
  const secondaryGlowX = Math.sin(scrollY * 0.003) * 60;
  const secondaryGlowY = Math.min(scrollY * 0.18, 220);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Dynamic Animated Top Primary Glow Spot (Violet/Lilac - Reduced 30% Brightness) */}
      <div
        style={{
          position: "absolute",
          top: "-180px",
          left: "50%",
          width: "720px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(199, 125, 255, 0.30) 0%, rgba(123, 44, 191, 0.15) 45%, rgba(12, 10, 20, 0) 70%)",
          filter: `blur(${85 + Math.min(scrollY * 0.05, 35)}px)`,
          transform: `translateX(-50%) translateY(${mainGlowY}px) scale(${mainGlowScale})`,
          opacity: mainGlowOpacity,
          willChange: "transform, opacity, filter",
          transition: "transform 0.1s ease-out, opacity 0.2s ease-out",
        }}
      />

      {/* Dynamic Animated Secondary Top Accent Glow Spot (Cyan/Blue - Reduced 30% Brightness) */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "10%",
          width: "500px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(76, 201, 240, 0.18) 0%, rgba(123, 44, 191, 0.08) 50%, transparent 75%)",
          filter: "blur(90px)",
          transform: `translate3d(${secondaryGlowX}px, ${secondaryGlowY}px, 0)`,
          opacity: 0.28,
          willChange: "transform",
          transition: "transform 0.15s ease-out",
        }}
      />
    </div>
  );
}
