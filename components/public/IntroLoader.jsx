"use client";

import { useEffect, useState } from "react";

export default function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start graceful fade out after 1.1s
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1150);

    // Completely unmount overlay after 1.65s
    const unmountTimer = setTimeout(() => {
      setMounted(false);
    }, 1650);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`intro-loader-overlay ${exiting ? "is-exiting" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "radial-gradient(circle at center, #130d24 0%, #07050e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: exiting ? "none" : "all",
        transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.03)" : "scale(1)",
      }}
    >
      {/* Intro Brand Typography */}
      <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
        <h1
          className="gradient-text"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
            margin: 0,
            fontWeight: 800,
            letterSpacing: "-.01em",
          }}
        >
          ANUGRAHA PILLAI
        </h1>
      </div>

      {/* Sleek Minimalist Progress Line */}
      <div
        style={{
          width: "180px",
          height: "2px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "2px",
          marginTop: "2.25rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, var(--violet), var(--lilac), var(--cyan-glow))",
            animation: "intro-progress 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        />
      </div>
    </div>
  );
}
