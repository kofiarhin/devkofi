const { Router } = require("express");
const Mentorship = require("../Model/mentorshipModel");
const User = require("../Model/userModel");
const Contact = require("../Model/contactModel");

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log({ users });
    return res.json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Admin overview metrics
router.get("/overview", async (req, res) => {
  try {
    const [usersCount, messagesCount] = await Promise.all([
      User.countDocuments().exec(),
      Contact.countDocuments().exec(),
    ]);

    // Placeholders for non-existent resources in this codebase
    const coursesCount = 0;
    const paymentsCount = 0;
    const transactionsCount = 0;

    return res.json({
      usersCount,
      coursesCount,
      messagesCount,
      paymentsCount,
      transactionsCount,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
