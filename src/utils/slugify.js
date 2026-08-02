/**
 * Converts a string into a URL/SEO-friendly slug.
 * "JWT Authentication Guide!" -> "jwt-authentication-guide"
 */
export function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slugifies heading text for anchor links, matching how most markdown
 * renderers (and rehype-slug) generate ids, so ToC links resolve correctly.
 */
export function slugifyHeading(text = "") {
  return slugify(text.replace(/`/g, ""));
}
