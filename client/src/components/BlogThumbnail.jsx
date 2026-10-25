const MAX_WORDS = 6;

const shortenTitle = (title = "") => {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  return words.slice(0, MAX_WORDS).join(" ");
};

const BlogThumbnail = ({ title = "", slug = "", className = "" }) => {
  const words = shortenTitle(title);
  const variant = Array.from(String(slug || title)).reduce((hash, char) => hash + char.charCodeAt(0), 0) % 3;

  return (
    <span className={`blog-text-thumbnail blog-text-thumbnail--${variant} ${className}`.trim()} aria-hidden="true">
      <span className="blog-text-thumbnail__grid" />
      <span className="blog-text-thumbnail__brand">DEV<span>KOFI</span> / JOURNAL</span>
      <span className="blog-text-thumbnail__title">{words || "FROM THE JOURNAL"}</span>
      <span className="blog-text-thumbnail__footer">BUILD. LEARN. DOCUMENT.</span>
    </span>
  );
};

export default BlogThumbnail;
