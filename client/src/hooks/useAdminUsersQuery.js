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

const fetchAdminUsers = async (token) => {
  const authToken = token || getStoredToken();
  if (!authToken) throw new Error("Missing auth token.");

  const res = await fetch(`${baseUrl}/api/admin/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch admin users.");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "Failed to fetch admin users.");
  }

  return data;
};

const useAdminUsersQuery = (token) => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchAdminUsers(token),
    enabled: !!(token || getStoredToken()),
    staleTime: 10_000,
  });
};

export default useAdminUsersQuery;
