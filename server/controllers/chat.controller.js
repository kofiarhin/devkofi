const { llmAsk } = require("../services/llm.service");

const ask = async (req, res, next) => {
  try {
    const { question, messages = [] } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Invalid question" });
    }

    if (
      messages &&
      (!Array.isArray(messages) ||
        !messages.every(
          (m) =>
            m &&
            ["user", "assistant"].includes(m.role) &&
            typeof m.content === "string"
        ))
    ) {
      return res.status(400).json({ error: "Invalid messages" });
    }

    const answer = await llmAsk(question.trim(), messages);

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Chat Ask Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { ask };
