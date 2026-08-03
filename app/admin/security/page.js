export default function SecurityPage() {
  const authorizedAdmins = [
    { email: "anugrahaapillai@gmail.com", role: "Owner Alias", status: "Active" },
    { email: "ratirajchavan@gmail.com", role: "Developer", status: "Active" },
  ];

  return (
    <>
      <header className="page-heading">
        <div>
          <p className="eyebrow">Access Control</p>
          <h1>Security & Auth Settings</h1>
          <p>Review authorized login access, Cloud Firestore security, and authentication logs.</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Authorized Admin Accounts Policy Card */}
        <section className="panel">
          <div className="panel__heading">
            <h2>Authorized Admin Accounts</h2>
            <span className="status-badge status-badge--live">Strict Lock</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: ".92rem", marginBottom: "1.25rem" }}>
            Only the specified email accounts listed below can log into the Admin Studio and manage live Cloud Firestore data:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {authorizedAdmins.map((admin) => (
              <li
                key={admin.email}
                style={{
                  padding: ".85rem 1rem",
                  marginBottom: ".6rem",
                  background: "var(--night-surface)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--night-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "var(--text-primary)", display: "block" }}>{admin.email}</strong>
                  <small style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>{admin.role}</small>
                </div>
                <span className="status-badge status-badge--live">{admin.status}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Database Security Rules Card */}
        <section className="panel">
          <h2>Cloud Firestore Security Rules</h2>
          <span className="status-badge status-badge--live" style={{ marginBottom: "1rem", display: "inline-block" }}>
            Deployed to Firebase
          </span>
          <p style={{ color: "var(--text-secondary)", fontSize: ".92rem", lineHeight: 1.6 }}>
            Public visitors have read-only access to published dispatches, posters, and research. Unauthenticated users cannot delete, modify, or overwrite any Firestore documents.
          </p>
          <div
            style={{
              padding: ".85rem",
              background: "#080710",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--night-border)",
              fontFamily: "monospace",
              fontSize: ".82rem",
              color: "var(--lilac)",
              marginTop: "1rem",
            }}
          >
            {"match /posts/{id} { allow read: if true; allow write: if request.auth != null; }"}
          </div>
        </section>

        {/* Session Security Details */}
        <section className="panel">
          <h2>Active Session Protection</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: ".92rem", lineHeight: 1.6 }}>
            Current session cookies use HTTP-Only, SameSite=Lax, and Secure transmission to prevent token theft or unauthorized cross-site requests.
          </p>
        </section>

        {/* Audit & Compliance Log */}
        <section className="panel">
          <h2>Security Audit Status</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: ".92rem", lineHeight: 1.6 }}>
            All administrative actions (content creation, updates, and record deletions) are logged to Firebase Audit Logs for accountability and security tracking.
          </p>
        </section>
      </div>
    </>
  );
}
