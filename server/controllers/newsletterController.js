const NewsletterSubscriber = require("../models/NewsletterSubscriber");

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res
        .status(400)
        .json({ success: false, error: "A valid email address is required." });
    }

    const normalized = email.trim().toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ email: normalized });

    if (existing) {
      return res
        .status(200)
        .json({ success: true, message: "You're already subscribed." });
    }

    await NewsletterSubscriber.create({ email: normalized });

    return res
      .status(201)
      .json({ success: true, message: "Thanks for subscribing!" });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe };
