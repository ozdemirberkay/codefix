export function Toast({ message, variant = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${variant}`} role="status" aria-live="polite">
      <span>{message}</span>
      {onClose ? (
        <button className="toast-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      ) : null}
    </div>
  );
}
