const { Router } = require("express");
const Mentorship = require("../Model/mentorshipModel");

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const users = await Mentorship.find();
    return res.json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
