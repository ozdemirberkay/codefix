import {
  FIX_SUGGESTION_SYSTEM_PROMPT,
  buildFixSuggestionUserPrompt,
} from "../prompts/fixSuggestionPrompt";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";

function extractResponseText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const outputBlocks = Array.isArray(payload?.output) ? payload.output : [];
  for (const block of outputBlocks) {
    const content = Array.isArray(block?.content) ? block.content : [];
    for (const item of content) {
      const candidate = item?.text || item?.output_text;
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }
  return "";
}

export async function requestFixSuggestion({
  issue,
  relativePath,
  code,
  locale,
}) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const model = import.meta.env.VITE_OPENAI_MODEL || DEFAULT_MODEL;
  const payload = {
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: FIX_SUGGESTION_SYSTEM_PROMPT.trim(),
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildFixSuggestionUserPrompt({
              issue,
              relativePath,
              code,
              locale,
            }).trim(),
          },
        ],
      },
    ],
  };

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("unauthorized");
    }
    throw new Error("request_failed");
  }

  const result = await response.json();
  const suggestion = extractResponseText(result);

  if (!suggestion) {
    throw new Error("empty_suggestion");
  }
  return suggestion;
}
