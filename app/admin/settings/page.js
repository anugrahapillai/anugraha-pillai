"use client";

import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    eyebrow: "Aeronautical Engineer & Aerospace Researcher",
    title: "Advancing aerodynamics, flight dynamics, and aerospace innovation.",
    lead: "Exploring high-speed aerodynamics, sustainable propulsion, structural analysis, and autonomous flight stability through technical research and engineering design.",
    aboutBio: "Anugraha is an Aeronautical Engineer specializing in aerodynamics, flight dynamics, computational fluid dynamics (CFD), and advanced propulsion systems. Her research explores high-speed boundary layer behavior, sustainable aviation fuels, and structural integrity under high-stress flight regimes.",
    profilePic: "/assets/profile.jpg",
    profilePicSecondary: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/content?type=settings");
        const data = await res.json();
        if (data.items?.length) {
          const loaded = data.items[0];
          setProfile((current) => ({
            ...current,
            ...loaded,
          }));
        }
      } catch {
        // Fallback to default
      }
    }
    loadSettings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...profile,
        id: profile.id || "global-settings",
        type: "Setting",
        status: "published",
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Profile & site settings saved successfully!");
      } else {
        setMessage(data.error || "Error saving settings.");
      }
    } catch {
      setMessage("Network error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <header className="page-heading">
        <div>
          <p className="eyebrow">Profile & Site Settings</p>
          <p>Manage your profile picture, bio, and hero details in a single panel.</p>
        </div>
      </header>

      {message && (
        <p className="form-message form-message--success" role="status" style={{ marginBottom: "1.5rem" }}>
          {message}
        </p>
      )}

      {/* Single Unified Settings Panel */}
      <section className="panel" style={{ maxWidth: "880px" }}>
        <form onSubmit={saveSettings} style={{ display: "grid", gap: "2rem" }}>
          
          {/* Section A: Profile Pictures (Primary & Secondary) */}
          <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid var(--night-border)", display: "grid", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-sans)", fontWeight: 700, margin: 0, color: "var(--lilac)" }}>
              ✦ Profile Pictures
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
              
              {/* Left Column: Primary Profile Picture (Circle for Hero) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 650, margin: 0, color: "var(--text-primary)" }}>
                  Primary (Hero Circle)
                </h3>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid var(--lilac)",
                      boxShadow: "0 0 15px rgba(199, 125, 255, 0.4)",
                      background: "var(--night-surface)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={profile.profilePic || "/assets/profile.jpg"}
                      alt="Primary Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <MediaUploader
                      onChange={(mediaResult) => {
                        if (mediaResult?.dataUrl) {
                          setProfile((current) => ({
                            ...current,
                            profilePic: mediaResult.dataUrl,
                          }));
                          setMessage("New primary profile picture uploaded! Click 'Save Profile Settings' to publish.");
                        }
                      }}
                    />
                    {/* Hidden input to maintain profilePic state */}
                    <input type="hidden" name="profilePic" value={profile.profilePic || ""} />
                  </div>
                </div>
              </div>

              {/* Right Column: Secondary Profile Picture (Rectangle for Bio) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 650, margin: 0, color: "var(--text-primary)" }}>
                  Secondary (Bio Rectangle)
                </h3>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: "140px",
                      height: "175px",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      border: "3px solid var(--lilac)",
                      boxShadow: "0 0 15px rgba(199, 125, 255, 0.4)",
                      background: "var(--night-surface)",
                      flexShrink: 0,
                    }}
                  >
                    {profile.profilePicSecondary ? (
                      <img
                        src={profile.profilePicSecondary}
                        alt="Secondary Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "var(--text-muted)", fontSize: ".8rem" }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <MediaUploader
                      onChange={(mediaResult) => {
                        if (mediaResult?.dataUrl) {
                          setProfile((current) => ({
                            ...current,
                            profilePicSecondary: mediaResult.dataUrl,
                          }));
                          setMessage("New secondary profile picture uploaded! Click 'Save Profile Settings' to publish.");
                        }
                      }}
                    />
                    {/* Hidden input to maintain profilePicSecondary state */}
                    <input type="hidden" name="profilePicSecondary" value={profile.profilePicSecondary || ""} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section B: Profile Text Details */}
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-sans)", fontWeight: 700, margin: 0, color: "var(--lilac)" }}>
              ◈ Profile Details & Bio
            </h2>

            <label className="editor-field">
              Role / Eyebrow Text
              <input
                type="text"
                name="eyebrow"
                value={profile.eyebrow}
                onChange={handleChange}
                placeholder="e.g. Aeronautical Engineer & Aerospace Researcher"
                required
              />
            </label>

            <label className="editor-field">
              Hero Section Heading
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                placeholder="Advancing aerodynamics, flight dynamics..."
                required
              />
            </label>

            <label className="editor-field">
              Hero Section Lead Paragraph
              <textarea
                name="lead"
                value={profile.lead}
                onChange={handleChange}
                rows={3}
                placeholder="Exploring high-speed aerodynamics..."
                required
              />
            </label>

            <label className="editor-field">
              About Section Bio Text
              <textarea
                name="aboutBio"
                value={profile.aboutBio}
                onChange={handleChange}
                rows={5}
                placeholder="Anugraha is an Aeronautical Engineer specializing in..."
                required
              />
            </label>
          </div>

          {/* Submit Action Button */}
          <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--night-border)" }}>
            <button type="submit" className="button button--primary" disabled={saving}>
              {saving ? "Saving to Firestore..." : "Save Profile Settings →"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
