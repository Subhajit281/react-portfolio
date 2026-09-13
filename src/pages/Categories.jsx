import { Link } from "react-router-dom";
import { FaLayerGroup } from "react-icons/fa";
import { SEO, Breadcrumbs } from "../components/Blog";
import { getCategoriesWithCounts } from "../data/blogData";
import { blogConfig } from "../config/blogConfig";
import PageTransition from "../components/PageTransition";

export default function Categories() {
  const categories = getCategoriesWithCounts();

  return (
    <PageTransition>
      <SEO
        title="Categories"
        description={`Browse ${blogConfig.blogTitle} articles by category.`}
        path="/categories"
      />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header with White & Neon Cyan Gradient */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <FaLayerGroup className="text-cyan-400" /> Topic Taxonomy
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Browse by <span className="gradient-text-cyan">Category</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Explore curated collections of engineering write-ups organized across {categories.length} technology sectors.
          </p>
        </div>

        <div className="mb-8">
          <Breadcrumbs items={[{ label: "Blog", to: "/blogs" }, { label: "Categories" }]} />
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            No published categories yet — add posts under{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-sm">
              src/data/blogs/
            </code>{" "}
            to see them here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(({ category, count }) => (
              <Link
                key={category}
                to={`/blogs?category=${encodeURIComponent(category)}`}
                className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md hover:border-cyan-400/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
              >
                <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {category}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  {count} {count === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}