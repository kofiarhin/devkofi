import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getContactMessages } from '../../services/adminService';

const useContactMessages = (params = {}) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['contactMessages', params],
    queryFn: () => getContactMessages(params),
    enabled: !!admin,
  });
};

export default useContactMessages;
