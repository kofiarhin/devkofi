import api from '../lib/api';

export const loginAdmin = (email, password) =>
  api.post('/api/admin/auth/login', { email, password });

export const logoutAdmin = () =>
  api.post('/api/admin/auth/logout');

export const getAdminSession = () =>
  api.get('/api/admin/auth/me');

export const getContactMessages = (page = 1, limit = 20) =>
  api.get('/api/admin/contact-messages', { params: { page, limit } });

export const getContactMessageById = (messageId) =>
  api.get(`/api/admin/contact-messages/${messageId}`);

export const getNewsletterSubscribers = (page = 1, limit = 20) =>
  api.get('/api/admin/newsletter-subscribers', { params: { page, limit } });

export const exportNewsletterSubscribersCsv = () =>
  api.get('/api/admin/newsletter/export/csv', { responseType: 'blob' });

export const exportNewsletterSubscribersJson = () =>
  api.get('/api/admin/newsletter/export/json', { responseType: 'blob' });
