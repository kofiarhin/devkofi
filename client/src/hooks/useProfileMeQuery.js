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

const fetchProfileMe = async (token) => {
  const authToken = token || getStoredToken();

  const res = await fetch(`${baseUrl}/api/profile/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to load profile.");
  }

  return {
    user: data?.user || {},
    profile: data?.profile || {},
  };
};

const useProfileMeQuery = (token) => {
  return useQuery({
    queryKey: ["profile-me"],
    queryFn: () => fetchProfileMe(token),
    enabled: !!(token || getStoredToken()),
  });
};

export default useProfileMeQuery;
