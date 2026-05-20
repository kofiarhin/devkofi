import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContactMessage } from '../../services/adminService';

const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => deleteContactMessage(messageId),
    onSuccess: (_data, messageId) => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      queryClient.removeQueries({ queryKey: ['contactMessage', messageId] });
    },
  });
};

export default useDeleteContactMessage;
