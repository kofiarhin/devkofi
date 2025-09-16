import { useQuery } from "@tanstack/react-query";

export default function useAdminData(token) {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await fetch("/api/admin/overview", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch admin overview");
      return res.json();
    },
    staleTime: 60_000,
  });
}

// TODO: Backend must provide at /api/admin/overview:
// {
//   "usersCount": number,
//   "coursesCount": number,
//   "messagesCount": number,
//   "paymentsCount": number,
//   "transactionsCount": number
// }
