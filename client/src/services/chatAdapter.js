import { API_BASE } from "../constants/server.js";

const resolveBaseUrl = () => {
  if (typeof API_BASE === "string" && API_BASE.trim()) {
    return API_BASE;
  }

  return "";
};

const withBaseUrl = (path) => `${resolveBaseUrl()}${path}`;

const generateId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `msg-${Math.random().toString(36).slice(2, 10)}${Date.now()}`;
};

const ensureEpoch = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value.trim());

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime?.())) {
    return value.getTime();
  }

  return Date.now();
};

const ensureRole = (value) => (value === "user" ? "user" : "assistant");

const ensureText = (value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed) {
      return trimmed;
    }

    return "";
  }

  if (value == null) {
    return "Message unavailable";
  }

  return String(value);
};

const normalizeMessage = (message = {}) => {
  const normalized = {
    id:
      typeof message.id === "string" && message.id.trim()
        ? message.id.trim()
        : generateId(),
    role: ensureRole(message.role),
    text: ensureText(message.text),
    createdAt: ensureEpoch(message.createdAt),
  };

  if (typeof message.pendingId === "string" && message.pendingId.trim()) {
    normalized.pendingId = message.pendingId.trim();
  }

  return normalized;
};

const normalizeMessages = (messages = []) => {
  if (!Array.isArray(messages)) {
    return [];
  }

  const byId = new Map();

  messages.forEach((message) => {
    const normalized = normalizeMessage(message);
    const existing = byId.get(normalized.id);

    if (!existing || normalized.createdAt >= existing.createdAt) {
      byId.set(normalized.id, normalized);
    }
  });

  return Array.from(byId.values()).sort((a, b) => a.createdAt - b.createdAt);
};

const normalizePostResponse = (payload = {}, fallbackTempId) => {
  const collected = [];
  const replacements = [];

  const pushMessage = (message) => {
    if (!message) {
      return;
    }

    const normalized = normalizeMessage(message);

    if (normalized.pendingId) {
      replacements.push({
        tempId: normalized.pendingId,
        id: normalized.id,
      });
    }

    delete normalized.pendingId;
    collected.push(normalized);
  };

  if (Array.isArray(payload.messages)) {
    payload.messages.forEach(pushMessage);
  } else {
    pushMessage(payload.user);
    pushMessage(payload.assistant);
  }

  if (!replacements.length && fallbackTempId) {
    const userMessage = collected.find((message) => message.role === "user");

    if (userMessage) {
      replacements.push({ tempId: fallbackTempId, id: userMessage.id });
    }
  }

  return {
    messages: normalizeMessages(collected),
    replacements,
  };
};

const getMessages = async (chatId) => {
  const response = await fetch(
    withBaseUrl(`/api/chats/${encodeURIComponent(chatId)}/messages`),
    {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = result?.message || "Unable to load messages.";
    throw new Error(message);
  }

  return normalizeMessages(result?.messages ?? result);
};

const postMessage = async ({ chatId, text, tempId }) => {
  const trimmed = typeof text === "string" ? text.trim() : "";

  if (!trimmed) {
    throw new Error("Message text is required.");
  }

  const response = await fetch(
    withBaseUrl(`/api/chats/${encodeURIComponent(chatId)}/messages`),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ text: trimmed, tempId }),
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = result?.message || "Unable to send message.";
    throw new Error(message);
  }

  return normalizePostResponse(result, tempId);
};

export { getMessages, postMessage, normalizeMessages, normalizeMessage, normalizePostResponse };
