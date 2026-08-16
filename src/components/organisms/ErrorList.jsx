import { ErrorCard } from "../molecules/ErrorCard";

export function ErrorList({
  title,
  subtitle,
  issues,
  labels,
  emptyMessage,
  toolbar,
  onRequestFix,
  requestFixLabel,
  requestFixLoadingLabel,
  loadingFixIds = [],
}) {
  return (
    <section className="error-list">
      <header className="section-header">
        <div>
          <p className="section-title">{title}</p>
          <p className="section-subtitle">{subtitle}</p>
        </div>
      </header>
      {toolbar ? <div className="filter-bar">{toolbar}</div> : null}
      {issues.length ? (
        <div className="error-grid">
          {issues.map((issue) => (
            <ErrorCard
              key={issue.id}
              issue={issue}
              labels={labels}
              onRequestFix={onRequestFix}
              requestFixLabel={requestFixLabel}
              requestFixLoadingLabel={requestFixLoadingLabel}
              isRequestingFix={loadingFixIds.includes(issue.id)}
            />
          ))}
        </div>
      ) : (
        <p className="error-empty">{emptyMessage}</p>
      )}
    </section>
  );
}
