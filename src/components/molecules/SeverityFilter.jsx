export function SeverityFilter({ label, value, onChange, options }) {
  return (
    <div className="severity-filter" role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`severity-option ${
              isActive ? "severity-option-active" : ""
            } severity-option-${option.value}`}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            <span className="severity-count">{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}
