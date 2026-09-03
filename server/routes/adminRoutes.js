const express = require('express');
const rateLimit = require('express-rate-limit');
const { loginAdmin, logoutAdmin, getAdminSession } = require('../controllers/adminAuthController');
const {
  cancelBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  getContactMessageById,
  updateBooking,
  exportNewsletterSubscribersJson,
  exportNewsletterSubscribersCsv,
} = require('../controllers/adminDashboardController');
const { getAdminOverview } = require('../controllers/adminOverviewController');
const {
  archiveArticle,
  createArticle,
  getArticleById,
  listArticles,
  publishArticle,
  restoreArticle,
  unpublishArticle,
  updateArticle,
} = require('../controllers/adminArticlesController');
const {
  archiveMessage,
  listMessages,
  restoreMessage,
  setReadState,
} = require('../controllers/adminMessagesController');
const { deleteSubscriber, listSubscribers } = require('../controllers/adminSubscribersController');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const requireTrustedAdminOrigin = require('../middleware/requireTrustedAdminOrigin');
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
router.use(requireTrustedAdminOrigin);
router.get('/overview', requireAdminAuth, getAdminOverview);
router.get('/articles', requireAdminAuth, listArticles);
router.post('/articles', requireAdminAuth, createArticle);
router.get('/articles/:articleId', requireAdminAuth, getArticleById);
router.patch('/articles/:articleId', requireAdminAuth, updateArticle);
router.post('/articles/:articleId/publish', requireAdminAuth, publishArticle);
router.post('/articles/:articleId/unpublish', requireAdminAuth, unpublishArticle);
router.post('/articles/:articleId/archive', requireAdminAuth, archiveArticle);
router.post('/articles/:articleId/restore', requireAdminAuth, restoreArticle);
router.get('/bookings', requireAdminAuth, getBookings);
router.get('/bookings/:bookingId', requireAdminAuth, getBookingById);
router.patch('/bookings/:bookingId', requireAdminAuth, updateBooking);
router.patch('/bookings/:bookingId/cancel', requireAdminAuth, cancelBooking);
router.delete('/bookings/:bookingId', requireAdminAuth, deleteBooking);
router.get('/contact-messages', requireAdminAuth, listMessages);
router.get('/contact-messages/:messageId', requireAdminAuth, getContactMessageById);
router.patch('/contact-messages/:messageId/read-state', requireAdminAuth, setReadState);
router.post('/contact-messages/:messageId/archive', requireAdminAuth, archiveMessage);
router.post('/contact-messages/:messageId/restore', requireAdminAuth, restoreMessage);
router.get('/newsletter-subscribers', requireAdminAuth, listSubscribers);
router.delete('/newsletter-subscribers/:subscriberId', requireAdminAuth, deleteSubscriber);
router.get('/newsletter/export/csv', requireAdminAuth, exportNewsletterSubscribersCsv);
router.get('/newsletter/export/json', requireAdminAuth, exportNewsletterSubscribersJson);

module.exports = router;
