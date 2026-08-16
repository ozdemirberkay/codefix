import { useEffect, useMemo, useState } from "react";
import { Header } from "../organisms/Header";
import { SummaryGrid } from "../organisms/SummaryGrid";
import { ErrorList } from "../organisms/ErrorList";
import { SetupPanel } from "../organisms/SetupPanel";
import { Toast } from "../atoms/Toast";
import { SearchInput } from "../molecules/SearchInput";
import { SeverityFilter } from "../molecules/SeverityFilter";
import { Button } from "../atoms/Button";
import { parseEslintReport } from "../../services/analysisService";
import { requestFixSuggestion } from "../../services/llmFixService";
import { useI18n } from "../../hooks/useI18n";
import { useDebounce } from "../../hooks/useDebounce";
import { loadFromStorage, saveToStorage } from "../../utils/storage";

const STORAGE_KEY = "codefix:analysis";
const REPO_STORAGE_KEY = "codefix:repo";

const initialData = {
  lastScan: "-",
  summary: {
    total: 0,
    critical: 0,
    major: 0,
    minor: 0,
  },
  issues: [],
};

const severityOptions = (t, summary) => [
  { value: "all", label: t("severity.all"), count: summary.total },
  { value: "critical", label: t("severity.critical"), count: summary.critical },
  { value: "major", label: t("severity.major"), count: summary.major },
  { value: "minor", label: t("severity.minor"), count: summary.minor },
];

export function HomePage() {
  const { locale, setLocale, locales, t } = useI18n();
  const [data, setData] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEY);
    return stored?.data || initialData;
  });
  const [fileName, setFileName] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEY);
    return stored?.fileName || "";
  });
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [resetCounter, setResetCounter] = useState(0);
  const [repoLink, setRepoLink] = useState(() => {
    const stored = loadFromStorage(REPO_STORAGE_KEY);
    return stored?.repoLink || "";
  });
  const [repoRoot, setRepoRoot] = useState(() => {
    const stored = loadFromStorage(REPO_STORAGE_KEY);
    return stored?.repoRoot || "";
  });
  const [repoBranch, setRepoBranch] = useState(() => {
    const stored = loadFromStorage(REPO_STORAGE_KEY);
    return stored?.repoBranch || "";
  });
  const [loadingFixIds, setLoadingFixIds] = useState([]);

  const debouncedSearch = useDebounce(searchTerm, 250);

  useEffect(() => {
    saveToStorage(REPO_STORAGE_KEY, { repoLink, repoRoot, repoBranch });
  }, [repoLink, repoRoot, repoBranch]);

  const showToast = (message, variant) => {
    setToast({ message, variant });
    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleInvalidFile = () => {
    showToast(t("errors.fileNotJson"), "error");
  };

  const handleFileSelected = async (file) => {
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const normalized = parseEslintReport(parsed);
      setData(normalized);
      setFileName(file.name);
      saveToStorage(STORAGE_KEY, { data: normalized, fileName: file.name });
      showToast(t("setup.upload.success"), "success");
    } catch (error) {
      if (error?.message === "invalid_format") {
        showToast(t("errors.reportInvalidShape"), "error");
        return;
      }
      showToast(t("errors.reportParseFailed"), "error");
    }
  };

  const handleClearAll = () => {
    setData(initialData);
    setFileName("");
    setSearchTerm("");
    setSeverityFilter("all");
    setRepoLink("");
    setRepoRoot("");
    setRepoBranch("");
    setResetCounter((prev) => prev + 1);
    setToast(null);
    saveToStorage(STORAGE_KEY, { data: initialData, fileName: "" });
    saveToStorage(REPO_STORAGE_KEY, {
      repoLink: "",
      repoRoot: "",
      repoBranch: "",
    });
  };

  const deriveRepoRelativePath = (filePath) => {
    if (!filePath) return null;
    if (repoRoot && filePath.startsWith(repoRoot)) {
      return filePath.slice(repoRoot.length).replace(/^\/+/, "");
    }
    return null;
  };

  const parseRepoLink = () => {
    try {
      const url = new URL(repoLink);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return null;
      const owner = parts[0];
      const repo = parts[1].replace(/\.git$/, "");
      return { owner, repo };
    } catch {
      return null;
    }
  };

  const handleRequestFix = async (issue) => {
    if (loadingFixIds.includes(issue.id)) return;

    if (!repoLink) {
      showToast(t("errors.repoLinkRequired"), "error");
      return;
    }
    if (!repoBranch) {
      showToast(t("errors.repoBranchRequired"), "error");
      return;
    }
    if (!repoRoot) {
      showToast(t("errors.repoRootRequired"), "error");
      return;
    }

    const repoInfo = parseRepoLink();
    if (!repoInfo) {
      showToast(t("errors.repoLinkInvalid"), "error");
      return;
    }

    const relativePath = deriveRepoRelativePath(issue.filePath || issue.file);
    if (!relativePath) {
      showToast(t("errors.repoPathUnresolved"), "error");
      return;
    }

    const rawUrl = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${repoBranch}/${relativePath}`;
    setLoadingFixIds((prev) => [...prev, issue.id]);

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) {
        showToast(t("errors.repoFileNotFound"), "error");
        return;
      }
      const sourceCode = await response.text();

      const fixSuggestion = await requestFixSuggestion({
        issue,
        relativePath,
        code: sourceCode,
        locale,
      });

      setData((prevData) => {
        const nextData = {
          ...prevData,
          issues: prevData.issues.map((entry) =>
            entry.id === issue.id ? { ...entry, fix: fixSuggestion } : entry,
          ),
        };
        saveToStorage(STORAGE_KEY, { data: nextData, fileName });
        return nextData;
      });

      showToast(t("success.fixGenerated"), "success");
    } catch (error) {
      if (error?.message === "missing_api_key") {
        showToast(t("errors.llmApiKeyMissing"), "error");
        return;
      }
      showToast(t("errors.llmRequestFailed"), "error");
    } finally {
      setLoadingFixIds((prev) => prev.filter((id) => id !== issue.id));
    }
  };

  const filteredIssues = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return data.issues.filter((issue) => {
      const matchesSeverity =
        severityFilter === "all" || issue.severity === severityFilter;
      if (!matchesSeverity) return false;

      if (!query) return true;

      const message = issue.message?.toLowerCase() || "";
      const filePath = (issue.filePath || issue.file || "").toLowerCase();
      return message.includes(query) || filePath.includes(query);
    });
  }, [data.issues, debouncedSearch, severityFilter]);

  const issueCountLabel = useMemo(
    () =>
      t("issues.count", {
        shown: filteredIssues.length,
        count: data.issues.length,
      }),
    [filteredIssues.length, data.issues.length, t],
  );

  return (
    <div className="app-shell">
      <Header
        languageLabel={t("common.language")}
        locale={locale}
        locales={locales}
        onLocaleChange={setLocale}
      />
      <main className="content">
        <section className="hero">
          <div>
            <h1>{t("app.tagline")}</h1>
          </div>
          <div className="scan-card">
            <p className="scan-title">{t("common.lastScan")}</p>
            <p className="scan-value">{data.lastScan}</p>
          </div>
        </section>

        <Toast
          message={toast?.message}
          variant={toast?.variant}
          onClose={() => setToast(null)}
        />

        <SetupPanel
          t={t}
          upload={{
            fileName,
            onFileSelected: handleFileSelected,
            onInvalidFile: handleInvalidFile,
            resetKey: resetCounter,
          }}
          repo={{
            repoLink,
            repoBranch,
            repoRoot,
            onRepoLinkChange: setRepoLink,
            onRepoBranchChange: setRepoBranch,
            onRepoRootChange: setRepoRoot,
          }}
          actions={
            <Button variant="ghost" onClick={handleClearAll}>
              {t("common.clearAll")}
            </Button>
          }
        />

        <section className="summary">
          <div className="section-header">
            <div>
              <p className="section-title">{t("summary.title")}</p>
              <p className="section-subtitle">{t("summary.subtitle")}</p>
            </div>
          </div>
          <SummaryGrid
            labels={{
              total: t("summary.total"),
              critical: t("severity.critical"),
              major: t("severity.major"),
              minor: t("severity.minor"),
            }}
            summary={data.summary}
          />
        </section>

        <ErrorList
          title={t("issues.title")}
          subtitle={issueCountLabel}
          issues={filteredIssues}
          labels={{
            locale,
            line: t("issues.card.line"),
            confidence: t("issues.card.confidence"),
            noFix: t("issues.card.noFix"),
            severity: {
              critical: t("severity.critical"),
              major: t("severity.major"),
              minor: t("severity.minor"),
            },
          }}
          emptyMessage={t(
            data.issues.length ? "issues.emptyFiltered" : "issues.emptyInitial",
          )}
          requestFixLabel={t("issues.card.requestFix")}
          requestFixLoadingLabel={t("issues.card.requestFixLoading")}
          loadingFixIds={loadingFixIds}
          onRequestFix={handleRequestFix}
          toolbar={
            <>
              <SearchInput
                label={t("issues.searchLabel")}
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t("issues.searchPlaceholder")}
              />
              <SeverityFilter
                label={t("issues.filterLabel")}
                value={severityFilter}
                onChange={setSeverityFilter}
                options={severityOptions(t, data.summary)}
              />
            </>
          }
        />
      </main>
    </div>
  );
}
