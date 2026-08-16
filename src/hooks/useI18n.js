import { useEffect, useMemo, useState } from "react";
import {
  createTranslator,
  defaultLocale,
  isSupportedLocale,
  supportedLocales,
} from "../i18n";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const LOCALE_STORAGE_KEY = "codefix:locale";

export function useI18n() {
  const [locale, setLocale] = useState(() => {
    const stored = loadFromStorage(LOCALE_STORAGE_KEY);
    return isSupportedLocale(stored) ? stored : defaultLocale;
  });

  useEffect(() => {
    saveToStorage(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(() => createTranslator(locale), [locale]);

  return {
    locale,
    setLocale,
    locales: supportedLocales,
    t,
  };
}
