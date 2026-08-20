const request = require("supertest");
const app = require("../app");
const projects = require("../data/projects.data.json");

describe("GET /api/projects", () => {
  it("returns the approved ThriftChef project exactly once with a unique ID", async () => {
    const response = await request(app).get("/api/projects");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toEqual(projects);

    const thriftChefProjects = response.body.filter(
      (project) => project.name === "ThriftChef"
    );

    expect(thriftChefProjects).toHaveLength(1);
    expect(thriftChefProjects[0]).toEqual({
      id: 32,
      name: "ThriftChef",
      description:
        "Budget-focused Aldi UK meal planner that creates practical seven-day meal plans, recipes, and a consolidated shopping list from real catalogue data.",
      features: [
        "Budget and household-based planning",
        "Deterministic seven-day meal generation",
        "Real Aldi catalogue pricing",
        "Recipes and consolidated shopping list",
      ],
      status: "Active",
      demoUrl: "https://thriftchef.vercel.app",
      repoUrl: "https://github.com/kofiarhin/thriftchef",
      thumbnailUrl:
        "https://opengraph.githubassets.com/1/kofiarhin/thriftchef",
    });

    const ids = response.body.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
