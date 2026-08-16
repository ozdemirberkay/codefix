export const defaultLocale = "tr";
export const fallbackLocale = "en";

export const supportedLocales = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

export function isSupportedLocale(locale) {
  return supportedLocales.some((entry) => entry.code === locale);
}
