import { Link, useSearchParams } from "react-router-dom";
import useBlogPosts from "../../hooks/queries/useBlogPosts";
import "../BlogArticle/blog.styles.scss";

const BLOG_PAGE_SIZE = 10;

const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(value));

const getPageHref = (page) => (page <= 1 ? "/blog" : `/blog?page=${page}`);

const Blog = () => {
  const [searchParams] = useSearchParams();
  const parsedPage = Number.parseInt(searchParams.get("page"), 10);
  const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const { data, isLoading, isError } = useBlogPosts(page, BLOG_PAGE_SIZE);
  const posts = data?.posts || [];
  const pagination = data?.pagination;
  const currentPage = pagination?.page || page;
  const totalPages = pagination?.totalPages || 1;
  const hasPreviousPage = pagination?.hasPreviousPage ?? currentPage > 1;
  const hasNextPage = pagination?.hasNextPage ?? currentPage < totalPages;
  const showPagination = !isLoading && !isError && posts.length > 0 && totalPages > 1;

  return (
    <main className="blog-page">
      <header className="blog-hero">
        <div className="blog-container">
          <p className="blog-eyebrow">Engineering notes</p>
          <h1>AI Engineering, in Practice.</h1>
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

        {showPagination && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            {hasPreviousPage ? (
              <Link className="blog-pagination__link" to={getPageHref(currentPage - 1)}>Previous</Link>
            ) : (
              <span className="blog-pagination__link blog-pagination__link--disabled" aria-disabled="true">Previous</span>
            )}

            <span className="blog-pagination__status">Page {currentPage} of {totalPages}</span>

            {hasNextPage ? (
              <Link className="blog-pagination__link" to={getPageHref(currentPage + 1)}>Next</Link>
            ) : (
              <span className="blog-pagination__link blog-pagination__link--disabled" aria-disabled="true">Next</span>
            )}
          </nav>
        )}
      </section>
    </main>
  );
};

export default Blog;
