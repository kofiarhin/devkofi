const { Router } = require("express");
const { createNewsletterUser } = require("../utility/helper");
const Newsletter = require("../Model/newsletterModel");

const router = Router();

// get list of users in newsletter
router.get("/", async (req, res) => {
  const users = await Newsletter.find();
  return res.json(users);
});

// join news letter
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("please provide an email address");
    }
    const user = await createNewsletterUser({ email });

    if (!user) {
      throw new Error("something went wrong creating user");
    }
    return res.json({ successs: true, data: user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, erro: error.message });
  }
});

module.exports = router;
