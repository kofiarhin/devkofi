import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProgress, updateProgress } from '../services/progressService.js';

export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgress,
  });
};

export const useProgressUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProgress,
    onSuccess: (data) => {
      queryClient.setQueryData(['progress'], data);
    },
  });
};
