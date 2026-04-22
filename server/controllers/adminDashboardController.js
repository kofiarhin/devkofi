const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const toExportRows = (subscribers = []) =>
  subscribers.map((subscriber) => ({
    email: subscriber.email,
    subscribedAt: new Date(subscriber.createdAt).toISOString(),
  }));

const getExportFilename = (extension) => {
  const date = new Date().toISOString().slice(0, 10);
  return `newsletter-subscribers-${date}.${extension}`;
};

const escapeCsvValue = (value) => {
  const normalized = String(value ?? '');
  if (!/[",\n]/.test(normalized)) {
    return normalized;
  }
  return `"${normalized.replace(/"/g, '""')}"`;
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

const getContactMessageById = async (req, res) => {
  const { messageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid message id',
    });
  }

  const message = await ContactMessage.findById(messageId);

  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Message not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: { message },
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

const exportNewsletterSubscribersJson = async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
  const rows = toExportRows(subscribers);
  const filename = getExportFilename('json');

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  return res.status(200).send(JSON.stringify(rows, null, 2));
};

const exportNewsletterSubscribersCsv = async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
  const rows = toExportRows(subscribers);
  const filename = getExportFilename('csv');

  const header = 'email,subscribedAt';
  const lines = rows.map((row) => `${escapeCsvValue(row.email)},${escapeCsvValue(row.subscribedAt)}`);
  const csv = `${header}\n${lines.join('\n')}${lines.length ? '\n' : ''}`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  return res.status(200).send(csv);
};

module.exports = {
  getContactMessages,
  getContactMessageById,
  getNewsletterSubscribers,
  exportNewsletterSubscribersJson,
  exportNewsletterSubscribersCsv,
};
