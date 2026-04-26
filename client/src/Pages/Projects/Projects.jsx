import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ArrowUpRight,
  Code,
  FadersHorizontal,
  Globe,
  GithubLogo,
  List,
  MagnifyingGlass,
  SlidersHorizontal,
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

const getProjectKey = (project) =>
  project._id || project.id || project.slug || project.name;

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
    <div
      className="projects-drawer-overlay"
      onClick={onClose}
      role="presentation"
    >
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
            <p className={`status-chip ${normalizeStatus(project.status)}`}>
              {normalizeStatus(project.status)}
            </p>
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

        {Array.isArray(project.technologies) &&
          project.technologies.length > 0 && (
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

const ProjectsLoadingState = () => (
  <section className="projects-loading" aria-label="Loading projects">
    <div className="loading-feature">
      <div className="skeleton-line skeleton-kicker" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-short" />
      <div className="skeleton-actions">
        <span />
        <span />
      </div>
    </div>
    <div className="loading-card-list">
      {[0, 1, 2].map((item) => (
        <div className="loading-card" key={item}>
          <div className="skeleton-media" />
          <div className="skeleton-line skeleton-kicker" />
          <div className="skeleton-line skeleton-card-title" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-short" />
        </div>
      ))}
    </div>
  </section>
);

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
  const projects = useMemo(
    () => (Array.isArray(data) ? data : data?.data || []),
    [data],
  );

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
    () =>
      filteredProjects.find((project) => project.featured) ||
      filteredProjects[0] ||
      null,
    [filteredProjects],
  );

  const projectStats = useMemo(() => {
    const active = projects.filter(
      (project) => normalizeStatus(project.status) === "active",
    ).length;
    const building = projects.filter(
      (project) => normalizeStatus(project.status) === "building",
    ).length;

    return [
      { label: "Live", value: active },
      { label: "Building", value: building },
      { label: "Total", value: projects.length },
    ];
  }, [projects]);

  const hasActiveFilters =
    statusFilter !== "All" ||
    search.trim() ||
    sortBy !== "Featured" ||
    activeTags.length > 0;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortBy("Featured");
    setActiveTags([]);
  };

  return (
    <main className="projects-page">
      <div className="projects-shell">
        <button
          type="button"
          className="projects-nav-trigger"
          onClick={() => dispatch(toggleSideNav())}
        >
          <List size={17} /> Menu
        </button>

        <section className="projects-intro">
          <div>
            <p className="projects-kicker">Selected builds</p>
            <h1>Projects built to be used.</h1>
          </div>
          <p>
            A mobile-first look at shipped products, work in progress, and
            experiments across marketplaces, dashboards, AI tools, and real-time
            apps.
          </p>

          {projects.length > 0 && (
            <dl className="projects-stats" aria-label="Project summary">
              {projectStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {!isLoading && !isError && featuredProject && (
          <section className="featured-project">
            <div>
              <p className="featured-label">Featured build</p>
              <h2>{featuredProject.name}</h2>
              <p>
                {featuredProject.shortDescription ||
                  featuredProject.description}
              </p>
              <ul>
                {(featuredProject.features || []).slice(0, 3).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="featured-actions">
                <button
                  type="button"
                  onClick={() => setSelectedProject(featuredProject)}
                >
                  View Case Study <ArrowUpRight size={15} />
                </button>
                {featuredProject.demoUrl && (
                  <a
                    href={featuredProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live Site <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
            <figure>
              <img
                src={featuredProject.thumbnailUrl}
                alt={`${featuredProject.name} preview`}
              />
              <figcaption>
                <Code size={15} />
                {(featuredProject.features || []).slice(0, 2).join(" / ")}
              </figcaption>
            </figure>
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

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter projects by status"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort projects"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <div
            className="view-toggle"
            role="tablist"
            aria-label="Project view mode"
          >
            {VIEW_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={viewMode === mode ? "active" : ""}
                onClick={() => setViewMode(mode)}
              >
                {mode === "Grid" ? (
                  <SquaresFour size={14} />
                ) : (
                  <List size={14} />
                )}
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="filter-toggle"
            onClick={() => setShowFilters((open) => !open)}
            aria-expanded={showFilters}
          >
            <FadersHorizontal size={15} /> Tags
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="reset-control"
              onClick={resetFilters}
            >
              Reset
            </button>
          )}
        </section>

        <div className="mobile-filter-cue" aria-hidden="true">
          <SlidersHorizontal size={15} />
          Use search, status, sort, or tags to shape the gallery.
        </div>

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
            {filteredProjects.length} results / status: {statusFilter} / sort:{" "}
            {sortBy}
            {activeTags.length > 0 ? ` / tags: ${activeTags.join(", ")}` : ""}
          </p>
        )}

        {isLoading && <ProjectsLoadingState />}

        {isError && (
          <section className="projects-state projects-state-panel">
            <p className="state-label">Could not load projects</p>
            <h2>Something blocked the gallery.</h2>
            <p>{error?.message || "Failed to load projects."}</p>
          </section>
        )}

        {!isLoading && !isError && filteredProjects.length === 0 && (
          <section className="projects-state projects-state-panel">
            <p className="state-label">No matches</p>
            <h2>No project fits those filters.</h2>
            <p>Clear a tag, change the status, or search for another build.</p>
            <button type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </section>
        )}

        {!isLoading &&
          !isError &&
          filteredProjects.length > 0 &&
          viewMode === "Grid" && (
            <section className="projects-grid">
              {filteredProjects.map((project, index) => (
                <article
                  key={getProjectKey(project)}
                  className="project-card"
                  style={{ "--project-index": index }}
                >
                  <div className="project-card-media">
                    <img
                      src={project.thumbnailUrl}
                      alt={`${project.name} cover`}
                      loading="lazy"
                    />
                    <p
                      className={`status-chip ${normalizeStatus(project.status)}`}
                    >
                      {normalizeStatus(project.status)}
                    </p>
                  </div>
                  <div className="project-card-body">
                    <p className="project-count">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3>{project.name}</h3>
                    <p>{project.shortDescription || project.description}</p>
                  </div>
                  <div className="card-tags">
                    {(project.features || []).slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                    >
                      View
                    </button>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}

        {!isLoading &&
          !isError &&
          filteredProjects.length > 0 &&
          viewMode === "Case Study" && (
            <section className="case-study-list">
              {filteredProjects.map((project) => {
                const { problem, solution, outcome } = getCaseStudy(project);
                return (
                  <article
                    key={getProjectKey(project)}
                    className="case-study-card"
                  >
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
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                    >
                      Open Project
                    </button>
                  </article>
                );
              })}
            </section>
          )}
      </div>

      {selectedProject && (
        <ProjectDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
};

export default Projects;
