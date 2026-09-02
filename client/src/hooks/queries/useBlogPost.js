import { useQuery } from "@tanstack/react-query";
import { getBlogPost } from "../../services/blogService";

const useBlogPost = (slug) => useQuery({
  queryKey: ["blog-post", slug],
  queryFn: () => getBlogPost(slug),
  enabled: Boolean(slug),
  retry: false,
});

export default useBlogPost;
