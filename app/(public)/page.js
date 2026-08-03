"use client";

import { useState, useEffect } from "react";
import ArticleCard from "@/components/public/ArticleCard";
import PosterCard from "@/components/public/PosterCard";
import ResearchRow from "@/components/public/ResearchRow";
import ContactForm from "@/components/public/ContactForm";
import CustomCursor from "@/components/public/CustomCursor";
import FloatingBackground from "@/components/public/FloatingBackground";

const defaultArticles = [];
const defaultPosters = [];
const defaultResearch = [];
const defaultServices = [];

const defaultProfileData = {
  eyebrow: "Aeronautical Engineer & Aerospace Researcher",
  title: "Advancing aerodynamics, flight dynamics, and aerospace innovation.",
  lead: "Exploring high-speed aerodynamics, sustainable propulsion, structural analysis, and autonomous flight stability through technical research and engineering design.",
  aboutBio: "Anugraha is an Aeronautical Engineer specializing in aerodynamics, flight dynamics, computational fluid dynamics (CFD), and advanced propulsion systems. Her research explores high-speed boundary layer behavior, sustainable aviation fuels, and structural integrity under high-stress flight regimes.",
  profilePic: "/assets/profile.jpg",
};

export default function SinglePageHome() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [posters, setPosters] = useState([]);
  const [research, setResearch] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState(null);

  // Paginated Lazy Loading state for Aero Outlook & Aero Graphics
  const [visibleBlogsCount, setVisibleBlogsCount] = useState(6);
  const [loadingMoreBlogs, setLoadingMoreBlogs] = useState(false);

  const [visiblePostersCount, setVisiblePostersCount] = useState(6);
  const [loadingMorePosters, setLoadingMorePosters] = useState(false);

  const [visibleResearchCount, setVisibleResearchCount] = useState(2);
  const [loadingMoreResearch, setLoadingMoreResearch] = useState(false);

  // Selected subject from service CTA clicks
  const [chosenSubject, setChosenSubject] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [bRes, pRes, rRes, sRes, stRes] = await Promise.all([
          fetch("/api/admin/content?type=posts&state=published").then((r) => r.json()),
          fetch("/api/admin/content?type=posters&state=published").then((r) => r.json()),
          fetch("/api/admin/content?type=research&state=published").then((r) => r.json()),
          fetch("/api/admin/content?type=services&state=published").then((r) => r.json()),
          fetch("/api/admin/content?type=settings").then((r) => r.json()),
        ]);

        const publishedBlogs = (bRes.items || []).filter((i) => i.status === "published" || !i.status);
        const publishedPosters = (pRes.items || []).filter((i) => i.status === "published" || !i.status);
        const publishedResearch = (rRes.items || []).filter((i) => i.status === "published" || !i.status);
        const publishedServices = (sRes.items || []).filter((i) => i.status === "published" || !i.status);

        // Sort items so newest uploads always appear first in Recents
        const sortByNewest = (items) =>
          [...items].sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || a.publishedAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || b.publishedAt || 0).getTime();
            return timeB - timeA;
          });

        setBlogs(sortByNewest(publishedBlogs));
        setPosters(sortByNewest(publishedPosters));
        setResearch(sortByNewest(publishedResearch));
        setServices(sortByNewest(publishedServices));
        setProfile(stRes.items?.length ? { ...defaultProfileData, ...stRes.items[0] } : defaultProfileData);
      } catch {
        setBlogs([]);
        setPosters([]);
        setResearch([]);
        setServices([]);
        setProfile(defaultProfileData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentProfile = profile || defaultProfileData;

  return (
    <div className="single-page-layout">
      {/* Custom Airplane Cursor & Floating Background Effects */}
      <CustomCursor />
      <FloatingBackground />

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-section__container">
          <div className="hero-section__content">
            {loading ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                <span className="skeleton-box" style={{ width: "220px", height: "1.2rem" }}></span>
                <span className="skeleton-box" style={{ width: "90%", height: "3.5rem" }}></span>
                <span className="skeleton-box" style={{ width: "80%", height: "2.2rem" }}></span>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <span className="skeleton-box" style={{ width: "160px", height: "3rem" }}></span>
                  <span className="skeleton-box" style={{ width: "160px", height: "3rem" }}></span>
                </div>
              </div>
            ) : (
              <>
                <p className="eyebrow animate-float">{currentProfile.eyebrow}</p>
                <h1 className="hero-section__heading gradient-text">{currentProfile.title}</h1>
                <p className="hero-section__lead">{currentProfile.lead}</p>
                <div className="hero-section__actions">
                  <a href="#writing" className="button button--primary">Explore Dispatches</a>
                  <a href="#contact" className="button button--secondary">Contact Anugraha</a>
                </div>
              </>
            )}
          </div>

          <div className="hero-profile-container">
            <div className="orbit-ring--minimal"></div>
            <div className="hero-profile-avatar">
              {loading ? (
                <span className="skeleton-box" style={{ width: "100%", height: "100%", borderRadius: "50%" }}></span>
              ) : (
                <img
                  src={currentProfile.profilePic || "/assets/profile.jpg"}
                  alt="Anugraha Pillai - Aeronautical Engineer & Aerospace Researcher"
                />
              )}
            </div>
            <div className="hero-profile-badge">ANUGRAHA PILLAI</div>
          </div>
        </div>
      </section>

      {/* Technical Writing Section: Aero Outlook */}
      <section id="writing" className="section-block">
        <div className="section-header">
          <h2 className="section-heading">Aero Outlook</h2>
        </div>

        {loading ? (
          <div className="grid-articles">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="skeleton-card">
                <span className="skeleton-box" style={{ width: "40%", height: "1rem" }}></span>
                <span className="skeleton-box" style={{ width: "80%", height: "1.75rem", margin: ".5rem 0" }}></span>
                <span className="skeleton-box" style={{ width: "100%", height: "3rem" }}></span>
                <span className="skeleton-box" style={{ width: "30%", height: "1rem", marginTop: "auto" }}></span>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--night-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No dispatches published yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "3rem" }}>
            {/* Subsection 1: Recent Uploads (Top 3 Items) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: ".8rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--lilac)", letterSpacing: ".12em", textTransform: "uppercase" }}>
                  ✦ RECENT DISPATCHES
                </span>
                <div style={{ flex: 1, height: "1px", background: "var(--night-border-glow)" }} />
              </div>
              <div className="grid-articles">
                {blogs.slice(0, 3).map((post) => (
                  <ArticleCard key={post.id} {...post} />
                ))}
              </div>
            </div>

            {/* Subsection 2: Previous Dispatches (Items 3 onwards with Lazy Load View More) */}
            {blogs.length > 3 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: ".8rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".12em", textTransform: "uppercase" }}>
                    ◈ PREVIOUS DISPATCHES 
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "var(--night-border)" }} />
                </div>
                <div className="grid-articles">
                  {blogs.slice(3, visibleBlogsCount).map((post) => (
                    <ArticleCard key={post.id} {...post} />
                  ))}
                  {loadingMoreBlogs &&
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div key={`skel-blog-${idx}`} className="skeleton-card">
                        <span className="skeleton-box" style={{ width: "40%", height: "1rem" }}></span>
                        <span className="skeleton-box" style={{ width: "80%", height: "1.75rem", margin: ".5rem 0" }}></span>
                        <span className="skeleton-box" style={{ width: "100%", height: "3rem" }}></span>
                      </div>
                    ))}
                </div>

                {/* View More Lazy Loading Button */}
                {blogs.length > visibleBlogsCount && (
                  <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                    <button
                      className="button button--secondary"
                      onClick={() => {
                        setLoadingMoreBlogs(true);
                        setTimeout(() => {
                          setVisibleBlogsCount((prev) => prev + 3);
                          setLoadingMoreBlogs(false);
                        }, 400);
                      }}
                      disabled={loadingMoreBlogs}
                    >
                      {loadingMoreBlogs ? "Loading More Dispatches…" : "View More Dispatches ↓"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Posters Section: Aero Graphics */}
      <section id="posters" className="section-block section-block--dark">
        <div className="section-header">
          <h2 className="section-heading section-heading--light">Aero Graphics</h2>
        </div>

        {loading ? (
          <div className="grid-posters">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="skeleton-poster">
                <span className="skeleton-box" style={{ width: "100%", height: "200px" }}></span>
                <span className="skeleton-box" style={{ width: "60%", height: "1.5rem" }}></span>
                <span className="skeleton-box" style={{ width: "40%", height: "1rem" }}></span>
              </div>
            ))}
          </div>
        ) : posters.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed rgba(76, 201, 240, 0.25)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No graphics published yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "3rem" }}>
            {/* Subsection 1: Recent Graphics (Top 3 Items) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: ".8rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--cyan-glow)", letterSpacing: ".12em", textTransform: "uppercase" }}>
                  ✦ RECENT GRAPHICS 
                </span>
                <div style={{ flex: 1, height: "1px", background: "rgba(76, 201, 240, 0.25)" }} />
              </div>
              <div className="grid-posters">
                {posters.slice(0, 3).map((poster) => (
                  <PosterCard key={poster.id} {...poster} />
                ))}
              </div>
            </div>

            {/* Subsection 2: Previous Graphics (Items 3 onwards with Lazy Load View More) */}
            {posters.length > 3 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: ".8rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".12em", textTransform: "uppercase" }}>
                    ◈ PREVIOUS GRAPHICS
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
                </div>
                <div className="grid-posters">
                  {posters.slice(3, visiblePostersCount).map((poster) => (
                    <PosterCard key={poster.id} {...poster} />
                  ))}
                  {loadingMorePosters &&
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div key={`skel-post-${idx}`} className="skeleton-poster">
                        <span className="skeleton-box" style={{ width: "100%", height: "200px" }}></span>
                        <span className="skeleton-box" style={{ width: "60%", height: "1.5rem" }}></span>
                      </div>
                    ))}
                </div>

                {/* View More Lazy Loading Button */}
                {posters.length > visiblePostersCount && (
                  <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                    <button
                      className="button button--secondary"
                      onClick={() => {
                        setLoadingMorePosters(true);
                        setTimeout(() => {
                          setVisiblePostersCount((prev) => prev + 3);
                          setLoadingMorePosters(false);
                        }, 400);
                      }}
                      disabled={loadingMorePosters}
                    >
                      {loadingMorePosters ? "Loading More Graphics…" : "View More Graphics ↓"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Research Section: Research & Analysis */}
      <section id="research" className="section-block">
        <div className="section-header">
          <h2 className="section-heading">Research & Analysis</h2>
        </div>
        {loading ? (
          <div className="list-research">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="skeleton-row">
                <span className="skeleton-box" style={{ width: "30%", height: "1rem" }}></span>
                <span className="skeleton-box" style={{ width: "70%", height: "1.5rem" }}></span>
                <span className="skeleton-box" style={{ width: "100%", height: "2.5rem" }}></span>
              </div>
            ))}
          </div>
        ) : research.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--night-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No research items published yet. Check back soon!</p>
          </div>
        ) : (
          <div>
            <div className="list-research">
              {research.slice(0, visibleResearchCount).map((item) => (
                <ResearchRow key={item.id} {...item} />
              ))}
              {loadingMoreResearch &&
                Array.from({ length: 2 }).map((_, idx) => (
                  <div key={`skel-res-${idx}`} className="skeleton-row">
                    <span className="skeleton-box" style={{ width: "30%", height: "1rem" }}></span>
                    <span className="skeleton-box" style={{ width: "70%", height: "1.5rem" }}></span>
                    <span className="skeleton-box" style={{ width: "100%", height: "2.5rem" }}></span>
                  </div>
                ))}
            </div>

            {research.length > visibleResearchCount && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  className="button button--secondary"
                  onClick={() => {
                    setLoadingMoreResearch(true);
                    setTimeout(() => {
                      setVisibleResearchCount((prev) => prev + 2);
                      setLoadingMoreResearch(false);
                    }, 400);
                  }}
                  disabled={loadingMoreResearch}
                >
                  {loadingMoreResearch ? "Loading More Research…" : "View More Research ↓"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Engineering Advisory Section: Services Provided */}
      <section id="services" className="section-block">
        <div className="section-header">
          <h2 className="section-heading">Services Provided</h2>
        </div>
        {loading ? (
          <div className="services-grid">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="skeleton-card">
                <span className="skeleton-box" style={{ width: "35%", height: "1rem" }}></span>
                <span className="skeleton-box" style={{ width: "75%", height: "1.5rem" }}></span>
                <span className="skeleton-box" style={{ width: "100%", height: "3rem" }}></span>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--night-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No services listed yet.</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((srv) => (
              <div key={srv.id} className="service-card">
                <span className="eyebrow">{srv.category}</span>
                <h3>{srv.title}</h3>
                <p>{srv.excerpt || srv.body}</p>
                <a
                  href="#contact"
                  className="button button--secondary"
                  onClick={() => setChosenSubject(`service reachout :-  ${srv.title}`)}
                >
                  Discuss engagement →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section: The Engineer */}
      <section id="about" className="section-block section-block--paper">
        <div className="section-header">
          <h2 className="section-heading">The Engineer</h2>
        </div>
        <div className="about-bio" style={{ maxWidth: "100%" }}>
          {loading ? (
            <div style={{ display: "grid", gap: ".75rem" }}>
              <span className="skeleton-box" style={{ width: "100%", height: "1.2rem" }}></span>
              <span className="skeleton-box" style={{ width: "95%", height: "1.2rem" }}></span>
              <span className="skeleton-box" style={{ width: "85%", height: "1.2rem" }}></span>
            </div>
          ) : (
            (() => {
              const text = currentProfile.aboutBio || "";
              let paragraphs = [];
              if (text.includes("\n")) {
                paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
              } else {
                const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
                let currentPara = [];
                sentences.forEach((sentence, index) => {
                  currentPara.push(sentence.trim());
                  if (currentPara.length === 2 || index === sentences.length - 1) {
                    paragraphs.push(currentPara.join(" "));
                    currentPara = [];
                  }
                });
              }
              return paragraphs.map((para, i) => (
                <p key={i} style={{ margin: 0 }}>
                  {para}
                </p>
              ));
            })()
          )}
        </div>
      </section>

      {/* Contact Section: Get in Touch */}
      <section id="contact" className="section-block">
        <div className="section-header">
          <h2 className="section-heading">Get in Touch</h2>
        </div>
        <div className="contact-layout">
          <ContactForm initialSubject={chosenSubject} onSubjectChange={setChosenSubject} />
        </div>
      </section>
    </div>
  );
}
