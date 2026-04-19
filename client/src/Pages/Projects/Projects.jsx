import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ArrowUpRight,
  FadersHorizontal,
  Globe,
  GithubLogo,
  List,
  MagnifyingGlass,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import useProjects from "../../hooks/useProjects";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";
import {
  applyProjectFilters,
  getCaseStudy,
  getProjectTags,
  SORT_OPTIONS,
  STATUS_FILTERS,
  VIEW_MODES,
  normalizeStatus,
} from "./projectUtils";
import "./projects.styles.scss";

const ProjectDrawer = ({ project, onClose }) => {
  const drawerRef = useRef(null);
  const { problem, solution, outcome } = getCaseStudy(project);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    const initialFocus = drawerRef.current?.querySelector("button, a");
    initialFocus?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="projects-drawer-overlay" onClick={onClose} role="presentation">
      <aside
        ref={drawerRef}
        className="projects-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="projects-drawer-close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={18} />
        </button>

        <header className="projects-drawer-header">
          <img src={project.thumbnailUrl} alt={`${project.name} preview`} />
          <div>
            <p className={`status-chip ${normalizeStatus(project.status)}`}>{normalizeStatus(project.status)}</p>
            <h2>{project.name}</h2>
            <p>{project.shortDescription || project.description}</p>
          </div>
        </header>

        {problem && (
          <section>
            <h3>Problem</h3>
            <p>{problem}</p>
          </section>
        )}

        {solution && (
          <section>
            <h3>Solution</h3>
            <p>{solution}</p>
          </section>
        )}

        {outcome && (
          <section>
            <h3>Outcome</h3>
            <p>{outcome}</p>
          </section>
        )}

        {Array.isArray(project.features) && project.features.length > 0 && (
          <section>
            <h3>Features</h3>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <section>
            <h3>Tech stack</h3>
            <div className="drawer-tags">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </section>
        )}

        <footer className="drawer-actions">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              <Globe size={16} /> Live
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              <GithubLogo size={16} /> Repo
            </a>
          )}
        </footer>
      </aside>
    </div>
  );
};

const Projects = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState("Grid");
  const [activeTags, setActiveTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, error } = useProjects();
  const projects = useMemo(() => (Array.isArray(data) ? data : data?.data || []), [data]);

  const tags = useMemo(() => getProjectTags(projects), [projects]);

  const filteredProjects = useMemo(
    () =>
      applyProjectFilters({
        projects,
        statusFilter,
        search,
        activeTags,
        sortBy,
      }),
    [projects, statusFilter, search, activeTags, sortBy],
  );

  const featuredProject = useMemo(
    () => filteredProjects.find((project) => project.featured) || filteredProjects[0] || null,
    [filteredProjects],
  );

  const hasActiveFilters =
    statusFilter !== "All" || search.trim() || sortBy !== "Featured" || activeTags.length > 0;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortBy("Featured");
    setActiveTags([]);
  };

  return (
    <main className="projects-page">
      <div className="projects-shell">
        <button type="button" className="projects-nav-trigger" onClick={() => dispatch(toggleSideNav())}>
          <List size={16} /> Menu
        </button>

        <section className="projects-intro">
          <h1>Projects</h1>
          <p>Shipped builds across product, AI, and systems.</p>
        </section>

        {featuredProject && (
          <section className="featured-project">
            <div>
              <p className="featured-label">Featured build</p>
              <h2>{featuredProject.name}</h2>
              <p>{featuredProject.shortDescription || featuredProject.description}</p>
              <ul>
                {(featuredProject.features || []).slice(0, 3).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="featured-actions">
                <button type="button" onClick={() => setSelectedProject(featuredProject)}>
                  View Case Study
                </button>
                {featuredProject.demoUrl && (
                  <a href={featuredProject.demoUrl} target="_blank" rel="noreferrer">
                    Live Site <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
            <img src={featuredProject.thumbnailUrl} alt={`${featuredProject.name} preview`} />
          </section>
        )}

        <section className="projects-toolbar">
          <label className="search-control" htmlFor="project-search">
            <MagnifyingGlass size={15} />
            <input
              id="project-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {STATUS_FILTERS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <div className="view-toggle" role="tablist" aria-label="Project view mode">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={viewMode === mode ? "active" : ""}
                onClick={() => setViewMode(mode)}
              >
                {mode === "Grid" ? <SquaresFour size={14} /> : <List size={14} />} {mode}
              </button>
            ))}
          </div>

          <button type="button" className="filter-toggle" onClick={() => setShowFilters((open) => !open)}>
            <FadersHorizontal size={15} /> Filters
          </button>

          {hasActiveFilters && (
            <button type="button" className="reset-control" onClick={resetFilters}>
              Reset
            </button>
          )}
        </section>

        {showFilters && tags.length > 0 && (
          <section className="filters-drawer">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={activeTags.includes(tag) ? "active" : ""}
                onClick={() =>
                  setActiveTags((previous) =>
                    previous.includes(tag)
                      ? previous.filter((item) => item !== tag)
                      : [...previous, tag],
                  )
                }
              >
                {tag}
              </button>
            ))}
          </section>
        )}

        {hasActiveFilters && (
          <p className="active-summary">
            {filteredProjects.length} result(s) • status: {statusFilter} • sort: {sortBy}
            {activeTags.length > 0 ? ` • tags: ${activeTags.join(", ")}` : ""}
          </p>
        )}

        {isLoading && <p className="projects-state">Loading projects…</p>}
        {isError && <p className="projects-state">{error?.message || "Failed to load projects."}</p>}

        {!isLoading && !isError && filteredProjects.length === 0 && (
          <p className="projects-state">No projects found. Try a different search or filter.</p>
        )}

        {!isLoading && !isError && filteredProjects.length > 0 && viewMode === "Grid" && (
          <section className="projects-grid">
            {filteredProjects.map((project) => (
              <article key={project._id || project.id || project.slug || project.name} className="project-card">
                <img src={project.thumbnailUrl} alt={`${project.name} cover`} />
                <p className={`status-chip ${normalizeStatus(project.status)}`}>{normalizeStatus(project.status)}</p>
                <h3>{project.name}</h3>
                <p>{project.shortDescription || project.description}</p>
                <div className="card-tags">
                  {(project.features || []).slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="card-actions">
                  <button type="button" onClick={() => setSelectedProject(project)}>
                    View
                  </button>
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {!isLoading && !isError && filteredProjects.length > 0 && viewMode === "Case Study" && (
          <section className="case-study-list">
            {filteredProjects.map((project) => {
              const { problem, solution, outcome } = getCaseStudy(project);
              return (
                <article key={project._id || project.id || project.slug || project.name} className="case-study-card">
                  <h3>{project.name}</h3>
                  {problem && (
                    <div>
                      <h4>Problem</h4>
                      <p>{problem}</p>
                    </div>
                  )}
                  {solution && (
                    <div>
                      <h4>Solution</h4>
                      <p>{solution}</p>
                    </div>
                  )}
                  {outcome && (
                    <div>
                      <h4>Outcome</h4>
                      <p>{outcome}</p>
                    </div>
                  )}
                  <button type="button" onClick={() => setSelectedProject(project)}>
                    Open Project
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {selectedProject && <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  );
};

export default Projects;
