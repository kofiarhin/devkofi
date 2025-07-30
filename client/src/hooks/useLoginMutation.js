import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const loginUser = async (userData) => {
  try {
    const url = import.meta.env.DEV
      ? "/api/auth/login"
      : `${baseUrl}/api/auth/login`;
    const res = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.error);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => loginUser(data),
  });
};

export default useLoginMutation;
