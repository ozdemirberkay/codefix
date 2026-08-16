export const FIX_SUGGESTION_SYSTEM_PROMPT = `
You are a senior static-analysis remediation assistant.
Given a lint/static analysis finding and the related source code:
1) Explain the likely root cause briefly.
2) Provide a concrete, safe fix suggestion for this exact file.
3) If relevant, include a short code snippet.

Constraints:
- Keep the response practical and concise.
- Do not invent project files or APIs.
- Focus on this single finding only.
`;

export function buildFixSuggestionUserPrompt({ issue, relativePath, code, locale = "tr" }) {
  const languageInstruction =
    locale === "tr"
      ? "Yaniti Turkce ver."
      : "Answer in English.";

  return `
${languageInstruction}

Static analysis finding:
- Severity: ${issue.severity}
- Rule: ${issue.rule}
- File: ${relativePath}
- Line: ${issue.line}
- Message: ${issue.message}

Source code:
\`\`\`
${code}
\`\`\`
`;
}
