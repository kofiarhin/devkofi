import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "../../services/newsletterService";

const useSubscribeNewsletter = () => {
  return useMutation({
    mutationKey: ["newsletter", "subscribe"],
    mutationFn: subscribeToNewsletter,
  });
};

export default useSubscribeNewsletter;
