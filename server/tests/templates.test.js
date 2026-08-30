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

    const aiDevWorkspace = response.body.filter(
      ({ id }) => id === "ai-dev-workspace"
    );

    expect(aiDevWorkspace).toHaveLength(1);
    expect(aiDevWorkspace[0]).toEqual({
      id: "ai-dev-workspace",
      title: "AI Dev Workspace",
      description:
        "A reusable repository operating system for AI-assisted software delivery, with persistent project context, operator briefs, planning, implementation, verification, and safe workspace lifecycle management.",
      category: "AI Workflow",
      tags: ["AI Agents", "Software Delivery", "Workspace"],
      templateUrl: "https://github.com/kofiarhin/ai-dev-workspace",
    });

    const templateIds = response.body.map(({ id }) => id);
    expect(new Set(templateIds).size).toBe(templateIds.length);
    expect(aiDevWorkspace[0]).not.toHaveProperty("githubUrl");

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
