import { UploadDropzone } from "../molecules/UploadDropzone";
import { RepoForm } from "../molecules/RepoForm";

function Step({ number, title, description, tag, isDone, children }) {
  return (
    <div className={`setup-step ${isDone ? "setup-step-done" : ""}`}>
      <header className="step-header">
        <span className="step-number">{isDone ? "✓" : number}</span>
        <div className="step-heading">
          <p className="step-title">
            {title}
            {tag ? <span className="step-tag">{tag}</span> : null}
          </p>
          <p className="step-description">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

export function SetupPanel({ t, upload, repo, actions }) {
  const isRepoReady = Boolean(repo.repoLink && repo.repoBranch && repo.repoRoot);

  return (
    <section className="setup">
      <header className="section-header">
        <div>
          <p className="section-title">{t("setup.title")}</p>
          <p className="section-subtitle">{t("setup.description")}</p>
        </div>
        {actions ? <div className="section-actions">{actions}</div> : null}
      </header>

      <div className="setup-grid">
        <Step
          number="1"
          title={t("setup.upload.title")}
          description={t("setup.upload.description")}
          isDone={Boolean(upload.fileName)}
        >
          <UploadDropzone
            hint={t("setup.upload.hint")}
            fileName={upload.fileName}
            successMessage={upload.fileName ? t("setup.upload.success") : ""}
            onFileSelected={upload.onFileSelected}
            onInvalidFile={upload.onInvalidFile}
            resetKey={upload.resetKey}
          />
          <p className="step-footnote">
            {t("setup.upload.commandHint")}{" "}
            <code>{t("setup.upload.command")}</code>
          </p>
        </Step>

        <Step
          number="2"
          title={t("setup.repo.title")}
          description={t("setup.repo.description")}
          tag={t("setup.optionalTag")}
          isDone={isRepoReady}
        >
          <RepoForm
            labels={{
              link: t("setup.repo.linkLabel"),
              branch: t("setup.repo.branchLabel"),
              root: t("setup.repo.rootLabel"),
            }}
            placeholders={{
              link: t("setup.repo.linkPlaceholder"),
              branch: t("setup.repo.branchPlaceholder"),
              root: t("setup.repo.rootPlaceholder"),
            }}
            rootHint={t("setup.repo.rootHint")}
            repoLink={repo.repoLink}
            repoBranch={repo.repoBranch}
            repoRoot={repo.repoRoot}
            onRepoLinkChange={repo.onRepoLinkChange}
            onRepoBranchChange={repo.onRepoBranchChange}
            onRepoRootChange={repo.onRepoRootChange}
          />
          <p
            className={`step-status ${isRepoReady ? "step-status-ready" : ""}`}
          >
            {isRepoReady
              ? t("setup.repo.statusReady")
              : t("setup.repo.statusMissing")}
          </p>
        </Step>
      </div>
    </section>
  );
}
