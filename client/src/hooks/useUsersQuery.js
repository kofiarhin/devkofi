import { useQuery } from "@tanstack/react-query";

const getUsers = async (token) => {
  try {
    const res = await fetch("/api/users", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("something went wrong");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
const useUsersQuery = (token) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token),
    enabled: !!token,
  });
};

export default useUsersQuery;
