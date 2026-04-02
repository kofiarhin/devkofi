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
} from "@phosphor-icons/react";
import "./projects.styles.scss";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const FILTERS = ["All", "Active", "Building", "Archived"];

const spring = { type: "spring", stiffness: 100, damping: 20 };

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, duration: 0.55 },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

const SkeletonCard = ({ index }) => (
  <div className={`skeleton-card ${index === 0 ? "skeleton-card--large" : ""}`}>
    <div className="skeleton-media" />
    <div className="skeleton-body">
      <div className="skel-line skel-name" />
      <div className="skel-line skel-bio" />
      <div className="skel-line skel-bio-short" />
      <div className="skel-tags">
        <div className="skel-line skel-tag" />
        <div className="skel-line skel-tag" />
      </div>
      <div className="skel-line skel-action" />
    </div>
  </div>
);

const ProjectDetail = ({ project, onClose }) => {
  const status = normalizeStatus(project.status);
  const features = project.features || [];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="detail-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="detail-modal"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${project.name} details`}
      >
        <button
          type="button"
          className="detail-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="detail-hero">
          <img
            src={project.thumbnailUrl}
            alt=""
            className="detail-hero-img"
          />
          <div className="detail-hero-overlay" />
          <span className={`detail-status ${status}`}>
            <i className="status-dot" /> {status}
          </span>
        </div>

        <div className="detail-body">
          <h2 className="detail-title">{project.name}</h2>
          <p className="detail-description">{project.description}</p>

          {features.length > 0 && (
            <div className="detail-section">
              <h3 className="detail-section-title">
                <Tag size={16} weight="duotone" />
                Tech Stack
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
                Visit Live Site
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
                View Source
                <ArrowUpRight size={16} weight="bold" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
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

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter(
      (p) => normalizeStatus(p.status) === filter.toLowerCase(),
    );
  }, [projects, filter]);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <main className="projects-page">
      <header className="projects-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, duration: 0.6 }}
        >
          <span className="projects-eyebrow">Portfolio</span>
          <h1 className="page-title">Projects</h1>
          <p className="page-description">
            Real products shipped with MERN engineering discipline and
            AI-enhanced workflows.
          </p>
        </motion.div>

        <motion.nav
          className="filter-bar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, duration: 0.5, delay: 0.15 }}
          aria-label="Filter projects"
        >
          <FunnelSimple
            size={14}
            weight="bold"
            className="filter-icon"
            aria-hidden="true"
          />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? "is-active" : ""}`}
            >
              {f}
            </button>
          ))}
        </motion.nav>
      </header>

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
            {filter === "All"
              ? "Projects will appear here once they are added."
              : `No ${filter.toLowerCase()} projects right now. Try a different filter.`}
          </p>
        </motion.div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, index) => (
              <motion.article
                className={`project-card ${index === 0 ? "project-card--featured" : ""}`}
                key={p._id || p.id}
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
                    alt=""
                    className="card-img"
                    loading="lazy"
                  />
                  <div className="card-overlay" />
                  <span
                    className={`status-pill ${normalizeStatus(p.status)}`}
                  >
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
                      className="btn-launch"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe size={16} weight="duotone" />
                      Launch Site
                      <ArrowUpRight size={14} weight="bold" />
                    </a>
                    <a
                      href={p.repoUrl}
                      className="btn-repo"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View source on GitHub"
                    >
                      <GithubLogo size={20} weight="fill" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {selected && (
          <ProjectDetail project={selected} onClose={handleClose} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Projects;
