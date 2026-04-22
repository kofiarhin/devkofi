const { sendContactEmail } = require("../utils/emailService");
const ContactMessage = require("../models/ContactMessage");

async function postContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }

    // Save to DB first — this is the source of truth
    await ContactMessage.create({ name, email, subject, message });

    // Email is best-effort — don't fail the request if SMTP is misconfigured
    sendContactEmail({ name, email, subject, message }).catch((err) => {
      console.error("[contact] email send failed:", err.message);
    });

    res.status(200).json({ success: true, message: "Message sent." });
  } catch (err) {
    next(err);
  }
}

module.exports = { postContact };
