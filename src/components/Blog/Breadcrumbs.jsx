import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * @param {{ label: string, to?: string }[]} items - last item (no `to`) renders as plain text
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-gray-400">
        <li className="flex items-center gap-1.5">
          <Link to="/" className="flex items-center hover:text-gray-900 dark:hover:text-gray-100">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.to ? (
              <Link to={item.to} className="hover:text-gray-900 dark:hover:text-gray-100">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-100 font-medium line-clamp-1">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
