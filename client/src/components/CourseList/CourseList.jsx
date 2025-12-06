// CourseList.jsx
import React, { useEffect } from "react";
import "./course-list.styles.scss";
import { Link } from "react-router-dom";
import { codingImage } from "../../constants/constants";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop";

const CourseList = ({ courses = [] }) => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle("in-view", e.isIntersecting)
        ),
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!courses?.length) return <p className="no-courses">No courses found</p>;

  // Use the first course or a default image for the hero background if needed,
  // but following ProjectList pattern, we might just use a static hero image for the section.

  return (
    <section id="courses">
      {/* HERO */}
      <div className="courses-hero">
        <img className="hero-img" src={codingImage} alt="Courses Hero" />
        <div className="hero-glow" />
        <h1 className="page-title reveal">Course Library</h1>
      </div>

      {/* GRID */}
      <div className="courses-container">
        {courses.map((course, i) => {
          const imgSrc = course?.media?.thumbnailUrl || PLACEHOLDER;
          return (
            <article
              key={course.id || i}
              className={`course-card reveal delay-${(i % 6) + 1}`}
            >
              <div className="thumb">
                <img
                  src={imgSrc}
                  alt={course.name}
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== PLACEHOLDER) e.target.src = PLACEHOLDER;
                  }}
                />
              </div>

              <div className="course-body">
                <h2 className="course-title">{course.name}</h2>

                {/* Optional: Add a short description if available in data, otherwise just title/price */}
                {/* Truncated Description */}
                <p className="course-desc">
                  {course.description
                    ? course.description.length > 120
                      ? course.description.substring(0, 120) + "..."
                      : course.description
                    : "No description available."}
                </p>

                <div className="course-meta">
                  <p className="price">
                    £ {Number(course?.price?.amount || 0).toFixed(2)}
                  </p>
                </div>

                <Link
                  className="cta primary-cta"
                  to={`/courses/${course.id}`}
                  style={{
                    width: "100%",
                    borderRadius: "50px",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  view More
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CourseList;
