import PosterCard from "@/components/public/PosterCard";
import { mockContent } from "@/lib/repositories/mock-admin";

export const metadata = {
  title: "Aero Graphics — Anugraha Pillai",
  description: "Civic design, visual communications, and conceptual poster designs.",
};

export default function PostersListingPage() {
  const posters = mockContent.filter((i) => i.type === "Poster");

  return (
    <div className="page-container dark-theme-block">
      <header className="page-header">
        <p className="eyebrow eyebrow--light">Aero Graphics</p>
        <h1>Aero Graphics</h1>
        <p>Conceptual poster artwork and visual design for public conversations.</p>
      </header>

      <section className="grid-posters">
        {posters.map((poster) => (
          <PosterCard key={poster.id} {...poster} />
        ))}
      </section>
    </div>
  );
}
