const axios = require("axios");

const BLOG_PATH = "/api/v1/blog-posts";
const REQUEST_TIMEOUT_MS = 5000;

class IdeaHubBlogError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "IdeaHubBlogError";
    this.status = status;
  }
}

const getBaseUrl = () => {
  const configured = process.env.IDEAHUB_API_URL?.trim();
  if (!configured) {
    throw new IdeaHubBlogError(503, "Blog service is not configured");
  }
  return configured.replace(/\/+$/, "");
};

const isValidListResponse = (data) =>
  Boolean(
    data
      && Array.isArray(data.posts)
      && data.pagination
      && typeof data.pagination === "object",
  );

const listPublicPosts = async ({ page, limit }) => {
  const baseUrl = getBaseUrl();
  try {
    const response = await axios.get(`${baseUrl}${BLOG_PATH}`, {
      params: { page, limit },
      timeout: REQUEST_TIMEOUT_MS,
    });

    if (!isValidListResponse(response.data)) {
      throw new IdeaHubBlogError(502, "Blog service returned an invalid response");
    }

    return response.data;
  } catch (error) {
    if (error instanceof IdeaHubBlogError) throw error;
    throw new IdeaHubBlogError(502, "Blog service is unavailable");
  }
};

const getPublicPostBySlug = async (slug) => {
  const baseUrl = getBaseUrl();
  try {
    const response = await axios.get(`${baseUrl}${BLOG_PATH}/${encodeURIComponent(slug)}`, {
      timeout: REQUEST_TIMEOUT_MS,
    });

    if (!response.data?.post || typeof response.data.post !== "object") {
      throw new IdeaHubBlogError(502, "Blog service returned an invalid response");
    }

    return response.data.post;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    if (error instanceof IdeaHubBlogError) throw error;
    throw new IdeaHubBlogError(502, "Blog service is unavailable");
  }
};

module.exports = {
  IdeaHubBlogError,
  listPublicPosts,
  getPublicPostBySlug,
};
