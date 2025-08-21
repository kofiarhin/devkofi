const app = require("../app");
const { mockRegisterUser, mockLoginUser, fullAuth } = require("./helper");
const {
  fetchGitHubContributions,
  fetchDailyGitHubContributions,
  createUser,
} = require("../utility/helper");
const request = require("supertest");
const { userTwo, testUser, invalidUser } = require("./data/data");

describe("app", () => {
  it("should just pass", async () => {
    expect(1).toBe(1);
  });

  // it("should join mentorship properly", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/mentorship")
  //     .send(userTwo);
  //   console.log({ statusCode, body });
  // });

  // it("should join news letter properly", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/newsletter")
  //     .send({ email: "test@gmail.com" });
  //   console.log({ statusCode, body });
  // });

  // it("should contact successfully", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/contact")
  //     .send({
  //       fullName: userTwo.fullName,
  //       email: userTwo.email,
  //       message: "testsing mic",
  //     });
  //   console.log({ statusCode, body });
  // });

  it("should test for 404 page not found", async () => {
    const { statusCode, body } = await request(app).get("/api/no-route");
    expect(statusCode).toBe(404);
    expect(body.error).toBeDefined();
  });

  it("should fetch git contributions successfully", async () => {
    const result = await fetchGitHubContributions();
    expect(result).toBeDefined();
  });

  it("should test fot daily git contribution data successfully", async () => {
    const { data } = await fetchDailyGitHubContributions();
    expect(data.length).toBeGreaterThan(0);
  });

  it("should test fo info routes succefully", async () => {
    const { statusCode, body } = await request(app).get("/api/info");
  });

  it("should test info on daily git hub contribution routes succefully", async () => {
    const { statusCode, body } = await request(app).get(
      "/api/info/github?query=daily"
    );
    expect(statusCode).toBe(200);
  });

  it("should get total git contributions when query is not provided", async () => {
    const { statusCode, body } = await request(app).get("/api/info/github");
    expect(statusCode).toBe(200);
    expect(body).toBeGreaterThan(0);
  });

  it("should get list pricing list successfully", async () => {
    const { statusCode, body } = await request(app).get("/api/pricing");
    expect(statusCode).toBe(200);
    expect(body.length).toBeGreaterThan(0);
  });

  it("should get pricing item successfully", async () => {
    const { statusCode, body } = await request(app).get("/api/pricing/1");
    expect(statusCode).toBe(200);
    expect(body).toBeDefined();
  });

  it("should create user properly", async () => {
    const user = await createUser({
      fullName: "test",
      email: "test@gmail.com",
      password: "password",
      pricingId: 1,
    });

    expect(user._id).toBeDefined();
  });

  it("should register user properly", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    expect(statusCode).toBe(201);
  });

  it("should login user properly user properly", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(statusCode).toBe(200);
    expect(body.token).toBeDefined();
  });

  it("should not login user with invalid credentials", async () => {
    const { statusCode, body } = await mockLoginUser(invalidUser);
    expect(statusCode).toBe(404);
    console.log({ body });
    expect(body.success).toBe(false);
  });

  it("should get user profile properly", async () => {
    const result = await fullAuth(testUser);
    console.log({ result });
    // expect(statusCode).toBe(200);
    // expect(body._id).toBeDefined();
  });
});
