import Link from "next/link";
import { mockContent } from "@/lib/repositories/mock-admin";

export const metadata = {
  title: "Advisory Services — Anugraha Pillai",
  description: "Strategic research, narrative design, and advisory services for public institutions and civic initiatives.",
};

export default function ServicesPage() {
  const services = mockContent.filter((i) => i.type === "Service");

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Advisory Services</p>
        <h1>Research & Narrative Strategy</h1>
        <p>Partnering with public sector teams, non-profits, and policy research institutes.</p>
      </header>

      <section className="services-grid">
        {services.length ? (
          services.map((srv) => (
            <div key={srv.id} className="service-card">
              <span className="eyebrow">{srv.category}</span>
              <h3>{srv.title}</h3>
              <p>{srv.excerpt || srv.body}</p>
              <Link href="/contact" className="button button--secondary">Discuss engagement →</Link>
            </div>
          ))
        ) : (
          <div className="service-card">
            <span className="eyebrow">Strategy & Advisory</span>
            <h3>Research and narrative strategy</h3>
            <p>Advisory consulting for institutional communication, narrative design, and policy research execution.</p>
            <Link href="/contact" className="button button--secondary">Discuss engagement →</Link>
          </div>
        )}
      </section>
    </div>
  );
}
