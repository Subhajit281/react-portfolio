import { useMemo, useState } from "react";
import { searchPosts } from "../data/blogData";
import { useDebounce } from "./useDebounce";

/**
 * Manages search input state and returns the filtered post list.
 * Debounced so typing doesn't re-filter on every keystroke.
 */
export function useBlogSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 250);

  const results = useMemo(() => searchPosts(debouncedQuery), [debouncedQuery]);

  return { query, setQuery, results, isSearching: query.trim().length > 0 };
}
