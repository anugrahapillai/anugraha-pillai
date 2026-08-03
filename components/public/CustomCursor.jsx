"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef(null);
  const smokeContainerRef = useRef(null);

  const isAdminRoute = pathname?.startsWith("/admin");
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [rotation, setRotation] = useState(0);

  const lastPos = useRef({ x: -100, y: -100 });
  const isMoving = useRef(false);
  const idleTimer = useRef(null);

  useEffect(() => {
    if (isAdminRoute || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(true);
    }
  }, [isAdminRoute]);

  // Emit a jet engine smoke puff behind the airplane nozzle
  const createSmokePuff = useCallback((x, y, currentRotation, isIdle = false) => {
    if (!smokeContainerRef.current) return;

    // Calculate nozzle position behind airplane tail
    const rad = (currentRotation * Math.PI) / 180;
    const tailOffset = 18;
    const tailX = x - tailOffset * Math.sin(rad);
    const tailY = y + tailOffset * Math.cos(rad);

    const smoke = document.createElement("div");
    smoke.className = `smoke-particle ${isIdle ? "smoke-particle--idle" : ""}`;

    const size = isIdle ? Math.random() * 8 + 8 : Math.random() * 14 + 10;
    const dx = (Math.random() - 0.5) * (isIdle ? 10 : 20);
    const dy = (Math.random() - 0.5) * (isIdle ? 10 : 20);

    smoke.style.left = `${tailX - size / 2}px`;
    smoke.style.top = `${tailY - size / 2}px`;
    smoke.style.width = `${size}px`;
    smoke.style.height = `${size}px`;
    smoke.style.setProperty("--dx", `${dx}px`);
    smoke.style.setProperty("--dy", `${dy}px`);

    smokeContainerRef.current.appendChild(smoke);

    setTimeout(() => {
      smoke.remove();
    }, isIdle ? 1800 : 1200);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      let newRotation = rotation;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        newRotation = angle + 90;
        setRotation(newRotation);

        isMoving.current = true;

        // Emit dense smoke while moving
        if (Math.random() < 0.85) {
          createSmokePuff(x, y, newRotation, false);
        }
      }

      // Reset idle detector timer
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isMoving.current = false;
      }, 150);

      lastPos.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(idleTimer.current);
    };
  }, [enabled, rotation, createSmokePuff]);

  // Idle engine smoke interval (emits light smoke while still)
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (!isMoving.current && lastPos.current.x > 0 && lastPos.current.y > 0) {
        createSmokePuff(lastPos.current.x, lastPos.current.y, rotation, true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [enabled, rotation, createSmokePuff]);

  if (isAdminRoute || !enabled) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * {
          cursor: none !important;
        }
      `}} />
      <div ref={smokeContainerRef} className="smoke-layer" />
      <div
        ref={cursorRef}
        className="custom-airplane-cursor"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 2C17.2 2 16.5 4.5 16.5 8L16 16L4 21V23.5L16 20.5V28L12 30.5V32.5L18 31L24 32.5V30.5L20 28V20.5L32 23.5V21L20 16L19.5 8C19.5 4.5 18.8 2 18 2Z"
            fill="url(#white-plane-grad)"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M17.2 6.5C17.2 5.5 17.5 4.5 18 4.5C18.5 4.5 18.8 5.5 18.8 6.5L18.8 9.5H17.2V6.5Z"
            fill="#e2e8f0"
            opacity="0.9"
          />
          <rect x="10" y="18" width="2" height="4.5" rx="1" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          <rect x="24" y="18" width="2" height="4.5" rx="1" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          <circle cx="4" cy="22" r="1" fill="#ffffff" />
          <circle cx="32" cy="22" r="1" fill="#ffffff" />
          <defs>
            <linearGradient id="white-plane-grad" x1="18" y1="2" x2="18" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#f8fafc" />
              <stop offset="1" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
