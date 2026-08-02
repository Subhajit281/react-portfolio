import BlogCard from "./BlogCard";

export default function BlogGrid({ posts = [] }) {
  if (!posts.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">
          No articles found. Try a different search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
