import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getBookings } from '../../services/adminService';

const useAdminBookings = (filters = {}) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['adminBookings', filters],
    queryFn: () => getBookings(filters),
    enabled: !!admin,
  });
};

export default useAdminBookings;
