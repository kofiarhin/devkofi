import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const rejectEnrollment = async ({ payload, token }) => {
  const res = await fetch(`${baseUrl}/api/admin/enrollments/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to reject enrollment.");
  }
  return data;
};

const useRejectEnrollmentMutation = (token) => {
  return useMutation({
    mutationKey: ["reject-enrollment"],
    mutationFn: (payload) => rejectEnrollment({ payload, token }),
  });
};

export default useRejectEnrollmentMutation;
