import { useEffect, useMemo, useState } from "react";
import "./projects.styles.scss";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const FILTERS = ["All", "Active", "Building", "Archived"];

const normalizeStatus = (s) => {
  const v = String(s || "")
    .trim()
    .toLowerCase();
  if (v.includes("active") || v === "live") return "active";
  if (v.includes("build") || v.includes("progress") || v.includes("wip"))
    return "building";
  if (v.includes("archiv") || v.includes("paused")) return "archived";
  return "active";
};

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.586 2 12.253c0 4.534 2.865 8.384 6.839 9.742.5.097.682-.22.682-.49 0-.242-.009-.883-.014-1.734-2.782.618-3.369-1.37-3.369-1.37-.455-1.183-1.11-1.497-1.11-1.497-.908-.638.069-.626.069-.626 1.004.073 1.532 1.057 1.532 1.057.893 1.567 2.342 1.114 2.913.852.091-.668.35-1.114.636-1.37-2.22-.26-4.555-1.14-4.555-5.072 0-1.12.39-2.036 1.03-2.753-.104-.26-.447-1.306.098-2.723 0 0 .84-.276 2.75 1.051A9.28 9.28 0 0 1 12 6.84c.85.004 1.705.118 2.503.347 1.909-1.327 2.748-1.051 2.748-1.051.546 1.417.203 2.463.1 2.723.64.717 1.028 1.633 1.028 2.753 0 3.944-2.338 4.808-4.566 5.063.36.317.68.94.68 1.894 0 1.366-.012 2.466-.012 2.801 0 .272.18.592.688.49C19.137 20.632 22 16.784 22 12.253 22 6.586 17.523 2 12 2Z" />
  </svg>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        const json = await res.json();
        setProjects(Array.isArray(json) ? json : json.data || []);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter(
      (p) => normalizeStatus(p.status) === filter.toLowerCase(),
    );
  }, [projects, filter]);

  return (
    <main className="projects-container">
      <header className="projects-header">
        <h1 className="main-title">Projects</h1>
        <p className="main-description">
          Engineering digital products from concept to production.
        </p>

        <nav className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? "is-active" : ""}`}
            >
              {f}
            </button>
          ))}
        </nav>
      </header>

      <section className="projects-grid">
        {loading ? (
          <div className="status-container">
            <p>Loading projects...</p>
          </div>
        ) : (
          filtered.map((p) => (
            <article className="project-card" key={p._id || p.id}>
              <div className="card-media">
                <img
                  src={p.thumbnailUrl}
                  alt=""
                  className="card-img"
                  loading="lazy"
                />
                <div className="card-overlay" />
                <span className={`status-pill ${normalizeStatus(p.status)}`}>
                  <i className="status-dot" /> {normalizeStatus(p.status)}
                </span>
              </div>

              <div className="card-body">
                <h2 className="project-name">{p.name}</h2>
                <p className="project-bio">{p.description}</p>

                <div className="tag-cloud">
                  {(p.features || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="feature-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="action-row">
                  <a
                    href={p.demoUrl}
                    className="btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Launch Site
                  </a>
                  <a
                    href={p.repoUrl}
                    className="btn-secondary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubIcon />
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Projects;
