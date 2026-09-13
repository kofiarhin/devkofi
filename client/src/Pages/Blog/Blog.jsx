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
  const [featuredPost, ...latestPosts] = posts;
  const pagination = data?.pagination;
  const currentPage = pagination?.page || page;
  const totalPages = pagination?.totalPages || 1;
  const hasPreviousPage = pagination?.hasPreviousPage ?? currentPage > 1;
  const hasNextPage = pagination?.hasNextPage ?? currentPage < totalPages;
  const showPagination = !isLoading && !isError && posts.length > 0 && totalPages > 1;

  return (
    <main className="blog-page">
      <header className="blog-hero">
        <div className="blog-shell blog-hero__grid">
          <div className="blog-hero__copy">
            <p className="blog-eyebrow">DevKofi journal</p>
            <h1>Insights for <span>Builders.</span></h1>
            <p className="blog-hero__intro">
              Practical notes on AI engineering, full-stack systems, developer tooling,
              and building software that holds up in the real world.
            </p>
          </div>

          <aside className="blog-hero__manifesto" aria-label="DevKofi publishing principles">
            <span className="blog-hero__rule" aria-hidden="true" />
            <p>Build.</p>
            <p>Learn.</p>
            <p>Document.</p>
            <p>Repeat.</p>
          </aside>
        </div>
      </header>

      <section className="blog-shell blog-feed" aria-busy={isLoading}>
        {isLoading && (
          <div className="blog-loading" role="status">
            <span className="blog-visually-hidden">Loading articles…</span>
            <div className="blog-loading__feature" aria-hidden="true">
              <span />
              <div>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="blog-state blog-state--error" role="alert">
            <p className="blog-state__eyebrow">Unable to load</p>
            <h2>Could not load articles.</h2>
            <p>Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="blog-state">
            <p className="blog-state__eyebrow">Journal</p>
            <h2>No articles have been published yet.</h2>
            <p>New engineering notes will appear here when they are ready.</p>
          </div>
        )}

        {!isLoading && !isError && featuredPost && (
          <>
            <article className="blog-feature" aria-label="Featured article">
              <Link
                className="blog-feature__media-link"
                to={`/blog/${featuredPost.slug}`}
                aria-label={`Read ${featuredPost.title}`}
              >
                {featuredPost.coverImageUrl ? (
                  <img
                    className="blog-feature__visual"
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.coverImageAlt || ""}
                  />
                ) : (
                  <span className="blog-feature__visual blog-feature__visual--empty" aria-hidden="true" />
                )}
              </Link>

              <div className="blog-feature__content">
                <div className="blog-feature__label-row">
                  <span className="blog-feature__label">Featured</span>
                  {featuredPost.tags?.[0] && <span className="blog-feature__topic">{featuredPost.tags[0]}</span>}
                </div>

                <p className="blog-meta">
                  <time dateTime={featuredPost.publishedAt}>{formatDate(featuredPost.publishedAt)}</time>
                </p>

                <h2>{featuredPost.title}</h2>
                <p className="blog-feature__excerpt">{featuredPost.excerpt}</p>

                {featuredPost.tags?.length > 1 && (
                  <div className="blog-tags" aria-label="Article topics">
                    {featuredPost.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                )}

                <Link className="blog-link blog-link--primary" to={`/blog/${featuredPost.slug}`}>
                  Read article <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            {latestPosts.length > 0 && (
              <section className="blog-latest" aria-labelledby="latest-writing-title">
                <div className="blog-section-heading">
                  <div>
                    <p className="blog-eyebrow">From the journal</p>
                    <h2 id="latest-writing-title">Latest writing</h2>
                  </div>
                  <p>Engineering decisions, patterns, experiments, and lessons from building.</p>
                </div>

                <div className="blog-latest__grid">
                  {latestPosts.map((post, index) => (
                    <article className="blog-story" key={post.slug} style={{ "--story-index": index }}>
                      <Link
                        className="blog-story__media-link"
                        to={`/blog/${post.slug}`}
                        aria-label={`Read ${post.title}`}
                      >
                        {post.coverImageUrl ? (
                          <img
                            className="blog-story__visual"
                            src={post.coverImageUrl}
                            alt={post.coverImageAlt || ""}
                            loading="lazy"
                          />
                        ) : (
                          <span className="blog-story__visual blog-story__visual--empty" aria-hidden="true" />
                        )}
                      </Link>

                      <div className="blog-story__body">
                        <p className="blog-meta">
                          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                          {post.tags?.[0] && <span>{post.tags[0]}</span>}
                        </p>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <Link className="blog-link" to={`/blog/${post.slug}`}>
                          Read article <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

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
          </>
        )}
      </section>
    </main>
  );
};

export default Blog;
