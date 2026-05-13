const request = require("supertest");
const app = require("../app");
const templates = require("../data/templates.json");

describe("GET /api/templates", () => {
  it("returns the template list with the expected public shape", async () => {
    const response = await request(app).get("/api/templates");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(3);
    expect(response.body).toEqual(templates);

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
