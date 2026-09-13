const request = require("supertest");

jest.mock("../config/db", () => jest.fn());
jest.mock("../services/ideaHubBlogService", () => ({
  listPublishedPosts: jest.fn(),
  getPublishedPost: jest.fn(),
}));

const ideaHubBlogService = require("../services/ideaHubBlogService");
const app = require("../app");

const publishedPost = {
  _id: "66d000000000000000000001",
  title: "Reliable agent retries need contracts",
  slug: "reliable-agent-retries-need-contracts",
  excerpt: "Retries need deterministic boundaries.",
  content: "# Reliable retries\n\nA retry is another state transition.",
  tags: ["AI Engineering", "Reliability"],
  sources: [{ title: "Primary source", url: "https://example.com/source" }],
  coverImageUrl: "https://example.com/cover.png",
  coverImageAlt: "Reliable agent retries",
  seoTitle: "Reliable agent retries need contracts",
  seoDescription: "Why reliable retries need deterministic contracts.",
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

const page = (posts, overrides = {}) => ({
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
  });

  it("lists published posts through IdeaHub with 10 posts per page by default", async () => {
    ideaHubBlogService.listPublishedPosts.mockResolvedValue(page([publishedPost], {
      totalPosts: 12,
      totalPages: 2,
      hasNextPage: true,
    }));

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(ideaHubBlogService.listPublishedPosts).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(response.body).toEqual({
      posts: [expect.objectContaining({ slug: publishedPost.slug })],
      pagination: {
        page: 1,
        limit: 10,
        totalPosts: 12,
        totalPages: 2,
        hasPreviousPage: false,
        hasNextPage: true,
      },
    });
  });

  it("forwards the requested published-post page to IdeaHub", async () => {
    ideaHubBlogService.listPublishedPosts.mockResolvedValue(page([publishedPost], {
      page: 2,
      totalPosts: 25,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    }));

    const response = await request(app).get("/api/blog?page=2&limit=10");

    expect(response.status).toBe(200);
    expect(ideaHubBlogService.listPublishedPosts).toHaveBeenCalledWith({ page: 2, limit: 10 });
    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 10,
      totalPosts: 25,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it("keeps the existing page-size clamp before calling IdeaHub", async () => {
    ideaHubBlogService.listPublishedPosts.mockResolvedValue(page([]));

    const response = await request(app).get("/api/blog?page=0&limit=500");

    expect(response.status).toBe(200);
    expect(ideaHubBlogService.listPublishedPosts).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it("adds the Cloudinary thumbnail fallback to the affected published post", async () => {
    ideaHubBlogService.listPublishedPosts.mockResolvedValue(page([missingThumbnailPost]));

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(response.body.posts[0]).toEqual(expect.objectContaining({
      slug: missingThumbnailPost.slug,
      coverImageUrl: expectedFallbackCover,
      coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
    }));
  });

  it("returns a published post by slug through IdeaHub", async () => {
    ideaHubBlogService.getPublishedPost.mockResolvedValue({ post: publishedPost });

    const response = await request(app).get(`/api/blog/${publishedPost.slug}`);

    expect(response.status).toBe(200);
    expect(ideaHubBlogService.getPublishedPost).toHaveBeenCalledWith(publishedPost.slug);
    expect(response.body.post.slug).toBe(publishedPost.slug);
  });

  it("adds the Cloudinary thumbnail fallback to the affected article response", async () => {
    ideaHubBlogService.getPublishedPost.mockResolvedValue({ post: missingThumbnailPost });

    const response = await request(app).get(`/api/blog/${missingThumbnailPost.slug}`);

    expect(response.status).toBe(200);
    expect(response.body.post).toEqual(expect.objectContaining({
      coverImageUrl: expectedFallbackCover,
      coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
    }));
  });

  it("preserves the current 404 response when IdeaHub cannot find the slug", async () => {
    ideaHubBlogService.getPublishedPost.mockRejectedValue({ response: { status: 404 } });

    const response = await request(app).get("/api/blog/private-post");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, error: "Article not found" });
  });
});
