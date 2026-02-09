import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const getProjects = async () => {
  const res = await fetch(`${baseUrl}/api/projects`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch projects (${res.status})`);
  }

  return res.json();
};

const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,

    // ✅ fixes “loads only after refresh” when first request fails/cold-starts
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),

    // ✅ ensures it fetches when you navigate to /projects
    refetchOnMount: "always",

    // optional
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};

export default useProjects;
