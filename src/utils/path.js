export function compactPath(filePath, segments = 3) {
  if (!filePath) return "-";
  const parts = filePath.split(/[\\/]/).filter(Boolean);
  return parts.slice(-segments).join("/");
}
