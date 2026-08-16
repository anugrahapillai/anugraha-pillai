import Link from "next/link";
import { notFound } from "next/navigation";
import { firestorePosts } from "@/lib/repositories/firestore-adapters";
import { formatDate } from "@/lib/client/date-utils";
import { markdownToHtml } from "@/lib/client/markdown";

export const revalidate = 60; // Revalidate dynamic article details page every 60s

export async function generateStaticParams() {
  try {
    const res = await firestorePosts.list({ state: "published" });
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
  const res = await firestorePosts.list({ state: "published" });
  const post = (res.items || []).find((i) => i.slug === slug || i.id === slug);
  if (!post) return { title: "Aero Outlook Not Found — Anugraha Pillai" };
  return {
    title: `${post.title} — Anugraha Pillai`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const res = await firestorePosts.list({ state: "published" });
  const post = (res.items || []).find((i) => i.slug === slug || i.id === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="article-detail">
      <header className="article-detail__header">
        <Link href="/blogs" className="back-link">← All Aero Outlook</Link>
        <span className="eyebrow">{post.category || "Aero Outlook"}</span>
        <h1>{post.title}</h1>
        <div className="article-detail__meta">
          <time>Published {formatDate(post.publishedAt)}</time>
        </div>
      </header>

      {post.excerpt && <p className="article-detail__lead">{post.excerpt}</p>}

      <div
        className="article-detail__body markdown-body"
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(post.body || "Detailed dispatch content."),
        }}
      />

      <footer className="article-detail__footer">
        <Link href="/blogs" className="button button--secondary">← Return to Aero Outlook</Link>
      </footer>
    </article>
  );
}
