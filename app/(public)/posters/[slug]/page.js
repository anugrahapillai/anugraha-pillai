import Link from "next/link";
import { notFound } from "next/navigation";
import { mockContent } from "@/lib/repositories/mock-admin";

export async function generateStaticParams() {
  return mockContent
    .filter((i) => i.type === "Poster" && i.slug)
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const poster = mockContent.find((i) => i.slug === slug || i.id === slug);
  if (!poster) return { title: "Poster Not Found — Anugraha Pillai" };
  return {
    title: `${poster.title} — Anugraha Pillai`,
    description: poster.excerpt || poster.title,
  };
}

export default async function PosterDetailPage({ params }) {
  const { slug } = await params;
  const poster = mockContent.find((i) => i.slug === slug || i.id === slug);

  if (!poster) {
    notFound();
  }

  return (
    <article className="poster-detail">
      <header className="page-header">
        <Link href="/posters" className="back-link">← All Posters</Link>
        <span className="eyebrow">{poster.category || "Poster"}</span>
        <h1>{poster.title}</h1>
        <p>{poster.excerpt}</p>
      </header>

      <div className="poster-detail__stage">
        <div className="poster-detail__canvas">
          <span className="poster-detail__symbol">✦</span>
          <h2>{poster.title}</h2>
        </div>
      </div>

      <div className="poster-detail__content">
        <p>{poster.body || "Visual poster design exploring public conversation and civic identity."}</p>
      </div>
    </article>
  );
}
