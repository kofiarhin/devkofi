import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  GithubLogo,
  X,
  FunnelSimple,
  Globe,
  Code,
  Tag,
  MagnifyingGlass,
  ArrowsDownUp,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react";
import "./projects.styles.scss";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const STATUS_FILTERS = ["All", "Active", "Building", "Archived"];
const SORT_OPTIONS = ["Featured", "Name A–Z", "Name Z–A", "Status"];
const VIEW_MODES = ["Grid", "Case Study"];

const spring = { type: "spring", stiffness: 100, damping: 20 };

const normalizeStatus = (s) => {
  const v = String(s || "")
    .trim()
    .toLowerCase();

  if (v.includes("active") || v === "live") return "active";
  if (v.includes("build") || v.includes("progress") || v.includes("wip")) {
    return "building";
  }
  if (v.includes("archiv") || v.includes("paused")) return "archived";
  return "active";
};

const statusPriority = { active: 0, building: 1, archived: 2 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, duration: 0.45 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

const drawerVariants = {
  hidden: { x: 460, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...spring, duration: 0.45 },
  },
  exit: {
    x: 420,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const SkeletonCard = ({ index }) => (
  <div className={`skeleton-card ${index === 0 ? "skeleton-card--large" : ""}`}>
    <div className="skeleton-media" />
    <div className="skeleton-body">
      <div className="skel-line skel-kicker" />
      <div className="skel-line skel-name" />
      <div className="skel-line skel-bio" />
      <div className="skel-line skel-bio-short" />
      <div className="skel-tags">
        <div className="skel-line skel-tag" />
        <div className="skel-line skel-tag" />
        <div className="skel-line skel-tag" />
      </div>
      <div className="skel-line skel-action" />
    </div>
  </div>
);

const DetailRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <p className="detail-meta-row">
      <span>{label}</span>
      {value}
    </p>
  );
};

const ProjectDrawer = ({ project, onClose }) => {
  const status = normalizeStatus(project.status);
  const features = Array.isArray(project.features) ? project.features : [];
  const outcome = project.outcomes || project.impact || project.result;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        className="drawer-backdrop"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      <motion.aside
        className="detail-drawer"
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
      >
        <button
          type="button"
          className="detail-close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="detail-hero">
          <img
            src={project.thumbnailUrl}
            alt={`${project.name} preview image`}
            className="detail-hero-img"
          />
          <div className="detail-hero-overlay" />
          <span className={`detail-status ${status}`}>
            <i className="status-dot" /> {status}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-intro">
            <p className="detail-eyebrow">Project overview</p>
            <h2 className="detail-title">{project.name}</h2>
            <p className="detail-description">{project.description}</p>
          </div>

          <div className="detail-section detail-section--meta">
            <h3 className="detail-section-title">Overview</h3>
            <DetailRow label="Role" value={project.role} />
            <DetailRow label="Year" value={project.year} />
            <DetailRow label="Status" value={status} />
          </div>

          {(project.challenge || project.approach || outcome) && (
            <div className="detail-section">
              <h3 className="detail-section-title">Case-study snapshot</h3>
              {project.challenge && (
                <p className="detail-copy">
                  <b>Challenge:</b> {project.challenge}
                </p>
              )}
              {project.approach && (
                <p className="detail-copy">
                  <b>Approach:</b> {project.approach}
                </p>
              )}
              {outcome && (
                <p className="detail-copy">
                  <b>Outcome:</b> {outcome}
                </p>
              )}
            </div>
          )}

          {features.length > 0 && (
            <div className="detail-section">
              <h3 className="detail-section-title">
                <Tag size={16} weight="duotone" />
                Tech stack
              </h3>
              <div className="detail-tags">
                {features.map((tag) => (
                  <span key={tag} className="detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-actions">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                className="detail-btn detail-btn--primary"
                target="_blank"
                rel="noreferrer"
              >
                <Globe size={18} weight="duotone" />
                Visit live site
                <ArrowUpRight size={16} weight="bold" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                className="detail-btn detail-btn--secondary"
                target="_blank"
                rel="noreferrer"
              >
                <Code size={18} weight="duotone" />
                View source
                <ArrowUpRight size={16} weight="bold" />
              </a>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState("Grid");
  const [activeTags, setActiveTags] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = await res.json();
        setProjects(Array.isArray(json) ? json : json.data || []);
      } catch (e) {
        console.error("Fetch error:", e);
        setError(
          "Failed to load projects. Check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const availableTags = useMemo(() => {
    const tags = projects.flatMap((p) =>
      Array.isArray(p.features) ? p.features : [],
    );

    return [...new Set(tags)]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 12);
  }, [projects]);

  const filtered = useMemo(() => {
    let list = [...projects];

    if (statusFilter !== "All") {
      list = list.filter(
        (p) => normalizeStatus(p.status) === statusFilter.toLowerCase(),
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      list = list.filter((p) => {
        const haystack = [p.name, p.description, ...(p.features || [])]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    if (activeTags.length > 0) {
      list = list.filter((p) => {
        const tags = Array.isArray(p.features) ? p.features : [];
        return activeTags.every((tag) => tags.includes(tag));
      });
    }

    if (sortBy === "Name A–Z") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "Name Z–A") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "Status") {
      list.sort(
        (a, b) =>
          statusPriority[normalizeStatus(a.status)] -
          statusPriority[normalizeStatus(b.status)],
      );
    }

    return list;
  }, [projects, statusFilter, search, activeTags, sortBy]);

  const featuredProject = filtered[0] || null;
  const projectCountLabel = filtered.length === 1 ? "project" : "projects";

  const handleClose = useCallback(() => setSelected(null), []);

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setSearch("");
    setSortBy("Featured");
    setViewMode("Grid");
    setActiveTags([]);
  };

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="projects-hero__bg" />

        <header className="projects-header">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, duration: 0.6 }}
          >
            <span className="projects-eyebrow">Selected work</span>
            <h1 className="page-title">
              Design, engineering, and shipped outcomes
            </h1>
            <p className="page-description">
              A cleaner portfolio experience built around product thinking,
              implementation depth, and launch-ready execution.
            </p>

            <div className="proof-chips" aria-label="Portfolio highlights">
              <span>{projects.length} Projects</span>
              <span>{availableTags.length} Core technologies</span>
              <span>Outcome-driven builds</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-spotlight"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, duration: 0.6, delay: 0.12 }}
          >
            <div className="spotlight-card">
              <div className="spotlight-top">
                <span className="spotlight-badge">
                  <Sparkle size={14} weight="fill" />
                  Featured
                </span>
                <span className="spotlight-count">
                  {filtered.length} {projectCountLabel}
                </span>
              </div>

              <div className="spotlight-body">
                <h2>{featuredProject?.name || "Portfolio system"}</h2>
                <p>
                  {featuredProject?.description ||
                    "Refined interface for case studies, filters, and deeper project storytelling."}
                </p>
              </div>

              <button
                type="button"
                className="spotlight-action"
                onClick={() => {
                  if (featuredProject) setSelected(featuredProject);
                }}
                disabled={!featuredProject}
              >
                Open featured project
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </motion.div>
        </header>
      </section>

      <motion.section
        className="projects-toolbar-shell"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, duration: 0.5, delay: 0.15 }}
      >
        <div className="toolbar-stack">
          <div className="toolbar-top">
            <nav className="filter-bar" aria-label="Filter projects by status">
              <FunnelSimple
                size={14}
                weight="bold"
                className="filter-icon"
                aria-hidden="true"
              />

              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={`filter-btn ${statusFilter === f ? "is-active" : ""}`}
                >
                  {f}
                </button>
              ))}
            </nav>

            <button type="button" className="clear-btn" onClick={clearFilters}>
              Reset
            </button>
          </div>

          <div className="toolbar-controls">
            <label className="search-wrap" htmlFor="projects-search">
              <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
              <input
                id="projects-search"
                type="search"
                placeholder="Search by name, description, or tech"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <label className="sort-wrap" htmlFor="projects-sort">
              <ArrowsDownUp size={14} weight="bold" aria-hidden="true" />
              <select
                id="projects-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <div
              className="view-toggle"
              role="tablist"
              aria-label="Select view mode"
            >
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === mode}
                  className={`view-toggle-btn ${viewMode === mode ? "is-active" : ""}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {availableTags.length > 0 && (
            <div className="tech-filter" aria-label="Filter by technology">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`tech-chip ${activeTags.includes(tag) ? "is-active" : ""}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {loading && (
        <div className="projects-grid">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="projects-error">
          <p className="error-title">Something went wrong</p>
          <p className="error-text">{error}</p>
          <button
            type="button"
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <motion.div
          className="projects-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="empty-title">No projects found</p>
          <p className="empty-text">
            Try adjusting search text, tags, or status filters.
          </p>
        </motion.div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <motion.section
          className={`projects-grid ${viewMode === "Case Study" ? "is-case-study" : ""}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, index) => {
              const status = normalizeStatus(p.status);
              const key = p._id || p.id || p.name;
              const outcome = p.outcomes || p.impact || p.result;

              return (
                <motion.article
                  className={`project-card ${index < 2 ? "project-card--featured" : ""}`}
                  key={key}
                  variants={cardVariants}
                  layout
                  exit="exit"
                  onClick={() => setSelected(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(p);
                    }
                  }}
                >
                  <div className="card-media">
                    <img
                      src={p.thumbnailUrl}
                      alt={`${p.name} project cover`}
                      className="card-img"
                      loading="lazy"
                    />
                    <div className="card-overlay" />
                    <span className={`status-pill ${status}`}>
                      <i className="status-dot" /> {status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="card-head">
                      <span className="card-kicker">
                        {p.role || "Product build"}
                      </span>
                      {p.year ? (
                        <span className="card-year">{p.year}</span>
                      ) : null}
                    </div>

                    <h2 className="project-name">{p.name}</h2>
                    <p className="project-bio">{p.description}</p>

                    {viewMode === "Case Study" && (
                      <div className="case-study-snippet">
                        <p>
                          <b>Challenge:</b>{" "}
                          {p.challenge ||
                            "Scaling product quality while keeping delivery speed high."}
                        </p>
                        <p>
                          <b>Approach:</b>{" "}
                          {p.approach ||
                            "Iterative product delivery with focused engineering tradeoffs."}
                        </p>
                        <p>
                          <b>Outcome:</b>{" "}
                          {outcome ||
                            "Improved launch readiness, stability, and user-facing polish."}
                        </p>
                      </div>
                    )}

                    <div className="tag-cloud">
                      {(p.features || []).slice(0, 4).map((tag) => (
                        <span key={tag} className="feature-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="action-row">
                      <button
                        type="button"
                        className="card-open-btn"
                        onClick={() => setSelected(p)}
                      >
                        View details
                        <ArrowRight size={14} weight="bold" />
                      </button>

                      <div className="action-links">
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            className="btn-launch"
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe size={16} weight="duotone" />
                            Launch site
                            <ArrowUpRight size={14} weight="bold" />
                          </a>
                        )}

                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            className="btn-repo"
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`View ${p.name} source on GitHub`}
                          >
                            <GithubLogo size={20} weight="fill" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.section>
      )}

      <AnimatePresence>
        {selected && <ProjectDrawer project={selected} onClose={handleClose} />}
      </AnimatePresence>
    </main>
  );
};

export default Projects;
