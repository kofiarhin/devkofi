const normalize = (value) => String(value || "").trim().toLowerCase();

const getHaystack = (project) =>
  [
    project.name,
    project.title,
    project.slug,
    project.category,
    project.shortDescription,
    project.description,
    ...(Array.isArray(project.technologies) ? project.technologies : []),
    ...(Array.isArray(project.tags) ? project.tags : []),
  ]
    .map(normalize)
    .join(" ");

export const sortByDisplayOrder = (projects = []) =>
  [...projects].sort((a, b) => {
    const left = Number.isFinite(Number(a.displayOrder)) ? Number(a.displayOrder) : 999;
    const right = Number.isFinite(Number(b.displayOrder)) ? Number(b.displayOrder) : 999;
    return left - right;
  });

export const isAiEngineeringProject = (project = {}) => {
  if (typeof project.aiEngineering === "boolean") return project.aiEngineering;
  const haystack = getHaystack(project);
  return ["ai", "agent", "llm", "rag", "context", "codex", "claude", "retrieval", "automation"].some((token) =>
    haystack.includes(token),
  );
};

export const isEngineeringSystem = (project = {}) => {
  if (typeof project.engineeringSystem === "boolean") return project.engineeringSystem;
  const haystack = getHaystack(project);
  return ["workflow", "agent system", "context api", "developer tool", "codex"].some((token) =>
    haystack.includes(token),
  );
};

export const isProduct = (project = {}) =>
  typeof project.product === "boolean" ? project.product : !isEngineeringSystem(project);

export const selectWorkProjects = (projects = []) =>
  sortByDisplayOrder(projects.filter(isAiEngineeringProject)).slice(0, 6);

export const selectFeaturedWork = (projects = []) => {
  const featured = projects.filter((project) => project.featured && isAiEngineeringProject(project));
  return sortByDisplayOrder(featured.length ? featured : selectWorkProjects(projects)).slice(0, 3);
};

export const selectEngineeringSystems = (projects = []) =>
  sortByDisplayOrder(projects.filter(isEngineeringSystem));

export const selectProducts = (projects = []) =>
  sortByDisplayOrder(projects.filter(isProduct));
