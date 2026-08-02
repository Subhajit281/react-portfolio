import { Link } from "react-router-dom";
import { SEO, Breadcrumbs } from "../components/Blog";
import { getCategoriesWithCounts } from "../data/blogData";
import { blogConfig } from "../config/blogConfig";

export default function Categories() {
  const categories = getCategoriesWithCounts();

  return (
    <div className={`${blogConfig.theme.pageBg} min-h-screen pt-18`}>
      <SEO
        title="Categories"
        description={`Browse ${blogConfig.blogTitle} articles by category.`}
        path="/categories"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumbs items={[{ label: "Blog", to: "/blogs" }, { label: "Categories" }]} />

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Categories
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Browse all {categories.length} categories currently in use.
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No published categories yet — add posts under{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm">
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
                className="flex items-center justify-between p-5 rounded-xl border-b border-cyan-400/70 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md hover:border-cyan-500 hover:shadow-sm hover:shadow-cyan-400/20 transition-all"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {category}
                </span>
                <span className="text-sm text-cyan-500 dark:text-cyan-400">
                  {count} {count === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}