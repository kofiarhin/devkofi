const request = require("supertest");
const app = require("../app");
const templates = require("../data/templates.json");

describe("GET /api/templates", () => {
  it("returns the template list with the expected public shape", async () => {
    const response = await request(app).get("/api/templates");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(templates);

    const setupPrdWorkspace = response.body.filter(
      ({ id }) => id === "setup-prd-workspace"
    );

    expect(setupPrdWorkspace).toHaveLength(1);
    expect(setupPrdWorkspace[0]).toEqual({
      id: "setup-prd-workspace",
      title: "Setup PRD Workspace",
      description:
        "Turn a PRD into an AI-ready Claude Code project workspace with reusable planning, review, demo, and routine documentation.",
      category: "AI Workflow",
      tags: ["Claude Code", "PRD", "AI Workflow"],
      templateUrl: "https://github.com/kofiarhin/setup-prd-workspace",
    });

    const templateIds = response.body.map(({ id }) => id);
    expect(new Set(templateIds).size).toBe(templateIds.length);
    expect(setupPrdWorkspace[0]).not.toHaveProperty("githubUrl");

    response.body.forEach((template) => {
      expect(template).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          category: expect.any(String),
          tags: expect.any(Array),
        })
      );
      expect(template.tags.length).toBeGreaterThan(0);
      template.tags.forEach((tag) => {
        expect(tag).toEqual(expect.any(String));
      });
    });
  });
});
