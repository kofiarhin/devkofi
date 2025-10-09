import { useMemo } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import useSiteContent from "../../hooks/useSiteContent";
import styles from "./blog.styles.module.scss";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const Blog = () => {
  const blogContent = useSiteContent("blog", {});
  const { hero = {}, posts = [], listHeading, topicsTitle, topics = [], readingTimeSuffix, readMoreLabel } = blogContent;

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [posts]);

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.layout}>
        <section className={styles.hero}>
          {hero.eyebrow ? <p className={styles.eyebrow}>{hero.eyebrow}</p> : null}
          {hero.title ? <h1>{hero.title}</h1> : null}
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </section>

        <section className={styles.content}>
          <div className={styles.posts}>
            {listHeading ? <h2>{listHeading}</h2> : null}
            <div className={styles.postGrid}>
              {sortedPosts.map((post) => (
                <article key={post.slug} className={styles.card}>
                  <div className={styles.meta}>
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>
                      {post.readingTime} {readingTimeSuffix}
                    </span>
                  </div>
                  <h3>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  {Array.isArray(post.tags) && post.tags.length > 0 ? (
                    <ul className={styles.tagList}>
                      {post.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <Link className={styles.readMore} to={`/blog/${post.slug}`}>
                    {readMoreLabel}
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.sidebar}>
            {topicsTitle ? <h3>{topicsTitle}</h3> : null}
            <ul>
              {topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Blog;
