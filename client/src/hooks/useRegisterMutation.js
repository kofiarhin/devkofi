import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const registerUser = async (userData) => {
  try {
    const url = import.meta.env.DEV
      ? "/api/auth/register"
      : `${baseUrl}/api/auth/register`;
    const res = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });

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
