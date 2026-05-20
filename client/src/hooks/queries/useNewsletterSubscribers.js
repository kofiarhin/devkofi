import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getNewsletterSubscribers } from '../../services/adminService';

const useNewsletterSubscribers = (params = {}) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['newsletterSubscribers', params],
    queryFn: () => getNewsletterSubscribers(params),
    enabled: !!admin,
  });
};

export default useNewsletterSubscribers;
