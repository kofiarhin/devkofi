import React from "react";
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

  const handleNavigate = (e, course) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(course);
    }
  };

  return (
    <section id="courses" aria-label="Courses">
      <div className="grid" aria-live="polite">
        {courses.map((c) => {
          const priceLabel = formatPrice(c.price);

          return (
            <article key={c.id} className="card">
              <a
                className="media"
                href={c?.links?.landing || "#"}
                onClick={(e) => handleNavigate(e, c)}
                aria-label={`Open ${c.title}`}
                rel="noopener"
              >
                {c?.media?.thumbnailUrl && (
                  <img
                    className="thumb"
                    src={c.media.thumbnailUrl}
                    alt={`${c.title} thumbnail`}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </a>

              <div className="body">
                <header className="header">
                  <h3 className="title">
                    <a
                      href={c?.links?.landing || "#"}
                      onClick={(e) => handleNavigate(e, c)}
                      rel="noopener"
                    >
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
                    <a className="cta" href={c.links.enroll} rel="noopener">
                      Enroll
                    </a>
                  )}
                  {c?.links?.syllabus && (
                    <a className="ghost" href={c.links.syllabus} rel="noopener">
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
  );
};

export default CourseList;
