export default function CategoryFilter({ categories = [], active, onChange }) {
  const allCategories = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      {allCategories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={active === category}
          onClick={() => onChange(category)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            active === category
            ? "bg-cyan-500 dark:bg-cyan-400 text-black"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
