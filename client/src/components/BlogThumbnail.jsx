import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { getLastLineStart, getThumbnailWords, hashString } from "../lib/blogThumbnail";

const FALLBACK_TITLE = "From the journal";
const LONG_TITLE_CHARS = 30;

const BlogThumbnail = ({ title = "", slug = "", className = "" }) => {
  const titleRef = useRef(null);
  const titleWords = getThumbnailWords(title);
  const words = titleWords.length ? titleWords : FALLBACK_TITLE.split(" ");
  const wordKey = words.join(" ");
  const variant = hashString(slug || title) % 3;
  const isLong = wordKey.length > LONG_TITLE_CHARS;

  // Until layout is measured, highlight the last word; then highlight the whole last visual line.
  const [lastLineStart, setLastLineStart] = useState(words.length - 1);

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return undefined;

    // offsetTop ignores the entrance transform, so the measurement is stable while words animate in.
    const measure = () => {
      const wordEls = Array.from(titleEl.querySelectorAll(".blog-text-thumbnail__word"));
      const tops = wordEls.map((wordEl) => wordEl.offsetTop - titleEl.offsetTop);
      setLastLineStart(getLastLineStart(tops, titleEl.clientHeight || Infinity));
    };

    measure();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(titleEl);
    // Web fonts change the wrapping once they load.
    let active = true;
    document.fonts?.ready?.then(() => active && measure());

    return () => {
      active = false;
      observer?.disconnect();
    };
  }, [wordKey]);

  const classes = [
    "blog-text-thumbnail",
    `blog-text-thumbnail--${variant}`,
    isLong && "blog-text-thumbnail--long",
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-hidden="true">
      <span className="blog-text-thumbnail__glow" />
      <span className="blog-text-thumbnail__grid" />
      <span className="blog-text-thumbnail__brand">DEV<span>KOFI</span> / JOURNAL</span>
      <span className="blog-text-thumbnail__title" ref={titleRef}>
        {words.map((word, index) => {
          const isLast = index === words.length - 1;
          return (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`blog-text-thumbnail__word${index >= lastLineStart ? " blog-text-thumbnail__accent" : ""}`}
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
