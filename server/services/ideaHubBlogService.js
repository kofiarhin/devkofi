const axios = require("axios");
const { ideaHubApiUrl } = require("../config/env");

const baseUrl = ideaHubApiUrl.replace(/\/+$/, "");
const REQUEST_TIMEOUT_MS = 5000;

const listPublishedPosts = async ({ page, limit }) => {
  const response = await axios.get(`${baseUrl}/api/v1/blog-posts`, {
    params: { page, limit },
    timeout: REQUEST_TIMEOUT_MS,
  });
  return response.data;
};

const getPublishedPost = async (slug) => {
  const response = await axios.get(
    `${baseUrl}/api/v1/blog-posts/${encodeURIComponent(slug)}`,
    { timeout: REQUEST_TIMEOUT_MS },
  );
  return response.data;
};

module.exports = { listPublishedPosts, getPublishedPost };
