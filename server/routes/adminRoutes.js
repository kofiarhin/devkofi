const express = require('express');
const rateLimit = require('express-rate-limit');
const { loginAdmin, logoutAdmin, getAdminSession } = require('../controllers/adminAuthController');
const {
  cancelBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  getContactMessages,
  getContactMessageById,
  getNewsletterSubscribers,
  updateBooking,
  exportNewsletterSubscribersJson,
  exportNewsletterSubscribersCsv,
} = require('../controllers/adminDashboardController');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const { loginRateLimit } = require('../config/env');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: loginRateLimit.windowMs,
  max: loginRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts, please try again later' },
});

router.post('/auth/login', loginLimiter, loginAdmin);
router.post('/auth/logout', logoutAdmin);
router.get('/auth/me', getAdminSession);
router.get('/bookings', requireAdminAuth, getBookings);
router.get('/bookings/:bookingId', requireAdminAuth, getBookingById);
router.patch('/bookings/:bookingId', requireAdminAuth, updateBooking);
router.patch('/bookings/:bookingId/cancel', requireAdminAuth, cancelBooking);
router.delete('/bookings/:bookingId', requireAdminAuth, deleteBooking);
router.get('/contact-messages', requireAdminAuth, getContactMessages);
router.get('/contact-messages/:messageId', requireAdminAuth, getContactMessageById);
router.get('/newsletter-subscribers', requireAdminAuth, getNewsletterSubscribers);
router.get('/newsletter/export/csv', requireAdminAuth, exportNewsletterSubscribersCsv);
router.get('/newsletter/export/json', requireAdminAuth, exportNewsletterSubscribersJson);

module.exports = router;
