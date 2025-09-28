const Groq = require("groq-sdk");
const systemPrompt = require("../prompts/systemPrompt");

const FALLBACK_RESPONSE = {
  title: "Parse Error",
  explanation: "The AI returned invalid JSON. Please try again.",
  code: "",
  difficulty: "medium",
  confidence: 0,
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "test-key" });

const parseMentorContent = (content) => {
  if (typeof content !== "string" || !content.trim()) {
    return { ...FALLBACK_RESPONSE };
  }

  try {
    const payload = JSON.parse(content);

    return {
      title:
        typeof payload.title === "string" && payload.title.trim()
          ? payload.title
          : FALLBACK_RESPONSE.title,
      explanation:
        typeof payload.explanation === "string" && payload.explanation.trim()
          ? payload.explanation
          : FALLBACK_RESPONSE.explanation,
      code: typeof payload.code === "string" ? payload.code : "",
      difficulty:
        typeof payload.difficulty === "string" && payload.difficulty.trim()
          ? payload.difficulty
          : "medium",
      confidence:
        typeof payload.confidence === "number"
          ? payload.confidence
          : FALLBACK_RESPONSE.confidence,
    };
  } catch (error) {
    return { ...FALLBACK_RESPONSE };
  }
};

const askMentor = async (userQuestion, history = []) => {
  if (typeof userQuestion !== "string" || !userQuestion.trim()) {
    throw new Error("Question must be a non-empty string.");
  }

  const sanitizedHistory = Array.isArray(history) ? history : [];
  const trimmedQuestion = userQuestion.trim();

  const messages = [
    { role: "system", content: systemPrompt },
    ...sanitizedHistory,
    { role: "user", content: trimmedQuestion },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages,
    temperature: 0.2,
    stream: false,
  });

  const content = completion?.choices?.[0]?.message?.content;
  return parseMentorContent(content);
};

module.exports = askMentor;
module.exports.FALLBACK_RESPONSE = FALLBACK_RESPONSE;
