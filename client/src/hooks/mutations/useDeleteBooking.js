import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking } from '../../services/adminService';

const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => deleteBooking(bookingId),
    onSuccess: (_data, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.removeQueries({ queryKey: ['adminBooking', bookingId] });
    },
  });
};

export default useDeleteBooking;
