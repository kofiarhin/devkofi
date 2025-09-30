// askMentor.js  (CommonJS)
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

// ⬇️ Fail loudly if key is missing (don’t pretend it’s a JSON error)
if (!API_KEY) {
  console.error("[askMentor] Missing GROQ_API_KEY");
}

const groq = API_KEY ? new Groq({ apiKey: API_KEY }) : null;

const parseMentorContent = (content) => {
  if (typeof content !== "string" || !content.trim())
    return { ...FALLBACK_RESPONSE };
  try {
    const cleaned = content
      .replace(/```json\s*([\s\S]*?)\s*```/i, "$1")
      .replace(/```\s*([\s\S]*?)\s*```/g, "$1")
      .trim();

    // fallback: extract first JSON object if extra text sneaks in
    const match = cleaned.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : cleaned;

    const payload = JSON.parse(jsonStr);

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
  } catch (e) {
    console.error("[parseMentorContent] JSON parse failed:", e?.message || e);
    return { ...FALLBACK_RESPONSE };
  }
};

const askMentor = async (userQuestion, history = []) => {
  if (typeof userQuestion !== "string" || !userQuestion.trim()) {
    throw new Error("Question must be a non-empty string.");
  }

  // Surface missing key clearly
  if (!groq) {
    return {
      title: "Missing GROQ_API_KEY",
      explanation: "Set GROQ_API_KEY in Heroku config vars and redeploy.",
      code: "",
      difficulty: "medium",
      confidence: 0,
    };
  }

  const sanitizedHistory = Array.isArray(history) ? history : [];
  const messages = [
    { role: "system", content: systemPrompt },
    ...sanitizedHistory,
    {
      role: "system",
      content:
        'Return ONLY a single valid JSON object with keys: "title","explanation","code","difficulty","confidence". No markdown fences, no comments, no prose.',
    },
    { role: "user", content: userQuestion.trim() },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0, // keep deterministic
      // 🔒 Force valid JSON output
      response_format: { type: "json_object" },
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
