"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navAnchors = [
  { href: "#writing", label: "Writing" },
  { href: "#posters", label: "Posters" },
  { href: "#research", label: "Research" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__container">
        <Link href="#hero" className="site-logo" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/assets/logo.jpg"
            alt="Anugraha Logo"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid var(--lilac)",
              boxShadow: "0 0 10px rgba(199, 125, 255, 0.4)",
            }}
          />
          <span className="site-logo__text">
            <strong>Anugraha</strong>
            <small>Aeronautical Engineer & Researcher</small>
          </span>
        </Link>

        <nav className={`site-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Main Single Page Navigation">
          {navAnchors.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`site-nav__link ${isActive ? "is-active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <button
          className="mobile-nav-toggle"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
