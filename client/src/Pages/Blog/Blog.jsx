import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useBlogPosts from "../../hooks/queries/useBlogPosts";
import "../BlogArticle/blog.styles.scss";

const PAGE_SIZE = 6;

const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(value));

const parsePage = (value) => {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

const Blog = () => {
  const [searchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const { data, isLoading, isError } = useBlogPosts(page, PAGE_SIZE);
  const posts = data?.posts || [];
  const pagination = data?.pagination;
  const previousPageRef = useRef(null);

  useEffect(() => {
    if (previousPageRef.current !== null && previousPageRef.current !== page) {
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    }
    previousPageRef.current = page;
  }, [page]);

  const totalPages = pagination?.totalPages || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

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

        {!isLoading && !isError && posts.length > 0 && totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            {pagination?.hasPreviousPage ? (
              <Link className="blog-pagination__control" to={`?page=${page - 1}`}>Previous</Link>
            ) : (
              <span className="blog-pagination__control blog-pagination__control--disabled" aria-disabled="true">Previous</span>
            )}

            <div className="blog-pagination__pages">
              {pageNumbers.map((pageNumber) => (
                <Link
                  className="blog-pagination__page"
                  key={pageNumber}
                  to={`?page=${pageNumber}`}
                  aria-current={pageNumber === page ? "page" : undefined}
                >
                  {pageNumber}
                </Link>
              ))}
            </div>

            {pagination?.hasNextPage ? (
              <Link className="blog-pagination__control" to={`?page=${page + 1}`}>Next</Link>
            ) : (
              <span className="blog-pagination__control blog-pagination__control--disabled" aria-disabled="true">Next</span>
            )}
          </nav>
        )}
      </section>
    </main>
  );
};

export default Blog;
