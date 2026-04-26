import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getBookingById } from '../../services/adminService';

const useAdminBooking = (bookingId) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['adminBooking', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!admin && !!bookingId,
  });
};

export default useAdminBooking;
