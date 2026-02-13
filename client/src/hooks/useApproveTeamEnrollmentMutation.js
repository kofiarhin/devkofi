import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const approveTeam = async ({ payload, token }) => {
  const res = await fetch(`${baseUrl}/api/admin/team/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to approve team enrollment.");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "Failed to approve team enrollment.");
  }

  return data;
};

const useApproveTeamEnrollmentMutation = (token) => {
  return useMutation({
    mutationKey: ["approve-team-enrollment"],
    mutationFn: (payload) => approveTeam({ payload, token }),
  });
};

export default useApproveTeamEnrollmentMutation;
