"use client";

import { useState } from "react";
import { formatBytes, prepareImage } from "@/lib/client/image-compression";

export default function MediaUploader({ onChange }) {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  async function processFile(file) {
    if (!file) return;
    setError("");

    try {
      const result = await prepareImage(file);
      setMedia(result);
      onChange?.(result);
    } catch (failure) {
      setError(failure.message);
    }
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }

  return (
    <div className="media-uploader-box" style={{ width: "100%" }}>
      <label
        htmlFor="cover-image-input"
        style={{
          display: "block",
          fontSize: ".95rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: ".75rem",
          letterSpacing: "0.02em",
        }}
      >
        Upload Cover / Poster Image
      </label>

      {/* Styled Interactive Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.25rem 1.5rem",
          borderRadius: "var(--radius-md)",
          border: `2px dashed ${isDragging ? "var(--cyan-glow)" : "rgba(199, 125, 255, 0.45)"}`,
          background: isDragging
            ? "rgba(76, 201, 240, 0.1)"
            : "linear-gradient(145deg, rgba(20, 24, 40, 0.75) 0%, rgba(13, 16, 28, 0.85) 100%)",
          boxShadow: isDragging
            ? "0 0 25px rgba(76, 201, 240, 0.25)"
            : "0 4px 20px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <input
          id="cover-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            zIndex: 5,
          }}
        />

        <div style={{ fontSize: "2.5rem", marginBottom: ".6rem", filter: "drop-shadow(0 0 8px rgba(199, 125, 255, 0.6))" }}>
          📤
        </div>

        <span
          className="button button--primary"
          style={{
            pointerEvents: "none",
            marginBottom: ".6rem",
            fontSize: ".88rem",
            padding: ".55rem 1.25rem",
          }}
        >
          Choose Image File
        </span>

        <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-secondary)" }}>
          or drag & drop your poster/cover image here
        </p>
        <small style={{ display: "block", marginTop: ".3rem", fontSize: ".75rem", color: "var(--text-muted)" }}>
          Supports JPEG, PNG, WEBP (Auto-optimized for web)
        </small>
      </div>

      {error && (
        <p role="alert" className="form-message form-message--error" style={{ marginTop: ".75rem" }}>
          {error}
        </p>
      )}

      {media && (
        <div
          className="media-preview"
          style={{
            marginTop: "1.25rem",
            padding: "1rem",
            background: "var(--night-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--night-border-glow)",
            textAlign: "center",
          }}
        >
          <img
            src={media.previewUrl}
            alt="Selected cover preview"
            style={{
              maxHeight: "220px",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            }}
          />
          <div style={{ marginTop: ".75rem" }}>
            <p style={{ fontSize: ".85rem", color: "var(--text-primary)", fontWeight: 600, margin: "0 0 .3rem" }}>
              {formatBytes(media.sourceBytes)} → {formatBytes(media.outputBytes)} · {media.width} × {media.height}px
            </p>
            <span className="status-badge status-badge--live" style={{ fontSize: ".75rem" }}>
              ✓ Image Compressed 
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
