import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

const sendContactMessage = async (formData) => {
  const { data } = await api.post("/api/contact", formData);
  return data;
};

const useContactMutation = () => {
  return useMutation({
    mutationFn: (payload) => sendContactMessage(payload),
    mutationKey: ["contact"],
  });
};

export default useContactMutation;
