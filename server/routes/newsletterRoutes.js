const express = require("express");
const rateLimit = require("express-rate-limit");
const { subscribe, verify } = require("../controllers/newsletterController");

const router = express.Router();

const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.NEWSLETTER_RATE_LIMIT) || 5,
  message: { success: false, error: "Too many requests. Try again later." },
});

const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.NEWSLETTER_VERIFY_RATE_LIMIT) || 30,
  message: { success: false, error: "Too many requests. Try again later." },
});

router.post("/subscribe", newsletterLimiter, subscribe);
router.get("/verify", verifyLimiter, verify);

module.exports = router;
