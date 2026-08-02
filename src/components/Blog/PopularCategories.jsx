import { Link } from "react-router-dom";

export default function PopularCategories({ categories = [], limit = 8 }) {
  if (!categories.length) return null;
  const items = categories.slice(0, limit);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">
        Popular categories
      </h3>
      <ul className="space-y-2">
        {items.map(({ category, count }) => (
          <li key={category}>
            <Link
              to={`/blogs?category=${encodeURIComponent(category)}`}
              className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span>{category}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
