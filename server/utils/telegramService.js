const axios = require("axios");

const TELEGRAM_API_BASE_URL = "https://api.telegram.org";
const TELEGRAM_TIMEOUT_MS = 5000;
const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;
const TELEGRAM_MESSAGE_CHUNK_LENGTH = 4000;

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

const getTextLength = (value) => Array.from(String(value ?? "")).length;

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

const getTelegramThreadId = (notificationType) => {
  if (notificationType !== "contact") {
    return undefined;
  }

  const value = process.env.TELEGRAM_CONTACT_THREAD_ID?.trim();

  if (!value || !/^[1-9]\d*$/.test(value)) {
    return undefined;
  }

  const threadId = Number(value);
  return Number.isSafeInteger(threadId) ? threadId : undefined;
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

const buildContactMetadataNotification = (contact) =>
  [
    "<b>📩 New DevKofi Contact Message</b>",
    "",
    `<b>Name:</b> ${escapeHtml(contact.name)}`,
    `<b>Email:</b> ${escapeHtml(contact.email)}`,
    `<b>Subject:</b> ${escapeHtml(contact.subject)}`,
    "",
    `<b>Contact ID:</b> <code>${escapeHtml(contact._id)}</code>`,
    `<b>Submitted:</b> ${escapeHtml(formatDate(contact.createdAt))}`,
  ].join("\n");

const splitTelegramText = (
  value,
  maxEscapedLength = TELEGRAM_MESSAGE_CHUNK_LENGTH
) => {
  const chunks = [];
  let chunk = [];
  let escapedLength = 0;

  for (const character of Array.from(String(value ?? ""))) {
    const characterLength = getTextLength(escapeHtml(character));

    if (chunk.length > 0 && escapedLength + characterLength > maxEscapedLength) {
      chunks.push(chunk.join(""));
      chunk = [];
      escapedLength = 0;
    }

    chunk.push(character);
    escapedLength += characterLength;
  }

  if (chunk.length > 0 || chunks.length === 0) {
    chunks.push(chunk.join(""));
  }

  return chunks;
};

const buildContactNotificationParts = (contact) => {
  const completeNotification = buildContactNotification(contact);

  if (getTextLength(completeNotification) <= TELEGRAM_MAX_MESSAGE_LENGTH) {
    return [completeNotification];
  }

  const messageChunks = splitTelegramText(contact.message);

  return [
    buildContactMetadataNotification(contact),
    ...messageChunks.map(
      (messageChunk, index) =>
        `<b>Message (${index + 1}/${messageChunks.length}):</b>\n${escapeHtml(
          messageChunk
        )}`
    ),
  ];
};

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
    console.warn(
      `[telegram] ${notificationType}: notifications disabled or not configured`
    );
    return { skipped: true };
  }

  const threadId = getTelegramThreadId(notificationType);
  const messages = Array.isArray(text) ? text : [text];

  for (const message of messages) {
    await axios.post(
      `${TELEGRAM_API_BASE_URL}/bot${config.botToken}/sendMessage`,
      {
        chat_id: config.chatId,
        ...(threadId ? { message_thread_id: threadId } : {}),
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
      { timeout: TELEGRAM_TIMEOUT_MS }
    );
  }

  return { skipped: false };
};

const sendContactTelegramNotification = (contact) =>
  sendTelegramNotification(
    "contact",
    buildContactNotificationParts(contact)
  );

const sendBookingTelegramNotification = (booking) =>
  sendTelegramNotification("booking", buildBookingNotification(booking));

module.exports = {
  TELEGRAM_MAX_MESSAGE_LENGTH,
  TELEGRAM_MESSAGE_CHUNK_LENGTH,
  TELEGRAM_TIMEOUT_MS,
  buildBookingNotification,
  buildContactNotification,
  buildContactNotificationParts,
  escapeHtml,
  getTelegramThreadId,
  sendBookingTelegramNotification,
  sendContactTelegramNotification,
  sendTelegramNotification,
  splitTelegramText,
};
