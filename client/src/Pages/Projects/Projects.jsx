import { useEffect, useState } from "react";
import "./projects.styles.scss";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      try {
        setStatus("loading");
        setError("");

        const res = await fetch(`${API_BASE}/api/projects`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Request failed (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setProjects(Array.isArray(data) ? data : []);
          setStatus("success");
        }
      } catch (e) {
        if (!ignore) {
          setStatus("error");
          setError(e?.message || "Failed to load projects");
        }
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          Live products I’m actively building and maintaining.
        </p>
      </section>

      {status === "loading" && (
        <section className="projects-grid">
          {[...Array(2)].map((_, i) => (
            <div className="project-card project-card-skeleton" key={i}>
              <div className="project-thumb skeleton" />
              <div className="project-body">
                <div className="project-row">
                  <span className="skeleton pill" />
                </div>
                <div className="skeleton title" />
                <div className="skeleton line" />
                <div className="skeleton line short" />
                <div className="project-actions">
                  <span className="skeleton btn" />
                  <span className="skeleton btn" />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {status === "error" && (
        <section className="projects-empty">
          <p className="projects-error">Couldn’t load projects.</p>
          <p className="projects-error-sub">{error}</p>
        </section>
      )}

      {status === "success" && (
        <section className="projects-grid">
          {projects.map((p) => (
            <article className="project-card" key={p.id || p.slug || p.name}>
              <div className="project-thumb-wrap">
                {p.thumbnailUrl ? (
                  <img
                    className="project-thumb"
                    src={p.thumbnailUrl}
                    alt={`${p.name} thumbnail`}
                  />
                ) : (
                  <div className="project-thumb project-thumb-fallback" />
                )}
              </div>

              <div className="project-body">
                <div className="project-row">
                  {p.status ? (
                    <span
                      className={`project-pill ${String(p.status).toLowerCase()}`}
                    >
                      {p.status}
                    </span>
                  ) : null}
                </div>

                <h2 className="project-name">{p.name}</h2>
                <p className="project-desc">{p.description}</p>

                {Array.isArray(p.features) && p.features.length ? (
                  <ul className="project-features">
                    {p.features.slice(0, 3).map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="project-actions">
                  {p.demoUrl ? (
                    <a
                      className="project-btn project-btn-primary"
                      href={p.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit site
                    </a>
                  ) : (
                    <button
                      className="project-btn project-btn-disabled"
                      disabled
                    >
                      No live link
                    </button>
                  )}

                  {p.repoUrl ? (
                    <a
                      className="project-btn project-btn-secondary"
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  ) : (
                    <button
                      className="project-btn project-btn-secondary project-btn-disabled"
                      disabled
                    >
                      GitHub
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Projects;
