const { Router } = require("express");
const { createNewsletterUser } = require("../utility/helper");

const router = Router();

router.get("/", async (req, res) => {
  return res.json({ message: "hello world" });
});

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
