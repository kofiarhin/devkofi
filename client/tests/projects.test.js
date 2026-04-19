import { describe, expect, it } from "vitest";
import fs from "fs";
import {
  applyProjectFilters,
  getCaseStudy,
  getProjectTags,
  normalizeStatus,
} from "../src/Pages/Projects/projectUtils";

const projects = [
  {
    id: 1,
    name: "Zeta",
    status: "Active",
    featured: false,
    features: ["React", "Node"],
    description: "alpha search",
  },
  {
    id: 2,
    name: "Alpha",
    status: "Building",
    featured: true,
    features: ["MongoDB", "React"],
    description: "case study app",
    challenge: "Messy data",
    approach: "Normalized payload",
    outcome: "Shipped",
  },
];

describe("projects page data behavior", () => {
  it("normalizes status buckets", () => {
    expect(normalizeStatus("live")).toBe("active");
    expect(normalizeStatus("WIP")).toBe("building");
    expect(normalizeStatus("archived")).toBe("archived");
  });

  it("returns max 12 sorted tags", () => {
    const tags = getProjectTags([
      ...projects,
      { features: ["TypeScript", "Express", "Docker", "Redis", "Jest", "Vite", "Tailwind", "CI", "CD", "GraphQL", "Prisma", "K8s", "Sentry"] },
    ]);

    expect(tags.length).toBe(12);
    expect(tags[0]).toBe("CD");
  });

  it("applies featured sort then filter logic", () => {
    const result = applyProjectFilters({
      projects,
      statusFilter: "All",
      sortBy: "Featured",
      search: "",
      activeTags: [],
    });

    expect(result[0].name).toBe("Alpha");
  });

  it("applies search and tags", () => {
    const result = applyProjectFilters({
      projects,
      statusFilter: "All",
      sortBy: "Featured",
      search: "case",
      activeTags: ["MongoDB"],
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alpha");
  });

  it("maps case study fields", () => {
    expect(getCaseStudy(projects[1])).toEqual({
      problem: "Messy data",
      solution: "Normalized payload",
      outcome: "Shipped",
    });
  });

  it("uses TanStack hook instead of direct fetch in page", () => {
    const projectsPage = fs.readFileSync("src/Pages/Projects/Projects.jsx", "utf-8");

    expect(projectsPage.includes("useProjects()") || projectsPage.includes("useProjects("))
      .toBe(true);
    expect(projectsPage.includes("fetch(")).toBe(false);
  });
});
