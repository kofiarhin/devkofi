const request = require("supertest");
const app = require("../app");
const askMentorService = require("../services/askMentor");
const { FALLBACK_RESPONSE } = require("../services/askMentor");
const mentorController = require("../controllers/mentorController");

var mockCreate;

jest.mock("groq-sdk", () => {
  mockCreate = jest.fn();
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

describe("POST /api/mentor/ask", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it("returns mentor guidance with expected keys", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Sample Title",
              explanation: "Brief guidance",
              code: "```js\nconsole.log('hi');\n```",
              difficulty: "easy",
              confidence: 0.9,
            }),
          },
        },
      ],
    });

    const response = await request(app)
      .post("/api/mentor/ask")
      .send({ question: "How do I log?" })
      .expect(200);

    expect(response.body).toEqual({
      title: "Sample Title",
      explanation: "Brief guidance",
      code: "```js\nconsole.log('hi');\n```",
      difficulty: "easy",
      confidence: 0.9,
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const { messages, model } = mockCreate.mock.calls[0][0];
    expect(model).toBe("llama3-70b-8192");
    expect(messages[0].role).toBe("system");
    expect(messages[messages.length - 1]).toEqual({
      role: "user",
      content: "How do I log?",
    });
  });

  it("passes history messages along with user question", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Follow Up",
              explanation: "More help",
              code: "",
              difficulty: "medium",
              confidence: 0.7,
            }),
          },
        },
      ],
    });

    const history = [
      { role: "user", content: "Hi" },
      { role: "assistant", content: "Hello" },
    ];

    await request(app)
      .post("/api/mentor/ask")
      .send({ question: "Need more?", history })
      .expect(200);

    const { messages } = mockCreate.mock.calls[0][0];
    expect(messages).toHaveLength(1 + history.length + 1);
    expect(messages[1]).toEqual(history[0]);
    expect(messages[2]).toEqual(history[1]);
  });

  it("returns fallback object when model output is invalid JSON", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: "not-json",
          },
        },
      ],
    });

    const response = await request(app)
      .post("/api/mentor/ask")
      .send({ question: "Break?" })
      .expect(200);

    expect(response.body).toEqual({
      title: "Parse Error",
      explanation: "The AI returned invalid JSON. Please try again.",
      code: "",
      difficulty: "medium",
      confidence: 0,
    });
  });

  it("returns fallback object when the model omits content", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {},
        },
      ],
    });

    const response = await request(app)
      .post("/api/mentor/ask")
      .send({ question: "Missing content?" })
      .expect(200);

    expect(response.body).toEqual(FALLBACK_RESPONSE);
  });

  it("forwards service errors to the global handler", async () => {
    mockCreate.mockRejectedValueOnce(new Error("mentor offline"));

    const response = await request(app)
      .post("/api/mentor/ask")
      .send({ question: "Will this fail?" })
      .expect(500);

    expect(response.body).toMatchObject({
      success: false,
      error: "mentor offline",
    });
  });

  it("sanitizes incomplete mentor payload fields", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "",
              explanation: null,
              code: 42,
              difficulty: "",
              confidence: "sure",
            }),
          },
        },
      ],
    });

    const response = await request(app)
      .post("/api/mentor/ask")
      .send({ question: "Sanitize?" })
      .expect(200);

    expect(response.body).toEqual({
      title: FALLBACK_RESPONSE.title,
      explanation: FALLBACK_RESPONSE.explanation,
      code: "",
      difficulty: "medium",
      confidence: FALLBACK_RESPONSE.confidence,
    });
  });

  it("rejects non-string question with 400", async () => {
    const response = await request(app)
      .post("/api/mentor/ask")
      .send({ question: 123 })
      .expect(400);

    expect(response.body).toEqual({
      message: "Question must be a non-empty string.",
    });
  });

  it("throws when the service receives an invalid question", async () => {
    await expect(askMentorService("")).rejects.toThrow(
      "Question must be a non-empty string."
    );
  });

  it("ignores malformed history entries", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(FALLBACK_RESPONSE),
          },
        },
      ],
    });

    await request(app)
      .post("/api/mentor/ask")
      .send({ question: "History?", history: "bad" })
      .expect(200);

    const { messages } = mockCreate.mock.calls[0][0];
    expect(messages).toHaveLength(2);
  });

  it("handles missing request bodies in the controller", async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await mentorController.ask({ body: undefined }, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Question must be a non-empty string.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
