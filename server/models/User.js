const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // legacy fields (keep for now so app doesn’t break)
    plan: {
      type: String,
      enum: ["none", "standard", "pro", "enterprise"],
      default: "none",
    },
    hasPaid: { type: Boolean, default: false },
    purchaseDate: { type: Date },

    discordUsername: { type: String },
    mentorshipCredits: { type: Number, default: 0 },
    teamName: { type: String },

    role: {
      type: String,
      enum: ["student", "admin", "mentor"],
      default: "student",
    },
    authProvider: { type: String, default: "local" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
