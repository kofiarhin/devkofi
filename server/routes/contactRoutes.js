const { Router } = require("express");
const sendEmail = require("../utility/sendEmail");
const { createContactMessage } = require("../controllers/contactController");

const router = Router();

router.get("/", async (req, res) => {
  return res.json({ message: "get contact" });
});

router.post("/", createContactMessage);
module.exports = router;
