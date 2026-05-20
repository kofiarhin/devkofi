import api from '../lib/api';

export const loginAdmin = (email, password) =>
  api.post('/api/admin/auth/login', { email, password });

export const logoutAdmin = () =>
  api.post('/api/admin/auth/logout');

export const getAdminSession = () =>
  api.get('/api/admin/auth/me');

export const getContactMessages = (params = {}) =>
  api.get('/api/admin/contact-messages', { params });

export const getContactMessageById = (messageId) =>
  api.get(`/api/admin/contact-messages/${messageId}`);

export const updateContactMessage = (messageId, payload) =>
  api.patch(`/api/admin/contact-messages/${messageId}`, payload);

export const deleteContactMessage = (messageId) =>
  api.delete(`/api/admin/contact-messages/${messageId}`);

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

export const getNewsletterSubscribers = (params = {}) =>
  api.get('/api/admin/newsletter-subscribers', { params });

export const updateNewsletterSubscriber = (subscriberId, payload) =>
  api.patch(`/api/admin/newsletter-subscribers/${subscriberId}`, payload);

export const deleteNewsletterSubscriber = (subscriberId) =>
  api.delete(`/api/admin/newsletter-subscribers/${subscriberId}`);

export const exportNewsletterSubscribersCsv = () =>
  api.get('/api/admin/newsletter/export/csv', { responseType: 'blob' });

export const exportNewsletterSubscribersJson = () =>
  api.get('/api/admin/newsletter/export/json', { responseType: 'blob' });
