"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        {/* Left side */}
        <div className="site-footer__brand" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <img
              src="/assets/logo.jpg"
              alt="Anugraha Logo"
              style={{
                width: "57px",
                height: "57px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--lilac)",
                boxShadow: "0 0 14px rgba(199, 125, 255, 0.4)",
                flexShrink: 0,
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.65rem", lineHeight: 1.2 }}>Anugraha</h3>
              <p style={{ margin: ".25rem 0 0", fontSize: ".88rem", color: "var(--lilac)", fontWeight: 500, letterSpacing: ".02em" }}>
                Aeronautical Engineer &amp; Researcher
              </p>
            </div>
          </div>

          <div style={{ marginTop: ".5rem" }}>
            <a
              href="#hero"
              onClick={scrollToTop}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                color: "var(--text-muted)",
                fontSize: ".88rem",
                fontFamily: "var(--font-mono)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              className="back-to-top-link"
            >
              Back to top ↑
            </a>
          </div>
        </div>

        {/* Right side — main CTA */}
        <div className="site-footer__cta-block" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h4 style={{ margin: "0 0 .75rem", fontSize: "1.35rem", fontFamily: "var(--font-serif)", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.35, maxWidth: "32rem" }}>
              Working on flight testing, aerodynamics, or aerospace research?
            </h4>
            <a href="#contact" className="button button--primary" style={{ display: "inline-flex", alignItems: "center", marginTop: ".5rem" }}>
              Let’s talk →
            </a>
          </div>

          {/* Links below CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", flexWrap: "wrap", paddingTop: ".5rem" }}>
            <a
              href="https://www.linkedin.com/in/anugrahaapillai/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                color: "var(--lilac)",
                textDecoration: "none",
                fontSize: ".92rem",
                fontWeight: 600,
                transition: "opacity 0.2s ease",
              }}
              className="linkedin-footer-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
              </svg>
              <span>LinkedIn ↗</span>
            </a>

            <a
              href="#services"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: ".92rem",
                transition: "color 0.2s ease",
              }}
              className="footer-nav-link"
            >
              Services
            </a>

            <Link
              href="/admin/login"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: ".88rem",
                fontFamily: "var(--font-mono)",
                transition: "color 0.2s ease",
              }}
              className="footer-nav-link"
            >
              CMS Admin Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom runway strip */}
      <div className="site-footer__runway-strip" style={{ width: "min(100%, 1280px)", margin: "3.5rem auto 0", padding: "1.5rem 0 0", textAlign: "center" }}>
        <div className="runway-motif-divider" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", color: "var(--lilac)", opacity: 0.75, margin: "0 0 1.5rem", fontSize: "1.1rem", letterSpacing: ".15em" }}>
          <span>✈ ⎯⎯⎯⎯⎯⎯ ✦</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: ".88rem", fontFamily: "var(--font-mono)", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ margin: 0 }}>© 2026 Anugraha Pillai</p>
          <p style={{ margin: 0 }}>Developed by Ratiraj Chavan</p>
        </div>
      </div>
    </footer>
  );
}
