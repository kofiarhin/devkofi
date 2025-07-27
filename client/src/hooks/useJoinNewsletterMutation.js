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
      const error = await res.json();
      throw new Error(error.error);
    }
    const resData = await res.json();
    console.log(resData);
    return resData;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

const useJoinNewsletterMutation = () => {
  return useMutation({
    mutationKey: ["newsletter"],
    mutationFn: joinNewsletter,
    onError: (data) => {
      console.log("something went wrong");
    },
  });
};

export default useJoinNewsletterMutation;
