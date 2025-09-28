const askMentor = require("../services/askMentor");

const ask = async (req, res, next) => {
  try {
    const { question, history = [] } = req.body || {};

    if (typeof question !== "string" || !question.trim()) {
      return res
        .status(400)
        .json({ message: "Question must be a non-empty string." });
    }

    const mentorResponse = await askMentor(question, history);
    return res.json(mentorResponse);
  } catch (error) {
    return next(error);
  }
};

module.exports = { ask };
