const Groq = require("groq-sdk");
const systemPrompt = require("../prompts/systemPrompt");

const FALLBACK_RESPONSE = {
  title: "Parse Error",
  explanation: "The AI returned invalid JSON. Please try again.",
  code: "",
  difficulty: "medium",
  confidence: 0,
};

const API_KEY = process.env.GROQ_API_KEY || "";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const groq = API_KEY ? new Groq({ apiKey: API_KEY }) : null;

const parseMentorContent = (content) => {
  if (typeof content !== "string" || !content.trim())
    return { ...FALLBACK_RESPONSE };
  try {
    // Strip common code-fence wrappers before parsing
    const cleaned = content
      .replace(/```json\s*([\s\S]*?)\s*```/i, "$1")
      .replace(/```\s*([\s\S]*?)\s*```/g, "$1")
      .trim();

    const payload = JSON.parse(cleaned);

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
        typeof payload.confidence === "number" &&
        Number.isFinite(payload.confidence)
          ? payload.confidence
          : FALLBACK_RESPONSE.confidence,
    };
  } catch {
    return { ...FALLBACK_RESPONSE };
  }
};

const askMentor = async (userQuestion, history = []) => {
  if (typeof userQuestion !== "string" || !userQuestion.trim()) {
    throw new Error("Question must be a non-empty string.");
  }

  if (!groq) return { ...FALLBACK_RESPONSE };

  const sanitizedHistory = Array.isArray(history) ? history : [];
  const trimmedQuestion = userQuestion.trim();

  const messages = [
    { role: "system", content: systemPrompt },
    ...sanitizedHistory,
    {
      role: "system",
      content:
        'Return ONLY a single valid JSON object with keys: "title","explanation","code","difficulty","confidence". No markdown fences, no comments, no prose.',
    },
    { role: "user", content: trimmedQuestion },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.2,
      stream: false,
    });

    const content = completion?.choices?.[0]?.message?.content || "";
    return parseMentorContent(content);
  } catch (e) {
    console.error("[askMentor] error:", e?.status || e?.message || e);
    return { ...FALLBACK_RESPONSE };
  }
};

module.exports = askMentor;
module.exports.FALLBACK_RESPONSE = FALLBACK_RESPONSE;
