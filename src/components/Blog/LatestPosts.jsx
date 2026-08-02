import BlogCard from "./BlogCard";

export default function LatestPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">
        Latest posts
      </h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} variant="compact" />
        ))}
      </div>
    </div>
  );
}
