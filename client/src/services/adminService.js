import api from '../lib/api';

export const loginAdmin = (email, password) =>
  api.post('/api/admin/auth/login', { email, password });

export const logoutAdmin = () =>
  api.post('/api/admin/auth/logout');

export const getAdminSession = () =>
  api.get('/api/admin/auth/me');

export const getContactMessages = (input = 1, limit = 20) =>
  api.get('/api/admin/contact-messages', { params: typeof input === 'object' ? input : { page: input, limit } });

export const getAdminOverview = () => api.get('/api/admin/overview');

export const getAdminArticles = (params = {}) => api.get('/api/admin/articles', { params });
export const getAdminArticle = (articleId) => api.get(`/api/admin/articles/${articleId}`);
export const createAdminArticle = (payload) => api.post('/api/admin/articles', payload);
export const updateAdminArticle = (articleId, payload) => api.patch(`/api/admin/articles/${articleId}`, payload);
export const transitionAdminArticle = (articleId, action) => api.post(`/api/admin/articles/${articleId}/${action}`);

export const updateContactMessageReadState = (messageId, isRead) =>
  api.patch(`/api/admin/contact-messages/${messageId}/read-state`, { isRead });
export const transitionContactMessage = (messageId, action) =>
  api.post(`/api/admin/contact-messages/${messageId}/${action}`);

export const getContactMessageById = (messageId) =>
  api.get(`/api/admin/contact-messages/${messageId}`);

export const getBookings = (params = {}) =>
  api.get('/api/admin/bookings', { params });

export const getBookingById = (bookingId) =>
  api.get(`/api/admin/bookings/${bookingId}`);

export const updateBooking = (bookingId, payload) =>
  api.patch(`/api/admin/bookings/${bookingId}`, payload);

export const cancelBooking = (bookingId) =>
  api.patch(`/api/admin/bookings/${bookingId}/cancel`);

export const deleteBooking = (bookingId) =>
  api.delete(`/api/admin/bookings/${bookingId}`);

export const getNewsletterSubscribers = (input = 1, limit = 20) =>
  api.get('/api/admin/newsletter-subscribers', { params: typeof input === 'object' ? input : { page: input, limit } });

export const deleteNewsletterSubscriber = (subscriberId) =>
  api.delete(`/api/admin/newsletter-subscribers/${subscriberId}`);

export const exportNewsletterSubscribersCsv = () =>
  api.get('/api/admin/newsletter/export/csv', { responseType: 'blob' });

export const exportNewsletterSubscribersJson = () =>
  api.get('/api/admin/newsletter/export/json', { responseType: 'blob' });
