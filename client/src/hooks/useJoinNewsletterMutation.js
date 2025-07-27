import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

export const joinNewsletter = async (data) => {
  const url = import.meta.env.DEV
    ? "http://localhost:5000/api/newsletter"
    : `${baseUrl}/api/newsletter`;
  try {
    const res = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("something went wrong");
    }
    const resData = await res.json();
    console.log({ resData });
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

const useJoinNewsletterMutation = () => {
  return useMutation({
    mutationKey: ["newsletter"],
    mutationFn: joinNewsletter,
    onSuccess: (data) => {
      console.log("user joined successfully");
    },
    onError: (data) => {
      console.log("something went wrong");
    },
  });
};

export default useJoinNewsletterMutation;
