const request = require("supertest");

jest.mock("../config/db", () => jest.fn());

const app = require("../app");

const publishedPost = {
  title: "Reliable agent retries need contracts",
  slug: "reliable-agent-retries-need-contracts",
  excerpt: "Retries need deterministic boundaries.",
  content: "# Reliable retries\n\nA retry is another state transition.",
  tags: ["AI Engineering", "Reliability"],
  sources: [{ title: "Primary source", url: "https://example.com/source" }],
  status: "published",
  publishedAt: "2026-09-01T12:00:00.000Z",
};

const upstreamResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: jest.fn().mockResolvedValue(body),
});

describe("public blog API", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("lists posts returned by Context API", async () => {
    global.fetch.mockResolvedValue(upstreamResponse({ data: [publishedPost], meta: { version: "v1" } }));

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ posts: [publishedPost] });
    expect(global.fetch).toHaveBeenCalledWith(
      "http://context-api.test/api/v1/blog",
      expect.objectContaining({
        headers: {
          Accept: "application/json",
          Authorization: "Bearer test-devkofi-blog-api-key-1234567890",
        },
      }),
    );
  });

  it("returns a post by slug and safely encodes the upstream path", async () => {
    global.fetch.mockResolvedValue(upstreamResponse({ data: publishedPost, meta: { version: "v1" } }));

    const response = await request(app).get(`/api/blog/${publishedPost.slug}`);

    expect(response.status).toBe(200);
    expect(response.body.post.slug).toBe(publishedPost.slug);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://context-api.test/api/v1/blog/${publishedPost.slug}`,
      expect.any(Object),
    );
  });

  it("preserves article-not-found as a 404", async () => {
    global.fetch.mockResolvedValue(
      upstreamResponse(
        { error: { code: "RESOURCE_NOT_FOUND", message: "Article not found" } },
        { ok: false, status: 404 },
      ),
    );

    const response = await request(app).get("/api/blog/private-post");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, error: "Article not found" });
  });

  it("maps upstream server failures to a controlled 502", async () => {
    global.fetch.mockResolvedValue(
      upstreamResponse(
        { error: { code: "INTERNAL_SERVER_ERROR", message: "internal detail" } },
        { ok: false, status: 500 },
      ),
    );

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ success: false, error: "Blog service unavailable" });
  });

  it("maps network failures to a controlled 502", async () => {
    global.fetch.mockRejectedValue(new Error("connection refused"));

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ success: false, error: "Blog service unavailable" });
  });

  it("rejects malformed successful upstream payloads", async () => {
    global.fetch.mockResolvedValue(upstreamResponse({ unexpected: true }));

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ success: false, error: "Blog service unavailable" });
  });
});
