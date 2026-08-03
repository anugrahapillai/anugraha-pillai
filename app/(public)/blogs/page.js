import ArticleCard from "@/components/public/ArticleCard";
import { mockContent } from "@/lib/repositories/mock-admin";

export const metadata = {
  title: "Writing & Dispatches — Anugraha Pillai",
  description: "Essays, policy dispatches, and reflections on institutional communication and governance.",
};

export default function BlogsListingPage() {
  const blogs = mockContent.filter((i) => i.type === "Blog");

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Writing</p>
        <h1>Writing & Dispatches</h1>
        <p>Essays, policy reflections, and observations on public systems.</p>
      </header>

      <section className="grid-articles">
        {blogs.map((post) => (
          <ArticleCard key={post.id} {...post} />
        ))}
      </section>
    </div>
  );
}
