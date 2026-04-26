import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/adminService';

const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, payload }) => updateBooking(bookingId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBooking', variables.bookingId] });
    },
  });
};

export default useUpdateBooking;
