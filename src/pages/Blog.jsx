import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
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
import PageTransition from "../components/PageTransition";

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
    <PageTransition>
      <SEO
        title={blogConfig.blogTitle}
        description={blogConfig.blogDescription}
        path="/blogs"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with White & Neon Cyan Gradient */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <FaBookOpen className="text-cyan-400" /> Technical Publications
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Articles & <span className="gradient-text-cyan">Technical Insights</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            In-depth guides, distributed system patterns, algorithmic strategies, and full-stack engineering notes from real-world software development.
          </p>
        </div>

        <div className="mb-8">
          <Breadcrumbs items={[{ label: "Blog" }]} />
        </div>

        {!query && !urlTag && activeCategory === "All" && (
          <FeaturedPosts posts={featured} />
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-sm text-slate-300 mb-6">
            <span>Showing posts tagged:</span>
            <span className="font-mono text-cyan-400 font-semibold">#{urlTag}</span>
          </div>
        )}

        <BlogGrid posts={paginated} />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PageTransition>
  );
}
