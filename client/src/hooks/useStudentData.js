import { useQuery } from "@tanstack/react-query";

// TODO: API endpoint "/api/student/overview" does not exist yet
const getStudentData = async () => {
  const res = await fetch("/api/student/overview");
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
