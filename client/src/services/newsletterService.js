import api from "../lib/api";

export const subscribeToNewsletter = async ({ email }) => {
  const response = await api.post("/api/newsletter/subscribe", { email });
  return response.data;
};

export const verifyNewsletter = async ({ token }) => {
  try {
    const response = await api.get("/api/newsletter/verify", {
      params: { token },
    });
    return response.data;
  } catch (error) {
    const body = error?.response?.data;
    if (body && typeof body === "object" && body.status) {
      return body;
    }
    throw error;
  }
};

export const getNewsletterErrorMessage = (error) => {
  return (
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};
