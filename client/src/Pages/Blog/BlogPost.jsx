import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import MarkdownRenderer from "../../components/MarkdownRenderer/MarkdownRenderer";
import useSiteContent from "../../hooks/useSiteContent";
import styles from "./blogPost.styles.module.scss";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const BlogPost = () => {
  const { slug } = useParams();
  const blogContent = useSiteContent("blog", {});
  const {
    posts = [],
    hero = {},
    postNotFound = {},
    readingTimeSuffix,
    backToListLabel,
  } = blogContent;

  const post = useMemo(() => posts.find((item) => item.slug === slug), [posts, slug]);

  if (!post) {
    return (
      <div className={styles.page}>
        <NavBar />
        <main className={styles.layout}>
          <section className={styles.emptyState}>
            {postNotFound.title ? <h1>{postNotFound.title}</h1> : null}
            {postNotFound.body ? <p>{postNotFound.body}</p> : null}
            <Link className={styles.backLink} to="/blog">
              {backToListLabel}
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.layout}>
        <article className={styles.article}>
          <header className={styles.header}>
            {hero.eyebrow ? <p className={styles.eyebrow}>{hero.eyebrow}</p> : null}
            <h1>{post.title}</h1>
            <div className={styles.meta}>
              <span>{formatDate(post.publishedAt)}</span>
              <span>
                {post.readingTime} {readingTimeSuffix}
              </span>
            </div>
            {Array.isArray(post.tags) && post.tags.length > 0 ? (
              <ul className={styles.tagList}>
                {post.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <MarkdownRenderer content={post.content} />
        </article>

        <Link className={styles.backLink} to="/blog">
          {backToListLabel}
        </Link>
      </main>
    </div>
  );
};

export default BlogPost;
