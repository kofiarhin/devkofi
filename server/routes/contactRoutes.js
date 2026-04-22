const express = require("express");
const rateLimit = require("express-rate-limit");
const { postContact } = require("../controllers/contactController");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.CONTACT_RATE_LIMIT) || 5,
  message: { success: false, error: "Too many requests. Try again later." },
});

router.post("/", contactLimiter, postContact);

module.exports = router;
