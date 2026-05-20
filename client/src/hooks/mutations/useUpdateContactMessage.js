import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContactMessage } from '../../services/adminService';

const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, payload }) => updateContactMessage(messageId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      queryClient.invalidateQueries({ queryKey: ['contactMessage', variables.messageId] });
    },
  });
};

export default useUpdateContactMessage;
