const mongoose = require("mongoose");

const TeamEnrollmentSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      unique: true,
    },
    planSlug: { type: String, default: "team" },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    seatLimit: { type: Number, default: 5 },
    approvedAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("TeamEnrollment", TeamEnrollmentSchema);
