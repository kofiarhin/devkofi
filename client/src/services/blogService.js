import api from "../lib/api";

export const getBlogPosts = async () => {
  const response = await api.get("/api/blog");
  return response.data;
};

export const getBlogPost = async (slug) => {
  const response = await api.get(`/api/blog/${encodeURIComponent(slug)}`);
  return response.data;
};
