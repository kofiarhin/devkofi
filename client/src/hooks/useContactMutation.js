import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const sendContactMessage = async (formData) => {
  const res = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }

  return data;
};

const useContactMutation = () => {
  return useMutation({
    mutationFn: (payload) => sendContactMessage(payload),
    mutationKey: ["contact"],
  });
};

export default useContactMutation;
