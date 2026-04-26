import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../../services/bookingService";

const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bookings", "create"],
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingAvailability"] });
    },
  });
};

export default useCreateBooking;
