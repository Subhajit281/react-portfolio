import BlogCard from "./BlogCard";

export default function RelatedPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16">
      <h2 id="related-posts-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Related articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
