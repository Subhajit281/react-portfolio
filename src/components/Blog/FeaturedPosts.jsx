import BlogCard from "./BlogCard";

export default function FeaturedPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="featured-posts-heading" className="mb-12">
      <h2 id="featured-posts-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Featured
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
