import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const activateEnrollment = async ({ payload, token }) => {
  const res = await fetch(`${baseUrl}/api/admin/enrollments/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to activate enrollment.");
  }
  return data;
};

const useActivateEnrollmentMutation = (token) => {
  return useMutation({
    mutationKey: ["activate-enrollment"],
    mutationFn: (payload) => activateEnrollment({ payload, token }),
  });
};

export default useActivateEnrollmentMutation;
