import { useMutation } from "@tanstack/react-query";
import { buildApiUrl } from "../lib/api";

const registerUser = async (userData) => {
  try {
    const url = buildApiUrl("/api/auth/register");
    const res = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error);
    }

    const result = await res.json();
    console.log({ result });
  } catch (error) {
    console.log(error.message);
  }
  return userData;
};
const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    mutationKey: ["register"],
  });
};

export default useRegisterMutation;
