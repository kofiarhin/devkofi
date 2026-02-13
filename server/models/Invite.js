const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    email: { type: String, required: true },
    token: { type: String, required: true },
    usedAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invite", InviteSchema);
