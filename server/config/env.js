const dotenv = require("dotenv");
const crypto = require("crypto");

const createDevJwtSecret = () => crypto.randomBytes(32).toString("hex");

const sanitize = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
};

const loadEnv = () => {
  const result = dotenv.config();

  if (result.error && result.error.code !== "ENOENT") {
    throw result.error;
  }

  const nodeEnv = process.env.NODE_ENV || "development";
  const port = Number.parseInt(process.env.PORT, 10) || 5000;
  let mongoUri = sanitize(process.env.MONGODB_URI);
  let jwtSecret = sanitize(process.env.JWT_SECRET);
  const corsOrigin = sanitize(process.env.CORS_ORIGIN);

  const missing = [];

  if (nodeEnv === "development") {
    if (!mongoUri) {
      mongoUri = "mongodb://127.0.0.1:27017/devkofi";
      console.warn(
        "[env] MONGODB_URI not set; defaulting to mongodb://127.0.0.1:27017/devkofi"
      );
    }

    if (!jwtSecret) {
      jwtSecret = createDevJwtSecret();
      console.warn(
        "[env] JWT_SECRET not set; generated ephemeral development secret"
      );
    }
  }

  if (nodeEnv !== "test" && !mongoUri) {
    missing.push("MONGODB_URI");
  }

  if (!jwtSecret) {
    missing.push("JWT_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return {
    nodeEnv,
    port,
    mongoUri,
    jwtSecret,
    corsOrigin,
  };
};

module.exports = { loadEnv };
