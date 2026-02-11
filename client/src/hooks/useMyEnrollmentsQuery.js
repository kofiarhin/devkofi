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

const fetchMyEnrollments = async (token) => {
  const authToken = token || getStoredToken();
  if (!authToken) {
    throw new Error("Not authorized. Please log in again.");
  }

  const res = await fetch(`${baseUrl}/api/enrollments/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch enrollments.");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "Failed to fetch enrollments.");
  }

  return data;
};

const useMyEnrollmentsQuery = (token) => {
  return useQuery({
    queryKey: ["my-enrollments"],
    queryFn: () => fetchMyEnrollments(token),
    enabled: !!(token || getStoredToken()),
    staleTime: 10_000,
  });
};

export default useMyEnrollmentsQuery;
