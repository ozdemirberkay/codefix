import { classNames } from "../../utils/classNames";

const severityStyles = {
  critical: "badge-critical",
  major: "badge-major",
  minor: "badge-minor",
};

export function Badge({ label, severity = "minor" }) {
  return (
    <span className={classNames("badge", severityStyles[severity])}>
      {label}
    </span>
  );
}
