const askMentor = require("../services/askMentor");
const app = require("../app");
const request = require("supertest");

describe("passing test", () => {
  it("ask questions successfully", async () => {
    const { title, code, explanation } = await askMentor(
      "how do i use .env and give an example"
    );
    expect(title).toBeDefined();
    expect(code).toBeDefined();
  });

  it("should ask questions successfully using end point", async () => {
    const { statusCode, body } = await request(app).get("/api/ask-mentor");
    expect(statusCode).toBe(200);
  });

  it("should ask questions properly using endpoint", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/ask-mentor")
      .send({ question: "explain error code 500" });
    console.log({ statusCode, body });
  });
});
