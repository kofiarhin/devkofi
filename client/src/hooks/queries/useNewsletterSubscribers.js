import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getNewsletterSubscribers } from '../../services/adminService';

const useNewsletterSubscribers = (page = 1) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['newsletterSubscribers', page],
    queryFn: () => getNewsletterSubscribers(page),
    enabled: !!admin,
  });
};

export default useNewsletterSubscribers;
