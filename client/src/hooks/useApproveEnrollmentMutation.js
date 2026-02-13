import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const approveEnrollment = async ({ payload, token }) => {
  const res = await fetch(`${baseUrl}/api/admin/enrollments/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to approve enrollment.");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "Failed to approve enrollment.");
  }

  return data;
};

const useApproveEnrollmentMutation = (token) => {
  return useMutation({
    mutationKey: ["approve-enrollment"],
    mutationFn: (payload) => approveEnrollment({ payload, token }),
  });
};

export default useApproveEnrollmentMutation;
