const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  },
  { timestamps: true },
);

// ✅ only 1 enrollment per user for this phase
enrollmentSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
