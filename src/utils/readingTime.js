const WORDS_PER_MINUTE = 200;

/**
 * Estimates reading time from raw markdown content.
 * Strips code fences and markdown syntax noise before counting words,
 * since code blocks skew word count without reflecting real reading time.
 */
export function calculateReadingTime(markdown = "") {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`[^`]*`/g, "") // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links -> link text
    .replace(/[#>*_~-]/g, "") // markdown symbols
    .trim();

  const words = stripped.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return { words, minutes, text: `${minutes} min read` };
}
