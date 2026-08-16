import { Select } from "../atoms/Select";

export function LanguageSwitcher({ label, value, locales, onChange }) {
  const options = locales.map((locale) => ({
    value: locale.code,
    label: locale.label,
  }));

  return <Select label={label} value={value} onChange={onChange} options={options} />;
}
