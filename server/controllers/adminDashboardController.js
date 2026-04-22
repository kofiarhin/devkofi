const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getContactMessages = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [messages, total] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(),
  ]);

  return res.status(200).json({
    success: true,
    data: { messages, page, limit, total },
  });
};

const getNewsletterSubscribers = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [subscribers, total] = await Promise.all([
    NewsletterSubscriber.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    NewsletterSubscriber.countDocuments(),
  ]);

  return res.status(200).json({
    success: true,
    data: { subscribers, page, limit, total },
  });
};

module.exports = { getContactMessages, getNewsletterSubscribers };
