const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pricingId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    role: {
      type: String,
      enum: ["admin", "student", "moderator"],
      default: "student",
    },
  }
);

module.exports = mongoose.model("User", userSchema);
