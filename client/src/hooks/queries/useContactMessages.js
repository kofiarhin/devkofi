import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getContactMessages } from '../../services/adminService';

const useContactMessages = (page = 1) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['contactMessages', page],
    queryFn: () => getContactMessages(page),
    enabled: !!admin,
  });
};

export default useContactMessages;
