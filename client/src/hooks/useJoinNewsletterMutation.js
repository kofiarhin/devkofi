import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const joinNewsletter = async (data) => {
  const url = import.meta.env.DEV
    ? "/api/newsletter"
    : `${baseUrl}/api/newsletter`;
  try {
    const res = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(res.ok);
  } catch (error) {
    throw new Error(error.message);
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
