import { baseUrl } from "../constants/constants";
import { useQuery } from "@tanstack/react-query";

const getCourses = async () => {
  const res = await fetch(`${baseUrl}/api/courses`);
  const data = await res.json();
  return data;
};

const useCourseQuery = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};

export default useCourseQuery;
