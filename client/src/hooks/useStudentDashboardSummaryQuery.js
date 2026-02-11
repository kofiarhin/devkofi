import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const API_BASE = String(baseUrl || "").replace(/\/$/, "");

const getTokenFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.token || "";
  } catch {
    return "";
  }
};

const fetchSummary = async (token) => {
  const auth = token || getTokenFromStorage();
  const res = await fetch(`${API_BASE}/api/dashboard/student-summary`, {
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data?.error || "Failed to load dashboard summary.");
  return data;
};

const useStudentDashboardSummaryQuery = (token) => {
  return useQuery({
    queryKey: ["student-dashboard-summary"],
    queryFn: () => fetchSummary(token),
    staleTime: 60_000,
    retry: 1,
  });
};

export default useStudentDashboardSummaryQuery;
