"use client";

import { useState } from "react";

export default function AeroCalculator() {
  const [altitude, setAltitude] = useState(30000); // feet
  const [velocity, setVelocity] = useState(250); // m/s
  const [chord, setChord] = useState(2.5); // meters

  // Standard atmospheric density approximation (kg/m^3) based on altitude (ft)
  const density = Math.max(0.1, (1.225 * Math.exp(-altitude / 30000)).toFixed(3));
  const dynamicPressure = Math.round(0.5 * density * velocity * velocity);
  const reynoldsNumber = ((density * velocity * chord) / 0.0000178).toExponential(2);

  return (
    <div className="aero-calculator panel" style={{ background: "var(--night-card)", border: "1px solid var(--night-border)", padding: "1.75rem", borderRadius: "var(--radius-md)" }}>
      <span className="eyebrow">Interactive Telemetry Tool</span>
      <h3 style={{ margin: ".3rem 0 1rem", fontFamily: "Georgia, serif", color: "var(--text-primary)" }}>
        Aerodynamic Flight Parameter Estimator
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <label style={{ display: "grid", gap: ".35rem", fontSize: ".82rem", fontWeight: 700 }}>
          Altitude ({altitude.toLocaleString()} ft)
          <input
            type="range"
            min="0"
            max="60000"
            step="1000"
            value={altitude}
            onChange={(e) => setAltitude(parseInt(e.target.value, 10))}
            style={{ accentColor: "var(--lilac)" }}
          />
        </label>

        <label style={{ display: "grid", gap: ".35rem", fontSize: ".82rem", fontWeight: 700 }}>
          Free-Stream Velocity ({velocity} m/s)
          <input
            type="range"
            min="50"
            max="800"
            step="10"
            value={velocity}
            onChange={(e) => setVelocity(parseInt(e.target.value, 10))}
            style={{ accentColor: "var(--cyan-glow)" }}
          />
        </label>

        <label style={{ display: "grid", gap: ".35rem", fontSize: ".82rem", fontWeight: 700 }}>
          Wing Mean Chord ({chord} m)
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={chord}
            onChange={(e) => setChord(parseFloat(e.target.value))}
            style={{ accentColor: "var(--lilac)" }}
          />
        </label>
      </div>

      <div className="aero-calculator__results" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", background: "var(--night-surface)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--night-border)", textAlign: "center" }}>
        <div>
          <small style={{ color: "var(--text-muted)", fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em", display: "block" }}>Air Density (ρ)</small>
          <strong style={{ fontSize: "1.25rem", color: "var(--cyan-glow)" }}>{density} kg/m³</strong>
        </div>
        <div>
          <small style={{ color: "var(--text-muted)", fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em", display: "block" }}>Dynamic Pressure (q)</small>
          <strong style={{ fontSize: "1.25rem", color: "var(--lilac)" }}>{dynamicPressure.toLocaleString()} Pa</strong>
        </div>
        <div>
          <small style={{ color: "var(--text-muted)", fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em", display: "block" }}>Reynolds Number (Re)</small>
          <strong style={{ fontSize: "1.25rem", color: "white" }}>{reynoldsNumber}</strong>
        </div>
      </div>
    </div>
  );
}
