/**
 * Formats an ISO date string ("2026-01-15") into a human-readable form.
 * e.g. "January 15, 2026"
 */
export function formatDate(dateString, locale = "en-US") {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Returns an ISO 8601 string suitable for <meta> / JSON-LD datePublished. */
export function toISODate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}
