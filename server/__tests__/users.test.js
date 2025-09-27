const { api } = require("./utils/request");
const { createUserAndToken, authHeader, registerUser } = require("./utils/auth");

describe("User routes", () => {
  it("fails when no authorization header is provided", async () => {
    const response = await api().get("/api/users").expect(500);
    expect(response.body).toHaveProperty("error");
  });

  it("allows an admin to fetch all users without leaking passwords", async () => {
    const { token } = await createUserAndToken({
      fullName: "Admin User",
      email: "admin@test.dev",
      password: "password123",
      pricingId: 3,
      role: "admin",
    });

    await registerUser({
      fullName: "Regular User",
      email: "member@test.dev",
      password: "password123",
      pricingId: 1,
    });

    const response = await api()
      .get("/api/users")
      .set("Authorization", authHeader(token))
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    response.body.forEach((user) => {
      expect(user).toHaveProperty("email");
      expect(user).not.toHaveProperty("password");
    });
  });

  it("rejects non-admin users", async () => {
    const { token } = await createUserAndToken({
      fullName: "Regular User",
      email: "member-only@test.dev",
      password: "password123",
      pricingId: 1,
      role: "student",
    });

    const response = await api()
      .get("/api/users")
      .set("Authorization", authHeader(token))
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      error: "unauthrized access",
    });
  });

  it("handles individual user lookups", async () => {
    const { token, user } = await createUserAndToken({
      fullName: "Admin",
      email: "single@test.dev",
      password: "password123",
      pricingId: 2,
      role: "admin",
    });

    const response = await api()
      .get(`/api/users/${user._id}`)
      .set("Authorization", authHeader(token))
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Cannot destructure");
  });
});

describe("getUsers controller", () => {
  it("returns an unauthorized error when req.user is missing", async () => {
    const { getUsers } = require("../controllers/userController");
    const json = jest.fn();
    const res = { json, status: jest.fn().mockReturnThis() };

    await getUsers({ user: null }, res, jest.fn());

    expect(json).toHaveBeenCalledWith({
      success: false,
      error: "unauthorized",
    });
  });
});

describe("userRoutes individual handler", () => {
  it("omits passwords when returning the authenticated user", async () => {
    const router = require("../routes/userRoutes");
    const routeLayer = router.stack.find((layer) => layer.route?.path === "/:id");
    const handler = routeLayer.route.stack[1].handle;
    const json = jest.fn();
    const res = { json };

    await handler(
      { user: { _doc: { email: "member@test.dev", role: "admin", password: "secret" } } },
      res
    );

    expect(json).toHaveBeenCalledWith({ email: "member@test.dev", role: "admin" });
  });
});
