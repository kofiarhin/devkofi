const request = require("supertest");

jest.mock("../config/db", () => jest.fn());
jest.mock("../services/ideaHubBlogService", () => ({
  listPublicPosts: jest.fn(),
  getPublicPostBySlug: jest.fn(),
}));

const {
  listPublicPosts,
  getPublicPostBySlug,
} = require("../services/ideaHubBlogService");
const app = require("../app");

const publishedPost = {
  id: "post-1",
  title: "Reliable agent retries need contracts",
  slug: "reliable-agent-retries-need-contracts",
  excerpt: "Retries need deterministic boundaries.",
  content: "# Reliable retries\n\nA retry is another state transition.",
  tags: ["AI Engineering", "Reliability"],
  sources: [{ title: "Primary source", url: "https://example.com/source" }],
  status: "published",
  publishedAt: "2026-09-01T12:00:00.000Z",
};

const missingThumbnailPost = {
  ...publishedPost,
  title: "Production AI Agents Need Tool Contracts",
  slug: "production-ai-agents-need-tool-contracts",
  coverImageUrl: null,
  coverImageAlt: null,
};

const expectedFallbackCover = "https://res.cloudinary.com/dlsiabgiw/image/upload/v1789259864/devkofi/blog/production-ai-agents-need-tool-contracts.png";

const page = (posts = [publishedPost], overrides = {}) => ({
  posts,
  pagination: {
    page: 1,
    limit: 10,
    totalPosts: posts.length,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    ...overrides,
  },
});

describe("public blog API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    listPublicPosts.mockResolvedValue(page());
    getPublicPostBySlug.mockResolvedValue(publishedPost);
  });

  it("lists published posts through IdeaHub API with default pagination", async () => {
    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(listPublicPosts).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(response.body).toEqual(page());
  });

  it("forwards normalized page and limit to IdeaHub API", async () => {
    listPublicPosts.mockResolvedValue(page([publishedPost], {
      page: 2,
      limit: 100,
      totalPosts: 150,
      totalPages: 2,
      hasPreviousPage: true,
    }));

    const response = await request(app).get("/api/blog?page=2&limit=500");

    expect(response.status).toBe(200);
    expect(listPublicPosts).toHaveBeenCalledWith({ page: 2, limit: 100 });
    expect(response.body.pagination.page).toBe(2);
    expect(response.body.pagination.limit).toBe(100);
  });

  it("adds the Cloudinary thumbnail fallback to the affected published post", async () => {
    listPublicPosts.mockResolvedValue(page([missingThumbnailPost]));

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(response.body.posts[0]).toEqual(expect.objectContaining({
      slug: missingThumbnailPost.slug,
      coverImageUrl: expectedFallbackCover,
      coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
    }));
  });

  it("returns a published post by slug through IdeaHub API", async () => {
    const response = await request(app).get(`/api/blog/${publishedPost.slug}`);

    expect(response.status).toBe(200);
    expect(getPublicPostBySlug).toHaveBeenCalledWith(publishedPost.slug);
    expect(response.body.post.slug).toBe(publishedPost.slug);
  });

  it("adds the Cloudinary thumbnail fallback to the affected article response", async () => {
    getPublicPostBySlug.mockResolvedValue(missingThumbnailPost);

    const response = await request(app).get(`/api/blog/${missingThumbnailPost.slug}`);

    expect(response.status).toBe(200);
    expect(response.body.post).toEqual(expect.objectContaining({
      coverImageUrl: expectedFallbackCover,
      coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
    }));
  });

  it("returns 404 when IdeaHub has no published post for the slug", async () => {
    getPublicPostBySlug.mockResolvedValue(null);

    const response = await request(app).get("/api/blog/private-post");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, error: "Article not found" });
  });

  it("returns the upstream-safe service error without querying MongoDB directly", async () => {
    const error = Object.assign(new Error("Blog service is unavailable"), { status: 502 });
    listPublicPosts.mockRejectedValue(error);

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ success: false, error: "Blog service is unavailable" });
  });
});
