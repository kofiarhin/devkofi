// askMentor.js (CommonJS)
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
const DEBUG = process.env.DEBUG_MENTOR === "1";

if (!API_KEY) console.error("[askMentor] Missing GROQ_API_KEY");

const groq = API_KEY ? new Groq({ apiKey: API_KEY }) : null;

const DIFFICULTY_ALLOWED = new Set(["easy", "medium", "hard"]);
const clamp01 = (n) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

const normalizePayload = (payload = {}) => {
  const title =
    typeof payload.title === "string" && payload.title.trim()
      ? payload.title.trim().slice(0, 120)
      : FALLBACK_RESPONSE.title;

  const explanation =
    typeof payload.explanation === "string" && payload.explanation.trim()
      ? payload.explanation.trim()
      : FALLBACK_RESPONSE.explanation;

  const code = typeof payload.code === "string" ? payload.code : "";

  const difficultyRaw =
    typeof payload.difficulty === "string" && payload.difficulty.trim()
      ? payload.difficulty.trim().toLowerCase()
      : "medium";
  const difficulty = DIFFICULTY_ALLOWED.has(difficultyRaw)
    ? difficultyRaw
    : "medium";

  const confidence = clamp01(payload.confidence);

  return { title, explanation, code, difficulty, confidence };
};

const tryParseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const stripStrayProse = (text) => {
  // Remove stray prose, keep only JSON-like content
  // Match JSON objects, removing any non-JSON text before or after
  const jsonMatches = text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
  if (jsonMatches && jsonMatches.length > 0) {
    return jsonMatches[0]; // Take the first full JSON object
  }
  return text.trim();
};

const extractFirstJsonObject = (text) => {
  if (typeof text !== "string" || !text.trim()) return null;

  // Clean any code fences first
  let cleaned = text
    .replace(/```json\s*([\s\S]*?)\s*```/i, "$1")
    .replace(/```\s*([\s\S]*?)\s*```/g, "$1");

  // Strip stray prose
  cleaned = stripStrayProse(cleaned);

  // 1) direct parse
  const direct = tryParseJson(cleaned);
  if (direct) return direct;

  // 2) fallback: first {...} block
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    const m = tryParseJson(match[0]);
    if (m) return m;
  }
  return null;
};

const parseMentorContent = (content) => {
  if (typeof content !== "string" || !content.trim())
    return { ...FALLBACK_RESPONSE };

  // Clean the content
  const cleaned = content
    .replace(/```json\s*([\s\S]*?)\s*```/i, "$1")
    .replace(/```\s*([\s\S]*?)\s*```/g, "$1");
  const fullyCleaned = stripStrayProse(cleaned);

  if (DEBUG) {
    console.log("[askMentor][RAW AI CONTENT]:", content);
    console.log("[askMentor][CLEANED CONTENT]:", fullyCleaned);
  }

  const parsed = tryParseJson(fullyCleaned);
  if (parsed) return normalizePayload(parsed);

  // Fallback: extract first JSON block from fully cleaned
  const match = fullyCleaned.match(/\{[\s\S]*\}/);
  if (match) {
    const m = tryParseJson(match[0]);
    if (m) return normalizePayload(m);
  }

  if (DEBUG) {
    console.error("[askMentor][PARSE FAILED]: Could not parse cleaned content");
  }
  return { ...FALLBACK_RESPONSE };
};

const askMentor = async (userQuestion, history = []) => {
  if (typeof userQuestion !== "string" || !userQuestion.trim()) {
    throw new Error("Question must be a non-empty string.");
  }

  if (!groq) {
    return {
      title: "Missing GROQ_API_KEY",
      explanation: "Set GROQ_API_KEY in your env/config vars and redeploy.",
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
        'CRITICAL: Respond with ONLY one valid JSON object with fields "title","explanation","code","difficulty","confidence". No markdown, no prose outside JSON.',
    },
    { role: "user", content: userQuestion.trim() },
  ];

  const attemptGroqCall = async (msgHistory) => {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: msgHistory,
      temperature: 0,
      response_format: { type: "json_object" },
      stream: false,
    });
    return completion;
  };

  try {
    let completion = await attemptGroqCall(messages);
    let content = completion?.choices?.[0]?.message?.content || "";
    let result = parseMentorContent(content);

    if (DEBUG) {
      console.log(
        "[askMentor][RAW GROQ COMPLETION]:",
        JSON.stringify(completion, null, 2)
      );
    }

    // Check if parsing failed (fell back to FALLBACK_RESPONSE)
    if (
      result.title === FALLBACK_RESPONSE.title &&
      result.explanation === FALLBACK_RESPONSE.explanation
    ) {
      if (DEBUG) {
        console.log(
          "[askMentor] First attempt failed, retrying with stricter prompt."
        );
      }
      // Retry with stricter system message
      const retryMessages = [
        ...messages,
        {
          role: "system",
          content:
            "Return ONLY a valid JSON object with keys: title, explanation, code, difficulty, confidence. No other text.",
        },
        { role: "user", content: "Retry: " + userQuestion.trim() },
      ];
      completion = await attemptGroqCall(retryMessages);
      content = completion?.choices?.[0]?.message?.content || "";
      result = parseMentorContent(content);
    }

    if (DEBUG) {
      console.log("[askMentor] difficulty/confidence:", {
        difficulty: result.difficulty,
        confidence: result.confidence,
      });
    }

    return result;
  } catch (e) {
    console.error("[askMentor] error:", e?.status || e?.message || e);
    return { ...FALLBACK_RESPONSE };
  }
};

module.exports = {
  askMentor,
  parseMentorContent,
  normalizePayload,
  FALLBACK_RESPONSE,
  _private: { clamp01, extractFirstJsonObject },
};
