import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const registerUser = async (userData) => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (payload) => registerUser(payload),
  });
};

export default useRegisterMutation;
