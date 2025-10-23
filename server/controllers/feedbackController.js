const Feedback = require('../Model/feedbackModel');

const RATE_LIMIT_WINDOW_MS = 1000 * 60;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map();

const cleanOldEntries = (now) => {
  rateLimitStore.forEach((timestamps, key) => {
    const recent = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (recent.length) {
      rateLimitStore.set(key, recent);
    } else {
      rateLimitStore.delete(key);
    }
  });
};

const create = async (req, res) => {
  try {
    const { sentiment, message } = req.body;
    if (!['up', 'down'].includes(sentiment)) {
      return res.status(400).json({ message: 'Invalid sentiment value' });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    const trimmed = message.trim();
    if (!trimmed) {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    const now = Date.now();
    cleanOldEntries(now);
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const timestamps = rateLimitStore.get(key) || [];
    if (timestamps.length >= RATE_LIMIT_MAX) {
      return res.status(429).json({ message: 'Too many feedback submissions. Try again later.' });
    }
    rateLimitStore.set(key, [...timestamps, now]);

    const feedback = await Feedback.create({
      sentiment,
      message: trimmed,
      source: req.body.source || 'web',
      metadata: req.body.metadata,
    });

    return res.status(201).json({
      id: feedback.id,
      sentiment: feedback.sentiment,
      message: feedback.message,
      createdAt: feedback.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const escapeCsvValue = (value) => {
  if (value == null) {
    return '';
  }
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const exportCsv = async (_req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
    const header = ['id', 'sentiment', 'message', 'source', 'createdAt'];
    const rows = feedback.map((entry) =>
      [entry._id, entry.sentiment, entry.message, entry.source, entry.createdAt.toISOString()].map(escapeCsvValue).join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="feedback.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  exportCsv,
};
