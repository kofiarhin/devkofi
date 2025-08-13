const app = require("../app");
const {
  fetchGitHubContributions,
  fetchDailyGitHubContributions,
} = require("../utility/helper");
const request = require("supertest");
const { userTwo } = require("./data/data");

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
    console.log({ statusCode, body });
  });

  it("should test fo info on daily git hub contribution routes succefully", async () => {
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
});
