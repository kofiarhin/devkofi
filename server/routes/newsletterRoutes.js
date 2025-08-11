const { Router } = require("express");
const { createNewsletterUser } = require("../utility/helper");
const Newsletter = require("../Model/newsletterModel");
const { joinNewsLetter } = require("../controllers/newsLetterController");
const auth = require("../middlewares/auth");

const router = Router();

// get list of users in newsletter
router.get("/", auth, async (req, res) => {
  const users = await Newsletter.find();
  return res.json(users);
});

// join news letter
router.post("/", joinNewsLetter);

module.exports = router;
