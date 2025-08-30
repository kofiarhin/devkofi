import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";
// TODO: API endpoint "/api/student/overview" does not exist yet
const getStudentData = async () => {
  const url = import.meta.env.DEV
    ? "/api/admin/users"
    : `${baseUrl}/api/admin/users`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const useStudentData = () => {
  return useQuery({
    queryKey: ["studentData"],
    queryFn: getStudentData,
  });
};

export default useStudentData;
