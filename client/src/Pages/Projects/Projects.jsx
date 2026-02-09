import { useEffect, useMemo, useState } from "react";
import "./projects.styles.scss";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const FILTERS = ["All", "Active", "Building", "Archived"];

const normalizeStatus = (s) => {
  const v = String(s || "")
    .trim()
    .toLowerCase();
  if (!v) return "";
  if (v.includes("active") || v === "live") return "Active";
  if (v.includes("build") || v.includes("progress") || v.includes("wip"))
    return "Building";
  if (v.includes("archiv") || v.includes("paused")) return "Archived";
  return s;
};

const GithubIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M12 2C6.477 2 2 6.586 2 12.253c0 4.534 2.865 8.384 6.839 9.742.5.097.682-.22.682-.49 0-.242-.009-.883-.014-1.734-2.782.618-3.369-1.37-3.369-1.37-.455-1.183-1.11-1.497-1.11-1.497-.908-.638.069-.626.069-.626 1.004.073 1.532 1.057 1.532 1.057.893 1.567 2.342 1.114 2.913.852.091-.668.35-1.114.636-1.37-2.22-.26-4.555-1.14-4.555-5.072 0-1.12.39-2.036 1.03-2.753-.104-.26-.447-1.306.098-2.723 0 0 .84-.276 2.75 1.051A9.28 9.28 0 0 1 12 6.84c.85.004 1.705.118 2.503.347 1.909-1.327 2.748-1.051 2.748-1.051.546 1.417.203 2.463.1 2.723.64.717 1.028 1.633 1.028 2.753 0 3.944-2.338 4.808-4.566 5.063.36.317.68.94.68 1.894 0 1.366-.012 2.466-.012 2.801 0 .272.18.592.688.49C19.137 20.632 22 16.784 22 12.253 22 6.586 17.523 2 12 2Z"
    />
  </svg>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

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
          const list = Array.isArray(data) ? data : [];
          setProjects(list);
          setStatus("success");

          // Auto-select "Active" if there are no projects in "All"? keep All by default.
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

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => normalizeStatus(p.status) === filter);
  }, [projects, filter]);

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="projects-breadcrumb">
          <span className="crumb-brand">DevKofi</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-page">Projects</span>
        </div>

        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          Live products I’m actively building and maintaining.
        </p>

        <div className="projects-filters" role="tablist" aria-label="Projects">
          {FILTERS.map((label) => {
            const active = filter === label;
            return (
              <button
                key={label}
                type="button"
                className={`filter-tab ${active ? "is-active" : ""}`}
                onClick={() => setFilter(label)}
                role="tab"
                aria-selected={active}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {status === "loading" && (
        <section className="projects-grid">
          {[...Array(2)].map((_, i) => (
            <div className="project-card project-card-skeleton" key={i}>
              <div className="project-thumb-wrap">
                <div className="project-thumb skeleton" />
              </div>
              <div className="project-body">
                <div className="skeleton line" />
                <div className="skeleton line short" />
                <div className="skeleton chips" />
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
          {filteredProjects.map((p) => {
            const key = p.id || p._id || p.slug || p.name;
            const pill = normalizeStatus(p.status);
            const chips = Array.isArray(p.features)
              ? p.features.slice(0, 3)
              : [];

            return (
              <article className="project-card" key={key}>
                <div className="project-thumb-wrap">
                  {p.thumbnailUrl ? (
                    <img
                      className="project-thumb"
                      src={p.thumbnailUrl}
                      alt={`${p.name} thumbnail`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="project-thumb project-thumb-fallback" />
                  )}

                  <div className="project-thumb-overlay" aria-hidden="true" />

                  <div className="project-thumb-content">
                    {pill ? (
                      <span
                        className={`project-pill ${String(pill).toLowerCase()}`}
                      >
                        <span className="pill-dot" aria-hidden="true" />
                        {pill}
                      </span>
                    ) : null}

                    <h2 className="project-name">{p.name}</h2>
                  </div>
                </div>

                <div className="project-body">
                  <p className="project-desc">{p.description}</p>

                  {chips.length ? (
                    <div className="project-chips" aria-label="Tech stack">
                      {chips.map((c, idx) => (
                        <span className="chip" key={`${key}-chip-${idx}`}>
                          {c}
                        </span>
                      ))}
                    </div>
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
                        <span className="btn-icon" aria-hidden="true">
                          <GithubIcon />
                        </span>
                        GitHub
                      </a>
                    ) : (
                      <button
                        className="project-btn project-btn-secondary project-btn-disabled"
                        disabled
                      >
                        <span className="btn-icon" aria-hidden="true">
                          <GithubIcon />
                        </span>
                        GitHub
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Projects;
