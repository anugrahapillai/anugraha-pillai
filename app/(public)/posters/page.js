import PosterCard from "@/components/public/PosterCard";
import { firestorePosters } from "@/lib/repositories/firestore-adapters";

export const metadata = {
  title: "Aero Graphics — Anugraha Pillai",
  description: "Civic design, visual communications, and conceptual poster designs.",
};

export const revalidate = 60; // Revalidate dynamic page every 60s

export default async function PostersListingPage() {
  const res = await firestorePosters.list({ state: "published" });
  const posters = (res.items || []).filter((i) => i.status === "published" || !i.status);

  // Sort by newest
  const sortedPosters = [...posters].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || a.publishedAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || b.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="page-container dark-theme-block">
      <header className="page-header">
        <p className="eyebrow eyebrow--light">Aero Graphics</p>
        <h1>Aero Graphics</h1>
        <p>Conceptual poster artwork and visual design for public conversations.</p>
      </header>

      <section className="grid-posters">
        {sortedPosters.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1", border: "1px dashed var(--night-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No posters published yet. Check back soon!</p>
          </div>
        ) : (
          sortedPosters.map((poster) => (
            <PosterCard key={poster.id} {...poster} />
          ))
        )}
      </section>
    </div>
  );
}
