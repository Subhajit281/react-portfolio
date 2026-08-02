/**
 * Single source of truth for blog-wide settings.
 * Edit these to match your actual domain, socials, and branding.
 */
export const blogConfig = {
  siteName: "Subhajit Sarkar",
  siteUrl: "https://subhajit-sarkar.vercel.app", // no trailing slash
  blogTitle: "Blog",
  blogDescription:
    "Developer notes, tutorials, and deep dives on frontend, backend, and system design.",
  defaultAuthor: "Subhajit Sarkar",
  twitterHandle: "@your_twitter", // update or remove usage in SEO.jsx
  defaultCoverImage: "/blog-og-default.jpg", // place a 1200x630 image in /public
  postsPerPage: 9,
  relatedPostsCount: 3,
  latestPostsCount: 5,
  featuredPostsCount: 3,

  // Master category list — keep in sync with the "Categories" section of
  // frontmatter across your markdown files. Order here drives display order
  // in CategoryFilter / PopularCategories unless post counts are used instead.
  categories: [
    "Backend",
    "Frontend",
    "React",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Prisma ORM",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "DSA",
    "System Design",
    "Deployment",
    "DevOps",
    "Career",
    "Interview Preparation",
    "Performance",
  ],

  // Accent classes used throughout Blog/* components.
  // These intentionally use generic Tailwind utility + dark: pairs so the
  // blog visually matches most portfolio themes out of the box. If your
  // portfolio uses CSS variables / shadcn tokens (e.g. bg-background,
  // text-primary), swap these strings for your token classes instead —
  // every Blog component reads colors from here, so this is the only
  // file you should need to touch to reskin the blog.
  theme: {
    pageBg: "bg-white dark:bg-gray-950",
    surface: "bg-gray-50 dark:bg-gray-900",
    border: "border-gray-200 dark:border-gray-800",
    text: "text-gray-900 dark:text-gray-100",
    textMuted: "text-gray-500 dark:text-gray-400",
    accent: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-indigo-600 dark:bg-indigo-500",
    accentBgHover: "hover:bg-indigo-700 dark:hover:bg-indigo-600",
    ring: "focus:ring-2 focus:ring-indigo-500",
    tagBg: "bg-indigo-50 dark:bg-indigo-500/10",
    tagText: "text-indigo-700 dark:text-indigo-300",
  },
};
