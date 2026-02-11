import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const loginUser = async (userData) => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(userData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "something went wrong. try again");
  }

  if (data?.success === false) {
    throw new Error(data?.error || "something went wrong. try again");
  }

  return data;
};

const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload) => loginUser(payload),
    mutationKey: ["login"],
  });
};

export default useLoginMutation;
