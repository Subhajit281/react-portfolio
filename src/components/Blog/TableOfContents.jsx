import { List } from "lucide-react";

export default function TableOfContents({ headings = [], activeId }) {
  if (!headings.length) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        <List className="w-4 h-4" />
        On this page
      </div>
      <ul className="space-y-2 text-sm border-l border-gray-200 dark:border-gray-800">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              style={{ paddingLeft: heading.depth === 3 ? "1.75rem" : "0.75rem" }}
              className={`block -ml-px border-l-2 py-0.5 transition-colors ${
                activeId === heading.id
                  ? "border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 font-medium"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
