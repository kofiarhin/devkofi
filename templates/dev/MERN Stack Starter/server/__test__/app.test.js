const app = require("../app");
const request = require("supertest");
const { userTwo, userOne } = require("./data");
const User = require("../models/userModel");

describe("app", () => {
  it("should test auth route", async () => {
    const { statusCode, body } = await request(app).get("/api/auth/users");
    expect(statusCode).toBe(200);
    expect(body.length).toBeGreaterThan(0);
  });

  it("should register user properly", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/register")
      .send(userTwo);
    expect(statusCode).toBe(201);
    expect(body.password).not.toBe(userTwo.password);
    expect(body._id).toBeDefined();
  });

  it("should not register user with invalid details", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/register")
      .send({
        name: "",
        email: "",
        password: "",
      });
    expect(body.error).toBeDefined();
  });

  it("should login user properly", async () => {
    const testUser = {
      name: "test",
      email: "test@gmail.com",
      password: "password",
    };

    // register user
    await request(app).post("/api/auth/register").send(testUser);
    const { body, statusCode } = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    expect(body.token).toBeTruthy();
  });

  it("should not login user with invalid credentials", async () => {
    const user = await User.findOne({ email: userOne.email });
    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({
        email: userOne.email,
        password: "wrongpassword",
      });
    expect(body.error).toBeDefined();
  });
});
