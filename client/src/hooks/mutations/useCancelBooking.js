import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '../../services/adminService';

const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => cancelBooking(bookingId),
    onSuccess: (_data, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBooking', bookingId] });
    },
  });
};

export default useCancelBooking;
