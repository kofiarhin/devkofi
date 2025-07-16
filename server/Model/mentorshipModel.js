// models/Mentorship.js
const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema({
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
    maxlength: 20,
    // validate: {
    //   validator: (v) => v === "" || /^[+0-9()\- ]{7,20}$/.test(v),
    //   message: (props) => `${props.value} is not a valid phone number`,
    // },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Mentorship", mentorshipSchema);
