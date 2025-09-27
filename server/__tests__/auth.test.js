const jwt = require("jsonwebtoken");
const Mentorship = require("../Model/mentorshipModel");
const { api } = require("./utils/request");

const validUser = {
  fullName: "Auth Tester",
  email: "auth@test.dev",
  password: "securePass123",
  pricingId: 2,
};

describe("Auth routes", () => {
  it("registers a new user and omits the password", async () => {
    const response = await api().post("/api/auth/register").send(validUser).expect(201);
    expect(response.body.email).toBe(validUser.email);
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toHaveProperty("_id");
  });

  it("rejects registration when required fields are missing", async () => {
    const response = await api()
      .post("/api/auth/register")
      .send({ email: "missing@test.dev" })
      .expect(400);
    expect(response.body).toEqual({
      success: false,
      error: "please fill out all fields",
    });
  });

  it("logs in a registered user and returns a token", async () => {
    await api().post("/api/auth/register").send(validUser).expect(201);
    const response = await api()
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(validUser.email);
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("returns 400 when login payload is incomplete", async () => {
    const response = await api().post("/api/auth/login").send({}).expect(400);
    expect(response.body).toEqual({
      success: false,
      error: "please fill out all fields",
    });
  });

  it("returns 404 when the email is not registered", async () => {
    const response = await api()
      .post("/api/auth/login")
      .send({ email: "unknown@test.dev", password: "password" })
      .expect(404);
    expect(response.body).toEqual({ success: false, error: "user not found" });
  });

  it("returns 400 when the password is incorrect", async () => {
    await api().post("/api/auth/register").send(validUser).expect(201);
    const response = await api()
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "wrongpass" })
      .expect(400);
    expect(response.body).toEqual({ success: false, error: "invalid credentials" });
  });

  it("returns an error when verifying without a token", async () => {
    const response = await api().get("/api/auth/verify").expect(500);
    expect(response.text).toContain("no token");
  });

  it("rejects invalid verification tokens", async () => {
    const response = await api().get("/api/auth/verify?token=invalid").expect(500);
    expect(response.text).toContain("jwt");
  });

  it("verifies mentorship accounts with a valid token", async () => {
    await Mentorship.create({
      fullName: "Verifier",
      email: "verify@test.dev",
      phone: "+123",
    });
    const token = jwt.sign({ email: "verify@test.dev" }, process.env.JWT_SECRET);
    const response = await api()
      .get(`/api/auth/verify?token=${token}`)
      .expect(200);
    expect(response.text).toContain("successfully activated");
  });
});
