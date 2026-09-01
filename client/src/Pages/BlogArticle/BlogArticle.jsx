import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { PageMeta } from "../../components/Studio/Studio";
import { SITE_URL } from "../../constants/seo";
import useBlogPost from "../../hooks/queries/useBlogPost";
import "./blog.styles.scss";

const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(value));

const BlogArticle = ({ slug: suppliedSlug }) => {
  const { slug: routeSlug } = useParams();
  const slug = suppliedSlug || routeSlug;
  const { data, isLoading, isError } = useBlogPost(slug);
  const post = data?.post;

  if (isLoading) {
    return <main className="blog-container blog-state blog-state--page">Loading article…</main>;
  }

  if (isError || !post) {
    return (
      <main className="blog-container blog-state blog-state--page" role="alert">
        <p>This article could not be found.</p>
        <Link className="blog-link" to="/blog">Return to articles</Link>
      </main>
    );
  }

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    url: articleUrl,
    author: { "@type": "Person", name: "Kofi Arhin" },
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  };

  return (
    <main className="blog-article">
      <PageMeta
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        image={post.coverImageUrl}
        structuredData={structuredData}
      />
      <article className="blog-container blog-article__inner">
        <Link className="blog-link" to="/blog">← All articles</Link>
        <header className="blog-article__header">
          <p className="blog-eyebrow">DevKofi article</p>
          <h1>{post.title}</h1>
          <p className="blog-article__excerpt">{post.excerpt}</p>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </header>
        {post.coverImageUrl && (
          <img className="blog-article__cover" src={post.coverImageUrl} alt={post.coverImageAlt || ""} />
        )}
        <div className="blog-prose">
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        {post.sources?.length > 0 && (
          <section className="blog-sources" aria-labelledby="blog-sources-heading">
            <h2 id="blog-sources-heading">Sources</h2>
            <ul>
              {post.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
};

export default BlogArticle;
