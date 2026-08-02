import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormat";
import ReadingTimeBadge from "./ReadingTimeBadge";

/**
 * @param {object} post
 * @param {"default"|"compact"} variant - "compact" used in sidebars (LatestPosts, RelatedPosts)
 */
export default function BlogCard({ post, variant = "default" }) {
  if (!post) return null;

  if (variant === "compact") {
    return (
      <Link
        to={`/blogs/${post.slug}`}
        className="group flex gap-3 items-start"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100 dark:bg-gray-800"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 line-clamp-2 transition-colors">
            {post.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(post.date)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blogs/${post.slug}`}
      className="group flex flex-col rounded-xl border-b border-cyan-400/70 overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-md hover:shadow-lg hover:shadow-cyan-400/10 dark:hover:shadow-none dark:hover:border-cyan-400 transition-all"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <span className="text-xs font-semibold text-cyan-500 dark:text-cyan-400 uppercase tracking-wide">
          {post.category}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 line-clamp-2 transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
          {post.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(post.date)}</span>
          <ReadingTimeBadge minutes={post.readingTime.minutes} />
        </div>
      </div>
    </Link>
  );
}