import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { displayState } from "@/lib/repositories/mock-admin";
import { formatDate } from "@/lib/client/date-utils";
import {
  firestorePosts,
  firestorePosters,
  firestoreResearch,
  firestoreServices,
} from "@/lib/repositories/firestore-adapters";

export default async function DashboardPage() {
  let needsAction = [];

  try {
    const [postsRes, postersRes, researchRes, servicesRes] = await Promise.all([
      firestorePosts.list({ limit: 50 }),
      firestorePosters.list({ limit: 50 }),
      firestoreResearch.list({ limit: 50 }),
      firestoreServices.list({ limit: 50 }),
    ]);

    const allItems = [
      ...(postsRes.items || []).map((i) => ({ ...i, type: "Aero Outlook" })),
      ...(postersRes.items || []).map((i) => ({ ...i, type: "Aero Graphics" })),
      ...(researchRes.items || []).map((i) => ({ ...i, type: "Research & Analysis" })),
      ...(servicesRes.items || []).map((i) => ({ ...i, type: "Service" })),
    ];

    needsAction = allItems
      .filter((item) => ["draft", "pending", "failed"].includes(displayState(item)))
      .sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, 5);
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  const actions = [
    ["New Aero Graphics", "/admin/posters?new=true"],
    ["New Aero Outlook", "/admin/blogs?new=true"],
    ["New Research & Analysis", "/admin/research?new=true"],
    ["Edit Profile", "/admin/settings"],
  ];

  return (
    <>
      <header className="page-heading">
        <div>
          <p className="eyebrow">Studio Overview</p>
          <h1>Admin Dashboard</h1>
          <p>Welcome, Anugraha! Manage your dispatches, flow posters, and website content here.</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Side: Quick Actions Panel */}
        <section aria-labelledby="quick-actions" className="panel">
          <div className="panel__heading">
            <h2 id="quick-actions">Quick Actions</h2>
            <span className="eyebrow eyebrow--light" style={{ fontSize: ".7rem" }}>Studio Shortcuts</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
            {actions.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="button button--secondary"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                  padding: "0.85rem 1.25rem",
                  width: "100%",
                }}
              >
                {label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Right Side: Items Needing Review Panel */}
        <section className="panel" aria-labelledby="needs-action">
          <div className="panel__heading">
            <h2 id="needs-action">Items Needing Review</h2>
            <span>Drafts & Pending</span>
          </div>
          <ContentRows items={needsAction} />
        </section>
      </div>
    </>
  );
}

function ContentRows({ items }) {
  if (!items || !items.length) return <p className="empty-state">No pending items right now.</p>;
  return (
    <ul className="content-rows">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.title}</strong>
            <small>{item.type} · Updated {formatDate(item.updatedAt)}</small>
          </div>
          <StatusBadge status={displayState(item)} />
        </li>
      ))}
    </ul>
  );
}
