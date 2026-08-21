"use client";

import { useState, useEffect } from "react";
import ArticleCard from "@/components/public/ArticleCard";
import PosterCard from "@/components/public/PosterCard";
import ResearchRow from "@/components/public/ResearchRow";
import ContactForm from "@/components/public/ContactForm";
import CustomCursor from "@/components/public/CustomCursor";
import FloatingBackground from "@/components/public/FloatingBackground";
import Dialog from "@/components/ui/Dialog";
import { formatDate } from "@/lib/client/date-utils";
import { markdownToHtml } from "@/lib/client/markdown";

const defaultArticles = [];
const defaultPosters = [];
const defaultResearch = [];
const defaultServices = [];

const defaultProfileData = {
  eyebrow: "Aeronautical Engineer",
  title: "Advancing aerodynamics, flight dynamics, and aeronautical innovation.",
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

  // Modal control for Aero Outlook index listing
  const [outlookModalOpen, setOutlookModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // 1. Try loading from localStorage first to eliminate initial screen flash / skeleton wait
    try {
      const cached = localStorage.getItem("anugraha_home_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.blogs) setBlogs(parsed.blogs);
        if (parsed.posters) setPosters(parsed.posters);
        if (parsed.research) setResearch(parsed.research);
        if (parsed.services) setServices(parsed.services);
        if (parsed.profile) setProfile(parsed.profile);
        setLoading(false);
      }
    } catch (e) {
      console.warn("Failed to load local storage cache", e);
    }

    // 2. Fetch fresh data from consolidated server API endpoint (1 request instead of 5)
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/content?type=all&state=published");
        const data = await res.json();

        const publishedBlogs = (data.posts?.items || []).filter((i) => i.status === "published" || !i.status);
        const publishedPosters = (data.posters?.items || []).filter((i) => i.status === "published" || !i.status);
        const publishedResearch = (data.research?.items || []).filter((i) => i.status === "published" || !i.status);
        const publishedServices = (data.services?.items || []).filter((i) => i.status === "published" || !i.status);
        const settingsItems = data.settings?.items || [];

        const sortByNewest = (items) =>
          [...items].sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || a.publishedAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || b.publishedAt || 0).getTime();
            return timeB - timeA;
          });

        const sortedBlogs = sortByNewest(publishedBlogs);
        const sortedPosters = sortByNewest(publishedPosters);
        const sortedResearch = sortByNewest(publishedResearch);
        const sortedServices = sortByNewest(publishedServices);
        const loadedProfile = settingsItems.length ? { ...defaultProfileData, ...settingsItems[0] } : defaultProfileData;

        setBlogs(sortedBlogs);
        setPosters(sortedPosters);
        setResearch(sortedResearch);
        setServices(sortedServices);
        setProfile(loadedProfile);

        // Update local storage cache
        try {
          localStorage.setItem("anugraha_home_cache", JSON.stringify({
            blogs: sortedBlogs,
            posters: sortedPosters,
            research: sortedResearch,
            services: sortedServices,
            profile: loadedProfile,
          }));
        } catch (e) {
          console.warn("Failed to save to local storage", e);
        }
      } catch (err) {
        console.error("Failed to load homepage content:", err);
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
                <h2 className="hero-section__heading gradient-text">{currentProfile.title}</h2>
                <p className="hero-section__lead">{currentProfile.lead}</p>
                <div className="hero-section__actions">
                  <a href="#writing" className="button button--primary">Explore Blogs</a>
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
                  alt="Anugraha Pillai - Aeronautical Engineer"
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
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No blogs published yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "3rem" }}>
            {/* Subsection 1: Recent Uploads (Top 3 Items) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: ".8rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--lilac)", letterSpacing: ".12em", textTransform: "uppercase" }}>
                  ✦ RECENT BLOGS
                </span>
                <div style={{ flex: 1, height: "1px", background: "var(--night-border-glow)" }} />
              </div>
              <div className="grid-articles">
                {blogs.slice(0, 3).map((post) => (
                  <ArticleCard key={post.id} {...post} />
                ))}
              </div>
            </div>

            {/* View More Button triggering the Aero Outlook Index Modal */}
            {blogs.length > 3 && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => {
                    setOutlookModalOpen(true);
                    setSelectedArticle(null);
                  }}
                >
                  View More Blogs ↓
                </button>
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
        
        {loading ? (
          <div style={{ display: "grid", gap: ".75rem" }}>
            <span className="skeleton-box" style={{ width: "100%", height: "1.2rem" }}></span>
            <span className="skeleton-box" style={{ width: "95%", height: "1.2rem" }}></span>
            <span className="skeleton-box" style={{ width: "85%", height: "1.2rem" }}></span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "2.5rem", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", width: "100%" }}>
            <div className="about-bio" style={{ flex: "1 1 500px", display: "grid", gap: "1.1rem" }}>
              {(() => {
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
                  <p key={i} style={{ margin: 0, lineHeight: "1.65" }}>
                    {para}
                  </p>
                ));
              })()}
            </div>
            
            {currentProfile.profilePicSecondary && (
              <div style={{ flex: "0 0 320px", maxWidth: "100%", margin: "0 auto" }}>
                <img
                  src={currentProfile.profilePicSecondary}
                  alt="Anugraha Pillai - Aeronautical Engineer"
                  style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "var(--radius-lg)",
                    border: "3px solid var(--lilac)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(199, 125, 255, 0.35)",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Contact Section: Get in Touch */}
      <section id="contact" className="section-block">
        <div className="section-header">
          <h2 className="section-heading">Get in Touch</h2>
        </div>
        <div className="contact-layout">
          <div className="contact-form-wrap">
            <ContactForm initialSubject={chosenSubject} onSubjectChange={setChosenSubject} />
          </div>
          
          <div className="contact-poster-wrap">
            <div className="contact-poster-box animate-float-gentle">
              {profile && profile.contactPoster ? (
                <>
                  {/* Blurred background layer to fill empty spaces gracefully */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${profile.contactPoster})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(20px) brightness(0.35)",
                    opacity: 0.7,
                    zIndex: 1
                  }} />
                  {/* Uncropped foreground poster image */}
                  <img
                    src={profile.contactPoster}
                    alt="Anugraha Pillai - Aeronautical Contact Graphic"
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </>
              ) : (
                <div className="contact-poster-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", fontWeight: 700, margin: "0 0 0.5rem" }}>
                    Aerodynamics Lab
                  </h3>
                  <p>
                    Discuss aerospace research, aerodynamic simulations, and flight structural consulting.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Dialog
        open={outlookModalOpen}
        onClose={() => setOutlookModalOpen(false)}
        title={selectedArticle ? selectedArticle.title : "Aero Outlook Index"}
      >
        {selectedArticle ? (
          /* Full Article View inside popup */
          <div className="article-detail" style={{ border: "none", padding: 0, background: "transparent", margin: 0, boxShadow: "none" }}>
            {/* Sticky docked header matching dialog margins */}
            <div style={{
              position: "sticky",
              top: "-1.75rem",
              zIndex: 5,
              background: "var(--night-card)",
              backdropFilter: "blur(12px)",
              margin: "-1.75rem -1.75rem 1.5rem",
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid var(--night-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setSelectedArticle(null)}
                style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".4rem .85rem", fontSize: ".85rem" }}
              >
                ← Back to Index
              </button>
              <div style={{ display: "flex", gap: "1rem", fontSize: ".82rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                <span style={{ color: "var(--lilac)", fontWeight: 700, textTransform: "uppercase" }}>
                  {selectedArticle.category || "General"}
                </span>
                <span>{formatDate(selectedArticle.publishedAt)}</span>
              </div>
            </div>

            {selectedArticle.excerpt && (
              <p style={{ fontSize: "1.1rem", lineHeight: "1.65", color: "var(--text-primary)", marginBottom: "1.5rem", fontStyle: "italic" }}>
                {selectedArticle.excerpt}
              </p>
            )}
            <div
              className="markdown-body"
              style={{ lineHeight: "1.75", color: "var(--text-secondary)" }}
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(selectedArticle.body || "No body content available."),
              }}
            />
          </div>
        ) : (
          /* Index list view of ALL uploaded blogs inside popup */
          <div style={{ display: "grid", gap: "1rem" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: ".92rem", margin: 0, borderBottom: "1px solid var(--night-border)", paddingBottom: ".5rem" }}>
              Explore all dispatches, research notes, and policy reviews published on Aero Outlook.
            </p>
            <div style={{ display: "grid", gap: "0.75rem", maxHeight: "60vh", overflowY: "auto", paddingRight: ".5rem" }}>
              {blogs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "0.85rem 1rem",
                    background: "var(--night-surface)",
                    border: "1px solid var(--night-border)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1.5rem",
                  }}
                >
                  <div style={{ display: "grid", gap: "0.55rem", flex: 1 }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                      <span style={{ fontWeight: 700, color: "var(--lilac)", textTransform: "uppercase", letterSpacing: ".05em" }}>
                        {item.category || "General"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                    <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--text-primary)", lineHeight: "1.3" }}>
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: "1.4" }}>
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => setSelectedArticle(item)}
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                    >
                      Read →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
