import { useQuery } from "@tanstack/react-query";
import { getGitHubInfo } from "../services/services";

const useGithubInfoQuery = () => {
  return useQuery({
    queryKey: ["github"],
    queryFn: getGitHubInfo,
  });
};

export default useGithubInfoQuery;
