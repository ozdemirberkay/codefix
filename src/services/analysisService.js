import { formatDateTime } from "../utils/date";
import { compactPath } from "../utils/path";

const severityMap = {
  2: "critical",
  1: "major",
  0: "minor",
};

const fallbackConfidence = {
  critical: 0.9,
  major: 0.75,
  minor: 0.6,
};

export function parseEslintReport(report) {
  if (!Array.isArray(report)) {
    throw new Error("invalid_format");
  }

  const issues = [];
  let critical = 0;
  let major = 0;
  let minor = 0;

  report.forEach((fileResult, fileIndex) => {
    const filePath = fileResult?.filePath;
    const messages = Array.isArray(fileResult?.messages) ? fileResult.messages : [];

    messages.forEach((message, messageIndex) => {
      const severity = severityMap[message?.severity] || "minor";

      if (severity === "critical") critical += 1;
      if (severity === "major") major += 1;
      if (severity === "minor") minor += 1;

      const suggestion = message?.suggestions?.[0]?.desc || null;

      issues.push({
        id: `ESL-${fileIndex + 1}-${messageIndex + 1}`,
        severity,
        filePath,
        file: compactPath(filePath),
        rule: message?.ruleId || "unknown-rule",
        line: message?.line || 0,
        message: message?.message || "No details provided.",
        confidence: fallbackConfidence[severity],
        fix: suggestion,
      });
    });
  });

  return {
    lastScan: formatDateTime(new Date()),
    summary: {
      total: issues.length,
      critical,
      major,
      minor,
    },
    issues,
  };
}
