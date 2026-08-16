export function Select({ label, value, onChange, options }) {
  return (
    <label className="select">
      <span className="select-label">{label}</span>
      <select
        className="select-control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
