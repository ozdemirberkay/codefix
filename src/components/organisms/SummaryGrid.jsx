import { StatCard } from "../molecules/StatCard";

export function SummaryGrid({ labels, summary }) {
  return (
    <section className="summary-grid">
      <StatCard label={labels.total} value={summary.total} tone="total" />
      <StatCard label={labels.critical} value={summary.critical} tone="critical" />
      <StatCard label={labels.major} value={summary.major} tone="major" />
      <StatCard label={labels.minor} value={summary.minor} tone="minor" />
    </section>
  );
}
