import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const getStoredToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    return stored?.token || null;
  } catch {
    return null;
  }
};

const patchProfile = async ({ payload, token }) => {
  const authToken = token || getStoredToken();

  const res = await fetch(`${baseUrl}/api/profile/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to update profile.");
  }

  return data;
};

const useUpdateProfileMutation = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (payload) => patchProfile({ payload, token }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile-me"] }),
        queryClient.invalidateQueries({ queryKey: ["onboarding-status"] }),
        queryClient.invalidateQueries({ queryKey: ["student-dashboard-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      ]);
    },
  });
};

export default useUpdateProfileMutation;
