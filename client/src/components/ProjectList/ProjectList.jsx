import React, { useEffect, useMemo, useRef } from "react";
import "./projectsList.styles.scss";

const ProjectList = ({ data = [] }) => {
  const rootRef = useRef(null);

  const projects = useMemo(() => {
    return Array.isArray(data) ? data.filter(Boolean) : [];
  }, [data]);

  const hero = useMemo(() => projects[0] || null, [projects]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const els = root.querySelectorAll(".reveal");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("in-view", e.isIntersecting);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [projects.length]);

  const handleParallax = (e) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    e.currentTarget.style.setProperty("--parx", px);
    e.currentTarget.style.setProperty("--pary", py);
  };

  if (!projects.length) {
    return (
      <div ref={rootRef} className="projects-list">
        <header className="projects-header reveal in-view">
          <h1 className="projects-heading">Projects</h1>
          <p className="projects-lede">No projects found.</p>
        </header>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="projects-list">
      <header className="projects-header reveal">
        <h1 className="projects-heading">Projects</h1>
        <p className="projects-lede">A selection of things I’ve built.</p>
      </header>

      {hero && (
        <section
          className="projects-hero reveal"
          onMouseMove={handleParallax}
          role="region"
          aria-label="Featured project"
        >
          <div className="projects-hero-inner">
            <div className="projects-hero-copy">
              <div className="projects-hero-status">
                {hero.status ? (
                  <span className="status-pill">{hero.status}</span>
                ) : null}
              </div>

              <h2 className="projects-hero-title">{hero.name}</h2>

              {hero.description ? (
                <p className="projects-hero-desc">{hero.description}</p>
              ) : null}

              <div className="projects-hero-actions">
                {hero.demoUrl ? (
                  <a
                    className="btn btn-primary"
                    href={hero.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Demo
                  </a>
                ) : (
                  <span className="btn btn-disabled" aria-disabled="true">
                    Demo unavailable
                  </span>
                )}
              </div>
            </div>

            <div className="projects-hero-media" aria-hidden="true">
              {hero.thumbnailUrl ? (
                <img
                  className="projects-hero-img"
                  src={hero.thumbnailUrl}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="projects-cover">
                  <div className="projects-cover-inner">
                    <span className="projects-cover-label">{hero.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="projects-grid" aria-label="Projects list">
        {projects.map((p, i) => {
          const {
            id,
            name,
            description,
            demoUrl,
            thumbnailUrl,
            status,
            features = [],
          } = p;

          return (
            <article
              key={id || `${name || "project"}-${i}`}
              className="project-card reveal"
              onMouseMove={handleParallax}
            >
              <div className="project-media" aria-hidden="true">
                {thumbnailUrl ? (
                  <img
                    className="project-img"
                    src={thumbnailUrl}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <div className="projects-cover">
                    <div className="projects-cover-inner">
                      <span className="projects-cover-label">{name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="project-body">
                <div className="project-top">
                  {status ? (
                    <span className="status-pill">{status}</span>
                  ) : null}

                  <h3 className="project-title">{name}</h3>

                  {description ? (
                    <p className="project-desc">{description}</p>
                  ) : null}

                  {Array.isArray(features) && features.length > 0 ? (
                    <ul className="project-features">
                      {features.slice(0, 3).map((f, idx) => (
                        <li key={`${id || name}-f-${idx}`}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="project-actions">
                  {demoUrl ? (
                    <a
                      className="btn btn-primary"
                      href={demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Demo
                    </a>
                  ) : (
                    <span className="btn btn-disabled" aria-disabled="true">
                      Demo unavailable
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default ProjectList;
