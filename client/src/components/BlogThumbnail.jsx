import { Fragment } from "react";
import { getAccentColor, getThumbnailWords, hashString } from "../lib/blogThumbnail";

const FALLBACK_TITLE = "From the journal";
const LONG_TITLE_CHARS = 30;

const BlogThumbnail = ({ title = "", slug = "", className = "" }) => {
  const titleWords = getThumbnailWords(title);
  const words = titleWords.length ? titleWords : FALLBACK_TITLE.split(" ");
  const key = slug || title;
  const accent = getAccentColor(key);
  const variant = hashString(key) % 3;
  const isLong = words.join(" ").length > LONG_TITLE_CHARS;

  const classes = [
    "blog-text-thumbnail",
    `blog-text-thumbnail--${variant}`,
    `blog-text-thumbnail--accent-${accent}`,
    isLong && "blog-text-thumbnail--long",
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={classes} data-accent={accent} aria-hidden="true">
      <span className="blog-text-thumbnail__glow" />
      <span className="blog-text-thumbnail__grid" />
      <span className="blog-text-thumbnail__brand">DEV<span>KOFI</span> / JOURNAL</span>
      <span className="blog-text-thumbnail__title">
        {words.map((word, index) => {
          const isLast = index === words.length - 1;
          return (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`blog-text-thumbnail__word${isLast ? " blog-text-thumbnail__accent" : ""}`}
                style={{ "--word-index": index }}
              >
                {word}
              </span>
              {!isLast && " "}
            </Fragment>
          );
        })}
      </span>
      <span className="blog-text-thumbnail__footer">BUILD. LEARN. DOCUMENT.</span>
    </span>
  );
};

export default BlogThumbnail;
