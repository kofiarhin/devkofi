import { engineeringSystemsPortfolio, workPortfolio } from "../constants/portfolioCatalog";

const normalize = (value) => String(value || "").trim().toLowerCase();

const getProjectIdentifiers = (project = {}) => {
  const repoSlug = project.repoUrl?.split("/").filter(Boolean).pop();
  return [project.name, project.title, project.slug, repoSlug].map(normalize).filter(Boolean);
};

const matchesEntry = (project, entry) => {
  const identifiers = getProjectIdentifiers(project);
  const aliases = [entry.key, entry.name, ...(entry.aliases || [])].map(normalize);
  return aliases.some((alias) => identifiers.includes(alias));
};

const hydrateEntry = (projects, entry) => {
  const runtimeProject = projects.find((project) => matchesEntry(project, entry));
  return {
    ...(runtimeProject || {}),
    ...entry,
    id: runtimeProject?._id || runtimeProject?.id || entry.key,
  };
};

const selectCurated = (projects = [], entries = []) =>
  entries
    .map((entry) => hydrateEntry(projects, entry))
    .sort((a, b) => a.displayOrder - b.displayOrder);

export const selectWorkProjects = (projects = []) => selectCurated(projects, workPortfolio);

export const selectFeaturedWork = (projects = []) =>
  selectWorkProjects(projects).filter((project) => project.featured).slice(0, 3);

export const selectEngineeringSystems = (projects = []) =>
  selectCurated(projects, engineeringSystemsPortfolio);
