jest.mock("axios", () => ({
  get: jest.fn(),
  isAxiosError: jest.fn(),
}));

const axios = require("axios");
const {
  listPublicPosts,
  getPublicPostBySlug,
} = require("../services/ideaHubBlogService");

const validPage = {
  posts: [{ slug: "public-post" }],
  pagination: {
    page: 1,
    limit: 10,
    totalPosts: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  },
};

describe("IdeaHub blog service", () => {
  const originalUrl = process.env.IDEAHUB_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.IDEAHUB_API_URL = "https://ideahub.example.com/";
  });

  afterAll(() => {
    if (originalUrl === undefined) {
      delete process.env.IDEAHUB_API_URL;
    } else {
      process.env.IDEAHUB_API_URL = originalUrl;
    }
  });

  it("calls the public IdeaHub list endpoint server-to-server", async () => {
    axios.get.mockResolvedValue({ data: validPage });

    await expect(listPublicPosts({ page: 2, limit: 25 })).resolves.toBe(validPage);
    expect(axios.get).toHaveBeenCalledWith(
      "https://ideahub.example.com/api/v1/blog-posts",
      { params: { page: 2, limit: 25 }, timeout: 5000 },
    );
  });

  it("calls the public IdeaHub detail endpoint with an encoded slug", async () => {
    const post = { slug: "public post" };
    axios.get.mockResolvedValue({ data: { post } });

    await expect(getPublicPostBySlug("public post")).resolves.toBe(post);
    expect(axios.get).toHaveBeenCalledWith(
      "https://ideahub.example.com/api/v1/blog-posts/public%20post",
      { timeout: 5000 },
    );
  });

  it("returns null when IdeaHub returns 404 for a slug", async () => {
    const error = { response: { status: 404 } };
    axios.get.mockRejectedValue(error);
    axios.isAxiosError.mockImplementation((value) => value === error);

    await expect(getPublicPostBySlug("missing-post")).resolves.toBeNull();
  });

  it("fails with 503 when the IdeaHub API URL is not configured", async () => {
    delete process.env.IDEAHUB_API_URL;

    await expect(listPublicPosts({ page: 1, limit: 10 })).rejects.toMatchObject({
      status: 503,
      message: "Blog service is not configured",
    });
  });

  it("fails with 502 for invalid upstream list data", async () => {
    axios.get.mockResolvedValue({ data: { posts: [] } });

    await expect(listPublicPosts({ page: 1, limit: 10 })).rejects.toMatchObject({
      status: 502,
      message: "Blog service returned an invalid response",
    });
  });

  it("fails with 502 for upstream network errors", async () => {
    axios.get.mockRejectedValue(new Error("socket closed"));
    axios.isAxiosError.mockReturnValue(false);

    await expect(getPublicPostBySlug("public-post")).rejects.toMatchObject({
      status: 502,
      message: "Blog service is unavailable",
    });
  });
});
