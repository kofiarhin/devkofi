const { Router } = require("express");
const sendMessage = require("../utility/sendEmail");

const router = Router();

router.get("/", async (req, res) => {
  return res.json({ message: "get messages" });
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    return res.json({ message: "create message" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
