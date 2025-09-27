import { useMutation } from "@tanstack/react-query";
import { buildApiUrl } from "../lib/api";

export const joinNewsletter = async (data) => {
  const url = buildApiUrl("/api/newsletter");
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
  });
};

export default useJoinNewsletterMutation;
