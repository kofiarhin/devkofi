import "./course-list.styles.scss";

const CourseList = ({ courses = [], onSelect }) => {
  if (!Array.isArray(courses) || courses.length === 0) return null;

  const formatPrice = (price) => {
    if (!price || typeof price.amount !== "number") return null;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: price.currency || "GBP",
      maximumFractionDigits: 0,
    }).format(price.amount);
  };

  return (
    <div className="container">
      <section id="courses">
        <div className="grid" aria-label="courses">
          {courses.map((c) => {
            const priceLabel = formatPrice(c.price);

            const handleClick = (e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(c);
              }
            };

            return (
              <article key={c.id} className="card">
                <a
                  className="media"
                  href={c?.links?.landing || "#"}
                  onClick={handleClick}
                  aria-label={`Open ${c.title}`}
                >
                  {c?.media?.thumbnailUrl && (
                    <img
                      className="thumb"
                      src={c.media.thumbnailUrl}
                      alt={`${c.title} thumbnail`}
                      loading="lazy"
                    />
                  )}
                </a>

                <div className="body">
                  <header className="header">
                    <h3 className="title">
                      <a href={c?.links?.landing || "#"} onClick={handleClick}>
                        {c.title}
                      </a>
                    </h3>
                    {c.tagline && <p className="tagline">{c.tagline}</p>}
                  </header>

                  <div className="meta">
                    {c.instructor?.name && (
                      <span className="badge">{c.instructor.name}</span>
                    )}
                    {c.category && <span className="badge">{c.category}</span>}
                    {c.level && <span className="badge">{c.level}</span>}
                    {typeof c.durationWeeks === "number" && (
                      <span className="badge">{c.durationWeeks}w</span>
                    )}
                    {priceLabel && <span className="badge">{priceLabel}</span>}
                    {c.status && <span className="badge">{c.status}</span>}
                  </div>

                  {Array.isArray(c.tags) && c.tags.length > 0 && (
                    <ul className="tags" aria-label="tags">
                      {c.tags.map((t) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="actions">
                    {c?.links?.enroll && (
                      <a className="cta" href={c.links.enroll}>
                        Enroll
                      </a>
                    )}
                    {c?.links?.syllabus && (
                      <a className="ghost" href={c.links.syllabus}>
                        Syllabus
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CourseList;
