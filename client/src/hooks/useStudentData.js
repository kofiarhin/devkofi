import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "../lib/api";
// TODO: API endpoint "/api/student/overview" does not exist yet
const getStudentData = async () => {
  const url = buildApiUrl("/api/admin/users");
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
