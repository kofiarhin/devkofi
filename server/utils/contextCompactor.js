// utils for compacting conversation history
// Simple version: slice last 10 turns, trim whitespace, remove extra newlines

const MAX_TURNS = 10;

const compact = (messages = []) => {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-MAX_TURNS)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().replace(/\n{3,}/g, "\n\n"), // collapse extra newlines
    }))
    .filter((m) => m.content.length > 0); // remove empty messages
};

module.exports = { compact };
