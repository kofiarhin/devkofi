const express = require("express");
const rateLimit = require("express-rate-limit");
const { subscribe } = require("../controllers/newsletterController");

const router = express.Router();

const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.NEWSLETTER_RATE_LIMIT) || 5,
  message: { success: false, error: "Too many requests. Try again later." },
});

router.post("/subscribe", newsletterLimiter, subscribe);

module.exports = router;
