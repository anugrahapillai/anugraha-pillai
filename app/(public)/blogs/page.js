import ArticleCard from "@/components/public/ArticleCard";
import { firestorePosts } from "@/lib/repositories/firestore-adapters";

export const metadata = {
  title: "Aero Outlook — Anugraha Pillai",
  description: "Essays, policy dispatches, and reflections on institutional communication and governance.",
};

export const revalidate = 60; // Revalidate dynamic listing page every 60s

export default async function BlogsListingPage() {
  const res = await firestorePosts.list({ state: "published" });
  const blogs = (res.items || []).filter((i) => i.status === "published" || !i.status);

  // Sort by newest published date
  const sortedBlogs = [...blogs].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || a.publishedAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || b.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Aero Outlook</p>
        <h1>Aero Outlook</h1>
        <p>Essays, policy reflections, and observations on public systems.</p>
      </header>

      <section className="grid-articles">
        {sortedBlogs.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1", border: "1px dashed var(--night-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>No dispatches published yet. Check back soon!</p>
          </div>
        ) : (
          sortedBlogs.map((post) => (
            <ArticleCard key={post.id} {...post} />
          ))
        )}
      </section>
    </div>
  );
}
