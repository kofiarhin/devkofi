// models/Mentorship.js
const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    phone: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      defaut: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentorship", mentorshipSchema);
