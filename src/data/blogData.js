import { parseFrontmatter } from "../utils/frontmatter";
import { calculateReadingTime } from "../utils/readingTime";
import { slugify } from "../utils/slugify";
import { blogConfig } from "../config/blogConfig";

/**
 * Eagerly imports every markdown file in ./blogs as a raw string.
 * `eager: true` keeps metadata (title, date, category, etc.) synchronously
 * available for listing/search/filter pages without an async fetch.
 * The full markdown body is still only rendered on the single-post page,
 * so this scales fine to 100+ posts (it's just text, no heavy parsing here).
 *
 * Files prefixed with "_" (e.g. _template.md) are treated as templates,
 * not published posts, and are excluded automatically.
 */
const markdownModules = import.meta.glob("./blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function buildPosts() {
  const posts = [];

  for (const path in markdownModules) {
    const fileName = path.split("/").pop();
    if (fileName.startsWith("_")) continue; // skip templates

    const raw = markdownModules[path];
    const { data, content } = parseFrontmatter(raw);

    if (!data.title) {
      // Skip malformed files instead of crashing the whole blog.
      console.warn(`[blogData] Skipping "${path}" — missing required "title" in frontmatter.`);
      continue;
    }

    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const keywords = Array.isArray(data.keywords) ? data.keywords : [];

    posts.push({
      title: data.title,
      slug,
      description: data.description || "",
      author: data.author || blogConfig.defaultAuthor,
      date: data.date || "",
      category: data.category || "Uncategorized",
      tags,
      keywords,
      coverImage: data.coverImage || blogConfig.defaultCoverImage,
      featured: data.featured === true || data.featured === "true",
      content, // markdown body (frontmatter stripped)
      readingTime: calculateReadingTime(content),
      sourcePath: path,
    });
  }

  // Newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

export const allPosts = buildPosts();

// ---------- Query helpers ----------

export function getAllPosts() {
  return allPosts;
}

export function getPostBySlug(slug) {
  return allPosts.find((post) => post.slug === slug) || null;
}

export function getPostsByCategory(category) {
  if (!category || category === "All") return allPosts;
  return allPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag) {
  return allPosts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getFeaturedPosts(limit = blogConfig.featuredPostsCount) {
  const featured = allPosts.filter((post) => post.featured);
  return (featured.length ? featured : allPosts).slice(0, limit);
}

export function getLatestPosts(limit = blogConfig.latestPostsCount) {
  return allPosts.slice(0, limit);
}

/**
 * Related posts: prioritizes same category, then shared tags,
 * falls back to most recent posts if nothing matches.
 */
export function getRelatedPosts(slug, limit = blogConfig.relatedPostsCount) {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const scored = allPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      let score = 0;
      if (post.category === current.category) score += 2;
      score += post.tags.filter((t) => current.tags.includes(t)).length;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score);

  const related = scored.filter((s) => s.score > 0).map((s) => s.post);
  const fallback = allPosts.filter((post) => post.slug !== slug);

  return (related.length ? related : fallback).slice(0, limit);
}

/** Returns the previous and next post relative to the current post's date order. */
export function getAdjacentPosts(slug) {
  const index = allPosts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: index < allPosts.length - 1 ? allPosts[index + 1] : null,
    next: index > 0 ? allPosts[index - 1] : null,
  };
}

/** All categories that actually have at least one post, with counts, sorted by count desc. */
export function getCategoriesWithCounts() {
  const counts = {};
  for (const post of allPosts) {
    counts[post.category] = (counts[post.category] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/** All unique tags across posts, with counts. */
export function getAllTags() {
  const counts = {};
  for (const post of allPosts) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Simple client-side search across title, description, tags, and category.
 * Fine up to a few hundred posts; swap for a search index (e.g. Fuse.js,
 * Pagefind) if the catalog grows much larger than that.
 */
export function searchPosts(query) {
  if (!query || !query.trim()) return allPosts;
  const q = query.trim().toLowerCase();

  return allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}
