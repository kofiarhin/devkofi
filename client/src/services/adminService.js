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

export const getNewsletterSubscribers = (page = 1, limit = 20) =>
  api.get('/api/admin/newsletter-subscribers', { params: { page, limit } });

export const exportNewsletterSubscribersCsv = () =>
  api.get('/api/admin/newsletter/export/csv', { responseType: 'blob' });

export const exportNewsletterSubscribersJson = () =>
  api.get('/api/admin/newsletter/export/json', { responseType: 'blob' });
