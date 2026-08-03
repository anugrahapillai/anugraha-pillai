import Link from "next/link";

export const metadata = {
  title: "About — Anugraha Pillai",
  description: "Profile and background of Anugraha Pillai in public policy, story design, and civic communication.",
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Profile</p>
        <h1>About Anugraha Pillai</h1>
        <p>Writer, civic designer, and policy researcher.</p>
      </header>

      <section className="about-content">
        <div className="about-bio">
          <p>
            Anugraha Pillai works at the intersection of public policy, urban development, and narrative communication.
            Focusing on how public institutions communicate complex policy decisions, her work bridges empirical research and visual design.
          </p>
          <p>
            With experience across municipal research teams, civic design projects, and independent policy dispatches, she leads research initiatives that examine urban transitions, governance structures, and public dialogue.
          </p>
          <div className="about-actions">
            <Link href="/contact" className="button button--primary">Get in Touch</Link>
            <Link href="/blogs" className="button button--secondary">Read Writing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
