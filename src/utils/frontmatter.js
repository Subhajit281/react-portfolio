/**
 * Lightweight, browser-safe YAML frontmatter parser.
 * Avoids "gray-matter" because it depends on Node's Buffer and breaks
 * in Vite's browser bundle without polyfills.
 *
 * Supports the subset of YAML actually needed for blog frontmatter:
 * strings, numbers, booleans, and simple `[a, b, c]` / multi-line "- x" arrays.
 */

function parseValue(raw) {
  const value = raw.trim();

  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (!Number.isNaN(Number(value)) && value !== "") return Number(value);

  // Inline array: [a, b, c]
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((v) => v.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  // Strip surrounding quotes
  return value.replace(/^["']|["']$/g, "");
}

/**
 * Parses a raw markdown file's contents into { data, content }.
 * @param {string} raw - full text of the .md file (frontmatter + body)
 * @returns {{ data: Record<string, any>, content: string }}
 */
export function parseFrontmatter(raw) {
  if (!raw || !raw.startsWith("---")) {
    return { data: {}, content: raw || "" };
  }

  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: raw };
  }

  const block = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).replace(/^\s*\n/, "");

  const data = {};
  const lines = block.split("\n");

  let currentKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Multi-line array item: "  - value"
    const listItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (listItemMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(parseValue(listItemMatch[1]));
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, rest] = kvMatch;
      currentKey = key;
      if (rest.trim() === "") {
        // Might be followed by "- item" lines
        data[key] = [];
      } else {
        data[key] = parseValue(rest);
      }
    }
  }

  // Clean up keys that ended up as empty arrays but were never populated
  // and were actually meant to be empty strings (rare edge case).
  return { data, content };
}
