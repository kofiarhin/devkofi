const request = require("supertest");

jest.mock("../config/db", () => jest.fn());
jest.mock("../models/BlogPost", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  countDocuments: jest.fn(),
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

const missingThumbnailPost = {
  ...publishedPost,
  title: "Production AI Agents Need Tool Contracts",
  slug: "production-ai-agents-need-tool-contracts",
  coverImageUrl: null,
  coverImageAlt: null,
};

const expectedFallbackCover = "https://res.cloudinary.com/dlsiabgiw/image/upload/v1789259864/devkofi/blog/production-ai-agents-need-tool-contracts.png";

const mockPublishedListQuery = (posts) => {
  const lean = jest.fn().mockResolvedValue(posts);
  const limit = jest.fn().mockReturnValue({ lean });
  const skip = jest.fn().mockReturnValue({ limit });
  const sort = jest.fn().mockReturnValue({ skip });
  BlogPost.find.mockReturnValue({ sort });
  return { sort, skip, limit };
};

describe("public blog API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists only published posts newest first with 10 posts per page by default", async () => {
    const { sort, skip, limit } = mockPublishedListQuery([publishedPost]);
    BlogPost.countDocuments.mockResolvedValue(12);

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(BlogPost.countDocuments).toHaveBeenCalledWith({ status: "published" });
    expect(BlogPost.find).toHaveBeenCalledWith({ status: "published" });
    expect(sort).toHaveBeenCalledWith({ publishedAt: -1, createdAt: -1 });
    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
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

  it("returns the requested published-post page", async () => {
    const { skip, limit } = mockPublishedListQuery([publishedPost]);
    BlogPost.countDocuments.mockResolvedValue(25);

    const response = await request(app).get("/api/blog?page=2&limit=10");

    expect(response.status).toBe(200);
    expect(skip).toHaveBeenCalledWith(10);
    expect(limit).toHaveBeenCalledWith(10);
    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 10,
      totalPosts: 25,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it("adds the Cloudinary thumbnail fallback to the affected published post", async () => {
    mockPublishedListQuery([missingThumbnailPost]);
    BlogPost.countDocuments.mockResolvedValue(1);

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(response.body.posts[0]).toEqual(expect.objectContaining({
      slug: missingThumbnailPost.slug,
      coverImageUrl: expectedFallbackCover,
      coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
    }));
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

  it("adds the Cloudinary thumbnail fallback to the affected article response", async () => {
    BlogPost.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(missingThumbnailPost) });

    const response = await request(app).get(`/api/blog/${missingThumbnailPost.slug}`);

    expect(response.status).toBe(200);
    expect(response.body.post).toEqual(expect.objectContaining({
      coverImageUrl: expectedFallbackCover,
      coverImageAlt: "DevKofi thumbnail showing an AI agent connected to a tool contract and typed tools.",
    }));
  });

  it("returns 404 for missing or unpublished slugs", async () => {
    BlogPost.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const response = await request(app).get("/api/blog/private-post");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, error: "Article not found" });
  });
});
