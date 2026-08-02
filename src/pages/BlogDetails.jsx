import { useEffect, useRef } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  SEO,
  MarkdownRenderer,
  TableOfContents,
  ReadingTimeBadge,
  ShareButtons,
  RelatedPosts,
  PrevNextNav,
  Breadcrumbs,
  TagList,
} from "../components/Blog";
import { useTableOfContents } from "../hooks/useTableOfContents";
import {
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
} from "../data/blogData";
import { formatDate } from "../utils/dateFormat";
import { blogConfig } from "../config/blogConfig";

export default function BlogDetails() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const articleRef = useRef(null);

  const { headings, activeId } = useTableOfContents(post?.content, articleRef);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  const related = getRelatedPosts(slug);
  const { previous, next } = getAdjacentPosts(slug);

  return (
    <div className={`${blogConfig.theme.pageBg} min-h-screen pt-18`}>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blogs/${post.slug}`}
        image={post.coverImage}
        type="article"
        publishedAt={post.date}
        author={post.author}
        keywords={post.keywords.length ? post.keywords : post.tags}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Blog", to: "/blogs" },
            { label: post.category, to: `/blogs?category=${encodeURIComponent(post.category)}` },
            { label: post.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-10">
          <article
            ref={articleRef}
            className="min-w-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-xl p-6 sm:p-8"
          >
            <header className="mb-8">
              <span className="text-sm font-semibold text-cyan-500 dark:text-cyan-400 uppercase tracking-wide">
                {post.category}
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span>By {post.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <ReadingTimeBadge minutes={post.readingTime.minutes} />
              </div>

              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-xl mt-6 bg-gray-100 dark:bg-gray-800"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </header>

            <MarkdownRenderer content={post.content} />

            <div className="mt-8 pt-6 border-b border-cyan-400/70 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TagList tags={post.tags} />
              <ShareButtons title={post.title} path={`/blogs/${post.slug}`} />
            </div>

            <PrevNextNav previous={previous} next={next} />
            <RelatedPosts posts={related} />
          </article>

          <aside className="hidden lg:block">
            <TableOfContents headings={headings} activeId={activeId} />
          </aside>
        </div>

        <div className="mt-10">
          <Link
            to="/blogs"
            className="text-sm font-medium text-cyan-500 dark:text-cyan-400 hover:underline"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}