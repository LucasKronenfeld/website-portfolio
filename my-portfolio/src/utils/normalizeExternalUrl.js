export function normalizeExternalUrl(rawUrl) {
  const value = (rawUrl || "").trim();
  if (!value) return "";

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
  return hasScheme ? value : `https://${value}`;
}

export function isExternalUrl(rawUrl) {
  const value = (rawUrl || "").trim();
  if (!value) return false;
  if (value.startsWith("/")) return false;

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
  return hasScheme || value.includes(".");
}