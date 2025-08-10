const app = require("../app");
const request = require("supertest");
const { userTwo } = require("./data/data");

describe("app", () => {
  it("should just pass", async () => {
    expect(1).toBe(1);
  });

  it("should join mentorship properly", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/mentorship")
      .send(userTwo);
    console.log({ statusCode, body });
  });
});
