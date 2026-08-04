"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function ContactForm({ initialSubject = "", onSubjectChange }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", hp: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, subject: initialSubject }));
  }, [initialSubject]);

  const handleChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
    if (e.target.name === "subject" && onSubjectChange) {
      onSubjectChange(val);
    }
  };

  const handleClearSubject = () => {
    setFormData((prev) => ({ ...prev, subject: "" }));
    if (onSubjectChange) {
      onSubjectChange("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.hp) return; // Honeypot bot trap
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ state: "error", message: "Please fill out all required fields." });
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    // Validate Name: min length, no numbers, no emojis
    if (trimmedName.length < 2) {
      setStatus({ state: "error", message: "Name must be at least 2 characters." });
      return;
    }
    if (/\d/.test(trimmedName)) {
      setStatus({ state: "error", message: "Name cannot contain numbers." });
      return;
    }
    try {
      if (/\p{Extended_Pictographic}/u.test(trimmedName)) {
        setStatus({ state: "error", message: "Name cannot contain emojis." });
        return;
      }
    } catch (e) {
      // Fallback regex if environment lacks full unicode property support
      if (/[\uD83C-\uDBFF\uDC00-\uDFFF]/.test(trimmedName)) {
        setStatus({ state: "error", message: "Name cannot contain emojis." });
        return;
      }
    }

    // Validate Email: regex check, no emojis
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus({ state: "error", message: "Please enter a valid email address." });
      return;
    }
    try {
      if (/\p{Extended_Pictographic}/u.test(trimmedEmail)) {
        setStatus({ state: "error", message: "Email address cannot contain emojis." });
        return;
      }
    } catch (e) {
      if (/[\uD83C-\uDBFF\uDC00-\uDFFF]/.test(trimmedEmail)) {
        setStatus({ state: "error", message: "Email address cannot contain emojis." });
        return;
      }
    }

    // Validate Message: min length
    if (trimmedMessage.length < 5) {
      setStatus({ state: "error", message: "Message must be at least 5 characters." });
      return;
    }

    setStatus({ state: "submitting", message: "Delivering your message…" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus({
          state: "success",
          message: data.message || `Thank you! Your message has been received and saved.`,
        });
        setFormData({ name: "", email: "", subject: "", message: "", hp: "" });
        if (onSubjectChange) {
          onSubjectChange("");
        }
      } else {
        // Extract Zod detailed messages if available
        let errDetail = "Form submission error.";
        if (data.details && Array.isArray(data.details) && data.details.length > 0) {
          errDetail = data.details[0].message;
        } else if (typeof data.error === "string") {
          errDetail = data.error;
        } else if (typeof data.details === "string") {
          errDetail = data.details;
        }
        setStatus({ state: "error", message: errDetail });
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus({
        state: "error",
        message: "Failed to connect to contact server. Please verify your internet connection.",
      });
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} suppressHydrationWarning>
      {status.message && (
        <div className={`form-message form-message--${status.state === "error" ? "error" : "success"}`} role="alert">
          {status.message}
        </div>
      )}

      <div className="form-field sr-only" aria-hidden="true">
        <label>
          Do not fill this out
          <input type="text" name="hp" value={formData.hp} onChange={handleChange} tabIndex={-1} suppressHydrationWarning />
        </label>
      </div>

      <div className="form-field">
        <label htmlFor="contact-name">Your Name *</label>
        <input id="contact-name" type="text" name="name" required value={formData.name} onChange={handleChange} suppressHydrationWarning />
      </div>

      <div className="form-field">
        <label htmlFor="contact-email">Email Address *</label>
        <input id="contact-email" type="email" name="email" required value={formData.email} onChange={handleChange} suppressHydrationWarning />
      </div>

      <div className="form-field">
        <label htmlFor="contact-subject">Subject *</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            readOnly={formData.subject && formData.subject.startsWith("service reachout ")}
            style={{
              paddingRight: formData.subject && formData.subject.startsWith("service reachout ") ? "2.5rem" : "1.1rem",
              cursor: formData.subject && formData.subject.startsWith("service reachout ") ? "not-allowed" : "text",
              opacity: formData.subject && formData.subject.startsWith("service reachout ") ? 0.85 : 1,
            }}
            suppressHydrationWarning
          />
          {formData.subject && formData.subject.startsWith("service reachout ") && (
            <button
              type="button"
              onClick={handleClearSubject}
              title="Clear subject"
              style={{
                position: "absolute",
                right: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "var(--text-muted)",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "0.68rem",
                lineHeight: 1,
                padding: 0,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--violet)";
                e.currentTarget.style.borderColor = "var(--lilac)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="form-field">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="contact-message">Message *</label>
          <small style={{ color: "var(--text-muted)", fontSize: ".75rem" }}>
            {formData.message.length} / 1000 chars
          </small>
        </div>
        <textarea id="contact-message" name="message" required maxLength={1000} rows={5} value={formData.message} onChange={handleChange} placeholder="Write your message here…" suppressHydrationWarning />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".5rem" }}>
        <Button type="submit" variant="primary" disabled={status.state === "submitting"}>
          {status.state === "submitting" ? "Delivering…" : "Send Message →"}
        </Button>
      </div>
    </form>
  );
}
