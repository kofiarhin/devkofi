// ProjectList.jsx (add animations)
import React, { useEffect } from "react";
import "./project_list.styles.scss";

const ProjectList = ({ data = [] }) => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.target.classList.toggle("in-view", e.isIntersecting)),
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!data?.length) return <p className="no-projects">No projects found</p>;

  const hero = data[0];

  const handleParallax = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty("--parx", px);
    e.currentTarget.style.setProperty("--pary", py);
  };

  return (
    <section id="projects">
      {/* HERO with Ken Burns + parallax light */}
      {hero && (
        <div className="projects-hero" onMouseMove={handleParallax}>
          <img className="hero-img" src={hero.thumbnailUrl} alt={hero.name} />
          <div className="hero-glow" />
          <h1 className="page-title reveal">{`Projects`}</h1>
        </div>
      )}

      {/* GRID */}
      <div className="projects-container">
        {data.map(({ id, name, description, demoUrl, thumbnailUrl, status, features = [] }, i) => (
          <article key={id} className={`project-card reveal delay-${(i % 6) + 1}`}>
            <div className="thumb">
              <img src={thumbnailUrl} alt={name} loading="lazy" />
              {status && <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>}
            </div>
            <div className="project-body">
              <h2 className="project-title">{name}</h2>
              {description && <p className="project-desc">{description}</p>}
              {features.length > 0 && (
                <ul className="feature-list">
                  {features.slice(0, 3).map((f, idx) => (
                    <li key={idx} className="feature-chip">{f}</li>
                  ))}
                </ul>
              )}
              {demoUrl ? (
                <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="btn-cta shimmer">
                  Live demo
                </a>
              ) : (
                <span className="btn-cta disabled">Demo unavailable</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;