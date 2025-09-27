const { api } = require("./utils/request");
const { createUserAndToken, authHeader } = require("./utils/auth");
const User = require("../Model/userModel");
const Contact = require("../Model/contactModel");

describe("Admin routes", () => {
  it("lists all users for admin dashboards", async () => {
    await createUserAndToken({
      fullName: "Admin User",
      email: "admin-dashboard@test.dev",
      password: "password123",
      pricingId: 1,
      role: "admin",
    });

    const response = await api().get("/api/admin/users").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("email");
    expect(response.body[0].password).not.toBe("password123");
  });

  it("rejects overview access without authentication", async () => {
    const response = await api().get("/api/admin/overview").expect(500);
    expect(response.body).toHaveProperty("error");
  });

  it("handles database errors on the users listing", async () => {
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("db unavailable");
    });

    const response = await api().get("/api/admin/users").expect(500);
    expect(response.body).toEqual({ success: false, error: "db unavailable" });
  });

  it("returns aggregated metrics for authenticated admins", async () => {
    const { token } = await createUserAndToken({
      fullName: "Admin User",
      email: "admin-metrics@test.dev",
      password: "password123",
      pricingId: 1,
      role: "admin",
    });

    const response = await api()
      .get("/api/admin/overview")
      .set("Authorization", authHeader(token))
      .expect(200);

    expect(response.body).toMatchObject({
      usersCount: expect.any(Number),
      coursesCount: expect.any(Number),
      messagesCount: expect.any(Number),
      paymentsCount: expect.any(Number),
      transactionsCount: expect.any(Number),
    });
  });

  it("guards the overview endpoint against aggregation failures", async () => {
    jest
      .spyOn(Contact, "countDocuments")
      .mockReturnValueOnce({ exec: async () => { throw new Error("metrics failed"); } });

    const { token } = await createUserAndToken({
      fullName: "Admin User",
      email: "admin-errors@test.dev",
      password: "password123",
      pricingId: 1,
      role: "admin",
    });

    const response = await api()
      .get("/api/admin/overview")
      .set("Authorization", authHeader(token))
      .expect(500);

    expect(response.body).toEqual({ success: false, error: "metrics failed" });
  });
});
