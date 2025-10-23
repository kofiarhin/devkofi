import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from '../services/feedbackService.js';

export const useFeedback = () => {
  return useMutation({
    mutationFn: submitFeedback,
  });
};
