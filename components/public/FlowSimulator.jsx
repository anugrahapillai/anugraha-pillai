"use client";

import { useEffect, useRef, useState } from "react";

export default function FlowSimulator() {
  const canvasRef = useRef(null);
  const [machSpeed, setMachSpeed] = useState(1.2);
  const [angleId, setAngleId] = useState(6); // Angle of Attack in degrees
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = canvas.parentElement.clientWidth || 600);
    const height = (canvas.height = 280);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 2 + 3) * machSpeed,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    function draw() {
      ctx.fillStyle = "rgba(18, 16, 28, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Draw Airframe Foil Profile
      ctx.save();
      ctx.translate(width / 3, height / 2);
      ctx.rotate((-angleId * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(-70, 0);
      ctx.bezierCurveTo(-20, -35, 50, -30, 80, 0);
      ctx.bezierCurveTo(40, 15, -20, 10, -70, 0);
      ctx.fillStyle = "#1e1a30";
      ctx.strokeStyle = "#c77dff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#7b2cbf";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Shockwave Visualization for Supersonic (Mach > 1.0)
      if (machSpeed >= 1.0) {
        ctx.beginPath();
        const shockAngle = Math.asin(1 / Math.min(machSpeed, 3)) || 0.8;
        ctx.moveTo(width / 3 - 80, height / 2);
        ctx.lineTo(width / 3 - 80 + Math.cos(shockAngle) * 200, height / 2 - Math.sin(shockAngle) * 200);
        ctx.moveTo(width / 3 - 80, height / 2);
        ctx.lineTo(width / 3 - 80 + Math.cos(shockAngle) * 200, height / 2 + Math.sin(shockAngle) * 200);
        ctx.strokeStyle = "rgba(76, 201, 240, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Streamline Particles
      particles.forEach((p) => {
        p.x += p.vx * (isSimulating ? 1 : 0.1);
        if (p.x > width) {
          p.x = 0;
          p.y = Math.random() * height;
        }

        // Deflection curve around airframe
        const dx = p.x - width / 3;
        const dy = p.y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          p.y += (p.y < height / 2 ? -2.5 : 2.5) * (angleId / 5);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = machSpeed > 1.0 ? `rgba(76, 201, 240, ${p.opacity})` : `rgba(199, 125, 255, ${p.opacity})`;
        ctx.shadowColor = "#4cc9f0";
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [machSpeed, angleId, isSimulating]);

  return (
    <div className="flow-simulator panel">
      <div className="flow-simulator__header">
        <div>
          <span className="eyebrow">Interactive CFD Wind Tunnel</span>
          <h3 style={{ margin: ".2rem 0", color: "var(--text-primary)", fontFamily: "Georgia, serif" }}>
            Real-Time Streamline & Shockwave Simulator
          </h3>
          <p style={{ margin: 0, fontSize: ".85rem", color: "var(--text-secondary)" }}>
            Adjust Mach regime and angle of attack to observe boundary layer deflection and oblique shock formation.
          </p>
        </div>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => setIsSimulating(!isSimulating)}
          style={{ fontSize: ".8rem", padding: ".4rem 1rem" }}
        >
          {isSimulating ? "Pause Flow" : "Resume Flow"}
        </button>
      </div>

      <div className="flow-simulator__canvas-wrap" style={{ margin: "1.25rem 0", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--night-border)", background: "#0c0a14" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "280px" }} />
      </div>

      <div className="flow-simulator__controls" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", background: "var(--night-surface)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--night-border)" }}>
        <label style={{ display: "grid", gap: ".4rem", fontSize: ".82rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Airspeed (Mach {machSpeed.toFixed(1)}) — {machSpeed >= 1.0 ? "Supersonic Regime" : "Subsonic Regime"}
          <input
            type="range"
            min="0.4"
            max="3.0"
            step="0.1"
            value={machSpeed}
            onChange={(e) => setMachSpeed(parseFloat(e.target.value))}
            style={{ accentColor: "var(--lilac)" }}
          />
        </label>
        <label style={{ display: "grid", gap: ".4rem", fontSize: ".82rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Angle of Attack ({angleId}°)
          <input
            type="range"
            min="-5"
            max="20"
            step="1"
            value={angleId}
            onChange={(e) => setAngleId(parseInt(e.target.value, 10))}
            style={{ accentColor: "var(--cyan-glow)" }}
          />
        </label>
      </div>
    </div>
  );
}
