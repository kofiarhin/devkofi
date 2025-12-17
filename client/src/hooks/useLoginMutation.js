import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const loginUser = async (userData) => {
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error("something went wrong. try again");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return { error: "something went wrong" };
  }
};

const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data) => loginUser(data),
    mutationKey: ["login"],
  });
};

export default useLoginMutation;
