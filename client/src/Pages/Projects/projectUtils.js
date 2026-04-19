export const STATUS_FILTERS = ["All", "Active", "Building", "Archived"];
export const SORT_OPTIONS = ["Featured", "Name A–Z", "Name Z–A", "Status"];
export const VIEW_MODES = ["Grid", "Case Study"];

export const normalizeStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value.includes("active") || value === "live") return "active";
  if (value.includes("build") || value.includes("progress") || value.includes("wip")) {
    return "building";
  }
  if (value.includes("archiv") || value.includes("paused")) return "archived";

  return "active";
};

const statusPriority = { active: 0, building: 1, archived: 2 };

export const getProjectTags = (projects = []) => {
  return [...new Set(projects.flatMap((project) => project?.features || []))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 12);
};

export const applyProjectFilters = ({
  projects = [],
  statusFilter = "All",
  search = "",
  activeTags = [],
  sortBy = "Featured",
}) => {
  let filtered = [...projects];

  if (statusFilter !== "All") {
    filtered = filtered.filter(
      (project) => normalizeStatus(project.status) === statusFilter.toLowerCase(),
    );
  }

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter((project) => {
      const haystack = [project.name, project.shortDescription, project.description, ...(project.features || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  if (activeTags.length > 0) {
    filtered = filtered.filter((project) => {
      const tags = Array.isArray(project.features) ? project.features : [];
      return activeTags.every((tag) => tags.includes(tag));
    });
  }

  if (sortBy === "Name A–Z") {
    filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortBy === "Name Z–A") {
    filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  } else if (sortBy === "Status") {
    filtered.sort(
      (a, b) =>
        statusPriority[normalizeStatus(a.status)] - statusPriority[normalizeStatus(b.status)],
    );
  } else {
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }

  return filtered;
};

export const getCaseStudy = (project) => {
  return {
    problem: project.challenge || project.problem,
    solution: project.approach || project.solution,
    outcome: project.outcome || project.outcomes || project.impact || project.result,
  };
};
