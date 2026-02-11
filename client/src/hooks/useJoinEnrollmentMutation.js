import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const getStoredToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    return stored?.token || null;
  } catch {
    return null;
  }
};

const joinEnrollment = async ({ slug, token }) => {
  const url = `${baseUrl}/api/enrollments/join/${slug}`;
  const authToken = token || getStoredToken();

  if (!authToken) throw new Error("Not authorized. Please log in again.");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to create enrollment.");
  }

  return data;
};

const useJoinEnrollmentMutation = (token) => {
  return useMutation({
    mutationKey: ["join-enrollment"],
    mutationFn: ({ slug }) => joinEnrollment({ slug, token }),
  });
};

export default useJoinEnrollmentMutation;
