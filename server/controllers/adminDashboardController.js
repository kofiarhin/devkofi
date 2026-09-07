const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { getSlotEnd, isValidBookableSlot } = require('../utils/bookingSlots');

const BOOKING_STATUSES = new Set(['booked', 'cancelled']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const isDuplicateKeyError = (error) => error?.code === 11000;
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const buildSearchQuery = (search, fields) => {
  const normalizedSearch = String(search || '').trim();
  if (!normalizedSearch) return {};

  const escaped = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(escaped, 'i');
  return { $or: fields.map((field) => ({ [field]: pattern })) };
};

const toExportRows = (subscribers = []) =>
  subscribers.map((subscriber) => ({
    email: subscriber.email,
    verified: subscriber.verified ? 'yes' : 'no',
    subscribedAt: new Date(subscriber.createdAt).toISOString(),
  }));

const getExportFilename = (extension) => {
  const date = new Date().toISOString().slice(0, 10);
  return `newsletter-subscribers-${date}.${extension}`;
};

const escapeCsvValue = (value) => {
  const normalized = String(value ?? '');
  if (!/[",\n]/.test(normalized)) return normalized;
  return `"${normalized.replace(/"/g, '""')}"`;
};

const toBookingRow = (booking) => ({
  id: booking._id.toString(),
  name: booking.name,
  email: booking.email,
  company: booking.company,
  message: booking.message,
  slotStart: booking.slotStart.toISOString(),
  slotEnd: booking.slotEnd.toISOString(),
  status: booking.status,
  createdAt: booking.createdAt.toISOString(),
  updatedAt: booking.updatedAt.toISOString(),
});

const getBookingOrError = async (bookingId, res) => {
  if (!isValidObjectId(bookingId)) {
    res.status(400).json({ success: false, error: 'Invalid booking id' });
    return null;
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404).json({ success: false, error: 'Booking not found' });
    return null;
  }

  return booking;
};

const getContactMessageOrError = async (messageId, res) => {
  if (!isValidObjectId(messageId)) {
    res.status(400).json({ success: false, error: 'Invalid message id' });
    return null;
  }

  const message = await ContactMessage.findById(messageId);
  if (!message) {
    res.status(404).json({ success: false, error: 'Message not found' });
    return null;
  }

  return message;
};

const getNewsletterSubscriberOrError = async (subscriberId, res) => {
  if (!isValidObjectId(subscriberId)) {
    res.status(400).json({ success: false, error: 'Invalid subscriber id' });
    return null;
  }

  const subscriber = await NewsletterSubscriber.findById(subscriberId);
  if (!subscriber) {
    res.status(404).json({ success: false, error: 'Subscriber not found' });
    return null;
  }

  return subscriber;
};

const parseDateFilter = (value, label, res) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    res.status(400).json({ success: false, error: `Invalid ${label} date` });
    return false;
  }

  return date;
};

const buildBookingListQuery = (reqQuery, res) => {
  const query = {};
  const { status, from, to, search } = reqQuery;

  if (status && status !== 'all') {
    if (!BOOKING_STATUSES.has(status)) {
      res.status(400).json({ success: false, error: 'Invalid booking status' });
      return null;
    }
    query.status = status;
  }

  const fromDate = parseDateFilter(from, 'from', res);
  if (fromDate === false) return null;

  const toDate = parseDateFilter(to, 'to', res);
  if (toDate === false) return null;

  if (fromDate || toDate) {
    query.slotStart = {};
    if (fromDate) query.slotStart.$gte = fromDate;
    if (toDate) query.slotStart.$lte = toDate;
  }

  Object.assign(query, buildSearchQuery(search, ['name', 'email', 'company']));
  return query;
};

const findActiveSlotConflict = async ({ bookingId, slotStart }) =>
  Booking.findOne({
    _id: { $ne: bookingId },
    slotStart,
    status: 'booked',
  }).select('_id');

const getNormalizedBookingPatch = (body, existingBooking, res) => {
  const patch = {};
  const nextStatus = body.status === undefined ? existingBooking.status : String(body.status).trim();

  if (body.status !== undefined && !BOOKING_STATUSES.has(nextStatus)) {
    res.status(400).json({ success: false, error: 'Invalid booking status' });
    return null;
  }

  if (body.name !== undefined) {
    const name = String(body.name || '').trim();
    if (!name) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return null;
    }
    patch.name = name;
  }

  if (body.email !== undefined) {
    const email = normalizeEmail(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) {
      res.status(400).json({ success: false, error: 'A valid email is required' });
      return null;
    }
    patch.email = email;
  }

  if (body.company !== undefined) patch.company = String(body.company || '').trim();
  if (body.message !== undefined) patch.message = String(body.message || '').trim();
  if (body.status !== undefined) patch.status = nextStatus;

  if (body.slotStart !== undefined) {
    const slotStart = new Date(body.slotStart);
    if (Number.isNaN(slotStart.getTime())) {
      res.status(400).json({ success: false, error: 'A valid slotStart is required' });
      return null;
    }

    if (!isValidBookableSlot(slotStart)) {
      res.status(400).json({ success: false, error: 'Slot is outside bookable hours' });
      return null;
    }

    patch.slotStart = slotStart;
    patch.slotEnd = getSlotEnd(slotStart);
  }

  const finalStatus = patch.status || existingBooking.status;
  const finalSlotStart = patch.slotStart || existingBooking.slotStart;

  if (finalStatus === 'booked' && finalSlotStart <= new Date()) {
    res.status(400).json({ success: false, error: 'Slot must be in the future' });
    return null;
  }

  return patch;
};

const getNormalizedContactMessagePatch = (body, res) => {
  const patch = {};

  if (body.name !== undefined) {
    const name = String(body.name || '').trim();
    if (!name) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return null;
    }
    patch.name = name;
  }

  if (body.email !== undefined) {
    const email = normalizeEmail(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) {
      res.status(400).json({ success: false, error: 'A valid email is required' });
      return null;
    }
    patch.email = email;
  }

  if (body.subject !== undefined) {
    const subject = String(body.subject || '').trim();
    if (!subject) {
      res.status(400).json({ success: false, error: 'Subject is required' });
      return null;
    }
    patch.subject = subject;
  }

  if (body.message !== undefined) {
    const message = String(body.message || '').trim();
    if (!message) {
      res.status(400).json({ success: false, error: 'Message is required' });
      return null;
    }
    patch.message = message;
  }

  if (body.isRead !== undefined) {
    patch.isRead = Boolean(body.isRead);
    patch.readAt = patch.isRead ? new Date() : null;
  }

  return patch;
};

const getNormalizedSubscriberPatch = (body, res) => {
  const patch = {};

  if (body.email !== undefined) {
    const email = normalizeEmail(body.email);
    if (!email || !EMAIL_PATTERN.test(email)) {
      res.status(400).json({ success: false, error: 'A valid email is required' });
      return null;
    }
    patch.email = email;
  }

  if (body.verified !== undefined) {
    patch.verified = Boolean(body.verified);
    patch.verifiedAt = patch.verified ? new Date() : null;
    if (patch.verified) {
      patch.verifyToken = undefined;
      patch.verifyTokenExpiresAt = undefined;
    }
  }

  return patch;
};

const getContactMessages = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const query = buildSearchQuery(req.query.search, ['name', 'email', 'subject', 'message']);

  if (req.query.isRead === 'true') query.isRead = true;
  if (req.query.isRead === 'false') query.isRead = false;

  const [messages, total] = await Promise.all([
    ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(query),
  ]);

  return res.status(200).json({ success: true, data: { messages, page, limit, total } });
};

const getContactMessageById = async (req, res) => {
  const message = await getContactMessageOrError(req.params.messageId, res);
  if (!message) return undefined;

  if (!message.isRead) {
    message.isRead = true;
    message.readAt = new Date();
    await message.save();
  }

  return res.status(200).json({ success: true, data: { message } });
};

const updateContactMessage = async (req, res) => {
  const message = await getContactMessageOrError(req.params.messageId, res);
  if (!message) return undefined;

  const patch = getNormalizedContactMessagePatch(req.body, res);
  if (!patch) return undefined;

  Object.assign(message, patch);
  await message.save();

  return res.status(200).json({ success: true, data: { message } });
};

const deleteContactMessage = async (req, res) => {
  const message = await getContactMessageOrError(req.params.messageId, res);
  if (!message) return undefined;

  await message.deleteOne();
  return res.status(200).json({ success: true });
};

const getNewsletterSubscribers = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const query = buildSearchQuery(req.query.search, ['email']);

  if (req.query.verified === 'true') query.verified = true;
  if (req.query.verified === 'false') query.verified = false;

  const [subscribers, total] = await Promise.all([
    NewsletterSubscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    NewsletterSubscriber.countDocuments(query),
  ]);

  return res.status(200).json({ success: true, data: { subscribers, page, limit, total } });
};

const updateNewsletterSubscriber = async (req, res) => {
  try {
    const subscriber = await getNewsletterSubscriberOrError(req.params.subscriberId, res);
    if (!subscriber) return undefined;

    const patch = getNormalizedSubscriberPatch(req.body, res);
    if (!patch) return undefined;

    Object.assign(subscriber, patch);
    await subscriber.save();

    return res.status(200).json({ success: true, data: { subscriber } });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({ success: false, error: 'Subscriber email already exists' });
    }
    throw error;
  }
};

const deleteNewsletterSubscriber = async (req, res) => {
  const subscriber = await getNewsletterSubscriberOrError(req.params.subscriberId, res);
  if (!subscriber) return undefined;

  await subscriber.deleteOne();
  return res.status(200).json({ success: true });
};

const getBookings = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const query = buildBookingListQuery(req.query, res);

  if (!query) return undefined;

  const [bookings, total] = await Promise.all([
    Booking.find(query).sort({ slotStart: 1 }).skip(skip).limit(limit),
    Booking.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    data: { bookings: bookings.map(toBookingRow), page, limit, total },
  });
};

const getBookingById = async (req, res) => {
  const booking = await getBookingOrError(req.params.bookingId, res);
  if (!booking) return undefined;

  return res.status(200).json({ success: true, data: { booking: toBookingRow(booking) } });
};

const updateBooking = async (req, res) => {
  try {
    const booking = await getBookingOrError(req.params.bookingId, res);
    if (!booking) return undefined;

    const patch = getNormalizedBookingPatch(req.body, booking, res);
    if (!patch) return undefined;

    const finalStatus = patch.status || booking.status;
    const finalSlotStart = patch.slotStart || booking.slotStart;

    if (finalStatus === 'booked') {
      const conflict = await findActiveSlotConflict({ bookingId: booking._id, slotStart: finalSlotStart });
      if (conflict) {
        return res.status(409).json({ success: false, error: 'This slot is no longer available' });
      }
    }

    Object.assign(booking, patch);
    await booking.save();

    return res.status(200).json({ success: true, data: { booking: toBookingRow(booking) } });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({ success: false, error: 'This slot is no longer available' });
    }
    throw error;
  }
};

const cancelBooking = async (req, res) => {
  const booking = await getBookingOrError(req.params.bookingId, res);
  if (!booking) return undefined;

  booking.status = 'cancelled';
  await booking.save();

  return res.status(200).json({ success: true, data: { booking: toBookingRow(booking) } });
};

const deleteBooking = async (req, res) => {
  const booking = await getBookingOrError(req.params.bookingId, res);
  if (!booking) return undefined;

  await booking.deleteOne();
  return res.status(200).json({ success: true });
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

  const header = 'email,verified,subscribedAt';
  const lines = rows.map((row) =>
    `${escapeCsvValue(row.email)},${escapeCsvValue(row.verified)},${escapeCsvValue(row.subscribedAt)}`
  );
  const csv = `${header}\n${lines.join('\n')}${lines.length ? '\n' : ''}`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  return res.status(200).send(csv);
};

module.exports = {
  cancelBooking,
  deleteBooking,
  deleteContactMessage,
  deleteNewsletterSubscriber,
  getBookingById,
  getBookings,
  getContactMessages,
  getContactMessageById,
  getNewsletterSubscribers,
  updateBooking,
  updateContactMessage,
  updateNewsletterSubscriber,
  exportNewsletterSubscribersJson,
  exportNewsletterSubscribersCsv,
};
