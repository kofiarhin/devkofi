const request = require("supertest");

jest.mock("../config/db", () => jest.fn());
jest.mock("../models/BlogPost", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

const BlogPost = require("../models/BlogPost");
const app = require("../app");

const publishedPost = {
  title: "Reliable agent retries need contracts",
  slug: "reliable-agent-retries-need-contracts",
  excerpt: "Retries need deterministic boundaries.",
  content: "# Reliable retries\n\nA retry is another state transition.",
  tags: ["AI Engineering", "Reliability"],
  sources: [{ title: "Primary source", url: "https://example.com/source" }],
  status: "published",
  publishedAt: new Date("2026-09-01T12:00:00.000Z"),
};

describe("public blog API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists only published posts newest first", async () => {
    const lean = jest.fn().mockResolvedValue([publishedPost]);
    const sort = jest.fn().mockReturnValue({ lean });
    BlogPost.find.mockReturnValue({ sort });

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(BlogPost.find).toHaveBeenCalledWith({ status: "published" });
    expect(sort).toHaveBeenCalledWith({ publishedAt: -1, createdAt: -1 });
    expect(response.body).toEqual({ posts: [expect.objectContaining({ slug: publishedPost.slug })] });
  });

  it("returns a published post by slug", async () => {
    BlogPost.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(publishedPost) });

    const response = await request(app).get(`/api/blog/${publishedPost.slug}`);

    expect(response.status).toBe(200);
    expect(BlogPost.findOne).toHaveBeenCalledWith({
      slug: publishedPost.slug,
      status: "published",
    });
    expect(response.body.post.slug).toBe(publishedPost.slug);
  });

  it("returns 404 for missing or unpublished slugs", async () => {
    BlogPost.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const response = await request(app).get("/api/blog/private-post");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, error: "Article not found" });
  });
});
