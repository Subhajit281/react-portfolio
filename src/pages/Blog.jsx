import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SEO,
  BlogGrid,
  BlogSearch,
  CategoryFilter,
  FeaturedPosts,
  Pagination,
  Breadcrumbs,
} from "../components/Blog";
import { useBlogSearch } from "../hooks/useBlogSearch";
import {
  getFeaturedPosts,
  getCategoriesWithCounts,
  getPostsByTag,
} from "../data/blogData";
import { blogConfig } from "../config/blogConfig";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";
  const urlTag = searchParams.get("tag") || "";

  const { query, setQuery, results } = useBlogSearch();
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => getCategoriesWithCounts(), []);
  const featured = useMemo(() => getFeaturedPosts(), []);

  // Base list: tag filter (from URL) takes precedence, then search, then category
  const baseList = urlTag ? getPostsByTag(urlTag) : results;

  const filtered = useMemo(() => {
    if (activeCategory === "All") return baseList;
    return baseList.filter(
      (post) => post.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [baseList, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / blogConfig.postsPerPage));
  const paginated = filtered.slice(
    (page - 1) * blogConfig.postsPerPage,
    page * blogConfig.postsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [query, activeCategory, urlTag]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const next = new URLSearchParams(searchParams);
    if (category === "All") next.delete("category");
    else next.set("category", category);
    next.delete("tag");
    setSearchParams(next);
  };

  return (
    <div className={`${blogConfig.theme.pageBg} min-h-screen pt-18`}>
      <SEO
        title={blogConfig.blogTitle}
        description={blogConfig.blogDescription}
        path="/blogs"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumbs items={[{ label: "Blog" }]} />

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {blogConfig.blogTitle}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
            {blogConfig.blogDescription}
          </p>
        </header>

        {!query && !urlTag && activeCategory === "All" && (
          <FeaturedPosts posts={featured} />
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
          <CategoryFilter
            categories={categories.map((c) => c.category)}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
          <div className="w-full sm:w-72">
            <BlogSearch query={query} onChange={setQuery} />
          </div>
        </div>

        {urlTag && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Showing posts tagged <span className="font-medium">#{urlTag}</span>
          </p>
        )}

        <BlogGrid posts={paginated} />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
