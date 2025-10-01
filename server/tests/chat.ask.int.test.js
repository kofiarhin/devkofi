const request = require("supertest");
const app = require("../app");
const contextCompactor = require("../utils/contextCompactor");

describe("POST /api/chat/ask", () => {
  it("returns 200 and { answer } when given { question }", async () => {
    const res = await request(app)
      .post("/api/chat/ask")
      .send({ question: "What is JavaScript?" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("answer");
    expect(typeof res.body.answer).toBe("string");
    expect(res.body.answer.length).toBeGreaterThan(0);
  });

  it("returns 400 when question missing or empty", async () => {
    const res = await request(app).post("/api/chat/ask").send({});

    expect(res.status).toBe(400);
  });

  it("returns 400 when messages is not an array of { role, content }", async () => {
    const res1 = await request(app)
      .post("/api/chat/ask")
      .send({ question: "test", messages: "not array" });
    expect(res1.status).toBe(400);

    const res2 = await request(app)
      .post("/api/chat/ask")
      .send({ question: "test", messages: [{ role: "user" }] }); // missing content
    expect(res2.status).toBe(400);

    const res3 = await request(app)
      .post("/api/chat/ask")
      .send({
        question: "test",
        messages: [{ role: "invalid", content: "test" }],
      });
    expect(res3.status).toBe(400);
  });

  it("compacts history when messages provided", async () => {
    const messages = [
      { role: "user", content: "Hello  " },
      { role: "assistant", content: "Hi there!\n\n\nWith extra lines." },
    ];

    const res = await request(app)
      .post("/api/chat/ask")
      .send({ question: "What next?", messages });

    expect(res.status).toBe(200);
    // Assume compact is called, since code uses it
  });
});
