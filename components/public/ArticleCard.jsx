"use client";

import { useState, useEffect } from "react";
import Dialog from "@/components/ui/Dialog";
import { formatDate } from "@/lib/client/date-utils";
import { markdownToHtml } from "@/lib/client/markdown";

export default function ArticleCard(props) {
  const {
    id,
    title,
    excerpt,
    category,
    publishedAt,
    body,
    featured = false,
    imageUrl,
    coverImage,
    mediaUrl,
  } = props;

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  // hoverZone: 'backdrop' | 'image' | 'close'
  const [hoverZone, setHoverZone] = useState("backdrop");

  // Close fullscreen on ESC keypress & track mouse movement
  useEffect(() => {
    if (!fullscreen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setFullscreen(false);
    };

    const handleMouseMove = (e) => {
      setMouseCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [fullscreen]);

  // Resolve cover image
  const src = imageUrl || coverImage || mediaUrl || null;

  return (
    <>
      <article className={`article-card ${featured ? "article-card--featured" : ""}`}>
        <div className="article-card__meta">
          <span className="article-card__category">{category || "Dispatch"}</span>
          <time className="article-card__date">
            {publishedAt ? `Published ${formatDate(publishedAt)}` : "Recently published"}
          </time>
        </div>
        <h3 className="article-card__title">
          <button type="button" className="text-button text-button--title" onClick={() => setOpen(true)}>
            {title}
          </button>
        </h3>
        {excerpt && <p className="article-card__excerpt">{excerpt}</p>}
        <button type="button" className="article-card__link text-button" onClick={() => setOpen(true)}>
          Read dispatch →
        </button>
      </article>

      {/* Read Dispatch Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} title={title}>
        <div className="article-modal-content">
          {/* Category & Small Publish Date on the Right Side */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              borderBottom: "1px solid var(--night-border)",
              paddingBottom: "0.75rem",
            }}
          >
            <span className="eyebrow" style={{ margin: 0 }}>
              {category || "Dispatch"}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
              }}
            >
              {publishedAt ? `Published ${formatDate(publishedAt)}` : "Recently published"}
            </span>
          </div>

          {/* Compressed Image (Click for Fullscreen Lightbox) */}
          {src && (
            <div
              className="article-modal-image-wrap"
              style={{
                position: "relative",
                margin: "0 0 1.50rem 0",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                cursor: "zoom-in",
                border: "1px solid var(--night-border)",
                background: "var(--night-bg)",
              }}
              onClick={() => setFullscreen(true)}
            >
              <img
                src={src}
                alt={title || "Dispatch Cover Image"}
                style={{
                  width: "100%",
                  maxHeight: "320px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                className="image-overlay-zoom"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  color: "white",
                  fontWeight: 650,
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                🔍 Click to View Fullscreen
              </div>
            </div>
          )}

          {/* Excerpt / Lead */}
          {excerpt && <p className="article-detail__lead">{excerpt}</p>}

          {/* Body Content */}
          <div
            className="article-detail__body markdown-body"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(
                body ||
                  "Public institutions must ensure policy decisions and data insights are accessible, transparent, and built on shared democratic understanding."
              ),
            }}
          />
        </div>
      </Dialog>

      {/* Fullscreen Lightbox */}
      {fullscreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(5, 4, 8, 0.98)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "none",
          }}
          onMouseEnter={() => setHoverZone("backdrop")}
          onClick={() => setFullscreen(false)}
        >
          {/* Always-visible custom cursor — changes size/glow by zone */}
          <div
            style={{
              position: "fixed",
              left: mouseCoords.x,
              top: mouseCoords.y,
              transform: "translate(-50%, -50%)",
              width: hoverZone === "close" ? "18px" : "28px",
              height: hoverZone === "close" ? "18px" : "28px",
              borderRadius: "50%",
              backgroundColor:
                hoverZone === "close"
                  ? "rgba(255, 100, 100, 0.55)"
                  : hoverZone === "image"
                  ? "rgba(76, 201, 240, 0.35)"
                  : "rgba(199, 125, 255, 0.45)",
              border:
                hoverZone === "close"
                  ? "2px solid #f87171"
                  : hoverZone === "image"
                  ? "2px solid var(--cyan-glow)"
                  : "2px solid var(--lilac)",
              boxShadow:
                hoverZone === "close"
                  ? "0 0 12px rgba(248, 113, 113, 0.8)"
                  : hoverZone === "image"
                  ? "0 0 12px rgba(76, 201, 240, 0.7)"
                  : "0 0 15px rgba(199, 125, 255, 0.8)",
              pointerEvents: "none",
              zIndex: 1000000,
              transition: "width 0.15s ease, height 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
            }}
          />

          {/* Close/Exit Button */}
          <button
            type="button"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "none",
              fontSize: "1.5rem",
              lineHeight: 1,
              transition: "all 0.2s ease",
              zIndex: 100000,
            }}
            onMouseEnter={() => setHoverZone("close")}
            onMouseLeave={() => setHoverZone("backdrop")}
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(false);
            }}
          >
            ✕
          </button>

          {/* Image */}
          <img
            src={src}
            alt={title}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)",
              cursor: "none",
            }}
            onMouseEnter={() => setHoverZone("image")}
            onMouseLeave={() => setHoverZone("backdrop")}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      )}
    </>
  );
}
