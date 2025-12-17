import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const registerUser = async (userData) => {
  try {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });

    console.log(res.ok);
    return { userData };
  } catch (error) {
    console.log(error.message);
  }
};

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    mutationKey: ["register"],
  });
};

export default useRegisterMutation;
