const labels = {
  draft: "Draft",
  pending: "Publication pending",
  live: "Live",
  failed: "Publication failed",
  archived: "Archived",
};

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status}`}>{labels[status] ?? status}</span>;
}
