const cors = require("cors");

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const createCors = () => {
  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "production") {
    const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);

    if (allowedOrigins.length === 0) {
      allowedOrigins.push("https://devkofi.com");
    }

    return cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    });
  }

  return cors({
    origin: true,
    credentials: true,
  });
};

module.exports = createCors;
