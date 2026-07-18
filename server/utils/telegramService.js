const axios = require("axios");

const TELEGRAM_API_BASE_URL = "https://api.telegram.org";
const TELEGRAM_TIMEOUT_MS = 5000;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toISOString();
};

const isTelegramEnabled = () =>
  String(process.env.TELEGRAM_NOTIFICATIONS_ENABLED).toLowerCase() === "true";

const getTelegramConfig = () => {
  if (!isTelegramEnabled()) {
    return null;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    return null;
  }

  return { botToken, chatId };
};

const buildContactNotification = (contact) =>
  [
    "<b>📩 New DevKofi Contact Message</b>",
    "",
    `<b>Name:</b> ${escapeHtml(contact.name)}`,
    `<b>Email:</b> ${escapeHtml(contact.email)}`,
    `<b>Subject:</b> ${escapeHtml(contact.subject)}`,
    `<b>Message:</b>\n${escapeHtml(contact.message)}`,
    "",
    `<b>Contact ID:</b> <code>${escapeHtml(contact._id)}</code>`,
    `<b>Submitted:</b> ${escapeHtml(formatDate(contact.createdAt))}`,
  ].join("\n");

const buildBookingNotification = (booking) =>
  [
    "<b>🎓 New DevKofi Enrolment</b>",
    "",
    `<b>Applicant:</b> ${escapeHtml(booking.name)}`,
    `<b>Email:</b> ${escapeHtml(booking.email)}`,
    `<b>Company:</b> ${escapeHtml(booking.company || "Not provided")}`,
    `<b>Message:</b>\n${escapeHtml(booking.message || "Not provided")}`,
    "",
    `<b>Starts:</b> ${escapeHtml(formatDate(booking.slotStart))}`,
    `<b>Ends:</b> ${escapeHtml(formatDate(booking.slotEnd))}`,
    `<b>Booking ID:</b> <code>${escapeHtml(booking._id)}</code>`,
    `<b>Submitted:</b> ${escapeHtml(formatDate(booking.createdAt))}`,
  ].join("\n");

const sendTelegramNotification = async (notificationType, text) => {
  const config = getTelegramConfig();

  if (!config) {
    console.warn(`[telegram] ${notificationType}: notifications disabled or not configured`);
    return { skipped: true };
  }

  await axios.post(
    `${TELEGRAM_API_BASE_URL}/bot${config.botToken}/sendMessage`,
    {
      chat_id: config.chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    },
    { timeout: TELEGRAM_TIMEOUT_MS }
  );

  return { skipped: false };
};

const sendContactTelegramNotification = (contact) =>
  sendTelegramNotification("contact", buildContactNotification(contact));

const sendBookingTelegramNotification = (booking) =>
  sendTelegramNotification("booking", buildBookingNotification(booking));

module.exports = {
  TELEGRAM_TIMEOUT_MS,
  buildBookingNotification,
  buildContactNotification,
  escapeHtml,
  sendBookingTelegramNotification,
  sendContactTelegramNotification,
  sendTelegramNotification,
};
