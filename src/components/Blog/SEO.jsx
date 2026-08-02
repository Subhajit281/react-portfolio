import { Helmet } from "react-helmet-async";
import { blogConfig } from "../../config/blogConfig";
import { toISODate } from "../../utils/dateFormat";

/**
 * Drop this at the top of any blog page/post to control that page's
 * <head>. Requires <HelmetProvider> wrapped around the app root once —
 * see INTEGRATION.md.
 */
export default function SEO({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedAt,
  modifiedAt,
  author,
  keywords = [],
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} | ${blogConfig.siteName}`
    : `${blogConfig.blogTitle} | ${blogConfig.siteName}`;

  const metaDescription = description || blogConfig.blogDescription;
  const url = `${blogConfig.siteUrl}${path}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${blogConfig.siteUrl}${image}`
    : `${blogConfig.siteUrl}${blogConfig.defaultCoverImage}`;

  const jsonLd =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: metaDescription,
          image: ogImage,
          author: { "@type": "Person", name: author || blogConfig.defaultAuthor },
          datePublished: toISODate(publishedAt),
          dateModified: toISODate(modifiedAt || publishedAt),
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          publisher: { "@type": "Person", name: blogConfig.siteName },
        }
      : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={blogConfig.siteName} />
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={toISODate(publishedAt)} />
      )}
      {type === "article" && author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {blogConfig.twitterHandle && (
        <meta name="twitter:site" content={blogConfig.twitterHandle} />
      )}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
