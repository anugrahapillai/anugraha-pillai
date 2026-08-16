import Link from "next/link";
import { notFound } from "next/navigation";
import { firestorePosters } from "@/lib/repositories/firestore-adapters";

export const revalidate = 60; // Revalidate dynamic page every 60s

export async function generateStaticParams() {
  try {
    const res = await firestorePosters.list({ state: "published" });
    return (res.items || [])
      .filter((i) => i.status === "published" || !i.status)
      .filter((i) => i.slug)
      .map((i) => ({ slug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await firestorePosters.list({ state: "published" });
  const poster = (res.items || []).find((i) => i.slug === slug || i.id === slug);
  if (!poster) return { title: "Aero Graphics Not Found — Anugraha Pillai" };
  return {
    title: `${poster.title} — Anugraha Pillai`,
    description: poster.excerpt || poster.title,
  };
}

export default async function PosterDetailPage({ params }) {
  const { slug } = await params;
  const res = await firestorePosters.list({ state: "published" });
  const poster = (res.items || []).find((i) => i.slug === slug || i.id === slug);

  if (!poster) {
    notFound();
  }

  return (
    <article className="poster-detail">
      <header className="page-header">
        <Link href="/posters" className="back-link">← All Aero Graphics</Link>
        <span className="eyebrow">{poster.category || "Aero Graphics"}</span>
        <h1>{poster.title}</h1>
        <p>{poster.excerpt}</p>
      </header>

      {/* Render poster visual or fallback */}
      <div className="poster-detail__stage">
        {poster.image ? (
          <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Blurred ambient background backdrop */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${poster.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px) brightness(0.35)",
              opacity: 0.7,
              zIndex: 1
            }} />
            <img
              src={poster.image}
              alt={poster.title}
              style={{
                position: "relative",
                zIndex: 2,
                maxHeight: "80vh",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            />
          </div>
        ) : (
          <div className="poster-detail__canvas">
            <span className="poster-detail__symbol">✦</span>
            <h2>{poster.title}</h2>
          </div>
        )}
      </div>

      <div className="poster-detail__content">
        <p>{poster.body || "Visual poster design exploring public conversation and civic identity."}</p>
      </div>
    </article>
  );
}
