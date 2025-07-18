import { useQuery } from "@tanstack/react-query";

const getUsers = async () => {
  const res = await fetch("/api/admin/users");
  const data = await res.json();
  return data;
};

const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export default useUsers;
