const mongoose = require("mongoose");

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifyToken: {
      type: String,
      index: { sparse: true },
    },
    verifyTokenExpiresAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
