const { Router } = require("express");
const router = Router();
const { joinMentorship } = require("../utility/helper");
const Mentorship = require("../Model/mentorshipModel");
const { createMentorship } = require("../controllers/mentorshipController");
const {
  sendWelcomeMessage,
  sendAdminNotification,
} = require("../utility/helper");

router.post("/", createMentorship);

module.exports = router;
