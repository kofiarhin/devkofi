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
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
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

const parseDateFilter = (value, label, res) => {
  if (!value) {
    return null;
  }

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
  if (fromDate === false) {
    return null;
  }

  const toDate = parseDateFilter(to, 'to', res);
  if (toDate === false) {
    return null;
  }

  if (fromDate || toDate) {
    query.slotStart = {};
    if (fromDate) {
      query.slotStart.$gte = fromDate;
    }
    if (toDate) {
      query.slotStart.$lte = toDate;
    }
  }

  const normalizedSearch = String(search || '').trim();
  if (normalizedSearch) {
    const escaped = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'i');
    query.$or = [{ name: pattern }, { email: pattern }, { company: pattern }];
  }

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
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !EMAIL_PATTERN.test(email)) {
      res.status(400).json({ success: false, error: 'A valid email is required' });
      return null;
    }
    patch.email = email;
  }

  if (body.company !== undefined) {
    patch.company = String(body.company || '').trim();
  }

  if (body.message !== undefined) {
    patch.message = String(body.message || '').trim();
  }

  if (body.status !== undefined) {
    patch.status = nextStatus;
  }

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

  if (finalStatus === 'booked') {
    if (finalSlotStart <= new Date()) {
      res.status(400).json({ success: false, error: 'Slot must be in the future' });
      return null;
    }
  }

  return patch;
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

const getBookings = async (req, res) => {
  const query = {};
  const { page, limit, skip } = parsePagination(req.query);
  const bookingQuery = buildBookingListQuery(req.query, res);

  if (!bookingQuery) {
    return undefined;
  }

  Object.assign(query, bookingQuery);

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

  if (!booking) {
    return undefined;
  }

  return res.status(200).json({
    success: true,
    data: { booking: toBookingRow(booking) },
  });
};

const updateBooking = async (req, res) => {
  try {
    const booking = await getBookingOrError(req.params.bookingId, res);

    if (!booking) {
      return undefined;
    }

    const patch = getNormalizedBookingPatch(req.body, booking, res);

    if (!patch) {
      return undefined;
    }

    const finalStatus = patch.status || booking.status;
    const finalSlotStart = patch.slotStart || booking.slotStart;

    if (finalStatus === 'booked') {
      const conflict = await findActiveSlotConflict({
        bookingId: booking._id,
        slotStart: finalSlotStart,
      });

      if (conflict) {
        return res.status(409).json({ success: false, error: 'This slot is no longer available' });
      }
    }

    Object.assign(booking, patch);
    await booking.save();

    return res.status(200).json({
      success: true,
      data: { booking: toBookingRow(booking) },
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({ success: false, error: 'This slot is no longer available' });
    }
    throw error;
  }
};

const cancelBooking = async (req, res) => {
  const booking = await getBookingOrError(req.params.bookingId, res);

  if (!booking) {
    return undefined;
  }

  booking.status = 'cancelled';
  await booking.save();

  return res.status(200).json({
    success: true,
    data: { booking: toBookingRow(booking) },
  });
};

const deleteBooking = async (req, res) => {
  const booking = await getBookingOrError(req.params.bookingId, res);

  if (!booking) {
    return undefined;
  }

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

  const header = 'email,subscribedAt';
  const lines = rows.map((row) => `${escapeCsvValue(row.email)},${escapeCsvValue(row.subscribedAt)}`);
  const csv = `${header}\n${lines.join('\n')}${lines.length ? '\n' : ''}`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  return res.status(200).send(csv);
};

module.exports = {
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
};
