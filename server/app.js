const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cleaner = require("./middleware/cleaner");
const connectDB = require("./config/db");

const projectRoutes = require("./routes/projectRoutes");
const pricingRoute = require("./routes/pricingRoutes");

const enrollmentRoutes = require("./routes/enrollmentRoutes");
const accessRequestRoutes = require("./routes/accessRequestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const profileRoutes = require("./routes/profileRoutes");

const teamRoutes = require("./routes/teamRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUsersRoutes = require("./routes/adminUsersRoutes");

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
  }),
);

app.use(express.json());
app.use(cleaner);

app.get("/", async (req, res) => {
  return res.json({
    status: "ok",
    timeStamp: new Date(),
    message: "welcome to dev kofi",
  });
});

app.use("/api/pricing", pricingRoute);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/access-requests", accessRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.use("/api/team", teamRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUsersRoutes);

app.get("/api/health", async (req, res) => {
  return res.json({ message: "get health" });
});

app.get("/health", async (req, res) => {
  return res.json({ message: "get health" });
});

module.exports = app;
