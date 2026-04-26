const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { slotStart: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "booked" },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
