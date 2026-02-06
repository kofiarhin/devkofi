// client/src/hooks/useProjects.js
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const fetchProjects = async () => {
  const res = await fetch(`${baseUrl}/api/projects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch (e) {
    payload = null;
  }

  if (!res.ok) {
    const msg =
      (payload && (payload.message || payload.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  // Normalize to a consistent shape:
  // { projects: [...] }
  if (Array.isArray(payload)) return { projects: payload };
  if (payload && Array.isArray(payload.projects))
    return { projects: payload.projects };
  if (payload && Array.isArray(payload.data)) return { projects: payload.data };
  return { projects: [] };
};

const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export default useProjects;
