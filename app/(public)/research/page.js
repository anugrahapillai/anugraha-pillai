import ResearchRow from "@/components/public/ResearchRow";
import { mockContent } from "@/lib/repositories/mock-admin";

export const metadata = {
  title: "Research & Analysis — Anugraha Pillai",
  description: "Longitudinal research reports, data dispatches, and policy studies.",
};

export default function ResearchListingPage() {
  const research = mockContent.filter((i) => i.type === "Research");

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Research & Analysis</p>
        <h1>Research & Analysis</h1>
        <p>Longitudinal policy studies, urban data indicators, and institutional field research.</p>
      </header>

      <section className="list-research">
        {research.map((item) => (
          <ResearchRow key={item.id} {...item} />
        ))}
      </section>
    </div>
  );
}
