import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const getStoredToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    return stored?.token || null;
  } catch {
    return null;
  }
};

const fetchMyRequests = async (token) => {
  const authToken = token || getStoredToken();
  if (!authToken) {
    return { success: true, requests: [] };
  }

  const res = await fetch(`${baseUrl}/api/access-requests/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 404) {
    return { success: true, requests: [] };
  }

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch requests.");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "Failed to fetch requests.");
  }

  return data;
};

const useMyAccessRequestsQuery = (token) => {
  return useQuery({
    queryKey: ["my-access-requests"],
    queryFn: () => fetchMyRequests(token),
    enabled: !!(token || getStoredToken()),
    staleTime: 10_000,
  });
};

export default useMyAccessRequestsQuery;
