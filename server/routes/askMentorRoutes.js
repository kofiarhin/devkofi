const { Router } = require("express");
const { ask } = require("../controllers/mentorController");

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "ask me anything" });
});

router.post("/", ask);

module.exports = router;
