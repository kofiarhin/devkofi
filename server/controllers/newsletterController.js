const crypto = require("crypto");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const emailService = require("../utils/emailService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildVerifyUrl(token) {
  const base = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
  return `${base}/newsletter/verify?token=${token}`;
}

async function dispatchVerificationEmail(email, plainToken) {
  try {
    await emailService.sendNewsletterVerificationEmail({
      email,
      verifyUrl: buildVerifyUrl(plainToken),
    });
  } catch (err) {
    console.error("[newsletter] verification email send failed:", err.message);
  }
}

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

    if (existing && existing.verified) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        pendingVerification: false,
        message: "You're already subscribed.",
      });
    }

    const plainToken = generateToken();
    const tokenHash = hashToken(plainToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    if (existing) {
      existing.verifyToken = tokenHash;
      existing.verifyTokenExpiresAt = expiresAt;
      await existing.save();
    } else {
      await NewsletterSubscriber.create({
        email: normalized,
        verified: false,
        verifyToken: tokenHash,
        verifyTokenExpiresAt: expiresAt,
      });
    }

    await dispatchVerificationEmail(normalized, plainToken);

    return res.status(201).json({
      success: true,
      alreadySubscribed: false,
      pendingVerification: true,
      message: "Check your email to confirm your subscription.",
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        pendingVerification: false,
        message: "You're already subscribed.",
      });
    }

    next(err);
  }
}

async function verify(req, res, next) {
  try {
    const token = typeof req.query.token === "string" ? req.query.token.trim() : "";

    if (!token) {
      return res.status(400).json({
        success: false,
        status: "invalid",
        message: "Verification link is invalid or has already been used.",
      });
    }

    const tokenHash = hashToken(token);
    const subscriber = await NewsletterSubscriber.findOne({ verifyToken: tokenHash });

    if (!subscriber) {
      return res.status(400).json({
        success: false,
        status: "invalid",
        message: "Verification link is invalid or has already been used.",
      });
    }

    if (subscriber.verified) {
      return res.status(200).json({
        success: true,
        status: "already_verified",
        message: "Your email is already confirmed.",
      });
    }

    if (
      !subscriber.verifyTokenExpiresAt ||
      subscriber.verifyTokenExpiresAt.getTime() < Date.now()
    ) {
      return res.status(410).json({
        success: false,
        status: "expired",
        message: "Verification link has expired. Please resubmit your email.",
      });
    }

    subscriber.verified = true;
    subscriber.verifiedAt = new Date();
    subscriber.verifyToken = undefined;
    subscriber.verifyTokenExpiresAt = undefined;
    await subscriber.save();

    return res.status(200).json({
      success: true,
      status: "verified",
      message: "Thanks! Your subscription is confirmed.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, verify };
