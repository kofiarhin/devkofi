const askMentor = require("../services/askMentor");
const app = require("../app");
const request = require("supertest");

describe("ask mentor", () => {
  it("should pass", async () => {});
  it("should respond to question properly", async () => {
    const question = "what is react js";
    const { title } = await askMentor(question);
    expect(title).toBeDefined();
  });

  it("should answer questions properly from endpoint", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/ask-mentor")
      .send({ question: "explain git and gitbash" });
    console.log({ statusCode, body });
  });
});
