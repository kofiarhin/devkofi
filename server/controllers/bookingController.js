const Booking = require("../models/Booking");
const {
  SLOT_DURATION_MINUTES,
  generateWeekSlots,
  getSlotEnd,
  getWeekMonday,
  isValidBookableSlot,
} = require("../utils/bookingSlots");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toBookingResponse = (booking) => ({
  id: booking._id.toString(),
  name: booking.name,
  email: booking.email,
  company: booking.company,
  message: booking.message,
  slotStart: booking.slotStart.toISOString(),
  slotEnd: booking.slotEnd.toISOString(),
  status: booking.status,
  createdAt: booking.createdAt?.toISOString(),
});

const isDuplicateKeyError = (error) => error?.code === 11000;

const getBookingAvailability = async (req, res, next) => {
  try {
    const weekMonday = getWeekMonday(req.query.weekStart);

    if (!weekMonday) {
      return res.status(400).json({
        success: false,
        error: "A valid weekStart query parameter is required",
      });
    }

    const nextWeek = new Date(weekMonday.getTime());
    nextWeek.setUTCDate(weekMonday.getUTCDate() + 7);

    const bookings = await Booking.find({
      status: "booked",
      slotStart: { $gte: weekMonday, $lt: nextWeek },
    }).select("slotStart");

    const bookedSlotStarts = new Set(bookings.map((booking) => booking.slotStart.toISOString()));
    const days = generateWeekSlots(weekMonday, bookedSlotStarts);

    return res.status(200).json({
      success: true,
      timezone: "GMT",
      slotDurationMinutes: SLOT_DURATION_MINUTES,
      days,
    });
  } catch (error) {
    return next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const company = String(req.body.company || "").trim();
    const message = String(req.body.message || "").trim();
    const slotStart = new Date(req.body.slotStart);

    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }

    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ success: false, error: "A valid email is required" });
    }

    if (Number.isNaN(slotStart.getTime())) {
      return res.status(400).json({ success: false, error: "A valid slotStart is required" });
    }

    if (!isValidBookableSlot(slotStart)) {
      return res.status(400).json({ success: false, error: "Slot is outside bookable hours" });
    }

    if (slotStart <= new Date()) {
      return res.status(400).json({ success: false, error: "Slot must be in the future" });
    }

    const slotEnd = getSlotEnd(slotStart);
    const existingBooking = await Booking.findOne({ slotStart, status: "booked" }).select("_id");

    if (existingBooking) {
      return res.status(409).json({ success: false, error: "This slot is no longer available" });
    }

    const booking = await Booking.create({
      name,
      email,
      company,
      message,
      slotStart,
      slotEnd,
    });

    return res.status(201).json({
      success: true,
      booking: toBookingResponse(booking),
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({ success: false, error: "This slot is no longer available" });
    }

    return next(error);
  }
};

module.exports = {
  createBooking,
  getBookingAvailability,
  toBookingResponse,
};
