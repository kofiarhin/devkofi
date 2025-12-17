const request = require("supertest");
const app = require("../app");
const { createUser } = require("../utility/helper");
const { testUser } = require("./data");

describe("auth", () => {
  it("passing test", () => {
    expect(1).toBe(1);
  });

  it("should create user successfully", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    expect(statusCode).toBe(201);
  });

  it("should login user properly", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(statusCode).toBe(200);
  });

  it("should not login user with invalid credentials", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid@gmail.com", password: "wrongpassword" });
    console.log({ statusCode, body });

    expect(statusCode).toBe(400);
    expect(body?.error).toBeDefined();
  });
});
