import { SearchIcon } from "../atoms/SearchIcon";

export function SearchInput({ label, value, onChange, placeholder }) {
  return (
    <label className="search-input">
      <span className="visually-hidden">{label}</span>
      <SearchIcon />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="search-control"
      />
    </label>
  );
}
