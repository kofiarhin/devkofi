const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programSlug: {
      type: String,
      default: "devkofi-ai-powered-mern-mentorship",
      trim: true,
      lowercase: true,
    },
    planSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["standard", "pro"],
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "cancelled"],
      default: "pending",
      index: true,
    },
    applicationStatus: {
      type: String,
      enum: ["draft", "submitted", "pending_review", "approved", "rejected"],
      default: "submitted",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["not_required", "pending", "paid", "refunded"],
      default: "not_required",
    },
    selectedTrack: { type: String, default: "ai-powered-mern" },
    intakeSnapshot: { type: Object, default: {} },
    adminNotes: { type: String, default: "" },
    approvedAt: { type: Date },
    activatedAt: { type: Date },
    source: { type: String, default: "web" },
    selectedPlanVersion: { type: String, default: "2026.1" },
  },
  { timestamps: true },
);

enrollmentSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
