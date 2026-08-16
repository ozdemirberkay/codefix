import { Logo } from "../atoms/Logo";
import { LanguageSwitcher } from "../molecules/LanguageSwitcher";

export function Header({ languageLabel, locale, locales, onLocaleChange }) {
  return (
    <header className="header">
      <Logo />
      <LanguageSwitcher
        label={languageLabel}
        value={locale}
        locales={locales}
        onChange={onLocaleChange}
      />
    </header>
  );
}
