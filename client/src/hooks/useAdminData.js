import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminArticle, deleteNewsletterSubscriber, getAdminArticle, getAdminArticles,
  getAdminOverview, getContactMessages, getNewsletterSubscribers, transitionAdminArticle,
  transitionContactMessage, updateAdminArticle, updateContactMessageReadState,
} from '../services/adminService';

const invalidateAdmin = (client, keys) => {
  client.invalidateQueries({ queryKey: ['adminOverview'] });
  keys.forEach((key) => client.invalidateQueries({ queryKey: [key] }));
};

export const useAdminOverview = () => useQuery({ queryKey: ['adminOverview'], queryFn: getAdminOverview });
export const useAdminArticles = (filters) => useQuery({ queryKey: ['adminArticles', filters], queryFn: () => getAdminArticles(filters) });
export const useAdminArticle = (id) => useQuery({ queryKey: ['adminArticle', id], queryFn: () => getAdminArticle(id), enabled: Boolean(id) });
export const useSaveAdminArticle = (id) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload) => id ? updateAdminArticle(id, payload) : createAdminArticle(payload),
    onSuccess: () => invalidateAdmin(client, ['adminArticles', 'adminArticle']),
  });
};
export const useArticleTransition = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, action }) => transitionAdminArticle(id, action), onSuccess: () => invalidateAdmin(client, ['adminArticles', 'adminArticle', 'blogPosts']) });
};
export const useAdminMessages = (filters) => useQuery({ queryKey: ['adminMessages', filters], queryFn: () => getContactMessages(filters) });
export const useMessageMutation = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, action, isRead }) => action === 'read-state' ? updateContactMessageReadState(id, isRead) : transitionContactMessage(id, action), onSuccess: () => invalidateAdmin(client, ['adminMessages', 'contactMessages', 'contactMessage']) });
};
export const useAdminSubscribers = (filters) => useQuery({ queryKey: ['adminSubscribers', filters], queryFn: () => getNewsletterSubscribers(filters) });
export const useDeleteSubscriber = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: deleteNewsletterSubscriber, onSuccess: () => invalidateAdmin(client, ['adminSubscribers', 'newsletterSubscribers']) });
};
