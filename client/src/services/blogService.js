import api from "../lib/api";

export const getBlogPosts = async ({ page = 1, limit = 6 } = {}) => {
  const response = await api.get("/api/blog", {
    params: { page, limit },
  });
  return response.data;
};

export const getBlogPost = async (slug) => {
  const response = await api.get(`/api/blog/${encodeURIComponent(slug)}`);
  return response.data;
};
