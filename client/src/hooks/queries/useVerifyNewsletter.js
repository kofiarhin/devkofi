import { useQuery } from "@tanstack/react-query";
import { verifyNewsletter } from "../../services/newsletterService";

const useVerifyNewsletter = (token) => {
  return useQuery({
    queryKey: ["newsletter", "verify", token || ""],
    queryFn: () => verifyNewsletter({ token }),
    enabled: Boolean(token),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export default useVerifyNewsletter;
