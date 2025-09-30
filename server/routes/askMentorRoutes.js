const { Router } = require("express");
const askMentor = require("../services/askMentor");

const router = Router();

router.get("/", async (req, res, next) => {
  return res.json({ message: "ask me anything" });
});

router.post("/", async (req, res, next) => {
  try {
    const { question } = req.body;
    const result = await askMentor(question, []);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
