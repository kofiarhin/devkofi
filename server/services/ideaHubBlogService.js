const { ideaHubApiUrl, ideaHubApiKey } = require("../config/env");

const baseUrl = ideaHubApiUrl.replace(/\/+$/, "");

const upstreamError = () => {
  const error = new Error("Blog service unavailable");
  error.status = 502;
  return error;
};

const request = async (path) => {
  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ideaHubApiKey}`,
      },
    });
  } catch {
    throw upstreamError();
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    throw upstreamError();
  }

  if (!response.ok) {
    if (response.status === 404) {
      const error = new Error("Article not found");
      error.status = 404;
      throw error;
    }
    throw upstreamError();
  }

  return body;
};

const getPublishedPosts = async () => {
  const body = await request("/api/v1/devkofi/blog-posts");

  if (!Array.isArray(body?.posts)) {
    throw upstreamError();
  }

  return body.posts;
};

const getPublishedPost = async (slug) => {
  const body = await request(`/api/v1/devkofi/blog-posts/${encodeURIComponent(slug)}`);

  if (!body?.post || Array.isArray(body.post) || typeof body.post !== "object") {
    throw upstreamError();
  }

  return body.post;
};

module.exports = { getPublishedPosts, getPublishedPost };
