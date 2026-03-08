import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const getStoredToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    return stored?.token || null;
  } catch {
    return null;
  }
};

const submitOnboarding = async ({ payload, token }) => {
  const authToken = token || getStoredToken();

  const res = await fetch(`${baseUrl}/api/onboarding/intake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to submit onboarding.");
  }
  return data;
};

const useOnboardingIntakeMutation = (token) => {
  return useMutation({
    mutationKey: ["onboarding-intake"],
    mutationFn: (payload) => submitOnboarding({ payload, token }),
  });
};

export default useOnboardingIntakeMutation;
