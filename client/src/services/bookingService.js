import api from "../lib/api";

export const getBookingAvailability = async (weekStart) => {
  const response = await api.get("/api/bookings/availability", {
    params: { weekStart },
  });
  return response.data;
};

export const createBooking = async (payload) => {
  const response = await api.post("/api/bookings", payload);
  return response.data;
};

export const getBookingErrorMessage = (error) => {
  if (error?.response?.status === 409) {
    return "This slot is no longer available. Choose another time.";
  }

  return (
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};
