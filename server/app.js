const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push("http://localhost:5173");
}

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const isAllowedOrigin = requestOrigin && allowedOrigins.includes(requestOrigin);
  const originalSetHeader = res.setHeader.bind(res);

  res.setHeader = (name, value) => {
    if (
      typeof name === "string" &&
      name.toLowerCase() === "access-control-allow-origin" &&
      value === "*" &&
      isAllowedOrigin
    ) {
      return originalSetHeader(name, requestOrigin);
    }

    if (
      typeof name === "string" &&
      name.toLowerCase() === "access-control-allow-credentials"
    ) {
      return originalSetHeader(name, "true");
    }

    return originalSetHeader(name, value);
  };

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }

  const currentVaryHeader = res.getHeader("Vary");
  res.setHeader(
    "Vary",
    currentVaryHeader ? `${currentVaryHeader}, Origin` : "Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    const requestedHeaders = req.headers["access-control-request-headers"];

    if (requestedHeaders) {
      res.setHeader("Access-Control-Allow-Headers", requestedHeaders);
    }

    return res.sendStatus(204);
  }

  return next();
});

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.json({
    status: "ok",
    timeStamp: new Date(),
    message: "welcome to dev kofi",
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", async (req, res) => {
  return res.json({ message: "ok" });
});

app.get("/health", async (req, res) => {
  return res.json({ message: "ok" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[error]", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

module.exports = app;
