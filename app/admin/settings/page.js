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
          
          {/* Section A: Profile Picture & Media Uploader in Single Box */}
          <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid var(--night-border)", display: "grid", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-sans)", fontWeight: 700, margin: 0, color: "var(--lilac)" }}>
              ✦ Profile Picture
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1.75rem", alignItems: "center" }}>
              {/* Profile Picture Avatar Preview */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid var(--lilac)",
                    boxShadow: "0 0 20px rgba(199, 125, 255, 0.4)",
                    background: "var(--night-surface)",
                    margin: "0 auto .5rem",
                  }}
                >
                  <img
                    src={profile.profilePic || "/assets/profile.jpg"}
                    alt="Current Profile Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>

              {/* Upload Dropzone & Direct URL Input */}
              <div style={{ display: "grid", gap: "1rem" }}>
                <MediaUploader
                  onChange={(mediaResult) => {
                    if (mediaResult?.dataUrl) {
                      setProfile((current) => ({
                        ...current,
                        profilePic: mediaResult.dataUrl,
                      }));
                      setMessage("New profile picture uploaded! Click 'Save Profile Settings' to publish.");
                    }
                  }}
                />

                {/* Hidden input to maintain profilePic state & background processing */}
                <input type="hidden" name="profilePic" value={profile.profilePic || ""} />
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
