import { useMutation } from "@tanstack/react-query";
import { buildApiUrl } from "../lib/api";

const loginUser = async (userData) => {
  const url = buildApiUrl("/api/auth/login");
  const res = await fetch(url, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(userData),
  });
  const data = await res.json();

  if (data?.error) {
    throw new Error(data?.error);
  }
  return data;
};
const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => loginUser(data),
  });
};

export default useLoginMutation;
