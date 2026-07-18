const { sendContactEmail } = require("../utils/emailService");
const { sendContactTelegramNotification } = require("../utils/telegramService");
const ContactMessage = require("../models/ContactMessage");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

async function postContact(req, res, next) {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const subject = typeof req.body.subject === "string" ? req.body.subject.trim() : "";
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "A valid email address is required." });
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      subject.length > MAX_SUBJECT_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return res
        .status(400)
        .json({ success: false, error: "One or more fields exceed the allowed length." });
    }

    // Save to DB first — this is the source of truth
    const contact = await ContactMessage.create({ name, email, subject, message });

    res.status(200).json({ success: true, message: "Message sent." });

    // Notifications are best-effort and never affect the successful response.
    sendContactEmail({ name, email, subject, message }).catch((err) => {
      console.error("[contact] email:", err.message);
    });

    sendContactTelegramNotification(contact).catch((err) => {
      console.error("[telegram] contact:", err.message);
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postContact };
