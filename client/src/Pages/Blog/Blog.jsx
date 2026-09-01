import { Link } from "react-router-dom";
import useBlogPosts from "../../hooks/queries/useBlogPosts";
import "../BlogArticle/blog.styles.scss";

const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(value));

const Blog = () => {
  const { data, isLoading, isError } = useBlogPosts();
  const posts = data?.posts || [];

  return (
    <main className="blog-page">
      <header className="blog-hero">
        <div className="blog-container">
          <p className="blog-eyebrow">Engineering notes</p>
          <h1>Systems, products and the work behind them.</h1>
          <p>Practical writing about AI engineering, full-stack systems, architecture and reliable software delivery.</p>
        </div>
      </header>

      <section className="blog-container blog-list" aria-busy={isLoading}>
        {isLoading && <p className="blog-state">Loading articles…</p>}
        {isError && <p className="blog-state blog-state--error" role="alert">Could not load articles. Please try again.</p>}
        {!isLoading && !isError && posts.length === 0 && (
          <p className="blog-state">No articles have been published yet.</p>
        )}
        {posts.map((post) => (
          <article className="blog-card" key={post.slug}>
            {post.coverImageUrl && (
              <img src={post.coverImageUrl} alt={post.coverImageAlt || ""} loading="lazy" />
            )}
            <div className="blog-card__body">
              <p className="blog-meta">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {post.tags?.[0] && <span>{post.tags[0]}</span>}
              </p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link className="blog-link" to={`/blog/${post.slug}`}>Read article</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Blog;
