const express = require("express");
const { createBooking, getBookingAvailability } = require("../controllers/bookingController");

const router = express.Router();

router.get("/availability", getBookingAvailability);
router.post("/", createBooking);

module.exports = router;
