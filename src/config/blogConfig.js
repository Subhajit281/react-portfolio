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
    pageBg: "bg-transparent",
    surface: "bg-slate-900/60 backdrop-blur-md",
    border: "border-white/10",
    text: "text-white",
    textMuted: "text-slate-400",
    accent: "text-cyan-400",
    accentBg: "bg-cyan-500 text-slate-950 font-bold",
    accentBgHover: "hover:bg-cyan-400",
    ring: "focus:ring-2 focus:ring-cyan-400",
    tagBg: "bg-cyan-950/40 border border-cyan-500/20",
    tagText: "text-cyan-300",
  },
};
