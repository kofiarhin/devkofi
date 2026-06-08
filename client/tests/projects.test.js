import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import {
  applyProjectFilters,
  getCaseStudy,
  getProjectTags,
  normalizeStatus,
} from "../src/Pages/Projects/projectUtils";
import { getProjects, getProjectsUrl } from "../src/hooks/useProjects";

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
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("builds the projects endpoint for same-origin and configured APIs", () => {
    expect(getProjectsUrl()).toBe("/api/projects");
    expect(getProjectsUrl("https://api.devkofi.com")).toBe(
      "https://api.devkofi.com/api/projects",
    );
    expect(getProjectsUrl("https://api.devkofi.com/")).toBe(
      "https://api.devkofi.com/api/projects",
    );
  });

  it("proxies local API requests to the Express server", () => {
    const viteConfig = fs.readFileSync("vite.config.js", "utf-8");

    expect(viteConfig).toContain('"/api"');
    expect(viteConfig).toContain('"http://localhost:5000"');
  });

  it("returns project data from a successful request", async () => {
    const payload = [{ id: 25, name: "KareBraids" }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(getProjects("https://api.devkofi.com/")).resolves.toEqual(
      payload,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.devkofi.com/api/projects",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      }),
    );
  });

  it("throws the response message when a project request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: vi.fn().mockResolvedValue("Projects are temporarily unavailable"),
      }),
    );

    await expect(getProjects()).rejects.toThrow(
      "Projects are temporarily unavailable",
    );
  });
});
