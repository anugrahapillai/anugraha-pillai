"use client";

import { useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { formatDate } from "@/lib/client/date-utils";
import { markdownToHtml } from "@/lib/client/markdown";

const fallbackImages = {};

export default function PosterCard(props) {
  const {
    id,
    title,
    category,
    publishedAt,
    body,
    excerpt,
    imageUrl,
    coverImage,
    mediaUrl,
    url,
    src: propSrc,
    image,
    path,
    fileUrl,
    coverAlt,
    resolution,
    simTools,
  } = props;

  const [open, setOpen] = useState(false);

  // Resolve unique image for each card
  const src =
    imageUrl ||
    coverImage ||
    mediaUrl ||
    url ||
    propSrc ||
    image ||
    path ||
    fileUrl ||
    (coverAlt && (coverAlt.startsWith("http") || coverAlt.startsWith("/") || coverAlt.startsWith("data:")) ? coverAlt : null) ||
    fallbackImages[id] ||
    "/assets/logo.jpg";

  const description = excerpt || body || "High-speed flow visualization poster depicting boundary layer interactions, pressure contours, and aerodynamic shockwave structures.";

  return (
    <>
      <div className="flip-box poster-card-flip">
        <div className="flip-box-inner">
          {/* Front Side: Poster Image with complete visibility */}
          <div className="flip-box-front">
            <div className="flip-box-front-image-wrap">
              <img
                src={src}
                alt={title || "Flow Visualization Poster"}
              />
            </div>
            <div className="flip-box-front-footer">
              <div>
                <span className="eyebrow eyebrow--light" style={{ fontSize: ".7rem", display: "block" }}>{category || "CFD Visualization"}</span>
                <h4>{title}</h4>
              </div>
            </div>
          </div>

          {/* Back Side: 3D Flip Overlay */}
          <div className="flip-box-back-overlay">
            <div className="flip-box-back-content">
              <span className="eyebrow eyebrow--light">{category || "CFD Flow Analytics"}</span>
              <h4 style={{ fontFamily: "Georgia, serif", fontSize: "1.35rem", margin: ".3rem 0 .6rem", color: "var(--text-primary)" }}>{title}</h4>
              <div className="description">{description}</div>
              {resolution && (
                <p style={{ marginTop: ".5rem", fontSize: ".75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  🖼 {resolution}
                </p>
              )}
            </div>
            <div className="elementor-button-wrapper litho-button-wrapper">
              <button
                type="button"
                className="elementor-button-link elementor-button button button--primary"
                role="button"
                style={{ width: "100%" }}
                onClick={() => setOpen(true)}
              >
                VIEW FULL POSTER →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} title={title}>
        {/* Poster Image */}
        <div
          className="poster-detail__stage"
          style={{
            margin: "0 0 1.25rem",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--night-border)",
            background: "#050408",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          {src && (
            <img
              src={src}
              alt={title}
              style={{ maxWidth: "100%", maxHeight: "450px", objectFit: "contain", margin: "0 auto", display: "block" }}
            />
          )}
        </div>

        {/* Meta row: Category · Date · Resolution */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem 1.5rem",
            fontSize: ".82rem",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            marginBottom: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(199,125,255,0.12)",
          }}
        >
          {category && (
            <span>
              <strong style={{ color: "var(--text-secondary)" }}>Category:</strong>{" "}
              {category}
            </span>
          )}
          {publishedAt && (
            <span>
              <strong style={{ color: "var(--text-secondary)" }}>Published:</strong>{" "}
              {formatDate(publishedAt)}
            </span>
          )}
          {resolution && (
            <span>
              <strong style={{ color: "var(--text-secondary)" }}>Resolution:</strong>{" "}
              <span style={{ color: "var(--lilac)" }}>{resolution}</span>
            </span>
          )}
          {simTools && (
            <span>
              <strong style={{ color: "var(--text-secondary)" }}>Tools:</strong>{" "}
              {simTools}
            </span>
          )}
        </div>

        {/* Body content — rendered as Markdown */}
        {(body || excerpt) && (
          <div
            className="article-detail__body markdown-body"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(body || excerpt),
            }}
          />
        )}
      </Dialog>
    </>
  );
}
