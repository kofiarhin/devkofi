const { Router } = require("express");
const Contact = require("../Model/contactModel");

const router = Router();

// Minimal student overview data to unblock dashboard
router.get("/overview", async (req, res) => {
  try {
    const messagesCount = await Contact.countDocuments().exec();
    const assignmentsCount = 0; // No assignments model in codebase
    const profileCompletion = 0; // Could be computed from user profile fields if needed

    return res.json({ assignmentsCount, messagesCount, profileCompletion });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

