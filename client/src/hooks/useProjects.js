import { useQuery } from "@tanstack/react-query";

const getProjects = async () => {
  const base = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${base}/api/projects`, {
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

    // always fresh
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",

    // keep retry for cold start
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),

    // optional: hard refresh every X seconds
    // refetchInterval: 10_000,
  });
};

export default useProjects;
