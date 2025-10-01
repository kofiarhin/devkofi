const { askMentor } = require("../services/askMentor");

const ask = async (req, res, next) => {
  try {
    const { question, history = [] } = req.body || {};

    if (typeof question !== "string" || !question.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Question must be a non-empty string.",
        });
    }

    const mentorResponse = await askMentor(question.trim(), history);
    return res.status(200).json({ success: true, data: mentorResponse });
  } catch (error) {
    console.error("AskMentor Error:", error);
    return next(error);
  }
};

module.exports = { ask };
