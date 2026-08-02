import { useMemo, useState } from "react";
import { getAllPosts } from "../data/blogData";

/**
 * Combines category + tag filtering over the full post list.
 * Pass posts explicitly if you want to filter an already-searched subset.
 */
export function useBlogFilter(posts = null) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState(null);

  const source = posts || getAllPosts();

  const filtered = useMemo(() => {
    return source.filter((post) => {
      const matchesCategory =
        activeCategory === "All" ||
        post.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      return matchesCategory && matchesTag;
    });
  }, [source, activeCategory, activeTag]);

  return {
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    filtered,
  };
}
