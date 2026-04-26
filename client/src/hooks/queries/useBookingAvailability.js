import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability } from "../../services/bookingService";

const useBookingAvailability = (weekStart) => {
  return useQuery({
    queryKey: ["bookingAvailability", weekStart],
    queryFn: () => getBookingAvailability(weekStart),
    enabled: Boolean(weekStart),
    staleTime: 30 * 1000,
  });
};

export default useBookingAvailability;
