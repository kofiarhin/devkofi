jest.mock("axios", () => ({ get: jest.fn() }));

const axios = require("axios");
const ideaHubBlogService = require("../services/ideaHubBlogService");

describe("IdeaHub blog API client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requests the public paginated blog endpoint", async () => {
    const payload = { posts: [], pagination: { page: 2, limit: 10, totalPosts: 0, totalPages: 1, hasPreviousPage: false, hasNextPage: false } };
    axios.get.mockResolvedValue({ data: payload });

    await expect(ideaHubBlogService.listPublishedPosts({ page: 2, limit: 10 })).resolves.toEqual(payload);
    expect(axios.get).toHaveBeenCalledWith(
      "http://127.0.0.1:3999/api/v1/blog-posts",
      { params: { page: 2, limit: 10 }, timeout: 5000 },
    );
  });

  it("requests the public slug endpoint without authentication", async () => {
    const payload = { post: { slug: "public-post" } };
    axios.get.mockResolvedValue({ data: payload });

    await expect(ideaHubBlogService.getPublishedPost("public post")).resolves.toEqual(payload);
    expect(axios.get).toHaveBeenCalledWith(
      "http://127.0.0.1:3999/api/v1/blog-posts/public%20post",
      { timeout: 5000 },
    );
  });
});
