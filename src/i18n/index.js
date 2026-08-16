import en from "./locales/en.json";
import tr from "./locales/tr.json";
import { defaultLocale, fallbackLocale } from "./config";

export {
  defaultLocale,
  fallbackLocale,
  supportedLocales,
  isSupportedLocale,
} from "./config";

const resources = { en, tr };

const INTERPOLATION_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

function resolveKey(dictionary, key) {
  return key
    .split(".")
    .reduce((node, part) => (node == null ? undefined : node[part]), dictionary);
}

function interpolate(template, params) {
  return template.replace(INTERPOLATION_PATTERN, (match, name) =>
    params[name] === undefined ? match : String(params[name]),
  );
}

// Plural-aware keys follow the i18next convention: `key_one`, `key_other`.
// A locale that does not need the distinction can define `key_other` only.
function candidateKeys(locale, key, params) {
  if (typeof params.count !== "number") return [key];

  const category = new Intl.PluralRules(locale).select(params.count);
  return [`${key}_${category}`, `${key}_other`, key];
}

export function translate(locale, key, params = {}) {
  const candidates = candidateKeys(locale, key, params);

  for (const candidateLocale of [locale, defaultLocale, fallbackLocale]) {
    const dictionary = resources[candidateLocale];
    if (!dictionary) continue;

    for (const candidate of candidates) {
      const value = resolveKey(dictionary, candidate);
      if (typeof value === "string") return interpolate(value, params);
    }
  }

  if (import.meta.env.DEV) {
    console.warn(`[i18n] Missing translation for "${key}" (${locale})`);
  }
  return key;
}

export function createTranslator(locale) {
  return (key, params) => translate(locale, key, params);
}
