import { useQuery } from "@tanstack/react-query";
import { getBlogPosts } from "../../services/blogService";

const useBlogPosts = () => useQuery({
  queryKey: ["blog-posts"],
  queryFn: getBlogPosts,
  staleTime: 5 * 60 * 1000,
});

export default useBlogPosts;
