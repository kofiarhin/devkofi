import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getContactMessageById } from '../../services/adminService';

const useContactMessage = (messageId) => {
  const admin = useSelector((state) => state.auth.admin);

  return useQuery({
    queryKey: ['contactMessage', messageId],
    queryFn: () => getContactMessageById(messageId),
    enabled: !!admin && !!messageId,
    retry: false,
  });
};

export default useContactMessage;
