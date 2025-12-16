const request = require("supertest");
const app = require("../app");

describe("server", () => {
  it("passing test", () => {
    expect(1).toBe(1);
  });

  it("should get status code successfully", async () => {
    const { body, statusCode } = await request(app).get("/api/health");
    expect(statusCode).toBe(200);
  });

  it("should register user successfully", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@gmail.com",
        password: "password",
        firstName: "test first name",
        lastName: "test last name",
      });
    console.log({ body });
    expect(statusCode).toBe(201);
  });

  it("should login user successfully", async () => {
    const { statusCode } = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    console.log({ statusCode });
  });
});
