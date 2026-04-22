import api from "../lib/api";

export const subscribeToNewsletter = async ({ email }) => {
  const response = await api.post("/api/newsletter/subscribe", { email });
  return response.data;
};

export const getNewsletterErrorMessage = (error) => {
  return (
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};
