import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "../lib/api";

const getTemplates = async () => {
  try {
    const url = buildApiUrl("/api/templates");
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};
const useTemplateQuery = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });
};

export default useTemplateQuery;
