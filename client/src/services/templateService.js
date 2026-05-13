import api from "../lib/api";

export const getTemplates = async () => {
  const response = await api.get("/api/templates");
  return Array.isArray(response.data) ? response.data : [];
};

export const getTemplatesErrorMessage = (error) => {
  return (
    error?.response?.data?.error ||
    error?.message ||
    "Templates could not be loaded. Please try again."
  );
};
