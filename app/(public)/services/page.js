import Link from "next/link";
import { firestoreServices } from "@/lib/repositories/firestore-adapters";

export const metadata = {
  title: "Advisory Services — Anugraha Pillai",
  description: "Strategic research, narrative design, and advisory services for public institutions and civic initiatives.",
};

export const revalidate = 60; // Revalidate dynamic listing page every 60s

export default async function ServicesPage() {
  const res = await firestoreServices.list({ state: "published" });
  const services = (res.items || []).filter((i) => i.status === "published" || !i.status);

  // Sort by newest
  const sortedServices = [...services].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || a.publishedAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || b.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Advisory Services</p>
        <h1>Research & Narrative Strategy</h1>
        <p>Partnering with public sector teams, non-profits, and policy research institutes.</p>
      </header>

      <section className="services-grid">
        {sortedServices.length ? (
          sortedServices.map((srv) => (
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
