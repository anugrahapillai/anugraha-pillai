"use client";

import { useEffect, useId, useRef, useState, useCallback } from "react";

export default function Dialog({ children, open, onClose, title = "Dialog" }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
      setClosing(false);
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!open || closing) return;
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = () => [
      ...dialog.querySelectorAll(
        'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      ),
    ];

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    focusable()[0]?.focus();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const keyboard = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key !== "Tab") return;
      const controls = focusable();
      if (!controls.length) return;
      const first = controls[0];
      const last = controls.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("keydown", keyboard);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      previous?.focus();
    };
  }, [open, closing, handleClose]);

  if (!open && !closing) return null;

  return (
    <div
      className={`dialog-backdrop ${closing ? "is-closing" : "is-open"}`}
      onMouseDown={(event) => event.target === event.currentTarget && handleClose()}
    >
      <section
        ref={dialogRef}
        className={`dialog ${closing ? "is-closing" : "is-open"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="dialog-header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="dialog-close-btn"
            aria-label="Close dialog"
            onClick={handleClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div className="dialog-body">{children}</div>
      </section>
    </div>
  );
}
