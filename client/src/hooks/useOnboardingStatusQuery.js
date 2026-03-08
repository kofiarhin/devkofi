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

const fetchOnboardingStatus = async (token) => {
  const authToken = token || getStoredToken();

  const res = await fetch(`${baseUrl}/api/onboarding/status`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to load onboarding status.");
  }
  return data;
};

const useOnboardingStatusQuery = (token, enabled = true) => {
  return useQuery({
    queryKey: ["onboarding-status"],
    queryFn: () => fetchOnboardingStatus(token),
    enabled: enabled && Boolean(token || getStoredToken()),
  });
};

export default useOnboardingStatusQuery;
