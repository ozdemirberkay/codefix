export function RepoForm({
  labels,
  placeholders,
  rootHint,
  repoLink,
  repoBranch,
  repoRoot,
  onRepoLinkChange,
  onRepoBranchChange,
  onRepoRootChange,
}) {
  return (
    <div className="repo-form">
      <label className="repo-field">
        <span className="repo-label">{labels.link}</span>
        <input
          type="url"
          value={repoLink}
          onChange={(event) => onRepoLinkChange(event.target.value)}
          placeholder={placeholders.link}
          className="repo-control"
        />
      </label>
      <label className="repo-field">
        <span className="repo-label">{labels.branch}</span>
        <input
          type="text"
          value={repoBranch}
          onChange={(event) => onRepoBranchChange(event.target.value)}
          placeholder={placeholders.branch}
          className="repo-control"
        />
      </label>
      <label className="repo-field repo-field-wide">
        <span className="repo-label">{labels.root}</span>
        <input
          type="text"
          value={repoRoot}
          onChange={(event) => onRepoRootChange(event.target.value)}
          placeholder={placeholders.root}
          className="repo-control"
        />
        <span className="repo-field-hint">{rootHint}</span>
      </label>
    </div>
  );
}
