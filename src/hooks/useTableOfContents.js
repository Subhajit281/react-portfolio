import { useEffect, useMemo, useState } from "react";
import { slugifyHeading } from "../utils/slugify";

/**
 * Extracts h2/h3 headings from raw markdown for the sticky ToC,
 * then scrollspies the rendered DOM to highlight the active section.
 *
 * @param {string} markdown - raw markdown body (post.content)
 * @param {React.RefObject} containerRef - ref to the rendered article container
 */
export function useTableOfContents(markdown, containerRef) {
  const [activeId, setActiveId] = useState(null);

  const headings = useMemo(() => {
    if (!markdown) return [];
    const lines = markdown.split("\n");
    const items = [];
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const match = line.match(/^(#{2,3})\s+(.*)$/); // h2, h3 only
      if (match) {
        const depth = match[1].length;
        const text = match[2].trim();
        items.push({ id: slugifyHeading(text), text, depth });
      }
    }
    return items;
  }, [markdown]);

  useEffect(() => {
    if (!containerRef?.current || headings.length === 0) return;

    const elements = headings
      .map((h) => containerRef.current.querySelector(`#${CSS.escape(h.id)}`))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, containerRef]);

  return { headings, activeId };
}
