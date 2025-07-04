import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const getTemplates = async () => {
  try {
    const surfix = "/api/templates";
    const url = import.meta.env.DEV ? surfix : `${baseUrl}${surfix}`;
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
  return { data: "get templates" };
};
const useTemplateQuery = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });
};

export default useTemplateQuery;
