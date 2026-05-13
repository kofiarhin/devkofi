import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "../../services/templateService";

const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
    staleTime: 5 * 60 * 1000,
  });
};

export default useTemplates;
