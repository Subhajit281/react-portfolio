import { Link } from "react-router-dom";

export default function TagList({ tags = [], size = "md" }) {
  if (!tags.length) return null;

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          to={`/blogs?tag=${encodeURIComponent(tag)}`}
          className={`${sizeClasses} rounded-full bg-gray-300 dark:bg-black text-cyan-400 dark:text-cyan-500 font-medium hover:bg-indigo-100 dark:hover:bg-gray-700/20 transition-colors`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
