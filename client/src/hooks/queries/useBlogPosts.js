import { useQuery } from "@tanstack/react-query";
import { getBlogPosts } from "../../services/blogService";

const useBlogPosts = (page = 1, limit = 10) => useQuery({
  queryKey: ["blog-posts", page, limit],
  queryFn: () => getBlogPosts(page, limit),
  staleTime: 5 * 60 * 1000,
});

export default useBlogPosts;
