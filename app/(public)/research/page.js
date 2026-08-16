import ResearchRow from "@/components/public/ResearchRow";
import { firestoreResearch } from "@/lib/repositories/firestore-adapters";

export const metadata = {
  title: "Research & Analysis — Anugraha Pillai",
  description: "Academic articles, policy memos, and research briefs on institutional design and policy structures.",
};

export const revalidate = 60; // Revalidate dynamic listing page every 60s

export default async function ResearchListingPage() {
  const res = await firestoreResearch.list({ state: "published" });
  const research = (res.items || []).filter((i) => i.status === "published" || !i.status);

  // Sort by newest
  const sortedResearch = [...research].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || a.publishedAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || b.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Research & Analysis</p>
        <h1>Research & Analysis</h1>
        <p>In-depth research reports, policy analyses, and technical briefings.</p>
      </header>

      <section style={{ display: "grid", gap: "1.5rem" }}>
        {sortedResearch.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--night-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No research papers published yet. Check back soon!</p>
          </div>
        ) : (
          sortedResearch.map((item) => (
            <ResearchRow key={item.id} {...item} />
          ))
        )}
      </section>
    </div>
  );
}
