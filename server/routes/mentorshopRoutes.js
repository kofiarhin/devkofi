const { Router } = require("express");
const router = Router();
const { joinMentorship } = require("../utility/helper");
const Mentorship = require("../Model/mentorshipModel");

router.post("/", async (req, res) => {
  try {
    await Mentorship.deleteMany();
    const { fullName, email, phone } = req.body;
    if (!email || !fullName || !email) {
      throw new Error("please fill out all fields");
    }
    const result = await joinMentorship({ fullName, email, phone });
    res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: ërror.message });
  }
});

module.exports = router;
