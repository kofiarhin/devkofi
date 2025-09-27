const { api } = require("./utils/request");

describe("App routes", () => {
  it("returns a welcome message from the health endpoint", async () => {
    const response = await api().get("/").expect(200);
    expect(response.body).toEqual({ message: "welcome to dev kofi" });
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
