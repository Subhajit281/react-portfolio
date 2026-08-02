import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Route-based code splitting: each blog page ships as its own chunk,
// so visitors to non-blog routes never download blog/markdown code.
const Blog = lazy(() => import("../pages/Blog"));
const BlogDetails = lazy(() => import("../pages/BlogDetails"));
const Categories = lazy(() => import("../pages/Categories"));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
}

/**
 * Spread this array of <Route> elements inside your existing <Routes>.
 * See INTEGRATION.md for exact wiring into App.jsx.
 *
 * Usage:
 *   import { blogRoutes } from "./routes/BlogRoutes";
 *   <Routes>
 *     ...your existing routes...
 *     {blogRoutes}
 *   </Routes>
 */
export const blogRoutes = [
  <Route key="blog-list" path="/blogs" element={withSuspense(Blog)} />,
  <Route key="blog-details" path="/blogs/:slug" element={withSuspense(BlogDetails)} />,
  <Route key="blog-categories" path="/categories" element={withSuspense(Categories)} />,
];
