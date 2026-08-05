import Link from "next/link";
import { notFound } from "next/navigation";
import { mockContent } from "@/lib/repositories/mock-admin";
import { formatDate } from "@/lib/client/date-utils";
import { markdownToHtml } from "@/lib/client/markdown";

export async function generateStaticParams() {
  return mockContent
    .filter((i) => i.type === "Research" && i.slug)
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = mockContent.find((i) => i.slug === slug || i.id === slug);
  if (!item) return { title: "Research & Analysis Not Found — Anugraha Pillai" };
  return {
    title: `${item.title} — Anugraha Pillai`,
    description: item.excerpt || item.title,
  };
}

export default async function ResearchDetailPage({ params }) {
  const { slug } = await params;
  const item = mockContent.find((i) => i.slug === slug || i.id === slug);

  if (!item) {
    notFound();
  }

  return (
    <article className="article-detail">
      <header className="article-detail__header">
        <Link href="/research" className="back-link">← All Research & Analysis</Link>
        <span className="eyebrow">{item.category || "Research & Analysis"}</span>
        <h1>{item.title}</h1>
        <div className="article-detail__meta">
          <time>Published {formatDate(item.publishedAt)}</time> · <span>Policy Study</span>
        </div>
      </header>

      {item.excerpt && <p className="article-detail__lead">{item.excerpt}</p>}

      <div
        className="article-detail__body markdown-body"
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(item.body || "Detailed research report content and findings."),
        }}
      />

      <footer className="article-detail__footer">
        <Link href="/research" className="button button--secondary">← Return to Research & Analysis</Link>
        <Link href="/contact" className="button button--primary">Enquire about this study</Link>
      </footer>
    </article>
  );
}
