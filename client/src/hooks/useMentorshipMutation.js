import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";
const joinMentorship = async (data) => {
  try {
    const url = import.meta.env.DEV
      ? "/api/mentorship"
      : `${baseUrl}/api/mentorship`;
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
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
const useMentorshipMutation = () => {
  return useMutation({
    mutationKey: ["join-mentorship"],
    mutationFn: (data) => joinMentorship(data),
    onSuccess: (data) => {
      // console.log("success", data);
    },
  });
};

export default useMentorshipMutation;
