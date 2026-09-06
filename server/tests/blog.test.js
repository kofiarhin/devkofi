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

const mockPublishedPostQuery = (posts = [publishedPost]) => {
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
    BlogPost.countDocuments.mockResolvedValue(1);
  });

  it("lists only published posts newest first with pagination metadata", async () => {
    const { sort, skip, limit } = mockPublishedPostQuery();

    const response = await request(app).get("/api/blog");

    expect(response.status).toBe(200);
    expect(BlogPost.find).toHaveBeenCalledWith({ status: "published" });
    expect(BlogPost.countDocuments).toHaveBeenCalledWith({ status: "published" });
    expect(sort).toHaveBeenCalledWith({ publishedAt: -1, createdAt: -1 });
    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(6);
    expect(response.body).toEqual({
      posts: [expect.objectContaining({ slug: publishedPost.slug })],
      pagination: {
        page: 1,
        limit: 6,
        totalPosts: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    });
  });

  it("uses page and limit query parameters to select the requested slice", async () => {
    const { skip, limit } = mockPublishedPostQuery();
    BlogPost.countDocuments.mockResolvedValue(20);

    const response = await request(app).get("/api/blog?page=2&limit=6");

    expect(response.status).toBe(200);
    expect(skip).toHaveBeenCalledWith(6);
    expect(limit).toHaveBeenCalledWith(6);
    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 6,
      totalPosts: 20,
      totalPages: 4,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it("falls back to safe pagination defaults for invalid query values", async () => {
    const { skip, limit } = mockPublishedPostQuery();

    const response = await request(app).get("/api/blog?page=invalid&limit=0");

    expect(response.status).toBe(200);
    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(6);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(6);
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
