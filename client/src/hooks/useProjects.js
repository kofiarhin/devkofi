import { baseUrl } from "../constants/constants";
import { useQuery } from "@tanstack/react-query";
const getProjects = async () => {
  const res = await fetch(`${baseUrl}/api/projects`);
  const data = await res.json();
  return data;
};

const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export default useProjects;
