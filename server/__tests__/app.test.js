const { api } = require("./utils/request");

describe("App routes", () => {
  it("returns a welcome message from the health endpoint", async () => {
    const response = await api().get("/").expect(200);
    expect(response.body).toEqual({ message: "welcome to dev kofi" });
  });

  it("exposes both health check endpoints", async () => {
    const [rootHealth, apiHealth] = await Promise.all([
      api().get("/health").expect(200),
      api().get("/api/health").expect(200),
    ]);

    [rootHealth, apiHealth].forEach((response) => {
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  it("provides the project templates list", async () => {
    const response = await api().get("/api/templates").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("handles unknown routes with a 404 error", async () => {
    const response = await api().get("/unknown-route").expect(404);
    expect(response.body).toEqual({ success: false, error: "page not found" });
  });
});
