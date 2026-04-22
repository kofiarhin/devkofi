const NewsletterSubscriber = require("../models/NewsletterSubscriber");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "A valid email address is required." });
    }

    const normalized = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
      return res
        .status(400)
        .json({ success: false, error: "A valid email address is required." });
    }

    const existing = await NewsletterSubscriber.findOne({ email: normalized });

    if (existing) {
      return res
        .status(200)
        .json({
          success: true,
          alreadySubscribed: true,
          message: "You're already subscribed.",
        });
    }

    await NewsletterSubscriber.create({ email: normalized });

    return res
      .status(201)
      .json({ success: true, alreadySubscribed: false, message: "Thanks for subscribing!" });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: "You're already subscribed.",
      });
    }

    next(err);
  }
}

module.exports = { subscribe };
