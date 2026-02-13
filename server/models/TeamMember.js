const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    status: { type: String, enum: ["invited", "active"], default: "invited" },
  },
  { timestamps: true },
);

TeamMemberSchema.index({ userId: 1, teamId: 1 }, { unique: true });

module.exports = mongoose.model("TeamMember", TeamMemberSchema);
