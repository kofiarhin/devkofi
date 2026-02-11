const mongoose = require("mongoose");

const AccessRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["team"],
      default: "team",
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["request", "contacted", "scheduled", "closed"],
      default: "request",
      index: true,
    },
    message: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companySize: { type: String, default: "" },
  },
  { timestamps: true },
);

AccessRequestSchema.index({ userId: 1, planSlug: 1 }, { unique: true });

module.exports = mongoose.model("AccessRequest", AccessRequestSchema);
