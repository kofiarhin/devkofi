import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../services/services";
import { useNavigate } from "react-router-dom";

const usecontactMutation = () => {
  return useMutation({
    mutationKey: ["contact"],
    mutationFn: (data) => sendMessage(data),
    onSuccess: (data) => {
      console.log("email sent successfully");
    },
  });
};

export default usecontactMutation;
