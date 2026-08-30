import { describe, expect, it } from "vitest";
import { publicActionItem, publicNavItems } from "../src/constants/navigation";
import {
  selectEngineeringSystems,
  selectFeaturedWork,
  selectWorkProjects,
} from "../src/lib/projectSelectors";

describe("AI engineering studio navigation", () => {
  it("keeps the public portfolio focused on work and engineering systems", () => {
    expect(publicNavItems.map((item) => item.to)).toEqual([
      "/",
      "/services",
      "/work",
      "/engineering-systems",
      "/about",
    ]);
    expect(publicActionItem).toEqual({ label: "Contact", to: "/contact" });
  });
});

describe("curated portfolio selection", () => {
  const projects = [
    {
      id: 27,
      name: "Brain",
      description: "Runtime Brain description",
      demoUrl: "https://brain-pi-black.vercel.app",
      repoUrl: "https://github.com/kofiarhin/brain",
    },
    {
      id: 32,
      name: "ThriftChef",
      repoUrl: "https://github.com/kofiarhin/thriftchef",
    },
  ];

  it("uses explicit curated work order and hydrates matching runtime projects", () => {
    const work = selectWorkProjects(projects);
    expect(work.map((project) => project.name)).toEqual([
      "Hibachi",
      "Brain",
      "LeadRadar",
      "Forge",
      "ThriftChef",
    ]);
    expect(work.find((project) => project.name === "Brain")?.demoUrl).toBe("https://brain-pi-black.vercel.app");
  });

  it("keeps the private Hibachi repository out of public portfolio metadata", () => {
    const hibachi = selectWorkProjects(projects)[0];
    expect(hibachi.name).toBe("Hibachi");
    expect(hibachi.repoUrl).toBeNull();
  });

  it("features only Hibachi, Brain, and ThriftChef on the homepage", () => {
    expect(selectFeaturedWork(projects).map((project) => project.name)).toEqual([
      "Hibachi",
      "Brain",
      "ThriftChef",
    ]);
  });

  it("keeps primary catalogs disjoint and ignores duplicate runtime records", () => {
    const runtime = [...projects, ...projects, { name: "Hibachi", repoUrl: "https://example.test/private" }];
    const work = selectWorkProjects(runtime);
    const systems = selectEngineeringSystems(runtime);
    const keys = [...work, ...systems].map((project) => project.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(selectFeaturedWork(runtime)).toHaveLength(3);
    expect(work.find((project) => project.key === "hibachi").repoUrl).toBeNull();
  });

  it("uses an explicit engineering systems portfolio", () => {
    expect(selectEngineeringSystems(projects).map((project) => project.name)).toEqual([
      "AI Dev Workspace",
      "Codex Workflow Kit",
      "Agent System",
      "Context API",
      "Ideas Hub",
    ]);
  });
});
