import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const requestTeamAccess = async ({ payload, token }) => {
  const url = `${baseUrl}/api/access-requests/team`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to submit request.");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "Failed to submit request.");
  }

  return data;
};

const useTeamAccessRequestMutation = (token) => {
  return useMutation({
    mutationKey: ["team-access-request"],
    mutationFn: (payload) => requestTeamAccess({ payload, token }),
  });
};

export default useTeamAccessRequestMutation;
