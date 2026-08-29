import { describe, expect, it } from "vitest";
import { publicActionItem, publicNavItems } from "../src/constants/navigation";
import {
  isAiEngineeringProject,
  isEngineeringSystem,
  selectFeaturedWork,
  selectProducts,
  selectWorkProjects,
} from "../src/lib/projectSelectors";

describe("AI engineering studio navigation", () => {
  it("exposes the approved public information architecture", () => {
    expect(publicNavItems.map((item) => item.to)).toEqual([
      "/",
      "/services",
      "/work",
      "/engineering-systems",
      "/products",
      "/about",
    ]);
    expect(publicActionItem).toEqual({ label: "Book a Call", to: "/book-a-call" });
  });
});

describe("project classification", () => {
  const projects = [
    { id: "hibachi", name: "Hibachi", category: "AI Agent", featured: true, displayOrder: 1 },
    { id: "kit", name: "Codex Workflow Kit", engineeringSystem: true, displayOrder: 2 },
    { id: "store", name: "Commerce App", category: "Full-stack", product: true, displayOrder: 3 },
  ];

  it("detects AI engineering work from explicit metadata or project language", () => {
    expect(isAiEngineeringProject(projects[0])).toBe(true);
    expect(selectWorkProjects(projects).map((project) => project.id)).toContain("hibachi");
  });

  it("keeps engineering systems separate from the broader products view", () => {
    expect(isEngineeringSystem(projects[1])).toBe(true);
    expect(selectProducts(projects).map((project) => project.id)).toEqual(["hibachi", "store"]);
  });

  it("prefers featured AI engineering work for the homepage", () => {
    expect(selectFeaturedWork(projects).map((project) => project.id)).toEqual(["hibachi"]);
  });
});
