import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { formatPercent } from "../../utils/format";

export function ErrorCard({
  issue,
  labels,
  onRequestFix,
  requestFixLabel,
  requestFixLoadingLabel,
  isRequestingFix = false,
}) {
  return (
    <article className="error-card">
      <div className="error-card-header">
        <div>
          <p className="error-id">{issue.id}</p>
          <p className="error-message">{issue.message}</p>
        </div>
        <Badge label={labels.severity[issue.severity]} severity={issue.severity} />
      </div>
      <div className="error-meta">
        <span>{issue.file}</span>
        <span>
          {issue.rule} · {labels.line} {issue.line}
        </span>
        <span>
          {labels.confidence} {formatPercent(issue.confidence, labels.locale)}
        </span>
      </div>
      {issue.fix ? (
        <p className="error-fix">{issue.fix}</p>
      ) : (
        <div className="error-fix">
          <p className="error-fix-text">{labels.noFix}</p>
          {onRequestFix ? (
            <Button
              variant="ghost"
              onClick={() => onRequestFix(issue)}
              disabled={isRequestingFix}
            >
              {isRequestingFix ? requestFixLoadingLabel : requestFixLabel}
            </Button>
          ) : null}
        </div>
      )}
    </article>
  );
}
