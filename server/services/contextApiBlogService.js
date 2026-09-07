const { contextApiUrl, contextApiKey } = require("../config/env");

const baseUrl = contextApiUrl.replace(/\/+$/, "");

const upstreamError = (message = "Blog service unavailable") => {
  const error = new Error(message);
  error.status = 502;
  return error;
};

const request = async (path) => {
  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${contextApiKey}`,
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
  const body = await request("/api/v1/blog");

  if (!Array.isArray(body?.data)) {
    throw upstreamError();
  }

  return body.data;
};

const getPublishedPost = async (slug) => {
  const body = await request(`/api/v1/blog/${encodeURIComponent(slug)}`);

  if (!body?.data || Array.isArray(body.data) || typeof body.data !== "object") {
    throw upstreamError();
  }

  return body.data;
};

module.exports = { getPublishedPosts, getPublishedPost };
