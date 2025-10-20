// ProjectList.jsx — “go crazy” edition (React + plain SCSS). Arrow fns, default export.
// Drop in and keep your existing data shape.

import React, { useRef } from "react";
import "./project_list.styles.scss";

const ProjectList = ({ data = [] }) => {
  if (!data?.length) return <p className="no-projects">No projects found</p>;

  const onCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -10; // rotateX
    const ry = (px - 0.5) * 14;  // rotateY

    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
    card.style.setProperty("--mx", `${px * 100}%`);
    card.style.setProperty("--my", `${py * 100}%`);
  };

  const onCardLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <section id="projects-crazy">
      <div className="projects-bg" aria-hidden="true" />
      <div className="projects-scan" aria-hidden="true" />
      <div className="projects-container">
        {data.map(({ id, name, description, features = [], status, demoUrl, thumbnailUrl }) => (
          <article
            key={id}
            className="project-card"
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            style={{ transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))" }}
          >
            <div className="project-glow" />
            <div className="project-border" />
            <div className="thumb">
              <img src={thumbnailUrl} alt={name} loading="lazy" />
              {status && <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>}
            </div>

            <div className="project-body">
              <h2 className="project-title">
                <span className="title-glitch" data-text={name}>{name}</span>
              </h2>
              {description && <p className="project-desc">{description}</p>}

              {features.length > 0 && (
                <div className="feature-marquee">
                  <div className="feature-track">
                    {[...features, ...features].map((f, i) => (
                      <span className="feature-pill" key={i}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-actions">
                {demoUrl ? (
                  <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="btn-neo">
                    <span className="btn-ink" />
                    Live demo
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="btn-icon">
                      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                      <path d="M5 5h6V3H3v8h2V5z" />
                    </svg>
                  </a>
                ) : (
                  <span className="btn-ghost">Demo unavailable</span>
                )}
              </div>
            </div>

            <div className="project-noise" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;