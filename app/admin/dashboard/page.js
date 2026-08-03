import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { displayState, mockAdminRepository } from "@/lib/repositories/mock-admin";

export default async function DashboardPage() {
  const { needsAction, recent } = await mockAdminRepository.dashboard();

  const actions = [
    ["New Poster", "/admin/posters?new=true"],
    ["New Dispatch", "/admin/blogs?new=true"],
    ["New Service", "/admin/services?new=true"],
    ["Profile Settings", "/admin/settings"],
  ];

  const activityLogs = [
    {
      id: "act-1",
      icon: "✦",
      title: "Flow Poster Published Live",
      description: "Hypersonic Boundary Layer CFD Poster was published live to the public site.",
      time: "10 minutes ago",
      badge: "Live",
    },
    {
      id: "act-2",
      icon: "◈",
      title: "Aerospace Dispatch Saved",
      description: "Aerodynamic Optimization for Supersonic Airframes saved to Cloud Firestore.",
      time: "1 hour ago",
      badge: "Saved",
    },
    {
      id: "act-3",
      icon: "❖",
      title: "Admin Sign-In Verified",
      description: "Authorized login verified for anugrahapillai@gmail.com / ratirajchavan@gmail.com.",
      time: "2 hours ago",
      badge: "Security",
    },
    {
      id: "act-4",
      icon: "✉",
      title: "Contact Form Message Received",
      description: "Direct message received regarding CFD Advisory & Aerodynamic Analysis.",
      time: "Yesterday at 4:15 PM",
      badge: "Inquiry",
    },
    {
      id: "act-5",
      icon: "✧",
      title: "Aeroplane Cursor & Custom Theme Active",
      description: "White Aeroplane custom pointer and tail exhaust particles active on public site.",
      time: "Yesterday at 2:00 PM",
      badge: "Active",
    },
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

      <section aria-labelledby="quick-actions" style={{ marginBottom: "2rem" }}>
        <h2 id="quick-actions" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Quick Actions</h2>
        <div className="quick-actions">
          {actions.map(([label, href]) => (
            <Link key={href} href={href}>
              {label} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        {/* Recent Activity Log (Non-Tech Friendly) */}
        <section className="panel" aria-labelledby="activity-log">
          <div className="panel__heading">
            <h2 id="activity-log">Recent Activity Log</h2>
            <span className="eyebrow eyebrow--light" style={{ fontSize: ".7rem" }}>Live Site History</span>
          </div>
          <ul className="content-rows" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {activityLogs.map((log) => (
              <li key={log.id} style={{ padding: ".85rem 0", borderBottom: "1px solid var(--night-border)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{log.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".2rem" }}>
                    <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{log.title}</strong>
                    <small style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>{log.time}</small>
                  </div>
                  <p style={{ margin: 0, fontSize: ".88rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {log.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Content Needing Decision / Review */}
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
            <small>{item.type} · Updated {item.updatedAt}</small>
          </div>
          <StatusBadge status={displayState(item)} />
        </li>
      ))}
    </ul>
  );
}
