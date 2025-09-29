const DEV_API_BASE = "http://localhost:5000";
const PROD_FALLBACK_API_BASE = "https://devkofi-883f1d7b0ba0.herokuapp.com";

const normalizeUrl = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/\/$/, "");
};

const resolveApiBase = () => {
  if (import.meta.env?.DEV) {
    return normalizeUrl(DEV_API_BASE);
  }

  const envBase = import.meta.env?.VITE_API_BASE;

  if (typeof envBase === "string" && envBase.trim()) {
    return normalizeUrl(envBase.trim());
  }

  return normalizeUrl(PROD_FALLBACK_API_BASE);
};

export const API_BASE = resolveApiBase();
