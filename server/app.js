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
