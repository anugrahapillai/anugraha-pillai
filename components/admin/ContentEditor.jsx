"use client";

import { useEffect, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import MediaUploader from "@/components/admin/MediaUploader";
import PublishBar from "@/components/admin/PublishBar";
import { normalizeSlug } from "@/lib/validation/content";

const initial = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category: "",
  tags: "",
  coverAlt: "",
  imageUrl: "",
  publishDate: "",
  simTools: "",
  resolution: "",
  pdfUrl: "",
  doi: "",
  deliverables: "",
  duration: "",
  pricingModel: "",
  contactEmail: "",
  linkedinUrl: "",
  scholarUrl: "",
};

export default function ContentEditor({ type = "Blog", item, onClose }) {
  const [values, setValues] = useState(() => ({
    ...initial,
    ...item,
    type,
    tags: Array.isArray(item?.tags) ? item.tags.join(", ") : item?.tags || "",
  }));

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [message, setMessage] = useState("");
  // Track whether user has manually edited the slug field.
  // When false, slug always mirrors the title automatically.
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(() => !!item?.slug);

  useEffect(() => {
    const warn = (event) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
      // Always sync slug from title UNLESS user has manually edited the slug field
      ...(name === "title" && !slugManuallyEdited ? { slug: normalizeSlug(value) } : {}),
    }));
    setDirty(true);
    setMessage("");
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSlugChange(event) {
    const { value } = event.target;
    // Mark slug as manually edited so title changes no longer override it
    setSlugManuallyEdited(true);
    setValues((current) => ({ ...current, slug: normalizeSlug(value) }));
    setDirty(true);
    setMessage("");
    setErrors((prev) => ({ ...prev, slug: undefined }));
  }

  function validateAndNormalize() {
    let currentTitle = (values.title || "").trim();
    if (!currentTitle) {
      currentTitle = item?.title || `New ${type} Entry`;
    }

    let currentSlug = (values.slug || "").trim();
    if (!currentSlug) {
      currentSlug = normalizeSlug(currentTitle) || `item-${Date.now()}`;
    }

    const currentCategory = (values.category || "").trim() || "Aerodynamics";
    const currentExcerpt = (values.excerpt || "").trim() || "Aeronautical research and engineering analysis.";
    const currentBody = (values.body || "").trim() || "Technical dispatch details.";

    const nextValues = {
      ...values,
      title: currentTitle,
      slug: currentSlug,
      category: currentCategory,
      excerpt: currentExcerpt,
      body: currentBody,
    };

    setValues(nextValues);
    setErrors({});
    return nextValues;
  }

  async function save(publishAction = false) {
    const normalizedPayload = validateAndNormalize();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...normalizedPayload,
        type,
        status: publishAction ? "published" : normalizedPayload.status || "draft",
        deliveryState: publishAction ? "live" : normalizedPayload.deliveryState || null,
        publishedAt: publishAction ? new Date().toISOString() : normalizedPayload.publishedAt || "—",
        tags: typeof normalizedPayload.tags === "string"
          ? normalizedPayload.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : normalizedPayload.tags,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDirty(false);
        setMessage(publishAction ? "Published successfully!" : "Draft saved.");
        setTimeout(() => onClose?.(), 1000);
      } else {
        setMessage(data.error || "Error saving to Cloud Firestore.");
      }
    } catch {
      setMessage("Network error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="editor" aria-labelledby="editor-title">
      <header className="page-heading">
        <div>
          <p className="eyebrow">{item?.id ? "Edit" : "Create"} {type}</p>
          <h1 id="editor-title">{values.title || `Untitled ${type.toLowerCase()}`}</h1>
        </div>
        <button type="button" className="text-button" onClick={() => (dirty ? setConfirmLeave(true) : onClose?.())}>
          Close editor
        </button>
      </header>

      <PublishBar
        dirty={dirty}
        saving={saving}
        onSave={() => save(false)}
        onPublish={() => save(true)}
      />

      {message && (
        <p
          className={`form-message form-message--${message.includes("Error") || message.includes("Please") ? "error" : "success"}`}
          role="status"
          style={{ marginBottom: "1.5rem" }}
        >
          {message}
        </p>
      )}

      {/* Single Scrollable Page Editor Form Layout */}
      <div className="editor-single-page" style={{ display: "grid", gap: "2rem" }}>
        
        {/* Section 1: Content Details */}
        <section className="panel">
          <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", marginBottom: "1.25rem", borderBottom: "1px solid var(--night-border)", paddingBottom: ".75rem" }}>
            ◈ Content Details
          </h2>

          <div className="field-grid">
            <label className="editor-field">
              Title *
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={change}
                placeholder="e.g. Supersonic Airframe Boundary Layer CFD"
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </label>

            <label className="editor-field">
              URL Slug
              {!slugManuallyEdited && (
                <small style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.4rem", fontStyle: "italic" }}>
                  (auto-synced from title)
                </small>
              )}
              <input
                type="text"
                name="slug"
                value={values.slug}
                onChange={handleSlugChange}
                placeholder="e.g. supersonic-airframe-cfd"
              />
              {errors.slug && <span className="field-error">{errors.slug}</span>}
            </label>

            <label className="editor-field">
              Category
              <input
                type="text"
                name="category"
                value={values.category}
                onChange={change}
                placeholder="e.g. Flow Visualization"
              />
            </label>

            {type !== "Service" && (
              <label className="editor-field">
                Tags (comma separated)
                <input
                  type="text"
                  name="tags"
                  value={values.tags}
                  onChange={change}
                  placeholder="CFD, Aerodynamics, OpenFOAM"
                />
              </label>
            )}

            <label className="editor-field field-grid--full">
              Summary Excerpt
              <textarea
                name="excerpt"
                value={values.excerpt}
                onChange={change}
                rows={3}
                placeholder="Brief high-level abstract..."
              />
            </label>

            {type !== "Poster" && type !== "Service" && (
              <label className="editor-field field-grid--full">
                Body Content
                <textarea
                  name="body"
                  value={values.body}
                  onChange={change}
                  rows={8}
                  placeholder={
                    type === "Research"
                      ? "Write full research details, methodology, findings and conclusion..."
                      : "Write the full blog dispatch body content here. Supports Markdown (## headings, **bold**, * lists)..."
                  }
                />
              </label>
            )}

            {type === "Poster" && (
              <label className="editor-field">
                Simulation Tools
                <input
                  type="text"
                  name="simTools"
                  value={values.simTools}
                  onChange={change}
                  placeholder="OpenFOAM, Ansys Fluent, ParaView"
                />
              </label>
            )}

            {type === "Research" && (
              <>
                <label className="editor-field">
                  PDF Paper Download URL
                  <input
                    type="text"
                    name="pdfUrl"
                    value={values.pdfUrl}
                    onChange={change}
                    placeholder="https://..."
                  />
                </label>

                <label className="editor-field">
                  DOI Identifier
                  <input
                    type="text"
                    name="doi"
                    value={values.doi}
                    onChange={change}
                    placeholder="10.1016/j.ast.2026.07"
                  />
                </label>
              </>
            )}
          </div>
        </section>

        {/* Section 2: Media & Image Assets */}
        {type !== "Service" && type !== "Research" && (
          <section className="panel">
            <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", marginBottom: "1.25rem", borderBottom: "1px solid var(--night-border)", paddingBottom: ".75rem" }}>
              ✦ Media & Image Assets
            </h2>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              <label className="editor-field">
                Image File or Base64 / Direct URL
                <input
                  type="text"
                  name="imageUrl"
                  value={values.imageUrl}
                  onChange={change}
                  placeholder="https://... or data:image/webp;base64,..."
                />
              </label>

              <MediaUploader
                onChange={(mediaResult) => {
                  if (mediaResult?.dataUrl) {
                    setValues((current) => ({
                      ...current,
                      imageUrl: mediaResult.dataUrl,
                    }));
                    setDirty(true);
                    setMessage("New image uploaded! Click 'Publish' to publish.");
                  }
                }}
              />

              {values.imageUrl && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <p style={{ fontSize: ".85rem", color: "var(--text-secondary)", marginBottom: ".5rem" }}>Current Image Preview:</p>
                  <img
                    src={values.imageUrl}
                    alt="Preview"
                    style={{ maxHeight: "240px", maxWidth: "100%", borderRadius: "var(--radius-sm)", border: "1px solid var(--night-border-glow)" }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 3: Publishing Status */}
        <section className="panel">
          <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", marginBottom: "1.25rem", borderBottom: "1px solid var(--night-border)", paddingBottom: ".75rem" }}>
            ❖ Publishing Status
          </h2>

          <div style={{ display: "grid", gap: "1.25rem" }}>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Clicking <strong>Publish</strong> will immediately publish this record live and display it across the public site.
            </p>
            <div style={{ padding: "1.25rem", background: "var(--night-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--night-border-glow)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className={`status-badge status-badge--${values.status === "published" ? "live" : "draft"}`}>
                  Current Status: {values.status || "draft"}
                </span>
                <p style={{ marginTop: ".5rem", fontSize: ".85rem", color: "var(--text-muted)", margin: 0 }}>
                  Target Collection: <code>{type.toLowerCase()}s</code>
                </p>
              </div>

              <button
                type="button"
                className="button button--primary"
                onClick={() => save(true)}
                disabled={saving}
              >
                {saving ? "Publishing..." : "Publish →"}
              </button>
            </div>
          </div>
        </section>

      </div>

      <Dialog open={confirmLeave} onClose={() => setConfirmLeave(false)} title="Unsaved Changes">
        <p>You have unsaved edits. Are you sure you want to close without saving?</p>
        <div className="dialog-actions">
          <button type="button" className="button button--secondary" onClick={() => setConfirmLeave(false)}>
            Keep editing
          </button>
          <button type="button" className="button button--danger" onClick={() => onClose?.()}>
            Discard & close
          </button>
        </div>
      </Dialog>
    </section>
  );
}
